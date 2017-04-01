FROM node:boron
MAINTAINER Christian Bartrina <christianbartrina@gmail.com>
ENV NODE_ENV 'production'

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install --production

COPY config.json /usr/src/app

VOLUME /usr/src/app

COPY .env .env.production app.js LICENSE package.json /usr/src/app/
COPY api /usr/src/app/api
COPY bin /usr/src/app/bin
COPY client/dist /usr/src/app/client/dist


EXPOSE 8080

CMD ["npm", "run", "start:prod"]