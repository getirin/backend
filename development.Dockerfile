# Dockerfile to build `binary` image which will have everything packaged; like dependenecies and codes.
# This image can be configured and run with environment variables.
FROM node:8.9.4-alpine

# Add build tools necessary for npm installations.
RUN apk add --no-cache make gcc g++ python
# Add git for public project installing
RUN apk add --no-cache git

# Install global dependencies for dev image
RUN npm install -g nodemon
RUN npm install -g forever

WORKDIR /application

# Add the package.json and install dependencies.
COPY package*.json ./
RUN npm install

# Create a volume definition for app code, to a safe place that we can mount to.
VOLUME /application/code

# Expose the port for the image
EXPOSE 8080

# Start by replacing the package-lock at the project root with the fresh dev installation.
# Forever command to start the project with forever, and file watching with polling.
# Uses bin/index.js of the project as the entrypoint.
CMD cat /application/package-lock.json > /application/code/package-lock.json &&\
    forever --spinSleepTime 10000 --minUptime 5000 -c "nodemon --exitcrash -L --watch /application/code" /application/code/bin/index.js
