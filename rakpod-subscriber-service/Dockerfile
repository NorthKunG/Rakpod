FROM node:16
ENV TZ=Asia/Bangkok
RUN ln -fs /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && dpkg-reconfigure -f noninteractive tzdata
WORKDIR /app
RUN mkdir /app/export_files
COPY package.json /app
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-timeout 600000

RUN npm install -g npm@latest


RUN npm install
COPY . /app

CMD ["npm", "start"]
