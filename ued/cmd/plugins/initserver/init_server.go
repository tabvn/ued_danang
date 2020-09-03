package initserver

import (
	"bytes"
	"fmt"
	"github.com/99designs/gqlgen/api"
	"github.com/99designs/gqlgen/codegen/config"
	"github.com/tabvn/ued/cmd/plugins/servergen"
	"html/template"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
)

var configTemplate = template.Must(template.New("name").Parse(`
# Where are all the schema files located? globs are supported eg  src/**/*.graphqls
schema:
  - graphql/schema/*.graphqls

# Where should the generated server code go?
exec:
  filename: graphql/generated/generated.go
  package: generated

# Uncomment to enable federation
# federation:
#   filename: graph/generated/federation.go
#   package: generated

# Where should any generated models go?
model:
  filename: model/generated.go
  package: model

# Where should the resolver implementations go?
resolver:
  layout: follow-schema
  dir: graphql/resolver
  package: resolver

# struct_tag: json

# Optional: turn on to use []Thing instead of []*Thing
# omit_slice_element_pointers: false

# Optional: set to speed up generation time by not performing a final validation pass.
#skip_validation: true

# will search for any type names in the schema in these go packages
# if they match it will use them, otherwise it will generate them.
autobind:
  - "{{.}}/model"

# This section declares type mapping between the GraphQL and go type systems
#
# The first line in each type will be used as defaults for resolver arguments and
# modelgen, the others will be allowed when binding to fields. Configure them to
# your liking
models:
  ID:
    model:
      - github.com/99designs/gqlgen/graphql.ID
      - github.com/99designs/gqlgen/graphql.Int
      - github.com/99designs/gqlgen/graphql.Int64
      - github.com/99designs/gqlgen/graphql.Int32
  Int:
    model:
      - github.com/99designs/gqlgen/graphql.Int
      - github.com/99designs/gqlgen/graphql.Int64
      - github.com/99designs/gqlgen/graphql.Int32
`))
var schemaDefault = `
directive @tag(gorm: String) on INPUT_FIELD_DEFINITION | FIELD_DEFINITION
scalar Any
scalar Map
scalar Time

interface Model {
	id: ID! @tag(gorm: "primaryKey")
	createdAt: Time!
	updatedAt: Time
}
type Mutation
type Query
`

var userSchema = `
type User implements Model{
	id: ID! @tag(gorm: "primaryKey")
	firstName: String
	lastName: String
	email: String! @tag(gorm:"unique_index")
	password: String!
	createdAt: Time!
	updatedAt: Time
}
input NewUser{
	firstName: String
	lastName: String
	email: String!
	password: String!
}
extend type Mutation {
	createUser(input: NewUser!): User!
}
extend type Query {
	user(id: ID!): User!
}
`

func NewProject() error {
	pkgName := ImportPathForDir(".")
	if pkgName == "" {
		return fmt.Errorf("unable to determine import path for current directory, you probably need to run go mod init first")
	}
	configFilename := "gqlgen.yml"
	if _, err := os.Stat(configFilename); err != nil {
		if os.IsExist(err) {
			if err := initSchema("graphql/schema/schema.graphqls"); err != nil {
				return err
			}
			if err := initUserSchema("graphql/schema/user.graphqls"); err != nil {
				return err
			}
			if !configExists(configFilename) {
				if err := initConfig(configFilename, pkgName); err != nil {
					return err
				}
			}
			GenerateGraphServer("server.go")
		}
	}
	log.Println("Project exist!")
	return nil
}

func GenerateGraphServer(serverFilename string) {
	cfg, err := config.LoadConfigFromDefaultLocations()
	if err != nil {
		fmt.Fprintln(os.Stderr, err.Error())
	}

	if err := api.Generate(cfg, api.AddPlugin(servergen.New(serverFilename))); err != nil {
		fmt.Fprintln(os.Stderr, err.Error())
	}

	fmt.Fprintf(os.Stdout, "Exec \"go run ./%s\" to start GraphQL server\n", serverFilename)
}

func configExists(configFilename string) bool {
	var cfg *config.Config

	if configFilename != "" {
		cfg, _ = config.LoadConfig(configFilename)
	} else {
		cfg, _ = config.LoadConfigFromDefaultLocations()
	}
	return cfg != nil
}

func initConfig(configFilename string, pkgName string) error {
	if configFilename == "" {
		configFilename = "gqlgen.yml"
	}

	if err := os.MkdirAll(filepath.Dir(configFilename), 0755); err != nil {
		return fmt.Errorf("unable to create config dir: " + err.Error())
	}

	var buf bytes.Buffer
	if err := configTemplate.Execute(&buf, pkgName); err != nil {
		panic(err)
	}

	if err := ioutil.WriteFile(configFilename, buf.Bytes(), 0644); err != nil {
		return fmt.Errorf("unable to write cfg file: " + err.Error())
	}

	return nil
}

func initSchema(schemaFilename string) error {
	_, err := os.Stat(schemaFilename)
	if !os.IsNotExist(err) {
		return nil
	}

	if err := os.MkdirAll(filepath.Dir(schemaFilename), 0755); err != nil {
		return fmt.Errorf("unable to create schema dir: " + err.Error())
	}

	if err = ioutil.WriteFile(schemaFilename, []byte(strings.TrimSpace(schemaDefault)), 0644); err != nil {
		return fmt.Errorf("unable to write schema file: " + err.Error())
	}
	return nil
}

func initUserSchema(schemaFilename string) error {
	_, err := os.Stat(schemaFilename)
	if !os.IsNotExist(err) {
		return nil
	}
	if err := os.MkdirAll(filepath.Dir(schemaFilename), 0755); err != nil {
		return fmt.Errorf("unable to create schema dir: " + err.Error())
	}
	if err = ioutil.WriteFile(schemaFilename, []byte(strings.TrimSpace(userSchema)), 0644); err != nil {
		return fmt.Errorf("unable to write schema file: " + err.Error())
	}
	return nil
}
