# --- Step 1: Build React app ---
FROM node:16 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# --- Step 2: Serve build/ with Nginx ---
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]