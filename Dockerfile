FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY dist/. ./
COPY nginx-docker.conf /etc/nginx/conf.d/default.conf
