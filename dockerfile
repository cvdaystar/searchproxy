FROM node:10
COPY ./package.json /app/package.json
WORKDIR /app
RUN npm install
COPY . /app
ENV ES_HOST=es-nodes
ENV ELASTIC_URL=http://es-nodes:9200
ENV PORT=3001
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get install -y curl
RUN apt-get install -y tzdata \
    && ln -fs /usr/share/zoneinfo/Asia/Taipei /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata
EXPOSE 3001
CMD [ "npm", "start"]
