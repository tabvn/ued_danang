package storage

import (
	"fmt"
	"github.com/disintegration/imaging"
	"github.com/gin-gonic/gin"
	"github.com/tabvn/ued/auth"
	"github.com/tabvn/ued/id"
	"github.com/tabvn/ued/logger"
	"github.com/tabvn/ued/util"
	"gorm.io/gorm"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"
)

var DB *gorm.DB

type File struct {
	Name      string
	Mime      string
	Key       string
	thumbnail string
	Size      int64
	Width     int
	Height    int
	Thumbnail string
	Kind      string
}

func UploadDir() string {
	return "./storage"
}
func BuildUploadPath(userId int64) string {
	today := time.Now().Format("2006-01-02")
	return UploadDir() + "/" + fmt.Sprintf("%d", userId) + "/" + today + "/" + id.Gen(20)
}

func BuildFileName(fullUrl string) string {
	fileUrl, err := url.Parse(fullUrl)
	if err != nil {
		return ""
	}
	path := fileUrl.Path
	segments := strings.Split(path, "/")
	return segments[len(segments)-1]
}

func DownloadUrl(url string, dest string) (*File, error) {
	response, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	if err := os.MkdirAll(dest, 0775); err != nil {
		return nil, err
	}
	mime := response.Header.Get("Content-Type")
	filename := BuildFileName(url)
	ext := filepath.Ext(filename)
	kind := "Other"
	if len(ext) == 0 {
		switch mime {
		case "image/jpeg":
			filename += ".jpg"
			break
		case "image/png":
			filename += ".png"
			break
		case "image/gif":
			filename += ".gif"
			break
		case "image/webp":
			filename += ".webp"
			break
		default:
			break
		}
	}
	fileDest := dest + "/" + filename
	if strings.HasPrefix(dest, "/") {
		fileDest = dest + filename
	}
	file, err := os.Create(fileDest)
	if err != nil {
		log.Fatal(err)
	}
	_, err = io.Copy(file, response.Body)
	if err != nil {
		return nil, err
	}
	fi, err := file.Stat()
	if err != nil {
		return nil, fmt.Errorf("could not read file size")
	}
	if mime == "image/jpeg" || mime == "image/gif" || mime == "image/png" || mime == "image/webp" {
		kind = "Image"
	}
	obj := &File{
		Name: filename,
		Key:  strings.TrimPrefix(fileDest, UploadDir()+"/"),
		Mime: mime,
		Size: fi.Size(),
		Kind: kind,
	}
	file.Close()
	if mime == "image/png" || mime == "image/jpeg" || mime == "image/gif" {
		src, err := imaging.Open(fileDest)
		if err != nil {
			return nil, fmt.Errorf("could not open file %s", err.Error())
		}
		obj.Width = src.Bounds().Dx()
		obj.Height = src.Bounds().Dy()
		src = imaging.Resize(src, 400, 0, imaging.Lanczos)
		thumbDest := strings.TrimSuffix(fileDest, obj.Name) + "/thumbnail"
		if err := os.MkdirAll(thumbDest, 0775); err != nil {
			return nil, fmt.Errorf("failed to create thumbnai %s", err.Error())
		}
		if err = imaging.Save(src, thumbDest+"/"+obj.Name); err != nil {
			return nil, fmt.Errorf("failed to save thumbnail %s", err.Error())
		}
		obj.thumbnail = strings.TrimPrefix(thumbDest, UploadDir()+"/")
	}
	return obj, nil
}

func HandleUpload(c *gin.Context) {
	file, _ := c.FormFile("file")
	token := auth.GetToken(c.Request)
	if len(token) == 0 {
		c.JSON(401, gin.H{"error": "access denied"})
		return
	}
	decode := auth.DecodeJwt(token)
	if decode == nil {
		c.JSON(401, gin.H{"error": "access denied"})
		return
	}
	uniqueId := id.Gen(20)
	today := time.Now()
	todayFormat := today.Format("2006-01-02")
	userId := fmt.Sprintf("%d", decode.UserID)
	dir := UploadDir() + "/" + userId + "/" + todayFormat + "/" + uniqueId
	key := userId + "/" + todayFormat + "/" + uniqueId + "/" + file.Filename
	if err := os.MkdirAll(dir, 0775); err != nil {
		c.JSON(503, gin.H{"error": "could not create file"})
		return
	}
	dest := dir + "/" + file.Filename
	if err := c.SaveUploadedFile(file, dest); err != nil {
		logger.Log("upload file", map[string]string{"file": file.Filename, "error": err.Error()})
		c.JSON(503, gin.H{"error": "could not save file"})
		return
	}
	f, err := os.Open(dest)
	if err != nil {
		c.JSON(503, gin.H{"error": "could not read file"})
		return
	}
	buffer := make([]byte, 512)
	if _, err := f.Read(buffer); err != nil {
		c.JSON(503, gin.H{"error": "could not read file"})
		return
	}
	mime := http.DetectContentType(buffer)
	f.Close()
	insert := map[string]interface{}{
		"name":       file.Filename,
		"Key":        key,
		"cloud":      "Storage",
		"size":       file.Size,
		"mime":       mime,
		"kind":       "Other",
		"created_at": today,
		"updated_at": today,
	}
	if mime == "image/png" || mime == "image/jpeg" || mime == "image/gif" {
		src, err := imaging.Open(dest)
		if err != nil {
			c.JSON(503, gin.H{"error": "an error open file"})
			return
		}
		insert["width"] = src.Bounds().Dx()
		insert["height"] = src.Bounds().Dy()
		insert["kind"] = "Image"
		src = imaging.Resize(src, 400, 0, imaging.Lanczos)
		thumbSrc := userId + "/" + todayFormat + "/" + uniqueId + "/thumbnail/" + file.Filename
		if err := os.MkdirAll(dir+"/thumbnail", 0775); err != nil {
			c.JSON(503, gin.H{"error": "failed to create thumbnail"})
			return
		}
		if err = imaging.Save(src, dir+"/thumbnail/"+file.Filename); err != nil {
			c.JSON(503, gin.H{"error": "failed to save thumbnail"})
			return
		}
		insert["thumbnail"] = thumbSrc
	}
	if err := util.Insert(DB, "files", insert).Error; err != nil {
		logger.Log("create file", err)
		c.JSON(503, gin.H{"error": "an error saving file"})
		return
	}
	c.JSON(200, gin.H(insert))
}
