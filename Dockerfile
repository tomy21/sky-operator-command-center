FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# --- Tambah ARG supaya ENV dari docker-compose masuk ke tahap build ---
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

ARG PORT
ENV PORT=${PORT}

# Copy dependency file
COPY package.json yarn.lock ./

RUN yarn install

# Copy all project files
COPY . .

# Build dengan ENV (penting!!)
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
