# todo-microfrontend/Dockerfile

FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY *.json ./
RUN npm ci

COPY vite.config.ts index.html ./
COPY public ./public
COPY src ./src

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]