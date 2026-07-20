# Multi-stage production Dockerfile

# Stage 1: Development
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Runner (Production)
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
# Custom NGINX configurations
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    # Health probe endpoint \
    location /health { \
        access_log off; \
        add_header Content-Type text/plain; \
        return 200 "OK"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
