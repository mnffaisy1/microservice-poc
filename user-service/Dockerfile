FROM node:18-alpine AS node

# Builder stage
FROM node as builder

WORKDIR /user_app

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

# Final stage
FROM node as final

RUN mkdir -p /user_app/build
WORKDIR /user_app

COPY package*.json ./
RUN npm install

COPY --from=builder /user_app/build ./build

EXPOSE 3000

CMD ["node", "build/app.js"]