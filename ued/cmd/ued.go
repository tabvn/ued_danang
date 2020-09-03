package main

import (
	"fmt"
	"github.com/99designs/gqlgen/api"
	"github.com/99designs/gqlgen/codegen/config"
	"github.com/99designs/gqlgen/plugin/resolvergen"
	"github.com/spf13/cobra"
	"github.com/tabvn/ued/cmd/plugins/initserver"
	"github.com/tabvn/ued/cmd/plugins/modelgen"
	"log"
	"os"
	"os/exec"
)

var rootCmd = &cobra.Command{
	Use:   "goo",
	Short: "goo",
	Run: func(cmd *cobra.Command, args []string) {
		// Do Stuff Here
	},
}

var generateCmd = &cobra.Command{
	Use:   "generate",
	Short: "generate graphql server",
	Run: func(cmd *cobra.Command, args []string) {
		generate()
	},
}
var shortGenerateCmd = &cobra.Command{
	Use:   "gen",
	Short: "generate graphql server",
	Run: func(cmd *cobra.Command, args []string) {
		generate()
	},
}
var initProductCmd = &cobra.Command{
	Use:   "init",
	Short: "Init project",
	Run: func(cmd *cobra.Command, args []string) {
		initserver.NewProject()
	},
}
var runCmd = &cobra.Command{
	Use:   "run",
	Short: "run local development",
	Run: func(cmd *cobra.Command, args []string) {
		c := exec.Command("/bin/sh", "run.sh")
		c.Stdout = os.Stdout
		c.Stderr = os.Stderr
		err := c.Run()
		if err != nil {
			log.Fatalf("cmd.Run() failed with %s\n", err)
		}
	},
}

func generate() {
	cfg, err := config.LoadConfigFromDefaultLocations()
	if err != nil {
		fmt.Fprintln(os.Stderr, "failed to load config", err.Error())
		os.Exit(2)
	}
	err = api.Generate(cfg,
		api.NoPlugins(),
		api.AddPlugin(modelgen.New()),
		api.AddPlugin(resolvergen.New()),
	)
	if err != nil {
		fmt.Fprintln(os.Stderr, err.Error())
		os.Exit(3)
	}
}

func init() {
	rootCmd.AddCommand(generateCmd)
	rootCmd.AddCommand(initProductCmd)
	rootCmd.AddCommand(shortGenerateCmd)
	rootCmd.AddCommand(runCmd)
}

func execute() {
	rootCmd.Execute()
}
func main() {
	execute()
}
