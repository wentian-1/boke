# 从0到1搭建一个koa 管理系统
## 前言
::: tip
使用Node结合Koa MySQL Redis Sequelize Jwt验证的管理系统；
确保电脑已安装且运行了 MySQL 和 Redis。
:::
**node版本14.19**

## 初始化
### 初始化package.json
创建一个空项目，切换node版本到pnpm所需要的版本
``` shell
mkdir koa-app
cd koa-app
nvm use 14.19
pnpm init
pnpm add cross-env -D
```
cross-env它是运行跨平台设置和使用环境变量(Node中的环境变量)的脚本。
### 配置package.json
```json {6,7}
{
  "name": "koa-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "cross-env NODE_ENV=dev nodemon ./bin/www",
    "prod": "cross-env NODE_ENV=production nodemon ./bin/www"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
### 配置别名
```json {16,24}
{
	"name": "koa-app",
	"version": "1.0.0",
	"description": "",
	"main": "index.js",
	"scripts": {
		"dev": "cross-env NODE_ENV=dev nodemon ./bin/www",
		"prod": "cross-env NODE_ENV=production nodemon ./bin/www"
	},
	"keywords": [],
	"author": "",
	"license": "ISC",
	"devDependencies": {
		"cross-env": "^7.0.3"
	},
	"_moduleAliases": {
		"@root": ".",
		"@controller": "controller",
		"@config": "config/config.js",
		"@middlewares": "middlewares",
		"@services": "services",
		"@models": "models",
		"@routers": "routers",
		"@sequelize": "sequelize",
		"@utils": "utils"
	}
}
```
### 初始化项目
+ 在跟目录创建入口文件app.js，下载koa依赖，创建实例并导出
```js
const Koa = require('koa');
const app = new Koa();



app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
```
+ 全局安装nodemon，使用nodemon命令启动node项目会监听改动自动更新
```shell
pnpm add -g nodemon
```
+ 安装debug
[一个模仿Node.js核心调试技术的小型JavaScript调试实用程序。适用于Node.js和web浏览器。](https://www.npmjs.com/package/debug)
```shell
pnpm add debug
```
+ 在项目的根目录下创建bin文件夹并在里面创建www.js文件
``` js
#!/usr/bin/env node

const app = require('../app');
const debug = require('debug')('koa-app:server');
const http = require('http');

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }
  return false;
}

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


const port = normalizePort(process.env.PORT || '8888');

const server = http.createServer(app.callback());

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
```
在控制台启动
```shell
pnpm run dev
```

## 添加路由
### 安装koa-router
``` shell
pnpm add koa-router
```
在跟目录下创建文件夹routers在routers中创建index.js，并添加以下代码
```js
const Router = require('koa-router');
const router = new Router();


router.get('/', async (ctx) => {
	ctx.type = 'html';
	ctx.body = '<h1>hello world!</h1>';
})
module.exports = router;
```
**修改app.js代码**
```js {1,4,6,8}
require('module-alias/register') // 别名
const Koa = require('koa');
const app = new Koa();
const router = require('@routers');

app.use(router.routes());

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
module.exports = app;
```
打开浏览器输入[http://localhost:8888/](http://localhost:8888/) 即可看到 **Hello World**的字样

### 路由嵌套
在**routers文件**中新建auth.js 和 user.js
**user.js**
``` js
const Router = require('koa-router');
const userRouter = new Router();

userRouter.get('/', async (ctx) => {
	ctx.body = {
		name: 'admin',
		id: ctx.query.id
	}
})

module.exports = userRouter;
```
**auth.js**
```js
const Router = require('koa-router');
const authRouter = new Router();

authRouter.post('/register', async (ctx) => {
	ctx.body = ctx.request.body
}).post('/login', async (ctx) => {
	ctx.body = ctx.request.body
})
	
module.exports = authRouter;
```
**修改routers/index.js**
```js {3-7,15-18}
const Router = require('koa-router');
const router = new Router();
const userRouter = require('./user');
const authRouter = require('./auth');
const apiRouter = new Router({
	prefix: '/api'
})

router.get('/', async (ctx) => {
	ctx.type = 'html';
	ctx.body = '<h1>hello world!</h1>';
})

