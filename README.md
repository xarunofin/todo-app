# Developer Excercise - To Do App

An application that allows users to `create`, `read`, `update`, and `delete` tasks.
This is a monorepo project that uses [NestJS](https://nestjs.com/) and [Angular](https://angular.io/) with [MongoDB](https://www.mongodb.com/) as a database.

Powered by: `npm workspaces`

> **Disclaimer**: This is my first time creating an Angular and NestJS application. I may implement some anti-patterns or different approaches. I am open to any feedback.

## Task Details

_The task details in verbatim._

```
Simple To Do App Project
Framework: AngularJS
- Api: Nest JS
- DB : MongoDB
Task: Create a simple To Do App Project
That has basic CRUD Functionalities
No need for any fancy design you may just have the Basic UI
Upload the project on your personal github repository and share the link once done.
```

## Getting Started

1. Install dependencies at the root of the workspace.

   ```bash
   npm install
   ```

2. Setup environment variables in the [.env](/apps/api/.env) file for the API. (Refer to the [.env.example](/apps/api/.env.example) for reference)

3. Setup environment variables for the Web Application (Only if needed). (Refer to the [/apps/web/src/environments](/apps/web/src/environments/) for reference)

4. Start the application in development mode. (Runs the API and the Web App in
   parallel using [concurrently](https://www.npmjs.com/package/concurrently))

   ```bash
   npm start
   ```

   Or you can choose a specific service to start:

   ```bash
   npm start:api
   npm start:web
   ```

5. The services will be running in these ports:

   ```bash
   # API
   http://localhost:8127
   # Web
   http://localhost:8128
   ```

## Insights

- I did not implement any authentication and authorization due to time constraints.
- I focused too much on improving/easing out the workspace/development experience that I wasn't able to focus on other matters.
- I did not implement any unit tests due to time constraints.
