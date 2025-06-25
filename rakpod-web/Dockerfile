# --- Step 1: Build React app ---
FROM node:20 AS build

WORKDIR /app

COPY package.json ./
# ถ้ามี package-lock.json ด้วย ให้เพิ่มบรรทัดนี้:
# COPY package-lock.json ./

# **แก้ไขบรรทัดนี้:** ตรวจสอบให้แน่ใจว่า syntax ถูกต้อง
RUN npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set timeout 600000
    # ไม่มี `:` ต่อท้าย 600000 และ ensure exact phrasing.
    # ถ้าสงสัย syntax การรวมบรรทัด ลองแยกเป็น 3 RUN commands แทน:
    # RUN npm config set fetch-retry-mintimeout 20000
    # RUN npm config set fetch-retry-maxtimeout 120000
    # RUN npm config set timeout 600000

RUN npm cache clean --force

RUN npm install

COPY . . # ตรวจสอบให้แน่ใจว่ามี .dockerignore เพื่อละเว้น node_modules

RUN npm run build

# --- Step 2: Serve build/ with Nginx ---
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]