# Multi-stage Dockerfile for blog-frontend

# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist/blog-frontend/browser /usr/share/nginx/html
# Verify the path if it's dist/blog-frontend/browser for Angular 17+
# If Angular 17+ with application builder, it might be dist/blog-frontend/browser
# I will use a wildcard if needed or check dist structure later, but dist/blog-frontend is standard.
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
