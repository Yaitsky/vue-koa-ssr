# vue-koa-demo

A fullstack SSR boilerplate with Vue2 & Vueify.js & Koa2

## Install

`git clone https://github.com/Molunerfinn/vue-koa-demo.git`

`npm install` or `yarn`


After that, create a `.env` file and set envs:

```env
PORT=8889 # Koa is listening to this port
```

If you want to run the test for the Project, please create a `.env.test` file to face this situation:

```env
PORT=8888 # The port which is listened by koa in the test environment 
```

### Node.js

Beacuse of using Koa2, `Node.js >= v7.6.0` is needed.

#### Development: 

`npm run server`

open browser: `localhost:8889`

> tips: login password is 123

#### Production:

`npm run build` and then `npm run start`

open browser: `localhost:8889`

> tips: login password is 123

#### Test:

`npm run test` and find the coverage report in the `coverage/lcov/index.html`
