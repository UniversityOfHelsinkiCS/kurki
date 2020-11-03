#!/bin/bash

# This file would be a stack of npm scripts if we lived in node world.

option=$1

if [[ $option == kurki ]];
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
