package main

import (
	"context"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/tabvn/ued/auth"
	"github.com/tabvn/ued/graphql/generated"
	"github.com/tabvn/ued/graphql/resolver"
	"github.com/tabvn/ued/logger"
	"github.com/tabvn/ued/model"
	"github.com/tabvn/ued/storage"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"net/http"
	"os"
	"time"
)

func connect() *gorm.DB {
	dsn := os.Getenv("POSTGRESQL_URL")
	if len(dsn) == 0 {
		dsn = "user=postgres password=root dbname=goo port=5432 sslmode=disable"
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	model.AutoMigrate(db)
	initAdminUser(db)
	return db
}

func NewDefaultServer(es graphql.ExecutableSchema) *handler.Server {
	srv := handler.New(es)
	srv.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
	})
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.MultipartForm{})
	srv.SetQueryCache(lru.New(1000))
	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})

	return srv
}

func graphqlHandler(db *gorm.DB) gin.HandlerFunc {
	conf := generated.Config{Resolvers: &resolver.Resolver{DB: db}}
	conf.Directives.Tag = func(ctx context.Context, obj interface{}, next graphql.Resolver, gorm *string) (res interface{}, err error) {
		return next(ctx)
	}
	h := NewDefaultServer(generated.NewExecutableSchema(conf))
	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/api/query")
	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func addCors(r *gin.Engine) {
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "UPDATE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type", "Origin", "X-Xsrf-Token"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		MaxAge:          12 * time.Hour,
		AllowWebSockets: true,
		AllowFiles:      false,
	}))
}

func initAdminUser(db *gorm.DB) {
	var count int64
	db.Model(model.User{}).Where("role = ?", model.RoleAdministrator.String()).Count(&count)
	if count == 0 {
		adminUser := model.User{
			FirstName: "Toan",
			LastName:  "Nguyen",
			Email:     "admin@gmail.com",
			Password:  model.EncodePassword("admin"),
			Role:      model.RoleAdministrator.String(),
		}
		if err := db.Create(&adminUser).Error; err != nil {
			panic(err)
		}
	}

	// migrate

	db.Exec("CREATE UNIQUE INDEX IF NOT EXISTS course_student_unique_index ON course_students(student_id, course_id);")
}
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	db := connect()
	logger.DB = db
	storage.DB = db
	r := gin.Default()
	r.MaxMultipartMemory = 8 << 20 // 8 MiB
	addCors(r)
	r.Use(auth.Middleware())
	r.POST("/api/query", graphqlHandler(db))
	r.POST("/storage/upload", storage.HandleUpload)
	r.Static("/storage", "./storage")
	r.GET("/api", playgroundHandler())
	log.Printf("connect to http://127.0.0.1:%s/api for GraphQL playground", port)
	log.Fatal(r.Run(":" + port))
}
