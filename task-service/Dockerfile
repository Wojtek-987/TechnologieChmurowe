# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Install dependencies (prod + dev)
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copy TS config & source
COPY tsconfig.json ./
COPY src ./src

# 3) Compile to dist/
RUN npm run build

# Stage 2: runtime
FROM node:18-alpine AS runtime
WORKDIR /app

# 4) Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 5) Copy compiled output
COPY --from=builder /app/dist ./dist

# 6) Set production env and expose port
ENV NODE_ENV=production
EXPOSE 4000

# 7) Run the service
CMD ["node", "dist/index.js"]