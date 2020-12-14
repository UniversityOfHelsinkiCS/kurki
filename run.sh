#!/bin/bash

# Passes all additional arguments to docker-compose as is. See ./run kurki up --help

option=$1

command=$2

if [[ $option == morning ]];
then
  docker-compose down --rmi all --remove-orphans --volumes && rm -rf oracle_data
elif [[ $command == down ]];
then
  docker-compose down "${@:3}"
elif [[ $option == kurki ]];
then
  docker-compose "${@:2}" kurki kurki-db loginas
elif [[ $option == updater ]];
then
  docker-compose "${@:2}" kurki-db kurki-updater
elif [[ $option == both ]];
then
  docker-compose "${@:2}"
else
  echo "1st arg must be kurki, updater or both. Try './run.sh both up'"
fi
