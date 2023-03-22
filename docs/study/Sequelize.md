# Sequelize的简单使用
[Sequelize官网](https://www.sequelize.cn/)
Sequelize 是一个基于 promise 的 Node.js ORM, 它具有强大的事务支持, 关联关系, 预读和延迟加载,读取复制等功能。
Sequelize 遵从语义版本控制。 支持 Node v10 及更高版本以便使用 ES6 功能。
::: warning
基于KoaSystem的路由嵌套的部分
mysql 5.73 
:::
## 开始前准备工作
在**routers文件夹**中新增**article.js**文件
```js
const Router = require('koa-router');
const articleRouter = new Router();

articleRouter.get('/', async (ctx) => {
	ctx.body = '文章路由'
})


module.exports = articleRouter;
```
修改**routers**文件夹中的**index.js**文件
``` js {26, 37}
const Router = require('koa-router');
const router = new Router();
const userRouter = require('./user');
const authRouter = require('./auth');
const articleRouter = require('./article');
const apiRouter = new Router({
	prefix: '/api'
})

router.get('/', async (ctx) => {
	ctx.type = 'html';
	ctx.body = '<h1>hello world!</h1>';
})

// 第一种方式
apiRouter.use('/user', userRouter.routes()).use('/article', articleRouter.routes());
router.use(apiRouter.routes());
// 第二种方式
router.use('/api', authRouter.routes())






module.exports = router;
```
在根目录下创建**config.js**
```js
module.exports = {
	database: {
		host: 'localhost',
		dialect: 'mysql',
		name: 'koa-system',
		username: 'root', // 线上不要暴漏
		password: 'root' // 线上不要暴漏
	}
}
```

## 链接数据库
* 安装MySQL Sequelize moment
``` shell
pnpm add sequelize mysql2 moment
```
* 在跟目录创建**sequelize文件夹**并在其中创建**index.js**
``` js
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
* 在app.js导入测试
```js {5}
const Koa = require('koa');
const Router = require('koa-router');
const router = require('./routers');
const bodyParser = require('koa-bodyparser');
const { sequelize } = require('./sequelize')
const app = new Koa();
app.use(bodyParser());

app.use(router.routes());


try {
	sequelize.authenticate()
	console.log('success')
} catch(e) {
	console.log(e)
}

app.listen(8888, () => {
	console.log('启动')
})

```
控制台输入nodemon app.js 后看到success表示链接成功
``` shell
nodemon app.js
```
## 模型基础
模型是数组库中表的抽象方式，在Sequelize中是Model的扩展类，有**两种**方式定义
### 使用define
在**sequelize**文件夹中创建user.js
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
**timestamps**在sequelize中会默认增加createdAt 和 updatedAt 字段，并且在使用Sequelize完成操作使用才会自动更新，可单独配置详细查看article.js
### 继承Model
* 继承Model并实现init方法
在**sequelize**文件夹中创建article.js
```js
const {
	sequelize,
} = require('./index');
const {
	DataTypes,
	Model
} = require('sequelize')
const moment = require('moment');

class Article extends Model {
	num
}

Article.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: true,
		autoIncrement: true
	},
	content: {
		type: DataTypes.STRING,
		allowNull: false
	},
	// 创建时间
	createdAt: {
		type: DataTypes.DATE,
		defaultValue: new Date(),
		get() {
			return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
		}
	},
	authId: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, {
	timestamps: true,
	createdAt: false,
	updatedAt: 'updateTime',
	tableName: 'Article',
	modelName: 'Article',
	sequelize // 必传
})

Article.sync()

