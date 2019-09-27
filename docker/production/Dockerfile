FROM mhart/alpine-node:10

MAINTAINER Bao Nguyen <ducbaovn@gmail.com>

WORKDIR /app
COPY ./app /app
ADD ./root /

RUN cd /app && \
    npm install --quiet

RUN rm -rf /var/cache/apk/* /root/.npm /root/.node-gyp /tmp/* /var/tmp/*

EXPOSE 3000
