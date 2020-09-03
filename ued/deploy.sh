IP='35.197.153.176'
GOOS=linux GOARCH=amd64 go build -v -o ./docker/ued

#gcloud beta compute ssh --zone "asia-southeast1-a" "instance-2" --project "danang-288409"
gcloud compute copy-files ./docker/* root@instance-2:/var/www/ued.tabvn.com/api --zone "asia-southeast1-a" --project "danang-288409"
gcloud beta compute ssh --zone "asia-southeast1-a" "instance-2" --project "danang-288409" -- 'cd /var/www/ued.tabvn.com/api; sudo docker-compose build && sudo docker-compose up -d'
rm -r ./docker/ued