// 第一种方式
apiRouter.use('/user', userRouter.routes());
router.use(apiRouter.routes());
// 第二种方式
router.use('/api', authRouter.routes())
module.exports = router;
```
## 使用Sequelize
### 下载Sequelize MySQL moment
```shell
pnpm add sequelize mysql2 moment
```
### 配置Sequelize
+ **在根目录创建config/config.js**
```js
module.exports = {
	port: 8888,
	database: {
		host: 'localhost',
		dialect: 'mysql',
		name: 'koa-system',
		username: 'root',
		password: 'root'
	}
}
```
+ **再根目录创建sequelize文件夹并创建index.js和user.js**<br>
**index.js**配置Sequelize的链接
```js
const { Sequelize } = require('sequelize')
const { database } = require('../config')
const sequelize = new Sequelize(database.name, database.username, database.password, {
	host: database.host,
	dialect: database.dialect,
	dialectOptions: {
		charset: 'utf8mb4',
		supportBigNumbers: true,
		bigNumberStrings: true
	},
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	timezone: '+08:00'
})

module.exports = {
	sequelize,
	Sequelize
}
```
**user.js** 创建user表并导出模型（为以后得增删改查做准备）
```js
const {
	sequelize,
	Sequelize
} = require('./index');
const moment = require('moment');

const User = sequelize.define('User', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: true,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	},
	// 真实开发中不会这么建表，现在是为了后面事务
	article: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	// 创建时间
	createdAt: {
		type: Sequelize.DATE,
		defaultValue: new Date(),
		get() {
			return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
		}
	},
	// 更新时间
	updatedAt: {
		type: Sequelize.DATE,
		defaultValue: new Date(),
		get() {
			return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
		}
	}
}, {
	timestamps: false,
	tableName: 'user'
})
User.sync(); // 如果不存在就创建
// User.sync({ force: true }); // 强制创建 如果已存在先删除
// User.sync({ alter: true }); // 检查表中的列，数据类型，然后更改使其与模型匹配
module.exports = User;
```
+ 在根目录下创建models文件下--存放模型的查询方法，数据库交互<br>
**创建user.js**
``` js
const User = require('@sequelize/user')
class UserModel {
	static async findAllUser() {
		return await User.findAll()
	}
	static async findUserById(id) {
		return await User.findOne({
			where: {
				id
			}
		})
	}
}
module.exports = UserModel
```
+ 在根目录下创建services文件下--处理数据库获取的各种情况<br>
**创建user.js**
``` js
const userModel = require('@models/user')

const findAllUser = async () => {
	return new Promise((resolve, reject) => {
		userModel.findAllUser().then(res => {
			if (Array.isArray(res) && res.length) {
				resolve(res)
			} else {
				resolve(null)
			}
		}, err => reject(err))
	})
}
const findOneUserById = async (id) => {
	return new Promise((resolve, reject) => {
		userModel.findUserById(id).then(res => {
			resolve(res)
		}, err => reject(err))
	})
}
module.exports = {
	findAllUser,
	findOneUserById
}
```
+ 在根目录下创建controller文件下--处理api的相关逻辑<br>
**创建user.js**
``` js
const userService = require('@services/user')

class UserController {
	static async getAllUser(ctx) {
		const res = await userService.findAllUser()
		ctx.body = res
	}
	static async getUserById(ctx){
		const query = ctx.query;
		const res = await userService.findOneUserById(query.id);
		if (!res) {
			ctx.body = '用户不存在';
			return
		}
		ctx.body = res;
	}
}


module.exports = UserController
```
+ 修改routers文件夹下**user.js**
``` js {3,5}
const Router = require('koa-router');
const userRouter = new Router();
const User = require('@controller/user')

userRouter.get('/', User.getAllUser)

module.exports = userRouter;
```
## 使用 swagger
### 安装koa-swagger-decorator
```shell
pnpm add koa-swagger-decorator
```
### 配置
+ 在根目录下config文件夹中创建（位置随便）**swaggerDec.js**
```js
const { SwaggerRouter } = require('koa-swagger-decorator')
const path = require('path')
const router = new SwaggerRouter()

router.swagger({
	title: '管理系统',
	description: '管理系统---管理系统',
	version: '0.0.1',
})

