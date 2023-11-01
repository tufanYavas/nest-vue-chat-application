## Description

A chat website example\
Written using Nestjs, Vue 3, socket.io and peerjs

## Installation

To get the project running in your local development environment:

Rename the ```.env.development.example``` file to ```.env.development``` and fill in your own settings.\
Similarly, in the client folder, rename the ```.env.example``` file to ```client/.env``` and make the necessary adjustments.

```bash
$ npm i
$ npm run seed
$ cd ./client
$ npm i
$ npm run build
```

If you get sqlite3 not found error
```
npm i sqlite3@5.0.2
````

## Running the app (dev mode)

```bash
$ npm run start:dev
```


```
$ cd ./client
$ npm run serve
```