# Dockerfile to build `binary` image which will have everything packaged; like dependenecies and codes.
# This image can be configured and run with environment variables.
FROM node:8.9.4-alpine AS base

FROM base AS builder
# Add build tools necessary for npm installations.
RUN apk add --no-cache make gcc g++ python
# Add git for public project installing
RUN apk add --no-cache git

WORKDIR /application

# Add package.json for dependency installation.
ADD ./package*.json ./
# Install all dependencies for production.
RUN npm install --only=production

# Release docker image
# As the last stage.
FROM base as release
# init app for container signal forwarding, zombie reaping.
RUN apk add --no-cache tini
# Start cmd commands with tini
ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /application

# Add the codes and other stuff to the application folder.
ADD . .
# Copy the dependencies from the builder image.
COPY --from=builder /application/node_modules /application/node_modules

# Indicate that we use 8080. Maybe configurable.
EXPOSE 8080

# Start the application.
CMD ["node", "/application/bin/index.js"]