router.mapDir(path.resolve(__dirname, './controller/'))

module.exports = router
```
+ 下载 babel-plugin-transform-decorators-legacy<br>
因为文档需要decorators
```shell
pnpm add babel-plugin-transform-decorators-legacy babel-register -D
```
+ 在跟目录创建.babelrc
```json
{
  "presets": [
   
  ],
  "plugins": ["transform-decorators-legacy"]
}
```
+ 修改**app.js**
```js {1,6,9}
require('module-alias/register');
require("babel-register");
const Koa = require('koa');
const app = new Koa();
// const router = require('@routers/index');
const swaggerDec = require('@config/swaggerDec')

// app.use(router.routes());
app.use(swaggerDec.routes(), swaggerDec.allowedMethods());

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
module.exports = app;
```
+ 修改controller/user.js**
``` js {1,5-9}
const { summary, tags, query, description, request } = require('koa-swagger-decorator')
const userService = require('@services/user');
const tag = tags(['用户'])

class UserController {
	@request('get', '/api/user')
	@summary('获取用户列表')
	@description('获取用户列表')
	@tag
	// @query({name: {type: 'string', required: false, example: 'male'}})
	static async getAllUser(ctx) {
		const res = await userService.findAllUser();
		ctx.body = res;
	}
	@request('get', '/api/userById')
	@summary('返回一个用户')
	@description('lalla')
	@tag
	@query({id: {id: 'number', required: true, example: 1}})
	static async getUserByName(ctx){
		const query = ctx.query;
		const res = await userService.findOneUserById(query.id);
		if (!res) {
			ctx.body = '用户不存在';
			return
		}
		ctx.body = res;
	}
}


module.exports = UserController;
```
启动后打开链接[http://localhost:8888/swagger-html](http://localhost:8888/swagger-html)

## 日志处理
+ 在根目录中新建utils和logs文件夹
+ 安装log4js
```shell
pnpm add log4js
```
+ 在utils中创建log.js
```js
const log4j = require('log4js')

const levels = {
	trace: log4j.levels.TRACE,
	debug: log4j.levels.DEBUG,
	info: log4j.levels.INFO,
	warn: log4j.levels.WARN,
	error: log4j.levels.ERROR,
	fatal: log4j.levels.FATAL
}

log4j.configure({
	appenders: {
		console: {
			type: 'console'
		},
		info: {
			type: 'file',
			filename: 'logs/all-logs.log'
		},
		error: {
			type: 'dateFile',
			filename: 'logs/log',
			pattern: 'yyyy-MM-dd.log',
			alwaysIncludePattern: true
		}
	},
	categories: {
		default: {
			appenders: ['console'],
			level: 'debug'
		},
		info: {
			appenders: ['info', 'console'],
			level: 'info'
		},
		error: {
			appenders: ['error', 'console'],
			level: 'error'
		}
	}
})


exports.info = (content) => {
	let log = log4j.getLogger('info')
	log.level = levels.info
	log.info(content)
}


exports.debug = (content) => {
	let log = log4j.getLogger('debug')
	log.level = levels.debug
	log.debug(content)
}


exports.error = (content) => {
	let log = log4j.getLogger('error')
	log.level = levels.error
	log.error(content)
}

```
+ 在middlewares增加logger作为日志中间件
```js
const { info } = require('@utils/log');
const logger = async (ctx, next) => {
	info(`${ctx.request.method}, ${ctx.request.url}`);
	await next()
}

module.exports = logger;
```
+ 修改app.js
```js {7,8,11,15}
require('module-alias/register');
require("babel-register");
const Koa = require('koa');
const app = new Koa();
// const router = require('@routers/index');
const swaggerDec = require('@config/swaggerDec');
const logger = require('@middlewares/logger');
const { error } = require('@utils/log');


app.use(logger);
// app.use(router.routes());
app.use(swaggerDec.routes(), swaggerDec.allowedMethods());

app.on('error', (err, ctx) => {
  error(err)
});
module.exports = app;
```
## 错误处理
+ 在utils文件夹下新建error.js
```js
class ErrorClass {
	constructor(code = 500, msg = '服务开小车啦', statusCode = 500) {
		this.code = code;
		this.msg = msg;
		this.statusCode = statusCode;
	}
	throwErr(ctx) {
		ctx.throw(this.statusCode, this.msg, {
			code: this.code,
			flag: "ErrorClass"
		})
	}
}

