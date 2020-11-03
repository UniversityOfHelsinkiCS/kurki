#!/bin/bash

# This file would be a stack of npm scripts if we lived in node world.

option=$1

if [[ $option == kurki ]];
then
  docker-compose up -d kurki kurki-db loginas
elif [[ $option == updater ]];
then
  docker-compose up -d kurki-db kurki-updater
elif [[ $option == both ]];
then
  docker-compose up -d
else
  echo "Valid args are kurki, updater, both. Try './run.sh both'"
fi
