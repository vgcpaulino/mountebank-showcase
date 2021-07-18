ARG IMAGE_FROM=node
ARG IMAGE_TAG=latest

FROM ${IMAGE_FROM}:${IMAGE_TAG} AS base
COPY . /src
WORKDIR /src
RUN npm install

FROM base AS mountebank
CMD [ "npm", "run", "mb:start" ]

FROM base AS mountebank-test
