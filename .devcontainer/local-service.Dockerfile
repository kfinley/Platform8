FROM mcr.microsoft.com/dotnet/sdk:5.0
ARG Port

ENV DOCKERIZE_VERSION v0.6.1

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    apt-get update && \
    apt-get install -y --no-install-recommends apt-utils && \
    apt-get install -y procps

WORKDIR /Api

VOLUME /Api
VOLUME /vsdbg

EXPOSE ${Port}

WORKDIR /Api/bin/Debug/net5.0
