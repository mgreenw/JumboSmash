FROM node:8.12-alpine AS builder
WORKDIR /home/src/app
COPY . .
RUN apk update && apk add python make g++
RUN npm install
RUN npm run build

FROM node:8.12-alpine
WORKDIR /home/src/app

COPY ./package* ./
RUN apk update && apk add python make g++ vim
RUN npm install --prod
# RUN npm install --prod && npm cache clean
COPY --from=builder /home/src/app/dist .
EXPOSE 3000
CMD ["npm", "run", "start"]
