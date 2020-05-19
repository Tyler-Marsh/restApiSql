

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, seed the SQLite database.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).

Software developmental tools like Postman work too.

## About

The goal of this project was to build a REST API for a theoretical school. A user can sign up and then use CRUD functionality to
create classes, see which classes are available, update the courses only they posted, and delete course only they posted. Sequelize and Express were used to build a database and server.

## Skills

* User Authentication
* Express error handling
* ORM relational modeling
* Hasing for password security
* Validation in ORM database
* Routing
* Controlling user privileges
