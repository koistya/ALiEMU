FROM debian:jessie
MAINTAINER Derek P Sifford

# Grab initial requirements
RUN apt-get update && apt-get install -y \
                apt-utils \
                build-essential \
                curl \
                nodejs \
                npm

# Symlink nodejs over top of the useless preinstalled node binary
RUN ln -sf /usr/bin/nodejs /usr/bin/node

# Install the "n" nodejs version manager and update to the latest version
RUN npm i -g n \
    && n latest

RUN mkdir -p /app
WORKDIR /app

COPY ./package.json .
RUN npm install --production

CMD ["npm", "build"]
