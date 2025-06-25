# --- Step 1: Build React app ---
# อัปเกรด Node.js เป็น LTS ล่าสุด เช่น node:20 หรือ node:22
FROM node:20 AS build # หรือ node:22

WORKDIR /app

# คัดลอกเฉพาะ package.json และ package-lock.json ก่อน
COPY package.json ./
# ถ้ามี package-lock.json ด้วย ให้เพิ่มบรรทัดนี้:
# COPY package-lock.json ./

# ตั้งค่า npm config และล้าง cache
RUN npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set timeout 600000
RUN npm cache clean --force

# รัน npm install ก่อนที่จะคัดลอกไฟล์ทั้งหมด
RUN npm install

# คัดลอกไฟล์โปรเจกต์ที่เหลือ (ยกเว้น node_modules ที่จะถูก .dockerignore กรองออก)
COPY . .

RUN npm run build

# --- Step 2: Serve build/ with Nginx ---
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]