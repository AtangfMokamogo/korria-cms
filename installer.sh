#!/bin/bash

if mongod --version > /dev/null 2>&1; then
  echo "MongoDB is already installed."
else

  sudo apt update
  sudo apt install -y mongodb

  if [ $? -eq 0 ]; then
    echo "MongoDB installed successfully."
  else
    echo "Error: MongoDB installation failed."
    exit 1
  fi

  sudo service mongodb start

  if [ $? -eq 0 ]; then
    echo "MongoDB service started."
    echo "MongoDB can be reached on Connection String: mongodb://localhost:27017/korriadb"
  else
    echo "Error: Failed to start MongoDB service."
    exit 1
  fi
fi

npm install -y

if [ $? -eq 0 ]; then
  echo "npm packages install completed successfully!"
  echo "................................."
  echo "Starting Server"
  npm start
else
  echo "Error: npm install failed."
  exit 1
fi
