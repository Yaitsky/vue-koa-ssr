title: Full stack development Real combat: Develop complete front-end and back-end projects with Vue2 + Koa1 (Update Koa2)
tags: 
  - front end
  - Nodejs
categories:
  - Web
  - Development
  - Nodejs
date: 2017-05-03 14:09:00
---

## Introduction

Starting from a novice point of view (acquainted with Vue by default, with Koa or Express), starting with 0, build a complete front-end project where the data is available via the Koa API and the page is rendered via Vue. Learn some of the knowledge of Vue to build a single page and the use of front-end routing, how Koa provides the API interface, how to perform access filtering (routing), authentication (JSON-WEB-TOKEN) and Sequelize MySQL database operation some knowledge and skills Can be used as an entry-level development of the article stack it.

** UPDATING **: The github repository given at the end of the article has been updated with the Koa2 version. Please use Node.js v7.6.0 and above to experience ~

<!-- more -->

## Write in front

I wrote an article (https://molunerfinn.com/nodejs-2/), which was developed using both express and mongodb front and back ends of Nodejs. In this article, I simply created a demo that allows You read and write mongodb database, and read out the data from the database displayed on the page. Be regarded as a simple read and write demo, it can be considered a server-side rendering of the first attempt. And I also wrote [article] (https://molunerfinn.com/nodejs-1/) that wrote a simple little spider with nodejs, using a crawler to get the data written to the database. Through the above method I use express to write a small website, record and display the Beijing University of Posts and forums every day the top ten [content] (http://topten.piegg.cn). Very fun right, you can use the code to achieve what you want to do.

Later I came into contact with Koa and began to learn. Moving from Express to Koa is actually a smoother curve. However, the way with Koa also use the server-side rendering of the page. And I found that there are few applications on the web that have been written before and after the Koa build for both front-end and back-end applications. One of my recent projects that I need to do is to build the page with Vue. The data gets back to the backend API Form, that is, the so-called front and rear separation. Just go in this process a lot of pit, including the use of the database can be considered a novice, so write articles to record, with the same ideas and methods to build a simple Todolist, welcome to discuss, tap ~

## Project architecture

```
.
├── LICENSE
├── README.md
├── .env  // Environment Variables Profile
├── app.js  // Koa entry file
├── build // vue-cli Generated for webpack monitoring, build
│   ├── build.js
│   ├── check-versions.js
│   ├── dev-client.js
│   ├── dev-server.js
│   ├── utils.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── config // vue-cli Generate & add some of their own profile
│   ├── default.conf
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
├── dist // Vue build After the folder
│   ├── index.html // Entrance documents
│   └── static // Static resources
├── index.html // vue-cli Generated to host the main HTML file for the Vue component. One page application only one html
├── package.json //npm dependencies, project information files
├── server // Koa backend for providing APIs
│   ├── config // Configuration folder
│   ├── controllers // controller-controller
│   ├── models // model-model
│   ├── routes // route-route
│   └── schema // schema - database table structure
├── src // vue-cli Generate & add utils utility class
│   ├── App.vue // Main document
│   ├── assets // Related static resource storage
│   ├── components // Single file components
│   ├── main.js //The introduction of Vue and other resources, mount Vue entrance js
│   └── utils // Tool Folder - Encapsulation of reusable methods, features
└── yarn.lock // Automatically generated lock file with yarn
```

Looks like a very complex look, in fact, a large part of the folder structure is `vue-cli` this tool to help us generate. And what we need to add is mainly Koa's import file and a `server` folder for Koa's API. In this case, Koa can take the API to provide data, and Vue only needs to be concerned about how to render the data to the page.

## Some of the key dependencies the project uses

The following dependencies are versions of this article, or older

- Vue.js(v2.1.8)
- Vue-Router(v2.1.1)
- Axios(v0.15.3)
- Element(v1.1.2)
- Koa.js(v1.2.4)
- Koa-Router@5.4\Koa-jwt\Koa-static  // A series of Koa middleware
- Mysql(v2.12.0) // nodejs mysql driver, mysql version is not (project using mysql5.6)
- Sequelize(v3.28.0) // ORM to operate the database
- Yarn(v0.18.1) // Faster than npm

Remaining dependencies can refer to the project demo repository given at the end of this article.

## Project begining

Nodejs and npm installation is no longer described (hope you install the node version greater than or equal to 6.x, or else you need to add --harmony logo can be opened es6), the default reader has mastered npm installation dependencies. First global installation `npm i vue-cli-g`, of course, this project is basically used` yarn`, so it can also `yarn global add vue-cli`.

> Tips: You can change yarn to Taobao source, faster: `yarn config set registry 'https://registry.npm.taobao.org` `

Then we initialize a `Vue2 webpack` template:

`vue init webpack demo`

> Tips: The above demo can fill in your own project name

Then after making a few basic configuration selections, you get a basic project structure generated by `vue-cli`.

Then we go into the `vue-cli` build directory and install the` Vue` project. Dependencies and the `Koa` project dependencies are` yarn && yarn add koa koa-router@5.4 koa-logger koa-json koa-bodyparser`, (Note that version 5.4 of `koa-router` is installed as version 7.X supports Koa2) and then make some basic directory creation:

In the `demo` directory generated by` vue-cli`, create the `server` folder and subfolders:

```
├── server // Koa backend for providing APIs
    ├── config // Configuration folder
    ├── controllers // controller-controller
    ├── models // model
    ├── routes // route
    └── schema // schema
```

Then in the `demo` folder we create a` app.js` file as a `Koa` startup file.

Koa` can be started by writing the following basic contents:

```javascript
const app = require('koa')()
  , koa = require('koa-router')()
  , json = require('koa-json')
  , logger = require('koa-logger'); // Introduce various dependencies

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function* (next){
  let start = new Date;
  yield next;
  let ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms); // Shows the execution time
});

app.on('error', function(err, ctx){
  console.log('server error', err);
});

app.listen(8889,() => {
  console.log('Koa is listening in 8889');
});

module.exports = app;
```

Then type `node app.js` on the console and see the output` Koa is listening in 8889`, then our `Koa` has been started successfully and is listening on port 8889.

## front page build

This DEMO is a Todo-List, let's first make a login page.

Tips: In order to facilitate the construction of the page and beautiful, this article uses Vue2 front UI framework is the element-ui. Install: `yarn add element-ui`

Template engine I used to use `pug` CSS pretreatment I used to use` stylus`, of course, everyone's own habits and preferences are not the same, so everyone according to their usual preferences on the line.

In order to facilitate everyone to see the code, you do not have `pug`, and learning costs are relatively high. But CSS stylus write simple, it does not seem difficult to understand, is my own custom, so also need to install `yarn add stylus stylus-loader`.

> Tips: Install stylus-loader is to enable webpack to render stylus

Then we need to introduce `element-ui` into the project. Open `src / main.js`, rewrite the file as follows:

```js
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui' // Introducing element-ui
import 'element-ui/lib/theme-default/index.css'

Vue.use(ElementUI) // Vue global use

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
```
Then we type `npm run dev` in the root directory of the project to start the development mode, which has a webpack hot load, which means that as soon as you finish writing the code, the browser can respond immediately to changes.

In order to implement a responsive page, we need to add the following `meta` to the` index` tag in the project directory:

`<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">`


### login interface

Enter the `src / components` directory and create a new` Login.vue` file. Then we write the first page:

```html

<template>
  <el-row class="content">
    <el-col :xs="24" :sm="{span: 6,offset: 9}">
      <span class="title">
       Login please 
      </span>
      <el-row>
        <el-input 
          v-model="account" 
          placeholder="账号"
          type="text">
        </el-input>
        <el-input 
          v-model="password" 
          placeholder="密码"
          type="password">
        </el-input>
        <el-button type="primary">log in</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      account: '',
      password: ''
    };
  }
};
</script>

<style lang="stylus" scoped>
  .el-row.content
    padding 16px
  .title
    font-size 28px
  .el-input
    margin 12px 0
  .el-button
    width 100%
    margin-top 12px    
</style>

```

There are some notable places here. The first is that the direct child elements in the `template` tag can only be mounted at most. That is you can not write:

```html

<template>
  <el-row></el-row>
  <el-row></el-row>
</template>

```

Otherwise it will complain: `template syntax error Component template should contain exactly one root element` template can only have one root element. But to write multiple elements, you can do something like this:

```html

<template>
  <div>
    <el-row></el-row>
    <el-row></el-row>
  </div>
</template>

```

Also note that there is a `scoped` attribute in the` style` tag in `` Login.vue``, which enables these styles to work only within this component (because Webpack automatically renders the elements in this component when rendered) Put a string of attributes such as `data-v-62a7f97e`, and those styles will also look like` .title [data-v-62a7f97e] {font-size: 28px;} ` Conflicts with other components.

After the page is finished, the page will not be displayed without registering the component under Vue. So this time need to rewrite the file APP.vue:

```html
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <Login></Login> <!--Login component-->
  </div>
</template>

<script>
import Login from './components/Login' // Import Login component

export default {
  name: 'app',
  components: {
    Login // Register components
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

```

That is, the registration of the `Login` component under` Vue`, and at the same time you look at the browser is no longer the `Hello` welcome screen generated by` vue-cli` by default.

![Login](https://img.piegg.cn/vue-koa-demo/login.png "Login")

Then we write the login after the success of the interface.

### TodoList page

Still in `src / components` directory, write a file called` TodoList.vue`.

Then we start to write a TodoList:

```html
<template>
  <el-row class="content">
    <el-col :xs="{span:20,offset:2}" :sm="{span:8,offset:8}">
      <span>
        Welcome: {{name}}! Your to-do is:
      </span>
      <el-input placeholder="Please enter to do list" v-model="todos" @keyup.enter.native="addTodos"></el-input>
      <el-tabs v-model="activeName">
        <el-tab-pane label="To do" name="first">
          <el-col :xs="24">
            <template v-if="!Done"> <!-- v-if and v-for can not be used within an element at the same time because Vue always executes v-for-->
              <template v-for="(item, index) in list">
                <div class="todo-list" v-if="item.status == false">
                  <span class="item">
                    {{ index + 1 }}. {{ item.content }}
                  </span>
                  <span class="pull-right">
                    <el-button size="small" type="primary" @click="finished(index)">carry out</el-button>
                    <el-button size="small" :plain="true" type="danger" @click="remove(index)">delete</el-button>
                  </span>
                </div>
              </template> 
            </template>
            <div v-else-if="Done">
              No to-do list
            </div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="Completed" name="second">
          <template v-if="count > 0">
            <template v-for="(item, index) in list">
              <div class="todo-list" v-if="item.status == true">
                <span class="item finished">
                  {{ index + 1 }}. {{ item.content }}
                </span>
                <span class="pull-right">
                  <el-button size="small" type="primary" @click="restore(index)">reduction</el-button>
                </span>
              </div>
            </template> 
          </template>
          <div v-else>
            No completed items yet
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      name: 'Molunerfinn',
      todos: '',
      activeName: 'first',
      list:[],
      count: 0
    };
  },
  computed: { // Calculated properties are used to calculate whether all tasks have been completed
    Done(){
      let count = 0;
      let length = this.list.length;
      for(let i in this.list){
        this.list[i].status == true ? count += 1 : '';
      }
      this.count = count;
      if(count == length || length == 0){
        return true
      }else{
        return false
      }
    }
  },

  methods: {
    addTodos() {
      if(this.todos == '')
        return
      let obj = {
        status: false,
        content: this.todos
      }
      this.list.push(obj);
      this.todos = '';
    },
    finished(index) {
      this.$set(this.list[index],'status',true) // Vested by the set method allows the array to detect changes
      this.$message({
        type: 'success',
        message: 'mission completed'
      })
    },
    remove(index) {
      this.list.splice(index,1);
      this.$message({
        type: 'info',
        message: 'Task to delete'
      })
    },
    restore(index) {
      this.$set(this.list[index],'status',false)
      this.$message({
        type: 'info',
        message: 'Task to restore'
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
  .el-input
    margin 20px auto
  .todo-list
    width 100%
    margin-top 8px
    padding-bottom 8px
    border-bottom 1px solid #eee
    overflow hidden
    text-align left
    .item
      font-size 20px
      &.finished
        text-decoration line-through
        color #ddd
  .pull-right
    float right
</style>
```

In fact, there is nothing particularly good page construction, but because I have to check out the pit, it is still a special talk about:

1. `v-if` and` v-for` are used together in one element, because Vue always executes `v-for`, so` v-if` will not be executed. Instead, you can use the extra `template` element to put` v-if` or `v-for` for the same purpose. This is relevant [issue] (https://github.com/vuejs/vue/issues/3106).

2. Calculate the property For direct data such as `a: 2` ->` a: 3` such a data change can be directly detected. But if this property of `status` in one of the` list` s in this example is changed, Vue will not be able to detect any changes in the data if we directly use the wording of `list [index] .status = true`. Instead, you can use the `set` method (globally` Vue.set () `and in your case` this. $ Set () `), which makes it possible to detect changes in the data using the` set` method. This allows computing properties to capture changes. You can refer to the official documentation for the [description] of the reactive principle (https://cn.vuejs.org/v2/guide/reactivity.html).

! [Todolist] (https://img.piegg.cn/vue-koa-demo/todolist.gif "Todolist")

After `TodoList`, we need to tie it up with` vue-router` to make this one-page application available for page jumps.

### page routing

Because the server-side rendering is not used, the page routing is the front-end routing. Install `vue-router`:` yarn add vue-router`.

After installation, we mount the route. Open the main.js file to rewrite the following:

```js
// src/main.js

import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'

Vue.use(ElementUI);
Vue.use(VueRouter);

import Login from `./components/Login`
import TodoList from `./components/TodoList`

const router =  new VueRouter({
  mode: 'history', // Open HTML5 history mode, you can make the address bar url looks like the normal page jump url. (But also need back-end cooperation, when talking about Koa will say)
  base: __dirname, 
  routes: [
    {
      path: '/',  // The default home page open is the login page
      component: Login
    },
    {
      path: '/todolist',
      component: TodoList
    },
    {
      path: '*',
      redirect: '/' // Enter the other address does not exist automatically jump back to the home page
    }
  ]
})

const app = new Vue({
  router: router, // Enable router
  render: h => h(App) 
}).$mount('#app') // Mount to the id of the app element

```

This put the routing is good, but if you open the page to find what seems to be no change. This is because we did not put the route view on the page. Now we rewrite `APP.vue`:

```html
<!-- APP.vue -->

<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view></router-view> <!-- The original Login replaced router-view This is the target view of the route view rendering -->
  </div>
</template>

<script>
export default {
  name: 'app' // You do not need to import the `Login` \` TodoList` component, because it's already registered in the route
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

```

And then look at your page, this time if you add `/ todolist` in the address bar then it will jump to the` TodoList` page.

But how do we jump to `TodoList` by clicking the login button? Rewrite the `Login.vue`, you can jump.

Just need to sign in the `button` plus one method:

```html
<!-- Login.vue -->
······

<!-- to increase input keyboard events, when you enter the password carriage return also perform loginToDo method -->
<el-input 
  v-model="password" 
  placeholder="密码"
  type="password"
  @keyup.enter.native="loginToDo">
</el-input>
<!-- add a click method loginToDo -->
<el-button type="primary" @click="loginToDo">log in</el-button>

······

<script>
export default {
  data () {
    return {
      account: '',
      password: ''
    };
  },
  methods: {
    loginToDo() {
      this.$router.push('/todolist') // Programmed routing, through the push method, change the routing.
    }
  }
};
</script>

```

Then you can jump through the page by clicking the `Login` button. And you can see that the page address has changed from `localhost: 8080` to` localhost: 8080 / todolist`, which looks like the normal url jump. (But in fact we are single-page applications, just page jump within the application, there is no additional request to the back end)

! [login2todolist] (https://img.piegg.cn/vue-koa-demo/login2todolist.gif "login2todolist")

So far, we have completed a single front-end single-page application that enables page jumps, simple ToDoList additions and deletions and restores. Of course, this thing can only be regarded as something that can not be used - because the login system is a real name, ToDoList as long as the page refresh about gone.

So we can put the front first put. Open our back-end tour.

## back-end environment to build

### MySQL

The reason why I did not use `Mongodb`, which is generally popular in Node community, was mainly because I had used it before and did not use` MySQL`. I decided to use `MySQL` in a learning attitude. There is actually a `Express + Mongodb` tutorial in fact a long time ago is full of the streets. So if you think `Mongodb` is more appetizing, you can build a similar application using` Mongodb` after reading this article.

To `MySQL` [official website] (http://dev.mysql.com/downloads/) to download and install the corresponding platform` MySQL` `Community Server`.

Generally speaking, the installation steps are relatively simple. For the basic MySQL installation, you can refer to this [article] (http://www.rathishkumar.in/2016/01/how-to-install-mysql-server-on-windows.html) for this step, which Articles are windows Of course, the installation of other platforms is also very convenient, there is a corresponding package management tools can be obtained. It is noteworthy that, after installing `MySQL` you need to set the` root` account password. Ensure safety. If you missed the settings, or you do not know how to set, you can refer to this [article] (https://www.howtoforge.com/setting-changing-resetting-mysql-root-passwords)

Because I'm not familiar with MySQL's SQL statements, I needed a visual tool to manipulate MySQL. I use [HediSQL] on Windows (http://www.heidisql.com/), and on the macOS I use [Sequel Pro] (https://www.sequelpro.com/). They are free.

Then we can use these visual tools to connect to MySQL's server (the default is 3306) and create a new database called `todolist`. (Of course, you can also use the SQL statement: `CREATE DATABASE todolist`, will not repeat them later).

Then we can start to create the datasheet.

We need to create two tables, one for the user table and one for the to-do list. User tables are used to log in, verify, and to-do lists are used to showcase our to-do list.

Create a `user` table, where` password` will be `bcrypt` encrypted (taking 128 bits) later.

| Field | Type | Description |
| --- | --- | --- |
| id | int (self-increment) | id of the user
| user_name | CHAR (50) | The user's name |
| password | CHAR (128) | user's password |

Create a `list` table, the required fields are` id`, `user_id`,` content`, `status`.

| Field | Type | Description |
| --- | --- | --- |
| id | int (self-increment) | list id |
| user_id | int (11) | user id |
| content | CHAR (255) | Contents of list |
| status | tinyint (1) | Status of list |

The basic part of dealing directly with the database is like this.

### Sequelize

When dealing with the database we all need a good tool to operate the database, allowing us to use a relatively simple method to add or delete the database to check. [Mongoose`] (http://mongoosejs.com/) is familiar to `Mongodb` and I used a relatively simpler [Monk`] (https://github.com/Automattic / monk). For MySQL, I chose [`Sequelize`] (https://github.com/sequelize/sequelize) and it supports multiple relational databases (` Sqlite`, `MySQL`,` Postgres`, etc.) Its operation basically returns a `Promise` object so that we can easily 'synchronize' it in Koa.

> For more on the use of Sequelize, you can refer to [official documentation] (http://docs.sequelizejs.com/en/latest/), and these two articles - [Sequelize Chinese API documentation] (http: // itbilu .com / nodejs / npm / VkYIaRPz-.html), [Sequelize and MySQL Controls] (https://segmentfault.com/a/1190000003987871)

Before connecting to the database using `Sequelize` we need to export the table structure of the database using` sequelize-auto`.

> More about the use of `sequelize-auto` can refer to [official introduction] (https://github.com/sequelize/sequelize-auto) or [this article] (http://itbilu.com/nodejs/npm /41mRdls_Z.html)

So we need to install these several dependencies: `yarn global add sequelize-auto && yarn add sequelize mysql`.

> Note: The mysql installed above the yarn is the mysql driver nodejs environment.

Enter `server` directory, execute the following statement` sequelize-auto -o './schema "-d todolist-h 127.0.0.1-u root-p 3306-x XXXXX-e mysql`, (The-o parameter Is the output folder directory, -d parameter is followed by the database name, -h parameter is followed by the database address, -u parameter is followed by the database user name, -p parameter followed by the port number, -x parameter followed by the database password, this According to their own database password! -e parameter behind the specified database mysql)

Then it will automatically generate two files in the schema folder:

```js
// user.js

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11), // Field Type
      allowNull: false, // Whether to allow NULL
      primaryKey: true, // The main key
      autoIncrement: true // Whether self-increase
    },
    user_name: {
      type: DataTypes.CHAR(50), // The maximum length of 50 string
      allowNull: false
    },
    password: {
      type: DataTypes.CHAR(32),
      allowNull: false
    }
  }, {
    tableName: 'user' // Table Name
  });
};
```

```js
// list.js

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('list', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    content: {
      type: DataTypes.CHAR(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    }
  }, {
    tableName: 'list'
  });
};

```

Automation tools save us a lot of time manually defining the table structure. Also noticed that the generated database table structure files automatically come out for our `module.exports`, so it is convenient for us to introduce later.

In `server` directory` config` directory, we create a new `db.js`, used to initialize` Sequelize` and the database connection.

```js
// db.js

const Sequelize = require('sequelize'); // Introduced sequelize

// Use url connection to connect, pay attention to the root: behind XXXX into their own database password
const Todolist = new Sequelize('mysql://root:XXXX@localhost/todolist',{
  define: {
    timestamps: false // Cancel Sequelzie automatically adds a timestamp to the data table (createdAt and updatedAt)
  }
}) 

module.exports = {
  Todolist // Exposing the Todolist to the interface makes the Model call easy
}
```

Then we go to the `models` folder to connect the database and table structure files. Create a new `user.js' file in this folder. Let's write a query for user id.

To this end we can first add a random data in the database:

! [test] (https://img.piegg.cn/vue-koa-demo/database-1.png "test")

Usually we want to query for a user id 1 data, will naturally think of the wording similar to the following:

```js

const userInfo = User.findOne({ where: { id: 1} }); // Inquire
console.log(userInfo); // Output the result

```

But the above wording actually does not work. Because of the characteristics of JS its IO operation is asynchronous. The above wording, `userInfo` will be a` Promise` returned, not the final `userInfo`. If you want to use synchronous method to get asynchronous IO operation of the data, usually can not be obtained directly. But in Koa it's all very easy due to the existence of [`co`] (https://github.com/tj/co). Rewritten as follows:

```js
// models/user.js
const db = require('../config/db.js'), 
      userModel = '../schema/user.js'; // Introduced the user's table structure
const TodolistDb = db.Todolist; // Introduced into the database

const User = TodolistDb.import(userModel); // Import the table structure with the import method of sequelize, instantiated User.

const getUserById = function* (id){ // Note that function * instead of function This generator function is required for functions that require a yield operation.
  const userInfo = yield User.findOne({ // Use yield to control asynchronous operations and return the data in the returned Promise object. It also achieved the "synchronous" wording to obtain asynchronous IO operation data
    where: {
      id: id
    }
  });

  return userInfo // Return data
}

module.exports = {
  getUserById  // Export getUserById method will be called in the controller
}
```

Then we write a user controller in `controllers` to execute this method and return the result.

```js
// controllers/user.js 

const user = require('../models/user.js');

const getUserInfo = function* (){
  const id = this.params.id; // Get the url passed in the parameters in the id
  const result = yield user.getUserById(id);  // Returns the query result "synchronously" by yield
  this.body = result // The result of the request will be returned to the body of the response
}

module.exports = {
  getUserInfo // The method of obtaining user information is exposed 
}
```

This can not be done directly requested, because we have not yet defined the route, the request can not find the path through Koa does not respond.

Write a `auth.js` file in the` routes` folder. (In fact, `user` table is used for login, so go` auth`)

```js
// routes/auth.js

const auth = require('../controllers/user.js'); 
const router = require('koa-router')();

router.get('/user/:id', auth.getUserInfo); // Define the url parameter is id, using the user's auth method into the router

module.exports = router; // The router rules are exposed
```

At this point we are close to completing our first API, and we are still short of the last step to "mount" the routing rules to Koa.

Back to the root directory of `app.js`, rewritten as follows:

```js
const app = require('koa')()
  , koa = require('koa-router')()
  , json = require('koa-json')
  , logger = require('koa-logger')
  , auth = require('./server/routes/auth.js'); // Introduced auth

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function* (next){
  let start = new Date;
  yield next;
  let ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.on('error', function(err, ctx){
  console.log('server error', err);
});

koa.use('/auth', auth.routes()); // Mount to koa-router, at the same time will make all auth request path in front of the request path '/ auth'.

app.use(koa.routes()); // Mount routing rules to Koa.

app.listen(8889,() => {
  console.log('Koa is listening in 8889');
});

module.exports = app;
```

Open your console, enter `node app.js`, everything works fine without error, and you're done, our first API has been built!

How to test it?

### API Test

Interface before docking with the front, we should first test again to prevent problems. I recommend [`Postman`] (https://www.getpostman.com/) on the tools for testing the interface. This tool is very good at simulating various requests sent, making it easy to see the results of a response and use it for testing Is the best though.

! [Postman] (https://img.piegg.cn/vue-koa-demo/postman-1.png)

The test is successful, I sent the correct url request, the result returned is what I want to see. We see that the returned result is actually a JSON, which is a very handy data format for both our front-end and back-end.

But if we have a problem with the code and return error, how can we test? If the console can feed back some information, it's definitely not enough, and we probably will not know which step went wrong leading to a problem with the end result.

So I recommend using the [VSCode] (https://code.visualstudio.com/) tool to help us debug code behind nodejs. It can add breakpoints, can easily view the requested information. And with the tools like [`nodemon`] (https://github.com/remy/nodemon), debugging should not be more comfortable.

Nodejs debugging on VSCode, you can refer to this official [article] (https://code.visualstudio.com/docs/editor/node-debugging)

> I myself use Sublime write code, debugging with VSCode, ha ha.

### login system implementation

Just realized is just a simple user information query interface, but we want to achieve is a login system, so still need to do some work.

#### JSON-WEB-TOKEN

Cookie or session based login verification has been common, some time ago `JSON-WEB-TOKEN` came out a very good scenery. It was introduced to enable truly stateless requests instead of stored stateful validation based on sessions and cookies.

The JSON-WEB-TOKEN description can refer to this [article] (http://blog.leapoahead.com/2015/09/07/user-authentication-with-jwt/?utm_source=tuicool&utm_medium=referral) is relatively simple, I also recommend a [article] (https://segmentfault.com/a/1190000005783306), how to use JSON-WEB-TOKEN clearly written.

In addition you can JSON-WEB-TOKEN's [official website] (https://jwt.io/) feel.

> Tips: JSON-WEB-TOKEN is divided into three parts, the header information + principal information + key information, which the body of the information (we store the information we need) is BASE64 encoding, it is easy to decode , Must not be able to store the plain text password this key information! Instead, it is possible to store information that is not particularly critical, such as user name, which can be distinguished.

In simple terms, the login system using JSON-WEB-TOKEN should look like this:

1. The user enters the account password on the login page, sends the request to the backend with the account password (md5 encrypted)
2. Back-end verify the user's account and password information, if the match, it issued a TOKEN returned to the client. If not, do not send TOKEN back, return verification error message.
3. If the login is successful, the client saves the TOKEN in some way (SessionStorage, LocalStorage), and then takes the TOKEN in the request header to request other resources.
4 back-end received request information, first verify TOKEN is valid, the resource is valid, the validation returns invalid error.

Through this TOKEN way, the access between the client and the server is `stateless`: that is, the server does not know that you are still offline, as long as TOKEN in the header of the request you send is correct I'll give you the resources you want. This would not take up valuable space on the server side, and the `` stateless '' design would obviously have lower maintenance costs if servers were involved in server cluster maintenance or migration or CDN node assignments.

Without further ado, let's use `JSON-WEB-TOKEN` in our project.

`yarn add koa-jwt`, install` Koa` `JSON-WEB-TOKEN` library.

We need to add a method `user.js` in` models` to find the user by username:

```js
// models/user.js
// ......
// Omitted in front of


// Add a method to find by username
const getUserByName = function* (name){
  const userInfo = yield User.findOne({
    where: {
      user_name: name
    }
  })

  return userInfo
}

module.exports = {
  getUserById, // Export getUserById method will be called in the controller
  getUserByName
}

```

Then we write `user.js` in` controllers`:

```js
// controllers/user.js

const user = require('../models/user.js');
const jwt = require('koa-jwt'); // Introduced koa-jwt

const getUserInfo = function* (){
  const id = this.params.id; // Get the url passed in the parameters in the id
  const result = yield user.getUserById(id);  // Returns the query result "synchronously" by yield
  this.body = result // The result of the request will be returned to the body of the response
}

const postUserAuth = function* (){
  const data = this.request.body; // post data exists request.body
  const userInfo = yield user.getUserByName(data.name);

  if(userInfo != null){ // If no such user will return null
    if(userInfo.password != data.password){
      this.body = {
        success: false, // The success flag is for the convenience of the front-end to determine whether the return is correct or not
        info: '密码错误！'
      }
    }else{ // If the password is correct
      const userToken = {
        name: userInfo.user_name,
        id: userInfo.id
      }
      const secret = 'vue-koa-demo'; // Specify the key, which is used to determine token legitimacy later
      const token = jwt.sign(userToken,secret); // Issue token
      this.body = {
        success: true,
        token: token, // Return token
      }
    }
  }else{
    this.body = {
      success: false,
      info: '用户不存在！' // If the user does not exist the return user does not exist
    }
  }
}

module.exports = {
  getUserInfo,
  postUserAuth
}
```

Then the routing rules in the `routes` update:

```js
// routes/auth.js

const auth = require('../controllers/user.js'); 
const router = require('koa-router')();

router.get('/user/:id', auth.getUserInfo); // Define the url parameter is id, using the user's auth method into the router
router.post('/user', auth.postUserAuth);

module.exports = router; // The router rules are exposed
```

As a result, we have completed the user authentication section. Next we have to rewrite the front-end login method.

#### Introduced Axios

It used to be [`vue-resource`] (https://github.com/pagekit/vue-resource) when learning Vue, but after Vue2 came out, Vue did not recommend it by default The official ajax network request library. Instead, I recommend some other libraries, such as [`axios`] (https://github.com/mzabriskie/axios) that we are using today. I have not used it before, but after reading its star and a brief introduction of `` Promise based HTTP client for the browser and node.js` ', it supports both node and browser-based ajax request tools (based on Promised!), I think it is necessary to use it.

`yarn add axios`, install` axios`. Then we introduce `axios` in` src / main.js`:

```js

// scr/main.js

// ...

import Axios from 'axios'

Vue.prototype.$http = Axios // Similar to the calling method of vue-resource, you can use this. $ Http.get ()

// ...


```

```js
// Login.vue
// Omit the front part

 methods: {
    loginToDo() {
      let obj = {
        name: this.account,
        password: this.password
      } 
      this.$http.post('/auth/user', obj) // Send the information to the backend
        .then((res) => { // The data returned by axios res.data
          if(res.data.success){ // If successful
            sessionStorage.setItem('demo-token',res.data.token); // Save the token with sessionStorage
            this.$message({ // Login is successful, the prompt is displayed
              type: 'success',
              message: '登录成功！'
            }); 
            this.$router.push('/todolist') // Into todolist page, log in successfully
          }else{
            this.$message.error(res.data.info); // Login failed, the prompt is displayed
            sessionStorage.setItem('demo-token',null); // Clear the token
          }
        }, (err) => {
            this.$message.error('请求错误！')
            sessionStorage.setItem('demo-token',null); // Clear the token
        })
    }
  }
```



#### Password bcrypt encryption

The earliest time I was in the front with md5 encryption, but later reminded this way is not safe. md5 encrypted easily cracked. So I used `bcrypt` encryption method. All back-end encryption. Maybe you will ask such a clear text to the back-end password security? No problem, as long as you use HTTPS, this will not be a problem.

`yarn add bcryptjs` Install bcryptjs.

```js
// controllers/user.js

const user = require('../models/user.js');
const jwt = require('koa-jwt'); // Introduced koa-jwt
const bcrypt = require('bcryptjs');

const getUserInfo = function* (){
  const id = this.params.id; // Get the url passed in the parameters in the id
  const result = yield user.getUserById(id);  // Returns the query result "synchronously" by yield
  this.body = result // The result of the request will be returned to the body of the response
}

const postUserAuth = function* (){
  const data = this.request.body; // post data exists request.body
  const userInfo = yield user.getUserByName(data.name);

  if(userInfo != null){ // If no such user will return null
    if(!bcrypt.compareSync(data.password, userInfo.password)){ // Verify the password is correct
      this.body = {
        success: false, // The success flag is for the convenience of the front-end to determine whether the return is correct or not
        info: 'wrong password!'
      }
    }else{ // If the password is correct
      const userToken = {
        name: userInfo.user_name,
        id: userInfo.id
      }
      const secret = 'vue-koa-demo'; // Specify the key, which is used to determine token legitimacy later
      const token = jwt.sign(userToken,secret); // Issue token
      this.body = {
        success: true,
        token: token, // Return token
      }
    }
  }else{
    this.body = {
      success: false,
      info: 'User does not exist!' // If the user does not exist the return user does not exist
    }
  }
}

module.exports = {
  getUserInfo,
  postUserAuth
}
```

Because our database is still stored in plain text `123` as the password, it should first be bcrypt, encrypted into: $ 2a $ 10 $ x3f0Y2SNAmyAfqhKVAV.7uE7RHs3FDGuSYw.LlZhOFoyK7cjfZ.Q6`, replace it with the database ` 123`. We will not be able to login without this step.

We're not done yet, because our interface is running on `8080`, but the API provided by Koa runs on` 8889`, so it would not be possible to post it directly via the `/ auth / user` url. Even if written as `localhost: 8889 / auth / user`, the request will fail because of cross-domain issues.

This time there are two most convenient solution:

1. If it is cross-domain, the server as long as the request header with [`CORS`] (https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS), the client can cross Domain sends the request.
2. Into the same domain, you can solve the cross-domain request.

The first one is also handy and can be solved using [`kcors`] (https://github.com/koajs/cors).
However, in order to facilitate the deployment later, we use the second, into a domain request.

Open `config / index.js` in the root directory and find the` proxyTable` under `dev`. Using this` proxyTable` we can forward external requests to `local` through` webpack`, Into the domain request.

Rewrite the `proxyTable` as follows:

```js
 proxyTable: {
  '/auth':{
    target: 'http://localhost:8889',
    changeOrigin: true
  },
  '/api':{
    target: 'http://localhost:8889',
    changeOrigin: true
  }
}
```

The above meaning is that the address we requested in the component if `/ api / xxxx` actually requests` http: // localhost: 8889 / api / xxxx`, but because `webpack` helped us to proxy localhost 8889 port service, so we can call the actual cross-domain request as an interface under the same domain.

Now restart `webpack`:` ctrl + c` exit the current process, then `npm run dev`.

After everything is done, we can see the following exciting picture:

! [login2todolist] (https://img.piegg.cn/vue-koa-demo/login2todolist-2.gif "login2todolist")

#### jump block

Although we are now able to successfully log in the system, but there is still a problem: I manually in the address bar to address `localhost: 8080 / todolist` I still be able to successfully jump to the login interface ah. So this requires a jump block, when not logged in, regardless of the address bar to enter any address, eventually redirected back to the login page.

This time, the `token` returned from the backend to us is of great use. Having a token means that our identity is verified, otherwise it is illegal.

`vue-router` provides the hook for the page jump. We can validate the` router` before it jumps, and if `token` exists, it will return to the login page if it does not exist.

Reference Routing [Navigation Hook] (https://router.vuejs.org/en/advanced/navigation-guards.html)

Open `src / main.js` and change as follows:

```js
// src/main.js

// ...

const router = new VueRouter({....}) // abridgement

router.beforeEach((to,from,next) =>{
  const token = sessionStorage.getItem('demo-token');
  if(to.path == '/'){ // If it is to jump to the login page
    if(token != 'null' && token != null){
      next('/todolist') // If there is a token turn to todolist does not return to the login page
    }
    next(); // Otherwise jump back to the login page
  }else{
    if(token != 'null' && token != null){
      next() // If there is a token turn normal
    }else{
      next('/') // Otherwise jump back to the login page
    }
  }
})

const app = new Vue({...}) // abridgement

```

> ** Note: Be sure to call the `next ()` method, otherwise the hook will not be resolved. ** If you just call the `next (path)` method, it eventually returns to the `.beforeEach ()` hook, which can lead to an infinite loop if the condition is not written and the stack overflows.

Then we can see the following results:

! [login2todolist] (https://img.piegg.cn/vue-koa-demo/login2todolist-3.gif "login2todolist")

> Tips: This only to determine the token does not exist on the adoption of the verification is very unsafe, this case is just a demonstration, in fact, should be carried out a deeper level of judgments, such as from the token unpacked information contains The information we want can be used as a valid token before we can log in. and many more. This article is just a brief introduction.

#### resolve token

Notice that when we issued `token`, we wrote something like this:

```js

// server/controllers/user.js

// ...

const userToken = {
  name: userInfo.user_name,
  id: userInfo.id
}
const secret = 'vue-koa-demo'; // Specify the key, which is used to determine token legitimacy later
const token = jwt.sign(userToken,secret); // Issue token

// ...
```

We package the username and id into the body of the JWT and the key we decrypt is `vue-koa-demo`. So we can use this information to log in after the user name display, and used to distinguish who this user is, this user what `Todolist`.

Next in the `Todolist` page for token analysis, so that the user name is displayed as the login user name.

**Note:** Front-end direct exposure of `secret-key` is not actually safe. The correct way to do this is to pass the token along with the username and other less important information, token only for validation, and other information returned as return value. This will not expose `secret-key`. Of course, this article is only for convenience of illustration, given an example of inappropriate access to user information.

```js

// src/components/TodoList.vue

// ...

import jwt from 'jsonwebtoken' // We will download this dependency automatically when we install koa-jwt

export default {

  created(){ // Called when the component is created
    const userInfo = this.getUserInfo(); // A new way to get user information
    if(userInfo != null){
      this.id = userInfo.id;
      this.name = userInfo.name;
    }else{
      this.id = '';
      this.name = ''
    }
  },

  data () {
    return {
      name: '', // User name changed to empty
      todos: '',
      activeName: 'first',
      list:[],
      count: 0,
      id: '' // Add user id attribute, used to distinguish users
    };
  },
  computed: {...}, //abridgement

  methods: {
    addTodos() {...}, // abridgement
    finished(index) {...},
    remove(index) {...},
    restore(index) {...},
    getUserInfo(){ // Get user information
      const token = sessionStorage.getItem('demo-token');
      if(token != null && token != 'null'){
        let decode = jwt.verify(token,'vue-koa-demo'); // Parse token
        return decode // decode resolve it is actually {name: XXX, id: XXX}
      }else {
        return null
      }
    }
  }
};

// ...
```

So you can see:

! [todolist] (https://img.piegg.cn/vue-koa-demo/todolist-1.png "todolist")

The user name is not the default `Molunerfinn` but the login name` molunerfinn`.

# Todolist additions and deletions to change the realization of the investigation

This part is before and after the end of the collaboration. We want to achieve the pure front-end part of the content. I use the most basic two methods for example: Get `Todolist` and add` Todolist`, the rest of the ideas are more or less the same, I provide code and comments, I believe it is easy to understand.

### Send Token

Said before, with JSON-WEB-TOKEN, the verification of this system depends entirely on the token. If the token is correctly delivered resources, if the resources are incorrect, it returns an error message.

Because we used `koa-jwt`, we just need to add the` Authorization` attribute to the Bearer {token value} `header, and then let` Koa` verify the token before receiving the request . However, if you make a manual write a request for each request, too tired. So we can do global Header setting.

Open `src / main.js`, add this sentence in the route jump hook:

```js

// scr/main.json

router.beforeEach((to,from,next) =>{
  const token = sessionStorage.getItem('demo-token');
  if(to.path == '/'){ 
    if(token != 'null' && token != null){
      next('/todolist') 
    }
    next(); 
  }else{
    if(token != 'null' && token != null){
      Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token; // Set the header of the global token authentication, note that there is a space Bearer
      next() 
    }else{
      next('/') 
    }
  }
})

```

This completes the token client send settings.

### Koa end Token authentication

Then we implement two simple api, the two api request path is not `/ auth / xxx` but `/ api / xxx`. We also need to implement that the request to access the / api / * `path needs to be` koa-jwt` validated, whereas the request for `/ auth / *` is not required.

First go to the `models` directory to create a new` todolist.js` file:

```js

// server/models/todolist.js

const db = require('../config/db.js'), 
      todoModel = '../schema/list.js'; // Introduced todolist table structure
const TodolistDb = db.Todolist; // Introduced into the database

const Todolist = TodolistDb.import(todoModel); 

const getTodolistById = function* (id){  // Get all the todolists for a user
  const todolist = yield Todolist.findAll({ // Find all todolist
    where: {
      user_id: id
    },
    attributes: ['id','content','status'] // Just return the results of these three fields can be
  });

  return todolist // Return data
}

const createTodolist = function* (data){ // Create a todolist for a user
  yield Todolist.create({
    user_id: data.id, // The id of the user, used to determine which user to create
    content: data.content,
    status: data.status 
  })
  return true
}

module.exports = {
  getTodolistById,
  createTodolist
}
```

Then go to `controllers` directory to create a new` todolist.js` file:

```js
// server/controllers/todolist

const todolist = require('../models/todolist.js');

const getTodolist = function* (){ // Get all todolists for a user
  const id = this.params.id; // Get the url passed in the parameters in the id
  const result = yield todolist.getTodolistById(id);  // Returns the query result "synchronously" by yield
  this.body = result // The result of the request will be returned to the body of the response
}

const createTodolist = function* (){ // Create a todolist for a user
  const data = this.request.body; // post request, the data is in request.body
  const result = yield todolist.createTodolist(data);

  this.body = {
    success: true
  }
}


module.exports = {
  getTodolist,
  createTodolist
}
```

Then go to `routes` folder to create a new` api.js` file:

```js

// server/routes/api.js

const todolist = require('../controllers/todolist.js');
const router = require('koa-router')();

todolist(router); // Introduced koa-router

module.exports = router; // Export the router rules

```

Finally, go to the root directory of `app.js` and add new routing rules to koa:

```js

// app.js

const app = require('koa')()
  , koa = require('koa-router')()
  , json = require('koa-json')
  , logger = require('koa-logger')
  , auth = require('./server/routes/auth.js')
  , api = require('./server/routes/api.js')
  , jwt = require('koa-jwt');

// ..... 省略

app.use(function* (next){
  let start = new Date;
  yield next;
  let ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(function *(next){  //  If JWT validation fails, validation failure information is returned
  try {
    yield next;
  } catch (err) {
    if (401 == err.status) {
      this.status = 401;
      this.body = {
        success: false,
        token: null,
        info: 'Protected resource, use Authorization header to get access'
      };
    } else {
      throw err;
    }
  }
});

app.on('error', function(err, ctx){
  console.log('server error', err);
});

koa.use('/auth', auth.routes()); // Mount to koa-router, at the same time will make all auth request path in front of the request path '/ auth'.
koa.use("/api",jwt({secret: 'vue-koa-demo'}),api.routes()) // All / api / header requests need to be validated by jwt middleware. The secret key must be the same as the one we originally issued

app.use(koa.routes()); // Mount routing rules to Koa.

// ...abridgement

```

At this point, the back end of the two APIs have been constructed.

The initial configuration is relatively complex, involving `model`,` controllers`, `routes` and` app.js`, can be prohibitive. In fact, the first build is completed, the follow-up to add api, basically only need to write in the `model` and` controllers` method, set the interface can be very convenient.

### Front-end docking interface

Back-end interface has been open, then the front-end and back-end docking. There are two main docking interface:

Get all todolists for a user
Create a todolist for a user

The next step is to rewrite the `Todolist.vue` method:

```js

// todolist.js

// ... abridgement

created(){
  const userInfo = this.getUserInfo();
  if(userInfo != null){
    this.id = userInfo.id;
    this.name = userInfo.name;
  }else{
    this.id = '';
    this.name = ''
  }
  this.getTodolist(); // New: Get todolist when the component is created
},

// ... abridgement

methods: {
  addTodos() {
    if(this.todos == '')
      return
    let obj = {
      status: false,
      content: this.todos,
      id: this.id
    }
    this.$http.post('/api/todolist', obj) // Add create request
      .then((res) => {
        if(res.status == 200){ // When the return status is 200 success
          this.$message({
            type: 'success',
            message: '创建成功！' 
          })
          this.getTodolist(); // Get the latest todolist
        }else{
          this.$message.error('创建失败！') // When the return is not 200, the problem is solved
        }
      }, (err) => {
        this.$message.error('创建失败！') // When there is no return value that server error or request did not send out
        console.log(err)
      })
    this.todos = ''; // Empty the current todos
  },
  // ... Omit some methods
  getTodolist(){
    this.$http.get('/api/todolist/' + this.id) // Send request to the back end for todolist
      .then((res) => {
        if(res.status == 200){
          this.list = res.data // Insert the information obtained into the instance list
        }else{
          this.$message.error('获取列表失败！')
        }
      }, (err) => {
        this.$message.error('获取列表失败！')
        console.log(err)
      })
  }
}

```

At this point, the front and rear ends have been completely constructed. Let's take a look at the effect:

! [todolist] (https://img.piegg.cn/vue-koa-demo/login2todolist-4.gif "todolist")

In fact, when we do this, our application has basically been completed. The final finishing work, let's take a look.

The front-end version of the original `` `` delete `` `` `` `` `` `` `` `the completion of the state` `` `` `` `` `` `` `` . So we can be completed by the increase, delete, change, check out. The next part of the code to provide on the line, in fact, the idea is the same as before, but the function of the operation is not the same Bale.

### Todolist change, delete

```js

// server/models/todolist.js

// ...abridgement

const removeTodolist = function* (id,user_id){
  yield Todolist.destroy({
    where: {
      id,
      user_id
    }
  })
  return true
}

const updateTodolist = function* (id,user_id,status){
  yield Todolist.update(
    {
      status
    },
    {
      where: {
        id,
        user_id
      }
    }
  )
  return true
}

module.exports = {
  getTodolistById,
  createTodolist,
  removeTodolist,
  updateTodolist
}

```


```js

// server/controllers/todolist.js

// ... abridgement

const removeTodolist = function* (){
  const id = this.params.id;
  const user_id = this.params.userId;
  const result = yield todolist.removeTodolist(id,user_id);

  this.body = {
    success: true
  }
}

const updateTodolist = function* (){
  const id = this.params.id;
  const user_id = this.params.userId;
  let status = this.params.status; 
  status == '0' ? status = true : status =  false;// State reversal (update)

  const result = yield todolist.updateTodolist(id,user_id,status);

  this.body = {
    success: true
  }
}

module.exports = (router) => {
  getTodolist,
  createTodolist,
  removeTodolist,
  updateTodolist
}

```

```html
 <!-- src/components/TodoList.vue -->

....

<!-- The completion and restoration of the method replaced by update -->
<el-button size="small" type="primary" @click="update(index)">完成</el-button>
....
<el-button size="small" type="primary" @click="update(index)">还原</el-button>
....
<script>
// ....abridgement
  methods:{
    // ... abridgement
    update(index) {
      this.$http.put('/api/todolist/'+ this.id + '/' + this.list[index].id + '/' + this.list[index].status)
        .then((res) => {
          if(res.status == 200){
            this.$message({
              type: 'success',
              message: 'Task status update success!'
            })
            this.getTodolist();
          }else{
            this.$message.error('Task status update failed!')
          }
        }, (err) => {
          this.$message.error('Task status update failed')
          console.log(err)
        })
    },
    remove(index) {
      this.$http.delete('/api/todolist/'+ this.id + '/' + this.list[index].id)
        .then((res) => {
          if(res.status == 200){
            this.$message({
              type: 'success',
              message: 'Task deleted successfully!'
            })
            this.getTodolist();
          }else{
            this.$message.error('Task delete failed!')
          }
        }, (err) => {
          this.$message.error('Task delete failed!')
          console.log(err)
        })
    },
  }
// ... 省略
</script>
....
```

Let's take a look at the effect of the final 99% of the finished product:

! [Todolist] (https://img.piegg.cn/vue-koa-demo/todolist-5.gif 'todolist')

## project deployment

A lot of tutorials to the part similar to my above is over. But in fact we do a project most want to deploy to everyone is not it?

In the deployment of some of this pit, we need to let everyone know together. This project is a full stack project (albeit a very simple one ...), so it involves the issue of front-end and back-end communications and also involves requests for domain or cross-domain.

We also said that to solve this problem there are two convenient solutions, the first one, the server plus `cors`, the client can freely cross-domain request. But this will have a problem, because we are in the form of domain development, the address is also requested to write the relative address: `/ api / *`, `auth / *` this path to access the path is naturally the same domain . If we want to add `cors` on the server side, we also need to change all our request addresses to` localhost: 8889 / api / * `,` localhost: 8889 / auth / * `so that if the server's port number A change, we also need to re-modify the front all the request address. This is inconvenient and unscientific.

Therefore, it is the best solution to change a request to the same domain - no matter how the service port number changes, so long as the same domain can request it.

So combining Vue and Koa into a complete project (before actually in development mode, webpack helped us make the requested proxy forwarding, so it looks like a domain request, and Vue and Koa are not exactly ), You have to leave the Vue static file under "production mode" with Koa "hosting". All requests for access to the front end take the Koa side, including requests for static file resources, Koa side and Koa as a Vue Project's static resource server so that the requests in Vue go in the same domain. (Equivalent to, before the development model is webpack opened a server hosting Vue resources and requests, now converted to Koa hosted Vue resources and requests)

In order to change the different hosting servers in the development and production mode, it is actually very simple. You only need to use the Koa static resource service middleware to host the constructed Vue files in the production mode.

### Webpack package

Before deployment we use Webpack to package our front-end project output. However, if you use `npm run build` directly, you will find that the package size is too large:

`` `bash

                                                  Asset Size Chunks Chunk Names
    static / css / app.d9034fc06fd57ce00d6e75ed49f0dafe.css 120 kB 2, 0 [emitted] app
                 static / fonts / element-icons.a61be9c.eot 13.5 kB [emitted]
                   static / img / element-icons.09162bc.svg 17.4 kB [emitted]
             static / js / manifest.8ea250834bdc80e4d73b.js 832 bytes 0 [emitted] manifest
               static / js / vendor.75bbe7ecea37b0d4c62d.js 623 kB 1, 0 [emitted] vendor
                  static / js / app.e2d125562bfc4c57f9cb.js 16.5 kB 2, 0 [emitted] app
                 static / fonts / element-icons.b02bdc1.ttf 13.2 kB [emitted]
         static / js / manifest.8ea250834bdc80e4d73b.js.map 8.86 kB 0 [emitted] manifest
           static / js / vendor.75bbe7ecea37b0d4c62d.js.map 3.94 MB 1, 0 [emitted] vendor
              static / js / app.e2d125562bfc4c57f9cb.js.map 64.8 kB 2, 0 [emitted] app
static / css / app.d9034fc06fd57ce00d6e75ed49f0dafe.css.map 151 kB 2, 0 [emitted] app
                                             index.html 563 bytes [emitted]
`` `

There are actually 3.94MB map file. This is certainly unacceptable. So to modify the webpack output settings, cancel the output map file.

Find the `config / index.js` in the root directory: change` productionSourceMap: true` to `productionSourceMap: false`. Then run `npm run build` again.

`` `bash
                                              Asset Size Chunks Chunk Names
             static / fonts / element-icons.a61be9c.eot 13.5 kB [emitted]
             static / fonts / element-icons.b02bdc1.ttf 13.2 kB [emitted]
               static / img / element-icons.09162bc.svg 17.4 kB [emitted]
         static / js / manifest.3ba218c80028a707a728.js 774 bytes 0 [emitted] manifest
           static / js / vendor.75bbe7ecea37b0d4c62d.js 623 kB 1, 0 [emitted] vendor
              static / js / app.b6acaca2531fc0baa447.js 16.5 kB 2, 0 [emitted] app
static / css / app.d9034fc06fd57ce00d6e75ed49f0dafe.css 120 kB 2, 0 [emitted] app
                                         index.html 563 bytes [emitted]
`` `

Remove the sourceMap, the size of the small down. Although the size of 600 + kb is still a bit big, but on the server, gzip only 150 + kb size barely acceptable. Of course, the optimization of webpack output, not the scope of this article, there are many better articles about this thing, so this article will not be expanded in detail.

After the package is equivalent to the output of a pile of static files, of course, this pile of static files need to be on the server before they can access. We are going to have this heap of static resources hosted by Koa.

### Koa serve static resource

`yarn add koa-static`

Open `app.js` and introduce two new dependencies, where` path` is native to nodejs.

```js
// app.js

// .... 
const path =require('path')
    , serve = require('koa-static');
// ....

// The static file serves on top of the other rules of koa-router
app.use(serve(path.resolve('dist'))); // The webpack packaged project directory as the Koa static file service directory

// The following are some of the previous. . . For convenience to find the location marked out
koa.use('/auth', auth.routes());
koa.use("/api",jwt({secret: 'vue-koa-demo'}),api.routes()) 

// ...
```

Then run `node.js` again, and after seeing` Koa is listening in 8889`, you can open the browser `localhost: 8889` to see the following scenario:

! [vue-koa] (https://img.piegg.cn/vue-koa-demo/vue-koa.png)

This has almost come to an end, but there is a problem: if we log in after todolist page refresh, there will be:

! [404] (https://img.piegg.cn/vue-koa-demo/404.png '404')

Why does this happen? Simply because we use the front-end routing, using HTML5 History mode, if you do not do any other configuration, refresh the page, then the browser will go to the server to access the page address, because the server does not configure the address Of the route, so naturally 404 Not Found back.

Details can refer to vue-router [this document] (https://router.vuejs.org/zh-cn/essentials/history-mode.html)

How to solve? In fact, it is also very simple, add a middleware: `koa-history-api-fallback` can be.

`yarn add koa-history-api-fallback`

```js

//... 省略

const historyApiFallback = require('koa-history-api-fallback'); // Introduce dependencies

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.use(historyApiFallback()); // Join in this place. Must be added to the static file serve before, otherwise it will lapse.

// ... 
```

This time, you restart koa, log in and then refresh the page, will not appear again 404 Not Found.

### API Test

Originally wrote above the basic article is over. However, since I encountered some problems in the development process, so there are some fine-tuning needs to be done.

We know koa's use method is only orderly difference.

```js
const app = require('koa');
app.use(A);
app.use(B);
```

```js
const app = require('koa');
app.use(B);
app.use(A);
```

There is a difference between the two, who is the first to use, who put the rules before the implementation of the first.

So if we put the static file serve and `historyApiFallback` before the api's request, then using postman to test the API always returns the full page first:

! [postman] (https://img.piegg.cn/vue-koa-demo/postman.png)

So the right approach should be to put them behind the rules of the API we wrote:

```js

// app.js
// ...

koa.use('/auth', auth.routes()); // Mount to koa-router, at the same time will make all auth request path in front of the request path '/ auth'.
koa.use("/api",jwt({secret: 'vue-koa-demo'}),api.routes()) // All / api / header requests need to be jwt verified.

app.use(koa.routes()); // Mount routing rules to Koa.

app.use(historyApiFallback()); // Mount these two middleware behind the api's route
app.use(serve(path.resolve('dist'))); // The webpack packaged project directory as the Koa static file service directory

```

This will return the data normally.

### Nginx configuration

When really deployed to the server, we certainly will not let you enter `domain name: 8889` this way for everyone to visit. So I need to use Nginx to listen on port 80 and forward the request to our Koa server for access to our assigned domain name.

The general `nginx.conf` is as follows:

```nginx
http {

  # ....
  upstream koa.server{
    server 127.0.0.1:8889;
  }

  server {
    listen   80;
    server_name xxx.xxx.com;

    location / {
      proxy_pass http://koa.server;
      proxy_redirect off;
    }

    #....
  }
  #....
}
```

If you have energy you can configure Nginx's Gzip to make requesting static files such as JS \ CSS \ HTML smaller and faster.

## written in the last

So far, we have completed a complete project from the front-end to the back-end, from local to server. Although it is really a very simple little thing, it has been written in other ways (for example, using localStorage for storage). But as a complete front-end and back-end DEMO, I think it is relatively easier for everyone to start, you can appreciate the full stack development is not the "so difficult" (the difficulty of getting started or acceptable thing). With Nodejs we can do a lot better!

Of course, because of the limited space, this article can tell you that after all, not enough things are involved, and that things can not be exhaustive. Many things are over and you can play for yourself. In fact, want to talk about the simple use of `Event Bus`, as well as the basic realization of paging, etc., too many things for a time we can not digest.

In fact, I did some time ago projects, but also do not know how to combine Vue and Koa development. I do not even know how to use APIs for Koa. I only use Koa for server-side rendering, such as those rendered by template engines like JADE \ EJS. So before that project finished let me learn a lot of things, so I also share for everyone.

In fact, the Koa API provided in this article also tries to be as close as possible to RESTful, so you can learn how to provide a RESTful API via Koa.

Finally put this project Github [address] (https://github.com/Molunerfinn/vue-koa-demo), if this project is helpful to you, I hope you can fork, give me suggestions, if there is time , You can point a Star that's better ~

In addition, the version of this article is written in Koa1. Warehouse has been updated Koa2. From Koa1 -> Koa2 there is no difficulty, in fact, two key points are:

Replace `yield generation` with` async await`
2. Use `koa2` middleware` koa1` middleware replacement, for the same reason

Learn from each other, if I can learn something from this project I am very happy ~

> Note: Reprinted subject to consent, must be signed




