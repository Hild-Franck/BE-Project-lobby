FROM node:latest AS base

WORKDIR /app

FROM base as builder

COPY package*.json .babelrc ./

RUN npm install

COPY ./src ./src

RUN npm run build

RUN npm prune --production

FROM base AS release

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER node

CMD [ "node", "./dist/index.js" ]