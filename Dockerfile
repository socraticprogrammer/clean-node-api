ARG PORT=3000

FROM node:17.9.0-alpine as runtime
ENV NODE_ENV production
RUN apk --no-cache -U upgrade
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN npm i pm2 -g
COPY package*.json process.yml ./
USER node
RUN npm i --only=production
COPY --chown=node:node . .
EXPOSE ${PORT}
CMD pm2 start process.yml
