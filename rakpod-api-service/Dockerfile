FROM node:18
ENV TZ=Asia/Bangkok
RUN ln -fs /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && dpkg-reconfigure -f noninteractive tzdata
WORKDIR /app
COPY package.json /app
RUN echo 'nameserver 8.8.8.8' > /etc/resolv.conf \
    && echo 'nameserver 1.1.1.1' >> /etc/resolv.conf
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-timeout 600000
RUN npm install
COPY . /app

CMD ["npm", "start"]
