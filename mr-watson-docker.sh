#!/bin/bash

DIRNAME=$(dirname $0)
OSVERSION="$(uname -s)"

clean_docker() {
    # stop and remove old and running containers
    for i in $(docker  ps -q --filter=ancestor=mrwatson); do docker stop $i; done
    for i in $(docker  ps -a -q --filter=ancestor=mrwatson); do docker rm $i; done
}

create_image() {
    if [ -z "$(docker  images -q mrwatson)" ]; then
        cat <<EOF > Dockerfile
FROM node:carbon
WORKDIR /mrwatson
COPY . /mrwatson
RUN npm install
RUN rm /mrwatson/config.json
EXPOSE 5000
CMD [ "npm", "start" ]
EOF
        docker build --tag mrwatson --label mrwatson .
    fi
}

start_mrwatson() {
    echo Starting Mr Watson...
    CONTAINER=$(docker run -d -v $PWD/config.json:/mrwatson/config.json -p 5000:5000 -it mrwatson)
    n=0
    while [ $n -lt 10 ]; do
        curl --retry-connrefused --retry-delay 2 --retry 3 http://localhost:5000 &>/dev/null
        if [ $? = 0 ]; then
            return 0
        fi
        let n++
        sleep 1
    done
    return 1
}

open_browser() {
    $OPEN http://localhost:5000
}

case $OSVERSION in
Linux*)
    OPEN=xdg-open
;;
Darwin*)
    OPEN=open
;;
*)
    echo "This script only works on Linux or MacOS"
    exit 1
;;
esac

if [ $DIRNAME =  "." ]; then
    DIRNAME=$PWD
fi

cd $DIRNAME

if ! which docker &>/dev/null; then
    echo Please install docker first
    exit 1
fi

if ! docker ps 2>&- 1>&-; then
    echo Docker is not running.
    exit 1
fi

clean_docker
create_image
start_mrwatson
if [ $? = 0 ]; then
    echo Mr Watson is up and running. To stop it simply run: docker stop $CONTAINER
    open_browser
else
    echo Mr Watson failed to start. Check the logs for more info: docker logs $CONTAINER
fi