module.exports = Article;
```
::: warning
注意
* sequelize 是Sequelize实例必传
* 通过tableName设置的表明区分大小写，比如上面创建的表名为Article，但是Article.sync检测时候是不分大小写 A 和 a是相同的表
* timestamps可单独配置 可配置别名
* 利用继承model的方法可以在类中添加实例方法或者类方法
:::

## 模型查询
### INSERT增
**单条增加**
```js {10-14}
userRouter.post('/', async (ctx) => {
	const user = { ...ctx.request.body };
	const res = await User.create(user);
	ctx.body = res; // 创建成功后的user
})
```
**批量增加**
```js
userRouter.post('/batch', async (ctx) => {
	const res = await User.bulkCreate([{
		name: 'yfc',
		password: 123456
	},
	{
		name: 'hl',
		password: 123456
	}]);
	ctx.body = res; // 创建成功后的user Array
})
```

### DELETE 删
```js {16-23}
userRouter.del('/', async(ctx) => {
	const res = await User.destroy({
		where: {
			name: ctx.query.name
		}
	})
	ctx.body = res; // 删除的数量
})

```
### UPDATE 改
```js
userRouter.patch('/', async(ctx) => {
	const user = { ...ctx.request.body };
	const res = await User.update(user, {
		where: {
			name: ctx.query.name
		}
	})
	ctx.body = res; // 更改的个数
})

