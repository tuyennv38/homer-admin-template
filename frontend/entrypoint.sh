#!/bin/sh
for file in /usr/share/nginx/html/js/app.*.js;
do
  echo "Processing $file ...";
  echo "DOCKER_ENV_URL_API ${DOCKER_ENV_URL_API} ...";
  sed -i 's|DOCKER_ENV_URL_API|'${DOCKER_ENV_URL_API}'|g' $file 
  sed -i 's|DOCKER_ENV_SERVER|'${DOCKER_ENV_SERVER}'|g' $file 
  sed -i 's|DOCKER_ENV_OTHER_SERVER|'${DOCKER_ENV_OTHER_SERVER}'|g' $file 
done
echo "Starting Nginx"
nginx -g 'daemon off;'