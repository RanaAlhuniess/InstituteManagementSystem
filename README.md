# Part-Time Teaching Institute Management System

## Overview

This program facilitates managing a part-time teaching institute with three instructors. It allows students to create
accounts, log in, and book sessions with available instructors based on their schedules.

## Backend

### Framework

- Node.js with Express for the server-side application.

### Database

- PostgreSQL for storing user data, instructor availability, and booked sessions.

### ORM/Query Builder

- Prisma to interact with the PostgreSQL database.
-----------
# Technologies Used

- Node.js
- Express.js
- TypeScript
- Postgresql
- Prisma
- 
-----------
## API Endpoints
### Authentication
- `/auth/register`: POST - Register a new user.
- `/auth/login`: POST - Log in and generate JWT token for authentication.
- `/auth/logout`: POST - Logout (invalidate JWT token).
### Instructors
- `/instructors/{id}/book`: POST - Book a session with an available instructor.
- `/instructors/{id}/availability`: GET - Fetch available instructor schedules.

### Sessions
- `/sessions/{id}/cancel`: DELETE - Manage booked sessions.

### Students
- `/students/{id}/sessions`: GET - Fetch all booked sessions for a student.

## Postman Collection
For easier testing and usage of the API endpoints, a Postman collection is included in this repository. The collection contains pre-configured requests to interact with the API endpoints.

To use the Postman collection:
1. Download and install Postman ([Download Link](https://www.postman.com/downloads/)).
2. Import the collection file located in the `postman` directory of this repository.
3. Update environment variables as necessary for local setup.
4. Start testing and interacting with the API endpoints using the provided requests.

### Collection File
- [Part-Time Teaching Institute API Collection](https://github.com/RanaAlhuniess/InstituteManagementSystem/blob/master/management-sys.postman_collection.json)


-----------
# Setup Instructions

## Pre-requisites

- Install [Node.js](https://nodejs.org/en/) version 20.10.0

## Setup

- To get the Node server running locally:
- Clone the repository
    ```
    git clone  <git hub template url> <project_name>
    ```
- Switch to the repo folder
    ```
   cd <project_name>
  ```
- Install dependencies
  ### `npm install`
- Configure the database connection and third-party API keys
  Copy the example env file and make the required configuration changes in the .env file
  (Set up PostgreSQL and configure connection in the .env file)
    ```
     cp .env.example .env
  ```
- Apply Migration
  ### `npx prisma migrate deploy`
  Make sure you set the correct database connection information before running the migrations Environment variables
- Run the backend server using
  ### `npm run dev`

Runs the app in the development mode.\
You can now access the server at  [http://localhost:8000](http://localhost:8000).

## Seeding Data
To seed the database with initial data, use the following command:

### `npm run seed`

**TL;DR command list**

```
git clone https://github.com/RanaAlhuniess/InstituteManagementSystem
cd InstituteManagementSystem
npm install
cp .env.example .env
npx prisma migrate deploy
npm run dev
```


## Project Structure

The folder structure of this app is explained below:

| Name             | Description                                                                                      |
|------------------|--------------------------------------------------------------------------------------------------|
| **node_modules** | Contains all  npm dependencies                                                                   |
| **config**       | Application configuration including inversify, exception, logger and server configs              
| **controllers**  | Controllers define functions to serve various express routes.                                    
| **database**     | Contains database config and connection                                                         |
| **dtos**         | Data Transfer Objects (DTOs)                                                                     
| **entities**     | Entities representing data structures                                                            
| **middleware**   | Middleware for handling requests including validate body request                                 |
| **repositories** | Repositories for data access                                                                     |
| **services**     | Contain all business logic for the Application                                                   |
| server.ts        | Entry point to express app                                                                       |
| package.json     | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped) | tsconfig.json            | Config settings for compiling source code only written in TypeScript    

-----------