```
## SELECT 查
::: warning
使用routers里面的article.js做演示 <br />
使用批量插入的方法插入几条数据做查询用（参照上面的批量插入）
:::
### 重命名
``` js
// 重命名
articleRouter.get('/rename', async (ctx) => {
	const res = await Article.findAll({
		attributes: ['id', ['content', 'context']],
	});
	ctx.body = res;
})
```
### 聚合
::: warning
* 可能出现以下错误
In aggregated query without GROUP BY, expression #1 of SELECT list contains nonaggregated column 'koa-system.Article.id'; this is incompatible with sql_mode=only_full_group_by, Time: 0.000000s <br>
* 原因：
mysql的sql_mode是only_full_group_by的时候，在不使用group by 并且select后面出现聚集函数的话，那么所有被select的都应该是聚集函数，否则就会报错 <br>
* 解决方法：
查询mysql安装文件：whereis mysql，编辑/etc/my.cnf文件，加入参数 sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES 并重启 <br>
或者如下使用分组<br>
[解决办法的官方文档](https://dev.mysql.com/doc/refman/5.7/en/group-by-handling.html)
* 办法2 执行语句 并重启Navicate
``` sql
set @@global.sql_mode ='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
```

:::
```js
articleRouter.get('/aggregation', async (ctx) => {
	const res = await Article.findAll({
		attributes: ['id', ['content', 'context'], 'authId', [sequelize.fn('SUM', sequelize.col('views')), 's_views']],
		group: 'authId'
	});
	ctx.body = res;
})
```
其中attributes可以传递数组或者对象，传递数组需要把查找的每一列都罗列出来，如上。传递对象默认查找所有，但是可以根据include和exclude做限制。
```js
articleRouter.get('/aggregation2', async (ctx) => {
	const res = await Article.findAll({
		attributes: {
			include: [
				[sequelize.fn('SUM', sequelize.col('views')), 's_views']
			],
			exclude: ['views']
		},
		group: 'authId'
	});
	ctx.body = res;
})
```
## where子语句
where用于过滤查询，Sequelize中内置了Op
### 基础
```js
articleRouter.get('/basics', async (ctx) => {
	const res = await Article.findAll({
		where: {
			id: 1,
			authId: 1
		}
	});
	ctx.body = res;
})
```
### Eq
```js
articleRouter.get('/eq', async (ctx) => {
	const res = await Article.findOne({
		where: {
			// id: 1 等同于
			id: {
				[Op.eq]: 1
			}
		}
	});
	ctx.body = res;
})
```
### And
```js
articleRouter.get('/and', async (ctx) => {
	const res = await Article.findOne({
		where: {
			[Op.and]: [
				{id: 1},
				{authId: 1}
			]
		},
		// 等同于
		// where: {
		// 	id: 1,
		// 	authId: 1
		// }
	});
	ctx.body = res;
})
```
``` sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` WHERE (`Article`.`id` = 1 AND `Article`.`authId` = 1) LIMIT 1;
```
### Or
```js
articleRouter.get('/or', async (ctx) => {
	const res = await Article.findAll({
		where: {
			[Op.or]: [
				{id: 1},
				{authId: 1}
			]
		},
	});
	ctx.body = res;
})
```
``` sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` WHERE (`Article`.`id` = 1 OR `Article`.`authId` = 1);
```
如果是相同字段则可以
```js
articleRouter.get('/or2', async (ctx) => {
	const res = await Article.findAll({
		where: {
			id: {
				[Op.or]: [1, 2]
			}
		},
	});
	ctx.body = res;
})
```
```sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` WHERE (`Article`.`id` = 1 OR `Article`.`id` = 2);
```
### In
``` js
articleRouter.get('/in', async (ctx) => {
	const res = await Article.findAll({
		where: {
			id: {
				[Op.in]: [1, 2]
			},
			// 等同于
			// id: [1, 2]
		},
	});
	ctx.body = res;
})
```
``` sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` WHERE `Article`.`id` IN (1, 2);
```
::: tip
in和or的区别一个是多字段or链接一个单字段匹配多个值，只有在一个字段多值时候才极其相似
:::
### 操作符
::: tip
[查看官网](https://www.sequelize.cn/core-concepts/model-querying-basics#%E6%93%8D%E4%BD%9C%E7%AC%A6)
:::
``` js
const { Op } = require("sequelize");
Post.findAll({
  where: {
    [Op.and]: [{ a: 5 }, { b: 6 }],            // (a = 5) AND (b = 6)
    [Op.or]: [{ a: 5 }, { b: 6 }],             // (a = 5) OR (b = 6)
    someAttribute: {
      // 基本
      [Op.eq]: 3,                              // = 3
      [Op.ne]: 20,                             // != 20
      [Op.is]: null,                           // IS NULL
      [Op.not]: true,                          // IS NOT TRUE
      [Op.or]: [5, 6],                         // (someAttribute = 5) OR (someAttribute = 6)

      // 使用方言特定的列标识符 (以下示例中使用 PG):
      [Op.col]: 'user.organization_id',        // = "user"."organization_id"

      // 数字比较
      [Op.gt]: 6,                              // > 6
      [Op.gte]: 6,                             // >= 6
      [Op.lt]: 10,                             // < 10
      [Op.lte]: 10,                            // <= 10
      [Op.between]: [6, 10],                   // BETWEEN 6 AND 10
      [Op.notBetween]: [11, 15],               // NOT BETWEEN 11 AND 15

      // 其它操作符

      [Op.all]: sequelize.literal('SELECT 1'), // > ALL (SELECT 1)

      [Op.in]: [1, 2],                         // IN [1, 2]
      [Op.notIn]: [1, 2],                      // NOT IN [1, 2]

      [Op.like]: '%hat',                       // LIKE '%hat'
      [Op.notLike]: '%hat',                    // NOT LIKE '%hat'
      [Op.startsWith]: 'hat',                  // LIKE 'hat%'
      [Op.endsWith]: 'hat',                    // LIKE '%hat'
      [Op.substring]: 'hat',                   // LIKE '%hat%'
      [Op.iLike]: '%hat',                      // ILIKE '%hat' (不区分大小写) (仅 PG)
      [Op.notILike]: '%hat',                   // NOT ILIKE '%hat'  (仅 PG)
      [Op.regexp]: '^[h|a|t]',                 // REGEXP/~ '^[h|a|t]' (仅 MySQL/PG)
      [Op.notRegexp]: '^[h|a|t]',              // NOT REGEXP/!~ '^[h|a|t]' (仅 MySQL/PG)
      [Op.iRegexp]: '^[h|a|t]',                // ~* '^[h|a|t]' (仅 PG)
      [Op.notIRegexp]: '^[h|a|t]',             // !~* '^[h|a|t]' (仅 PG)

      [Op.any]: [2, 3],                        // ANY ARRAY[2, 3]::INTEGER (仅 PG)
      [Op.match]: Sequelize.fn('to_tsquery', 'fat & rat') // 匹配文本搜索字符串 'fat' 和 'rat' (仅 PG)

      // 在 Postgres 中, Op.like/Op.iLike/Op.notLike 可以结合 Op.any 使用:
      [Op.like]: { [Op.any]: ['cat', 'hat'] }  // LIKE ANY ARRAY['cat', 'hat']

      // 还有更多的仅限 postgres 的范围运算符,请参见下文
    }
  }
});
```
### 组合查询
查询views大于1小于6，作者是1或者是4的文章
```js
articleRouter.get('/combination', async (ctx) => {
	const res = await Article.findAll({
		where: {
			[Op.and]: [
				{
					views: {
						[Op.and]: {
							[Op.lt]: 6,
							[Op.gt]: 1
						}
					}
				},
				{
					authId: {
						[Op.in]: [1, 4]
					}
				}
			]
		},
	});
	ctx.body = res;
})
```
``` sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` WHERE ((`Article`.`views` < 6 AND `Article`.`views` > 1) AND `Article`.`authId` IN (1, 4));
```
## 高级查询
查询文章内容字符长度大于2的文章且views大于4的文章
```js
articleRouter.get('/advanced', async (ctx) => {
	const res = await Article.findAll({
		where: {
			[Op.and]: [
				{
					views: {
						[Op.gt]: 4
					}
				},
				sequelize.where(sequelize.fn('char_length', sequelize.col('content')), {
					[Op.gt]: 2
				})
			]
		},
	});
	ctx.body = res;
})
```
```sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` WHERE (`Article`.`views` > 4 AND char_length(`content`) > 2);
```
### 排序 [中文网](https://www.sequelize.cn/core-concepts/model-querying-basics#%E6%8E%92%E5%BA%8F)
```js
articleRouter.get('/order', async (ctx) => {
	const res = await Article.findAll({
		where: {
			views: {
				[Op.gt]: 1
			}
		},
		order: [['views', 'DESC']]
	});
	ctx.body = res;
})
```
::: warning
注意MySQL版本低的话order不支持函数会报错
:::
### 分组
```js
articleRouter.get('/group', async (ctx) => {
	const res = await Article.findAll({
		attributes: [[sequelize.fn('SUM', sequelize.col('views')), 'n_views'], 'authId'],
		group: 'authId'
	});
	ctx.body = res;
})
```sql
SELECT SUM(`views`) AS `n_views`, `authId` FROM `Article` AS `Article` GROUP BY `authId`;
```
### 限制
**提取一个实例**
```js
articleRouter.get('/limit', async (ctx) => {
	const res = await Article.findAll({
		limit: 1
	});
	ctx.body = res;
})
```
``` sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` LIMIT 1;
```
**跳过一个实例，取出剩下**
```js
articleRouter.get('/offset', async (ctx) => {
	const res = await Article.findAll({
		offset: 1
	});
	ctx.body = res;
})
```
```sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` LIMIT 1, 10000000000000;
```
### 分页
**跳过一个取出一个**
```js
articleRouter.get('/offsetOrLimit', async (ctx) => {
	const res = await Article.findAll({
		offset: 1,
		limit: 1
	});
	ctx.body = res;
})
```
```sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` LIMIT 1, 1;
```
### Count
``` js
articleRouter.get('/count', async (ctx) => {
	const res = await Article.count({
		where: {
			authId: 1
		}
	});
	ctx.body = res;
})
```
``` sql
SELECT count(*) AS `count` FROM `Article` AS `Article` WHERE `Article`.`authId` = 1;
```
::: warning
按照转义过后的sql查询结果应该是
| count        | 
| ------------- |
| 100			      | 
但是使用Sequelize后返回的总和的数值
:::
### max
```js
articleRouter.get('/max', async (ctx) => {
	const res = await Article.max('views', {
		where: {
			views: {
				[Op.lt]: 6
			}
		}
	});
	ctx.body = res; // 符合条件的views的值
})
```
``` sql
SELECT max(`views`) AS `max` FROM `Article` AS `Article` WHERE `Article`.`views` < 6;
```
::: warning
按照转义过后的sql查询应该是符合条件的那一列，但是使用Sequelize后返回的是符合条件的值
:::
### min
```js
articleRouter.get('/min', async (ctx) => {
	const res = await Article.min('views', {
		where: {
			views: {
				[Op.gt]: 1
			}
		}
	});
	ctx.body = res; // 符合条件的views的值
})
```
```sql
SELECT min(`views`) AS `min` FROM `Article` AS `Article` WHERE `Article`.`views` > 1;
```
::: warning
按照转义过后的sql查询应该是符合条件的那一列，但是使用Sequelize后返回的是符合条件的值
:::
### sum
```js
articleRouter.get('/sum', async (ctx) => {
	const res = await Article.sum('views', {
		where: {
			views: {
				[Op.gt]: 1
			}
		}
	});
	ctx.body = res; // 符合条件的views的值
})
```
```sql
SELECT sum(`views`) AS `sum` FROM `Article` AS `Article` WHERE `Article`.`views` > 1;
```
::: warning
按照转义过后的sql查询结果应该是
| sum        | 
| ------------- |
| 100			      | 
但是使用Sequelize后返回的总和的数值
:::
### increment
```js
articleRouter.get('/increment', async (ctx) => {
	const res = await Article.increment({
		views: 5
	}, {
		where: {
			id: 1
		}
	});
	ctx.body = res;
})
```
```sql
UPDATE `Article` SET `views`=`views`+ 5,`updateTime`='2023-03-20 14:32:09' WHERE `id` = 1
```
::: tip
因为创建article表时候开启了timestamps，所以执行更新语句时候会自动加上更新时间
:::
### decrement
```js
articleRouter.get('/decrement', async (ctx) => {
	const res = await Article.decrement({
		views: 5
	}, {
		where: {
			id: 1
		}
	});
	ctx.body = res;
})
```
```sql
UPDATE `Article` SET `views`=`views`- 5,`updateTime`='2023-03-20 14:37:00' WHERE `id` = 1
```
## 查找器
### findAll(查询所有)
查询所有的条目
```js
articleRouter.get('/findAll', async (ctx) => {
	const res = await Article.findAll();
	ctx.body = res;
})
```
```sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article`;
```
### findByPK(根据主键查询)
根据表内的主键查询，建表时候会声明主键
```js
articleRouter.get('/findByPk', async (ctx) => {
	const res = await Article.findByPk(1);
	ctx.body = res;
})
```
```sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` WHERE `Article`.`id` = 1;
```
### findOne(查询一条)
根据条件查询一条符合的值，即使有多符合
```js
articleRouter.get('/findOne', async (ctx) => {
	const res = await Article.findOne({
		where: {
			authId: 1
		}
	});
	ctx.body = res;
})
```
```sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` WHERE `Article`.`authId` = 1 LIMIT 1;
```
### findOrCreate(查找或创建)
根据条件查找，如果找不到则会创建一个defaults参数必传，用来定义找不到时创建的值，如果没有定义每一项则会采用where的值补充。
查找结果是一个数组，第一项为查找或者创建的实例，第二项则是一个布尔值，true表示是创建的false表示是查找的。
如果查到到多个符合条件的会像findOne一样
```js
articleRouter.get('/findOrCreate', async (ctx) => {
	const res = await Article.findOrCreate({
		where: {
			authId: 100
		},
		defaults: {
			content: '文章100',
			views: 100
		}
	});
	ctx.body = res;
})
```
```sql
SELECT `id`, `content`, `createdAt`, `authId`, `views`, `updateTime` FROM `Article` AS `Article` WHERE `Article`.`authId` = 100 LIMIT 1;
INSERT INTO `Article` (`id`,`content`,`createdAt`,`authId`,`views`,`updateTime`) VALUES (DEFAULT,?,?,?,?,?);
```
如果没有内部会多一条插入语句，如果有则只有查找

