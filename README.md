# Api
Backend for the Project [MEVA](https://github.com/MEVA-ITP)

## Installation
Clone git repo.
Install npm packages
```
npm install
```
Configure:
[src/config/config.js](src/config/config.js)
Copy `passwordsExample.js` to `passwords.js` and set passwords.

## Usage
#### Running dev server  
Watches files in `src/` and automatically compiles und reruns on file
change
```
npm run dev
```
#### Running server  
Compiles src and runs
```
npm start
```

#### Creating a user
Make sure src is compiles
```
npm run compile
```
Add user
```
node build/admin/createUser.js
```
For help:
```
node build/admin/createUser.js -h
```

Backend core technologies:
* [Express](https://expressjs.com/)
* [Falcor](https://netflix.github.io/falcor/)
* [ldapjs](http://ldapjs.org/)