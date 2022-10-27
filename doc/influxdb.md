# Howto install InfluxDB

Based on: [https://pimylifeup.com/raspberry-pi-influxdb/](https://pimylifeup.com/raspberry-pi-influxdb/)

## Basic installation (Raspberry OS)

### Import the key

```bash
curl https://repos.influxdata.com/influxdb.key | gpg --dearmor | sudo tee /usr/share/keyrings/influxdb-archive-keyring.gpg >/dev/null
```

### Add InfluxDB Repository to APT repository list

```bash
echo "deb [signed-by=/usr/share/keyrings/influxdb-archive-keyring.gpg] https://repos.influxdata.com/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```

### Update APT repository index

```bash
sudo apt update
```

### Install InfluxDB

```bash
sudo apt install influxdb
```

### Register InfluxDB System service and enable autostart

```bash
sudo systemctl unmask influxdb
sudo systemctl enable influxdb
sudo systemctl start influxdb
```

## Basic configuration

Based on: [https://www.superhouse.tv/41-datalogging-with-mqtt-node-red-influxdb-and-grafana/](https://www.superhouse.tv/41-datalogging-with-mqtt-node-red-influxdb-and-grafana/)


### Open the InfluxDB shell

```bash
influx
```

### Set admin password

Replace {pwd} with the password of your choice!

```bash
CREATE USER "admin" WITH PASSWORD '{pwd}' WITH ALL PRIVILEGES;
```

### Create a new unprivileged user

Replace {user} with the username of your choice!
Replace {pwd} with the password of your choice!

```bash
CREATE USER "{user}" WITH PASSWORD '{pwd}';
```

### Create a database

Replace {db} with the database name you like!

```bash
CREATE DATABASE "{db}";
```

### Grant all privileges to the unprivileged user to the new database

Replace {db} with the database name you choose in the steps before!
Replace {user} with the username you choose in the steps before!

```bash
GRANT ALL ON "{db}" TO "{user}";
```

### Exit the InfluxDB shell

```bash
exit
```

### Configure HTTP access to InfluxDB

Open the file "/etc/influxdb/influxdb.conf" in the editor of your choice. i.e.

```bash
sudo nano /etc/influxdb/influxdb.conf
```

Scroll down to the section \[http\] and change to following lines:

```text
[http]
enabled = true
bind-address = ":8086"
auth-enabled = true
log-enabled = true
write-tracing = false
pprof-enabled = true
pprof-auth-enabled = true
ping-auth-enabled = true
https-enabled = false
```

### Restart the InfluxDB service to activate the new configuration

```bash
sudo systemctl restart influxdb
```

## Configure Retention Policy

The retentation policies control how long data is kept within a database. In my case the default one is 168 hours which means 7 days.

### Start InfluxDB shell

```bash
influx
```

### Authenticate

```text
auth
```

You will be promted for your username and password!

### Set the database to use

Replace {db} with the database you want to use!

```text
use {db}
```

### Show current rention policies

During inject of values to the database the retention policy to use can be choosen. If no retention policy is specified the default one is used.

```text
SHOW RETENTION POLICIES;
```

### Create and set the default policy

Replace {name} with the name of the new policy!
Replace {duration} with the duration to keep the data (i.e. 23h60m)!
Replace {reps} with the number of replications you want to store. In case of a single node cluster you should use 1!
Replace {db} with the name of the database the policy should created for!

```text
CREATE RETENTION POLICY "{name}" ON "{db}" DURATION {duration} REPLICATION {reps} DEFAULT
```

### Create additonal policies which can be selected during inject

Replace {name} with the name of the new policy!
Replace {duration} with the duration to keep the data (i.e. 23h60m)!
Replace {reps} with the number of replications you want to store. In case of a single node cluster you should use 1!
Replace {db} with the name of the database the policy should created for!

```text
CREATE RETENTION POLICY "{name}" ON "{db}" DURATION {duration} REPLICATION {reps}
```
