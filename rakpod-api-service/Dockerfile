FROM node:16
ENV TZ=Asia/Bangkok
RUN ln -fs /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && dpkg-reconfigure -f noninteractive tzdata
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app

CMD ["npm", "start"]