class ParameterError extends ErrorClass {
	constructor(code, msg="参数错误") {
		super(code, msg, 400);
	}
}

class AuthError extends ErrorClass {
	constructor(code, msg = "token认证失败") {
		super(code, msg, 401)
	}
}

// 404
class NotFoundError extends ErrorClass {
	constructor(code, msg = "未找到该api") {
		super(code, msg, 404)
	}
}
// 500
class InternalServerError extends ErrorClass {
	constructor(code, msg = "服务器内部错误") {
		super(code, msg, 500)
	}
}

module.exports = {
	ErrorClass,
	ParameterError,
	AuthError,
	NotFoundError,
	InternalServerError
}
```
+ 在config文件夹下新建httpRes.js
```js
const {
	ParameterError,
	AuthError
} = require("@utils/error");
const Success = require("@utils/success");


exports.SUCCESS = async (ctx, data) => {
	new Success(200, '操作成功', data).success(ctx);
}

exports.USER_ACCOUNT_NOT_EXIST = async (ctx) => 
	new Success(2001, '账号不存在').success(ctx);

exports.USER_PASSWORD_FAIL = async (ctx) => 
	new Success(2001, '用户名或密码错误').success(ctx);


exports.NO_AUTH = async (ctx, msg = "暂无权限") => new AuthError(4001, msg).throwErr(ctx);

exports.PARAM_IS_BLANK = async (ctx, msg = "请求参数为空") => new ParameterError(1001, msg).throwErr(ctx);
```
+ 在middlewares中新建exception中间件
```js
const {
	ErrorClass,
	NotFoundError
} = require('@utils/error');
const { error } = require('../utils/log');
const format = (err, ctx) => {
	ctx.response.status = err.statusCode;
	ctx.body = {
		code: err.code,
		message: err.message || err.msg,
		data: null
	}
}

const exception = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		if (err.flag === 'ErrorClass') {
			format(err, ctx);
		} else {
			format(new ErrorClass(), ctx);
		}
	}
}

module.exports = exception;
```
+ 在app.js中引入
```js {8,9,13,19}
require('module-alias/register');
require("babel-register");
const Koa = require('koa');
const app = new Koa();
// const router = require('@routers/index');
const swaggerDec = require('@config/swaggerDec');
const logger = require('@middlewares/logger');
const { error } = require('@utils/log');
const exception = require('@middlewares/exception');



app.use(exception);
app.use(logger);
// app.use(router.routes());
app.use(swaggerDec.routes(), swaggerDec.allowedMethods());

app.on('error', (err, ctx) => {
  error(err)
});
module.exports = app;
```
+ 修改controller下的user.js
```js {21,23-26}
const { summary, tags, query, description, request } = require('koa-swagger-decorator')
const userService = require('@services/user');
const { PARAM_IS_BLANK }= require('@config/httpRes');
const tag = tags(['用户']);


class UserController {
	@request('get', '/api/user')
	@summary('获取用户列表')
	@description('获取用户列表')
	@tag
	// @query({name: {type: 'string', required: false, example: 'male'}})
	static async getAllUser(ctx) {
		const res = await userService.findAllUser();
		ctx.body = res;
	}
	@request('get', '/api/userById')
	@summary('返回一个用户')
	@description('lalla')
	@tag
	@query({id: {id: 'number', required: false, example: 1}})
	static async getUserById(ctx){
		const query = ctx.query;
		if (!query.id) {
			await PARAM_IS_BLANK(ctx, 'id不能为null')
		}
		const res = await userService.findOneUserById(query.id);
		if (!res) {
			ctx.body = '用户不存在';
			return
		}
		ctx.body = res;
	}
}


module.exports = UserController;
```
## 响应处理
+ 在utils文件下新建success.js
```js 
class Success {
	constructor(code, msg, data) {
		this.code = code;
		this.msg = msg || '操作成功';
		this.data = data || null
	},
	success(ctx) {
		ctx.body = this
	}
}

