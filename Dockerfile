FROM node:20

WORKDIR /app

COPY . .

RUN npm install
RUN npm install -g ts-node typescript

CMD ["npm","run","dev"]
