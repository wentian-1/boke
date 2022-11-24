module.exports = {
	title: 'TypeScript4 文档',
	description: 'TypeScript4 最新官方文档翻译',
	theme: 'reco',
	base: '/boke/'
	themeConfig: {
		subSidebar: 'auto',
		nav: [{
				text: '首页',
				link: '/'
			},
			{
				text: '闻天的博客',
				items: [{
						text: 'Github',
						link: 'https://github.com/mqyqingfeng'
					},
					{
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
				path: '/problem/WorkProblems',
				collapsable: false, // 不折叠
				children: [{
						title: "工作问题",
						path: "/problem/WorkProblems"
					},
				],
			},
			{
				title: "学习技能",
				path: '/study/CreateCli',
				collapsable: false, // 不折叠
				children: [{
						title: "搭建cli",
						path: "/study/CreateCli"
					},
				],
			}
		]
	}
}
