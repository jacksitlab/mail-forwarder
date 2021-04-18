FROM node:10

WORKDIR /usr/app
COPY package.json .
COPY tsconfig.json .
RUN npm install
COPY src src
RUN npm run build

CMD [ "node","dist/server.js","-c","config.json" ]
