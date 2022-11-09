# Grafana

## Installation

Based on: [https://grafana.com/docs/grafana/latest/setup-grafana/installation/debian/](https://grafana.com/docs/grafana/latest/setup-grafana/installation/debian/)

### Import the key

```bash
sudo wget -q -O /usr/share/keyrings/grafana.key https://packages.grafana.com/gpg.key
```

### Add Grafana OpenSource Edition Repository to APT repository list

```bash
echo "deb [signed-by=/usr/share/keyrings/grafana.key] https://packages.grafana.com/oss/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
```

### Update APT repository index

```bash
sudo apt update
```

### Install Grafana

```bash
sudo apt install -y grafana
```

### Allow external connections in firewall (optional)

```bash
sudo ufw allow 3000
```

## Basic configuration


### Configure HTTPS access to Grafana (optional)

First of all you need a certificate and key file for your host. If you do not have one try the following steps:

```bash
openssl genrsa -out grafana.key 2048
openssl req -new -key grafana.key -out grafana.csr
openssl x509 -req -days 365 -in grafana.csr -signkey grafana.key -out grafana.crt
sudo mv grafana.crt /etc/grafana/grafana-cert.pem
sudo mv grafana.key /etc/grafana/grafana-key.pem
```

Copy the certificate and the key to use to /etc/grafana and change the permissions to grafana user!

```bash
chown grafana:grafana /etc/grafana/*.pem
```

Open the file "/etc/grafana/grafana.ini" in the editor of your choice. i.e.

```bash
sudo nano /etc/grafana/grafana.ini
```

Scroll to the section \[server\] and change the following lines:

Replace {domain} with your domain!

```text
[server]
protocol = https
domain = {domain}
cert_file = /etc/grafana/grafana-cert.pem
cert_key = /etc/grafana/grafana-key.pem
```

Scroll to the section \[security\] and change the following lines:

```text
[security]
allow_embedding = true
```

Only if you use https:

```text
cookie_secure = true
```

Scroll to the section \[auth.anonymous\] and change the following lines:
Replace {org} with the organisation name you want to use for anonymouse users!

**Attention: Only dashboards/panels that are created within the organistation used for anonymouse users are browseable without login later!**

```text
[auth.anonymous]
enabled = true
# specify organization name that should be used for unauthenticated users
org_name = ORGANIZATION
org_role = Viewer
```

### Restart Grafana system service to activate the new configuration

```bash
sudo systemctl restart grafana-server
```

## Add InfluxDB as datasource (optional)

### Create a grafana user in InfluxDB

Login to InfluxDB:

```bash
influx
```

Authenticate:

```test
auth
```

You will be promted to enter your username and password!

Replace {user} with the username of your choice!
Replace {pwd} with the password of your choice!

```test
CREATE USER "{user}" WITH PASSWORD '{pwd}';
```

Replace {db} with the database name you choose in the steps before!
Replace {user} with the username you choose in the steps before!

```bash
GRANT ALL ON "{db}" TO "{user}";
```

## Start Grafana

### Register Grafana System service and enable autostart

```bash
sudo systemctl unmask grafana-server
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
```