module.exports = Success;
```
+ 修改config下的httpRes
```js {4-13}
const {
	ParameterError
} = require("@utils/error");
const Success = require("@utils/success");


exports.SUCCESS = async (ctx, data) => {
	new Success(200, '操作成功', data).success(ctx);
}

exports.USER_ACCOUNT_NOT_EXIST = async (ctx) => {
	new Success(2001, '账号不存在').success(ctx);
}

exports.PARAM_IS_BLANK = async (ctx, msg = "请求参数为空") => new ParameterError(1001, msg).throwErr(ctx);
```
+ 修改controller下的user.js
```js {3,29,32}
const { summary, tags, query, description, request } = require('koa-swagger-decorator')
const userService = require('@services/user');
const { PARAM_IS_BLANK, SUCCESS, USER_ACCOUNT_NOT_EXIST }= require('@config/httpRes');
const tag = tags(['用户']);


class UserController {
	@request('get', '/api/user')
	@summary('获取用户列表')
	@description('获取用户列表')
	@tag
	// @query({name: {type: 'string', required: false, example: 'male'}})
	static async getAllUser(ctx) {
		const res = await userService.findAllUser();
		ctx.body = res;
	}
	@request('get', '/api/userById')
	@summary('返回一个用户')
	@description('lalla')
	@tag
	@query({id: {id: 'number', required: false, example: 1}})
	static async getUserById(ctx){
		const query = ctx.query;
		if (!query.id) {
			await PARAM_IS_BLANK(ctx, 'id不能为null')
		}
		const res = await userService.findOneUserById(query.id);
		if (!res) {
			await USER_ACCOUNT_NOT_EXIST(ctx)
			return
		}
		await SUCCESS(ctx, res)
	}
}

module.exports = UserController;
```
## 鉴权
+ 鉴权分为三部分，第一部分是使用koa-jwt做的权限拦截，第二部分是使用jsonwebtoken做的签发token，第三部分是权限验证
+ 服务端会在前端访问的时候做权限验证，服务端对不需要权限的接口进行声明，对与需要的接口，如果无权限则返回401
+ 用户登录成功，借用jsonwebtoken生成一个有效期的加密的字符串，返回给前端
### 权限拦截
+ 安装 koa-jwt
```shell
pnpm add koa-jwt
```
+ 在config/config.js中创建密钥
```js {10}
module.exports = {
	port: 8888,
	database: {
		host: 'localhost',
		dialect: 'mysql',
		name: 'koa-system',
		username: 'root',
		password: 'root'
	},
	secret: 'koa-app'
}
```
+ 在app.js 中添加koajwt配置以及无权限的拦截
``` js {10-13,23-39}
require('module-alias/register');
require("babel-register");
const Koa = require('koa');
const app = new Koa();
// const router = require('@routers/index');
const swaggerDec = require('@config/swaggerDec');
const logger = require('@middlewares/logger');
const { error } = require('@utils/log');
const exception = require('@middlewares/exception');
const bodyparser = require('koa-bodyparser')
const koajwt = require('koa-jwt');
const { secret } = require('@config/config');
const { NO_AUTH } = require('@config/httpRes');






app.use(bodyparser())
app.use(exception);

app.use(async(ctx, next) => {
	try{
		await next();
	}catch(e){
		if (e.name === 'UnauthorizedError') {
			await NO_AUTH(ctx)
		}
		throw e
	}
})
app.use(koajwt({ secret }).unless({
  path: [
    /^\/api\/login/, // 登陆接口
    /^\/api\/register/, // 注册
		/^\/swagger/, // 接口文档
  ]
}))

app.use(logger);
// app.use(router.routes());
app.use(swaggerDec.routes(), swaggerDec.allowedMethods());

app.on('error', (err, ctx) => {
  error(err)
});
module.exports = app;
```
::: warnig
+ 注意错误处理的中间价要在token验证之前，因为需要抛出错误被统一的错误处理拦截掉
+ 注意koa-bodyparser的安装，需要解析请求体中的数据
:::
### 签发token
在登录成功的时候使用jsonwebtoken和密钥生成token
+ 安装jsonwebtoken
``` shell
pnpm add jsonwebtoken
```
+ 在utils文件夹下创建token.js
```js
const jwt = require('jsonwebtoken');
const { secret } = require('@config/config');
const signToken = (data) => {
	return jwt.sign(data, secret, { expiresIn: '1h' });
} 

