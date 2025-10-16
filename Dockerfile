FROM node:20

WORKDIR /app

COPY . .

RUN pnpm install

CMD ["pnpm","dev"]
