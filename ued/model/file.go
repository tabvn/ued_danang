package model

import (
	"fmt"
	"github.com/tabvn/ued/storage"
)

var (
	GoogleCloud   = "Google"
	AmazonCloud   = "Amazon"
	Storage       = "Storage"
	FileKindImage = "Image"
	FileKindOther = "Other"
)

func FileFromUrl(url string, destination string) (*File, error) {
	obj, err := storage.DownloadUrl(url, destination)
	if err != nil {
		return nil, err
	}
	file := File{
		Name:      obj.Name,
		Key:       obj.Key,
		Thumbnail: &obj.Thumbnail,
		Cloud:     Storage,
		Size:      obj.Size,
		Mime:      obj.Mime,
		Width:     &obj.Width,
		Height:    &obj.Height,
		Kind:      obj.Kind,
	}
	if err := DB.Create(&file).Error; err != nil {
		return nil, fmt.Errorf("create file error: %s", err.Error())
	}
	return &file, nil
}
func FindStoreFileByIds(storeID string, ids []string) []*File {
	if ids == nil{
		return []*File{}
	}
	if len(ids) == 0{
		return []*File{}
	}
	var res []*File
	if err := DB.Where("store_id = ? AND id IN (?)", storeID, ids).Find(&res).Error; err != nil {
		return []*File{}
	}
	return res
}
