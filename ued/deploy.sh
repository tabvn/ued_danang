IP='35.198.225.37'
INSTANCE="ued"
PROJECT="danang-288409"
GOOS=linux GOARCH=amd64 go build -v -o ./docker/ued
#sudo certbot certonly --standalone --preferred-challenges http -d ued.tabvn.com
#gcloud beta compute ssh --zone "asia-southeast1-a" "instance-2" --project "danang-288409"
gcloud beta compute ssh --zone "asia-southeast1-a" "$INSTANCE" --project "$PROJECT" -- 'sudo mkdir -p /var/www/html'
gcloud compute copy-files ./docker/* root@"$INSTANCE":/var/www --zone "asia-southeast1-a" --project "$PROJECT"
gcloud beta compute ssh --zone "asia-southeast1-a" "$INSTANCE" --project "$PROJECT" -- 'cd /var/www; sudo docker-compose build && sudo docker-compose up -d'
rm -r ./docker/ued
