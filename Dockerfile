FROM node:17.9.0-alpine

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json .

RUN npm i --production

COPY --chown=node:node . .

EXPOSE 3000

CMD node ./src/main/index.js
