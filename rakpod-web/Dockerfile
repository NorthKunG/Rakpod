# --- Step 1: Build React app ---
FROM node:18 AS build

WORKDIR /app
COPY . .
RUN echo 'nameserver 8.8.8.8' > /etc/resolv.conf \
    && echo 'nameserver 1.1.1.1' >> /etc/resolv.conf
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-timeout 600000

RUN npm install

RUN npm run build

# --- Step 2: Serve build/ with Nginx ---
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]