<div align="center>
    <img src="https://github.com/hapijs/hapi/raw/65944e55ea35189c68b2a5bd9f8cc039e5147961/images/17.png" alt="HapiJS Backend Boilerplate">
    <h1>HapiJS Backend Boilerplate</h1>
</div>

This is a backend boilerplate project that uses latest ES6 features and HapiJS v17. Its very opinionated and suits to my own tastes. It aims to create ease of development with features such as auto documentation of REST endpoints, generating random data for mock apis, Dockerfiles.

--------------------

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yengas/backend-boilerplate)
[![Documentation](	https://img.shields.io/swagger/valid/2.0/https/yengas-boilerplate.herokuapp.com/swagger.json.svg)](https://yengas-boilerplate.herokuapp.com/documentation)

Table of contents
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
