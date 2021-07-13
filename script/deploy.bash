#!/bin/bash

cd_cmd="cd BE-Project-authentication"
pull_cmd="git pull origin master"
build_cmd="sudo docker build -t be-project-authentication:latest ."
update_cmd="cd ../BE-Project-stack && sudo docker-compose -f docker-compose.yml up -d"

cmd="$cd_cmd && $pull_cmd && $build_cmd && $update_cmd"

ssh "ubuntu@$SERVER" "$cmd"