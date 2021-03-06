FROM node:12.9.1-buster-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
