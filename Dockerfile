FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

# Hanya API_BASE_URL yang perlu saat build
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
