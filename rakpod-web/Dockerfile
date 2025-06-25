# --- Step 1: Build React app ---
FROM node:20 AS build

WORKDIR /app

COPY package.json ./

RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm config set timeout 600000

RUN npm cache clean --force

RUN npm install

COPY . .

RUN npm run build

# --- Step 2: Serve build/ with Nginx ---
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]