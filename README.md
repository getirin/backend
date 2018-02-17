<div align="center>
    <img src="https://github.com/hapijs/hapi/raw/65944e55ea35189c68b2a5bd9f8cc039e5147961/images/17.png" alt="Getir.in Backend">
    <h1>Getir.in Backend</h1>
</div>

This is the backend of the [getir.in](https://github.com/getirin) project, done in [Semih Öztürk Hackathon 2018](http://hackathon.getir.com). It uses the [yengas/backend-boilerplate](https://github.com/Yengas/backend-boilerplate) as the initial commit. 

--------------------

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yengas/backend-boilerplate)
[![Documentation](	https://img.shields.io/swagger/valid/2.0/https/api.getir.in/swagger.json.svg)](https://yengas-boilerplate.herokuapp.com/documentation)

# Features

Whole projects features compatibility with Docker, Heroku for deployment, Swagger for Documentation, Unit and Integration tests with Jest, Logging with Pino, Linting according to custom taste extended over standardjs. As the backend framework of choice, HapiJS v17 is used. It features async rest endpoint handlers, auto documentation generation for routes, Schema validation with Joi.

Table of contents (WIP)
=================

<!--ts-->
   * [Table of contents](#table-of-contents)
   * [Structure](#structure)
   * [Documentation](#documentation)
   * [Initial Setup](#initial-setup)
   * [Configuration](#configuration)
   * [Running the project](#running-the-project)
      * [Using Docker](#using-docker)
        * [Docker-Compose file](#docker-compose-file)
      * [Local Development](#local-files)
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

# Documentation
# Initial Setup
Cloning the repository, what to change.
# Configuration
# Running the project
Explains how to run the project
## Using Docker
### Docker-Compose file
# Deployment
Deployment related info. heroku, docker, other platforms.
# Tests
Test engine used how to go about unit tests, integration tests. 
# Mocks
# FAQ
