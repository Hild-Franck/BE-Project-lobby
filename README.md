# BE-Project-authentication

[![Build Status](https://travis-ci.org/Hild-Franck/BE-Project-authentication.svg?branch=master)](https://travis-ci.org/Hild-Franck/BE-Project-authentication) [![Maintainability](https://api.codeclimate.com/v1/badges/183b8c33f6340c164535/maintainability)](https://codeclimate.com/github/Hild-Franck/BE-Project-authentication/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/183b8c33f6340c164535/test_coverage)](https://codeclimate.com/github/Hild-Franck/BE-Project-authentication/test_coverage)

Authentication service for the BE-Project stack. It will receive user credentials to test it against the authentication database.

## Technologies

- **[Moleculer](https://github.com/moleculerjs/moleculer)**
- **[NATS](https://nats.io)**

## Description

### Services

- Auth

### Actions

#### login

- **Params:**

    ```js
    { username: String, password: String }
    ```

- **Return:**

    ```js
    { username: String, id: String, updatedAt: Date, createdAt: Date }
    ```

#### register

- **Params:**

    ```js
    { username: String, password: String }
    ```

- **Return:**

    ```js
    { username: String, id: String, updatedAt: Date, createdAt: Date }
    ```

## Test

Run `npm test`

### Development

Run `npm run dev` to run tests with files watch

This is the bottom of the documentation ! Have a cookie: 🍪
