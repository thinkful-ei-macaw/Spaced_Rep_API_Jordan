# Spaced repetition API!
Server application for the [space repetition capstone](https://github.com/thinkful-ei-macaw/Spaced_Rep_MJ) by Jordan Knox

## General info 
This project is the server application for the spaced repetition capstone. It consists for a database, a test database, three tables, three routers, and endpoints.

## Technologies 

Project is created with: 

* Express
* PSQL 
* Knex
* Authentication e.g. BcryptJS
* Middleware e.g. Morgan
* Javascript
* NodeJS

Project is tested with: 

* Postgrator–cli@3.2.0
* Mocha
* Chai
* Supertest
* Nodemon

## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin spaced-repetition
createdb -U dunder-mifflin spaced-repetition-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DB_NAME=spaced-repetition-test npm run migrate
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`

## Endpoints 

# POST /api/auth/token

handles the authentication, making sure both username and password match for existing registered accounts

JSON Object requires: 

* username: string
* password: string

```
Response: **200 OK**
```

```
{

"authToken": eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJuYW1lIjoiSmlmdW56ZSBBZG1pbiIsImlhdCI6MTU5MDA3NjQ0MiwiZXhwIjoxNTkwMDg3MjQyLCJzdWIiOiJhZG1pbiJ9.rwoEogsEQYkPDwOrMQTmLG9QDlZleQt7wKNB563A8K8"

}
```

# PUT /api/auth/token

handles the refresh of the user's auth token

JSON Object requires:

* valid JSON Web Token

```
{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJuYW1lIjoiSmlmdW56ZSBBZG1pbiIsImlhdCI6MTU5MDA3NzE5NywiZXhwIjoxNTkwMDg3OTk3LCJzdWIiOiJhZG1pbiJ9.KISz0KYn6DdgPL-S5zVIG_4YD90c6dFl8yGSR81tljI"
}
```

# GET /api/language

gets all of the languages and words

```
**Response: 200 OK**

```

```
{
    "language": {
        "id": 1,
        "name": "Spanish",
        "user_id": 1,
        "head": 1,
        "total_score": 0
    },
    "words": [
        {
            "id": 1,
            "language_id": 1,
            "original": "Perro",
            "translation": "Dog",
            "next": 2,
            "memory_value": 1,
            "correct_count": 0,
            "incorrect_count": 0
        },
     ]
}

```

# GET /api/language/head

gets the current word

```
**Response: 200 OK
**
```

```
{
    "nextWord": "Gato",
    "totalScore": 0,
    "wordCorrectCount": 0,
    "wordIncorrectCount": 0
}
```

# POST /api/language/guess

handles whether the user guessed the current word correctly, then updates the score in the database

JSON Object requires:

* guess: string

```
**Response: 200 OK
**
```

```
{
    "answer": "Computer",
    "isCorrect": false,
    "nextWord": "jambo",
    "totalScore": 0,
    "wordCorrectCount": 0,
    "wordIncorrectCount": 0
}
```

# POST /api/user

handles the registration, making sure that the user's username is not already taken when registering

JSON Object requires:

* name: string
* username: `string must not already exist in database`
* password: `string 7 letters minimum, one uppercase, one number, and one special character`

```
**Response: 201 Created**
```
```

{
    "id": 2,
    "name": "geon",
    "username": "admin1"
}
```