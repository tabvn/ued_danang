certbot certonly --standalone -d ued.tabvn.com
#renew
certbot renew --pre-hook "docker-compose -f /var/www/docker-compose.yml down" --post-hook "docker-compose -f /var/www/docker-compose.yml up -d"
