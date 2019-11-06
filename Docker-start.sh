#!bin/bash

echo "\n\n\nNpm install:"
npm install -g n
npm install -g pm2

echo "\n\n\nCopy .env file:"
file="./.env.docker"

if [ -f "$file" ]
then
	echo "$file found."
	cp $file ./.env
	echo ".env created"
else
	echo "$file not found."
	exit 1
fi

echo "\n\n\nRun migration:"
adonis migration:run --force