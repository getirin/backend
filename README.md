<div align="center>
    <img src="https://github.com/hapijs/hapi/raw/65944e55ea35189c68b2a5bd9f8cc039e5147961/images/17.png" alt="Getir.in Backend">
    <h1>Getir.in Backend</h1>
</div>

This is the backend of the [getir.in](https://github.com/getirin) project, done in [Semih Öztürk Hackathon 2018](http://hackathon.getir.com). It uses the [yengas/backend-boilerplate](https://github.com/Yengas/backend-boilerplate) as the initial commit. 

--------------------

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yengas/backend-boilerplate)
[![Documentation](https://img.shields.io/swagger/valid/2.0/https/api.getir.in/swagger.json.svg)](https://api.getir.in/documentation)

# Features

Whole projects features compatibility with Docker, Heroku for deployment, Swagger for Documentation, Unit and Integration tests with Jest, Logging with Pino, Linting according to custom taste extended over standardjs. As the backend framework of choice, HapiJS v17 is used. It features async rest endpoint handlers, auto documentation generation for routes, Schema validation with Joi.

Table of contents (WIP)
=================

<!--ts-->
   * [Table of contents](#table-of-contents)
   * [Structure](#structure)
   * [Configuration](#configuration)
   * [Running the project](#running-the-project)
      * [Using Docker](#using-docker)
        * [Docker-Compose file](#docker-compose-file)
   * [Deployment](#deployment)
   * [Tests](#tests)
   * [Mocks](#mocks)
   * [FAQ](#faq)
<!--te-->

# Structure
```
.
├── __mocks__  # mock api overrides 
│   └── routes # these routes will override auto generated mock endpoints
├── __tests__       # all of the tests for the project
│   ├── unit        
│   ├── integration 
│   └── helper.js   # helper functions that will be re-used in tests
├── bin                     # scripts that gets run directly
│   ├── mock-api.js         # uses joi to create mock endpoints from routes
│   ├── swagger-generate.js # generates the swagger.json and saves it to given path
│   └── index.js            # entrypoint for our application
├── src                     # main source folder
│   ├── utils.js            # re-used functions
│   ├── schemas             # joi schemas for the app
│   ├── controllers         # controllers that handle http requests
│   ├── routes              # rest api endpoint definitions
│   ├── resources           # constant values and data
│   ├── plugins             # custom hapijs plugins
│   ├── log.js              # logger instance creator
│   ├── configureServer.js  # helper functions to configure the server
│   ├── index.js            # entrypoint for source folder
│   └── config.js           # application config
├── development.Dockerfile  # development dockerfile
├── Dockerfile              # production dockerfile
├── Makefile                # make file for easing docker usage
└── docker-compose.yml      # reference docker-compose for dev
```

# Configuration
The application is configured using environment variables to make it run everywhere. Most of the popular deployment softwares such as Heroku, Kubernetes rely on this aswell. To make it easier to work with, we also added dotenv so you can define a `.env` project at the root of your folder while working bare-metal on your computer. 

The main configuration file is on [./src/config.js](./src/config.js) and its pretty self describing. Configurations are commented and the environment variables are explained below.

## The most overengineered part of our code!
Most of the time spent on this project was setting up the endpoints that required to run the application. However there is one part that we think we have overdone ourselves and overengineered! Check [this commit](https://github.com/getirin/backend/commit/67f98ed83119cc4adb7ae5ce1c266f71ace81fb1) out to see what we mean. It's a fully configurable sorting algorithm, that dynamically generates mongodb queries. 

# Running the project
## Using Docker
Project relies on Docker for offline development. All backend development has been done locally, with a `mongo:3.6.2` docker image and the docker-compose reference file.
### Docker-Compose file
For development you can just run the `docker-compose` up command and the container will start running. However there isn't any database in the configuration, so you either need to add it, or run the container on net=host. This file is just a reference.
# Deployment
The repository uses Heroku deployment configuration so it can be run anywhere. The local installation, if you want to run it locally requires node 8.9.4. However there are Dockerfiles both for development and production.

There is also a very handy [Makefile](Makefile) which includes utility commands like running tests, lint, mocks in Docker Development images. It also has commands for building images and running them. However i suggest you to use the [docker-compose.yml](./docker-compose.yml) for the local development.
# Environment Variables
Environment variables are used to enable the configuration of this project. Below are list of these environment variables and what they configure.

- **APP_HOST** the host of the hapijs configuration, default: `localhost`
- **PORT** the port to listen on, default: `8080`
- **ENABLE_CORS** whether to enable hapi cors or not, default: `true`
- **SWAGGER_HOST** the hapi-swagger host which will be used to prefix `localhost`
- **SWAGGER_PORT** the swagger port to use in the documentation ui, default: `8080`
- **JWT_KEY** the jwt key to sign secrets. default: `helloworld`
- **JWT_ALGORITHM** the jwt algorithm to use, default: `HS256`
- **MONGODB_CONNECTION_STRING** or **MONGODB_URI** the mongodb connection string to use `mongodb://localhost/getirin`
- **TEST_MONGODB_CONNECTION_STRING** mongo database to use when testing. `mongodb://localhost/getirin-test`
- **REDIS_HOST** the host to use for events redis database, default: `localhost`
- **REDIS_PORT** the port to use for events redis port, default: `6379`

# Tests
Tests are done with Jest. There are both unit and integration tests. The default `npm test` command runs the unit tests only. If you would like to run integration tests , you can use `npm run test:integration`. Integration tests requires a Mongo database connection. 

# Mocks
You can run `npm run serve:mock` script to get a randomly generated data out of your joi schemas. We also have a make command for this.
# FAQ
