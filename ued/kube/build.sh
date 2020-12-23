cd ../
PROJECT_ID="danang-288409"
GOOS=linux GOARCH=amd64 go build -v -o ./kube/ued
cd ./kube
gcloud config set project $PROJECT_ID
gcloud builds submit --tag gcr.io/$PROJECT_ID/ued
rm ./ued
