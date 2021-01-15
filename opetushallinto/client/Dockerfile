FROM node:12.9.1-buster-slim

ARG BASE_PATH
ENV PUBLIC_URL=$BASE_PATH

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