const verifyToken = (token) => {
	return jwt.verify(token, secret);
}


module.exports = {
	signToken,
	verifyToken
}
```
+ 在models/user.js添加根据name查找用户的sql
```js {13-19}
const User = require('@sequelize/user')
class UserModel {
	static async findAllUser() {
		return await User.findAll()
	}
	static async findUserById(id) {
		return await User.findOne({
			where: {
				id
			}
		})
	}
	static async findUserByName(name) {
		return await User.findOne({
			where: {
				name
			}
		})
	}
}
module.exports = UserModel
```
+ 在services的user.js中添加对应的方法
```js {21-27, 31}
const userModel = require('@models/user')

const findAllUser = async () => {
	return new Promise((resolve, reject) => {
		userModel.findAllUser().then(res => {
			if (Array.isArray(res) && res.length) {
				resolve(res)
			} else {
				resolve(null)
			}
		}, err => reject(err))
	})
}
const findOneUserById = async (id) => {
	return new Promise((resolve, reject) => {
		userModel.findUserById(id).then(res => {
			resolve(res)
		}, err => reject(err))
	})
}
const findUserByName = async (name) => {
	return new Promise((resolve, reject) => {
		userModel.findUserByName(name).then(res => {
			resolve(res)
		}, err => reject(err))
	})
}
module.exports = {
	findAllUser,
	findOneUserById,
	findUserByName
}
```
+ 在controller的user.js中添加对应的方法
```js {1,3,5,34-59}
const { summary, tags, query, description, request, body } = require('koa-swagger-decorator')
const userService = require('@services/user');
const { PARAM_IS_BLANK, SUCCESS, USER_ACCOUNT_NOT_EXIST, USER_PASSWORD_FAIL }= require('@config/httpRes');
const tag = tags(['用户']);
const { signToken } = require('@utils/token');

class UserController {
	@request('get', '/api/user')
	@summary('获取用户列表')
	@description('获取用户列表')
	@tag
	// @query({name: {type: 'string', required: false, example: 'male'}})
	static async getAllUser(ctx) {
		const res = await userService.findAllUser();
		ctx.body = res;
	}
	@request('get', '/api/userById')
	@summary('返回一个用户')
	@description('lalla')
	@tag
	@query({id: {type: 'number', required: true, example: 1}})
	static async getUserById(ctx){
		const query = ctx.query;
		if (!query.id) {
			await PARAM_IS_BLANK(ctx, 'id不能为null')
		}
		const res = await userService.findOneUserById(query.id);
		if (!res) {
			await USER_ACCOUNT_NOT_EXIST(ctx)
			return
		}
		await SUCCESS(ctx, res)
	}
	@request('post', '/api/login')
	@summary('登录')
	@description('lalla')
	@tag
	@body({
		name: { type: 'string', required: true, example: 'admin'},
		password: { type: 'string', required: true, example: '123456'},
	})
	static async login(ctx){
		const body = ctx.request.body;
		const res = await userService.findUserByName(body.name);
		if (!res) {
			await USER_ACCOUNT_NOT_EXIST(ctx);
			return
		}
		if (res.password !== body.password) {
			await USER_PASSWORD_FAIL(ctx);
			return
		}
		const token = signToken({
			name: res.name,
			password: res.password
		});
		await SUCCESS(ctx, { token });
		
	}
}


module.exports = UserController;
```
::: warning
+ koa-jwt 会自动帮我们校验是否过期
:::
### 优化代码结构
因为我们使用了koa-swagger-decorator接替了路由并且单独配置了，所以把鉴权的代码转移到config/swaggerDec.js中
```js {4-6,14-30}
const { SwaggerRouter } = require('koa-swagger-decorator')
const path = require('path')
const router = new SwaggerRouter()
const koajwt = require('koa-jwt');
const { secret } = require('@config/config');
const { NO_AUTH } = require('@config/httpRes');

router.swagger({
	title: '管理系统',
	description: '管理系统---管理系统',
	version: '0.0.1',
})

