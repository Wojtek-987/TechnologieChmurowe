# todo-microfrontend/Dockerfile

### Stage 1: build ###
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# 1) Copy all JSON configs and install deps
COPY *.json ./
RUN npm ci

# 2) Copy Vite config, HTML, public assets, and source
COPY vite.config.ts index.html ./
COPY public ./public
COPY src ./src

# 3) Build the SPA
RUN npm run build

### Stage 2: serve static ###
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# 4) Install a simple static-server
RUN npm install -g serve

# 5) Copy the built assets
COPY --from=builder /usr/src/app/dist ./dist

# 6) Expose port and serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]