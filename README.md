# fat
Financial Asset Tracker

#Prerequistes
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
apt update
apt -y upgrade
apt install -y nodejs nmap whois rsync screen git build-essential npm nano certbot
npm install pm2 -g
apt install -y mongodb-org
npm install
npm update

#I will make this work later. Please ignore.
#Optional: Generate valid SSL cert for mongodb. Ensure no webserver is running on port 80/443. Also this has to be updated 60 days when the cert gets refreshed
certbot certonly --standalone -d <valid DNS name>
mkdir system_conf/certs
cp /etc/letsencrypt/live/<valid DNS name>/* system_conf/certs/
cat system_confs/certs/privkey.pem > system_conf/certs/fat_Cert.pem
cat system_confs/certs/cert.pem >> system_conf/certs/fat_Cert.pem
