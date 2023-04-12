# Stage 1
FROM node:14.21.3-alpine as node

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build -- --prod
# Stage 2
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf 
COPY --from=node /app/dist/shopDemoUI /usr/share/nginx/html

# EXPOSE 4200