# Setting the production using AWS EC2

### Features

- To be runned on ubuntu VM
- Node 18.16.0
- Vsftpd
- Nginx
- Certbot
- Pm2

### How to set up

1. Create a AWS EC2 instance using Ubuntu
	- A `.pem` file need to created to use **SSH** connection
	- Create a security group

<br>

2. Open the security group and set the following configurations as
	**entry rules**
	|  Type | Protocol | Ports interval | Origin |
	| :------------ | :------------ | :------------ | :------------ |
	| HTTPS  | TCP | 443 | 0.0.0.0/0 |
	|  HTTP | TCP | 80 | 0.0.0.0/0 |
	| SSH | TCP | 22 | <\Your IP>\ |
	| Custom TCP | TCP | 1024 - 1048 | 0.0.0.0/0 |
	| Custom TCP | TCP | 20 - 21 | 0.0.0.0/0 |
	| Custom TCP | TCP | 1024 - 1048 | ::0 |
	| Custom TCP | TCP | 20 - 21 | ::0 |

<br>

3. Connect to your instance using SSH
	- Go to "Connect"
	- Click on "SSH Client"
	- Run the example command on your device
		- you need to be in the same folder as your `.pem` key file

4. Once you are connected, make sure you have the **git** installed

5. Install the Node using NVM
	- You can install using the [nvm-sh repository](https://github.com/nvm-sh/nvm)
	on github

6. Install the Node v18.16.0 using the NVM
	```bash
	nvm install 18.16.0

	nvm use 18.16.0
	```

7. Install the PM2 proccess manager
	```bash
	npm i -g pm2
	```

8. Clone the scanner project on your user folder
	```bash
	git clone https://github.com/johncovv/scanner.git
	```
9. Open the project folder
	```bash
	cd ./scanner
	```

10. Install the dependencies using **npm**
	```bash
	npm install --production
	```

11. Create a `.env.production` file with the following content
	```.env
	PASSPORT_PASSWORD=<RANDOM_PASSWORD_WITH_AT_LEAST_64_CHARACTERS>
	ADMIN_PASSWORD=<ADMIN_PASSWORD>
	```

12. Install the NGINX for reverse proxy server
	```bash
	sudo apt update
	sudo apt-get install nginx -y´

	# check the nginx status
	sudo systemctl status nginx

	# the output should be something like
	Output
	● nginx.service - A high performance web server and a reverse proxy server
		Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
		Active: active (running) since Fri 2020-04-20 16:08:19 UTC; 3 days ago
			Docs: man:nginx(8)
	Main PID: 2369 (nginx)
			Tasks: 2 (limit: 1153)
		Memory: 3.5M
		CGroup: /system.slice/nginx.service
						├─2369 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
						└─2380 nginx: worker process
	```

13. Configure the nginx to listen the node proccess
	- Create an configuration file for this project
		```bash
		sudo nano /etc/nginx/sites-available/scanner
		```
	- Paste the following content
		```txt
		server {
			server_name <YOUR_DOMAIN>;

			location / {
				proxy_set_header   X-Forwarded-For $remote_addr;
				proxy_set_header   Host $http_host;
				proxy_pass         "http://127.0.0.0:3000";
			}
		}
		```
	- Create a link of the config in to the `sites-enabled`
		```bash
		sudo ln -s /etc/nginx/sites-available/scanner /etc/nginx/sites-enabled/

		# make sure that there are no syntax error in any of your nginx files
		sudo nginx -t

		# then, restart the service to apply the changes
		sudo systemctl restart nginx
		```
	- Now, to make sure everything is working properly, open the instance public
	IP on a new tab of your browser




