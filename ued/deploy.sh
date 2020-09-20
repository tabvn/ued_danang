IP='35.197.153.176'
INSTANCE="ued"
PROJECT="danang-288409"
GOOS=linux GOARCH=amd64 go build -v -o ./docker/ued

#gcloud beta compute ssh --zone "asia-southeast1-a" "instance-2" --project "danang-288409"
gcloud beta compute ssh --zone "asia-southeast1-a" "$INSTANCE" --project "$PROJECT" -- 'sudo mkdir /var/www/html'
gcloud compute copy-files ./docker/* root@ued:/var/www --zone "asia-southeast1-a" --project "danang-288409"
gcloud beta compute ssh --zone "asia-southeast1-a" "$INSTANCE" --project "$PROJECT" -- 'cd /var/www; sudo docker-compose build && sudo docker-compose up -d'
rm -r ./docker/ued