router.use(async(ctx, next) => {
	try{
		await next();
	}catch(e){
		if (e.name === 'UnauthorizedError') {
			await NO_AUTH(ctx);
		}
		throw e
	}
})
router.use(koajwt({ secret }).unless({
  path: [
    /^\/api\/login/, // 登陆接口
    /^\/api\/register/, // 注册
		/^\/swagger/, // 接口文档
  ]
}));


router.mapDir(path.resolve(__dirname, '../controller/'));

module.exports = router;
```
删除appjs中相关代码
``` js
require('module-alias/register');
require("babel-register");
const Koa = require('koa');
const app = new Koa();
// const router = require('@routers/index');
const swaggerDec = require('@config/swaggerDec');
const logger = require('@middlewares/logger');
const { error } = require('@utils/log');
const exception = require('@middlewares/exception');
const bodyparser = require('koa-bodyparser');

app.use(bodyparser());

app.use(exception);



app.use(logger);
// app.use(router.routes());
app.use(swaggerDec.routes(), swaggerDec.allowedMethods());

app.on('error', (err, ctx) => {
  error(err)
});

module.exports = app;
```
## 使用Redis
+ 安装ioredis
```shell
pnpm add ioredis
```
+ 修改config/config.js
```js {11-15}
module.exports = {
	port: 8888,
	database: {
		host: 'localhost',
		dialect: 'mysql',
		name: 'koa-system',
		username: 'root',
		password: 'root'
	},
	secret: 'koa-app',
	redisConfig: {
		host: '127.0.0.1',
		port: '6379',
		password: 'root'
	}
}
```
+ 在utils中创建redis
```js
const Redis = require('ioredis');
const { redisConfig } = require('@config/config');

const redis = new Redis(redisConfig)


const setItem = (key, value) => redis.set(key, value, 'EX', 3600);
const getItem = (key) => new Promise((resolve, reject) => {
	redis.get(key, (err, result) => {
	  if (err) {
	    reject(err);
	  } else {
	    resolve(result);
	  }
	});
});

module.exports = {
	redis,
	setItem,
	getItem
};
```
+ 修改controller/user.js
```js {6,61,62}
const { summary, tags, query, description, request, body } = require('koa-swagger-decorator')
const userService = require('@services/user');
const { PARAM_IS_BLANK, SUCCESS, USER_ACCOUNT_NOT_EXIST, USER_PASSWORD_FAIL }= require('@config/httpRes');
const tag = tags(['用户']);
const { signToken, verifyToken } = require('@utils/token')
const { setItem, getItem } = require("@utils/redis")

class UserController {
	@request('get', '/api/user')
	@summary('获取用户列表')
	@description('获取用户列表')
	@tag
	// @query({name: {type: 'string', required: false, example: 'male'}})
	static async getAllUser(ctx) {
		const token = ctx.request.header['authorization'].split(' ')[1];
		console.log(await getItem('key'))
		const res = await userService.findAllUser();
		ctx.body = res;
	}
	@request('get', '/api/userById')
	@summary('返回一个用户')
	@description('lalla')
	@tag
	@query({id: {type: 'number', required: true, example: 1}})
	static async getUserById(ctx){
		const query = ctx.query;
		if (!query.id) {
			await PARAM_IS_BLANK(ctx, 'id不能为null')
		}
		const res = await userService.findOneUserById(query.id);
		if (!res) {
			await USER_ACCOUNT_NOT_EXIST(ctx)
			return
		}
		await SUCCESS(ctx, res)
	}
	@request('post', '/api/login')
	@summary('登录')
	@description('lalla')
	@tag
	@body({
		name: { type: 'string', required: true, example: 'admin'},
		password: { type: 'string', required: true, example: '123456'},
	})
	static async login(ctx){
		const body = ctx.request.body;
		const res = await userService.findUserByName(body.name);
		if (!res) {
			await USER_ACCOUNT_NOT_EXIST(ctx);
			return
		}
		if (res.password !== body.password) {
			await USER_PASSWORD_FAIL(ctx);
			return
		}
		const token = signToken({
			name: res.name,
			password: res.password,
			id: res.id
		});
		setItem(res.id, token); // 用户权限被修改后清除掉token用
		setItem(token, token);
		await SUCCESS(ctx, { token });
		
	}
}


module.exports = UserController;
```