FROM node:14.17.0-alpine

WORKDIR /app

EXPOSE 3000

COPY package.json .
COPY yarn.lock .

RUN yarn install

# COPY package* ./
RUN yarn autoclean

COPY . .

ENV NODE_ENV=development
CMD ["yarn", "start:dev"]
