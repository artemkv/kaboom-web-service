FROM node:10

RUN mkdir -p /home/node/kaboom.services.web/node_modules && chown -R node:node /home/node/kaboom.services.web

WORKDIR /home/node/kaboom.services.web

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --chown=node:node . .

USER node

EXPOSE 8700

ENV NODE_IP=0.0.0.0
ENV NODE_PORT=8700

CMD [ "node", "app.js" ]