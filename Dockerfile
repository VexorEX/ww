FROM node:20

WORKDIR /app

COPY . .

RUN npm install -g pnpm ts-node typescript
RUN pnpm install

CMD ["pnpm","dev"]
