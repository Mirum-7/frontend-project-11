FROM node:20 as package

WORKDIR /opt/app

COPY package*.json ./
COPY Makefile ./

RUN make install

FROM node:20 as builder

WORKDIR /opt/app

COPY --from=package /opt/app/node_modules ./node_modules
COPY src ./src
COPY public ./public
COPY webpack.config.js ./
COPY Makefile ./
COPY package*.json ./

RUN make build

FROM nginx:alpine3.20-slim

WORKDIR /usr/src/app

COPY --from=builder /opt/app/build ./build

COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
