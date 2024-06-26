FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/api ./src

EXPOSE 3001

CMD ["npm", "start"]