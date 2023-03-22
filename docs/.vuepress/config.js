module.exports = {
	title: '工作学习记录',
	description: '工作学习记录',
	theme: 'reco',
	base: '/boke/',
	themeConfig: {
		subSidebar: 'auto',
		nav: [{
				text: '首页',
				link: '/'
			},
			{
				text: '闻天的博客',
				items: [
					// {
					// 	text: 'Github',
					// 	link: 'https://github.com/wentian-1'
					// },
					{
						text: '码云',
						link: 'https://gitee.com/y-f-c'
					}, {
						text: '掘金',
						link: 'https://juejin.cn/user/1802854801608109/posts'
					}
				]
			}
		],
		sidebar: [{
				title: '欢迎学习',
				path: '/',
				collapsable: false, // 不折叠
				children: [{
					title: "学前必读",
					path: "/"
				}]
			},
			{
				title: "问题记录",
				path: '/problem/Pc',
				collapsable: false, // 不折叠
				children: [{
						title: "pc端",
						path: "/problem/Pc"
					},
					{
						title: "移动端",
						path: "/problem/Mobile"
					}
				],
			},
			{
				title: "学习技能",
				path: '/study/CreateCli',
				collapsable: false, // 不折叠
				children: [{
						title: "搭建cli",
						path: "/study/CreateCli"
					}, {
						title: "koa管理系统",
						path: "/study/KoaSystem"
					},
					{
						title: "Sequelize的使用",
						path: "/study/Sequelize"
					}
				],
			},
			{
				title: "算法与数据结构",
				path: '/algorithms/LinearSearch',
				collapsable: false, // 不折叠
				children: [{
					title: "线性算法",
					path: "/algorithms/LinearSearch"
				}, ],
			}
		]
	},
	markdown: {
		lineNumbers: true,
		anchor: true
	}
}
