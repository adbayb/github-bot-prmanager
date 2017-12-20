FROM node:carbon
LABEL maintainer="adbayb@gmail.com"

WORKDIR /usr/app/project

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]

# Build image: docker build -t github/bot .
# Launch a container: docker run -p 3000:3000 github/bot
