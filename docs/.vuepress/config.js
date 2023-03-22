module.exports = {
	title: '',
	description: '',
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
		],
	},
	markdown: {
		lineNumbers: true,
		anchor: true
	},
	plugins: [
		[
			'@vuepress-reco/vuepress-plugin-bgm-player',
			{
				audios: [
					// 网络文件示例
					{
						name: '강남역 4번 출구',
						artist: 'Plastic / Fallin` Dild',
						url: 'https://assets.smallsunnyfox.com/music/2.mp3',
						cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
					},
					{
						name: '用胳膊当枕头',
						artist: '최낙타',
						url: 'https://assets.smallsunnyfox.com/music/3.mp3',
						cover: 'https://assets.smallsunnyfox.com/music/3.jpg'
					}
				],
				// 是否默认缩小
				autoShrink: true,
				// 缩小时缩为哪种模式
				shrinkMode: 'mini',
				// 悬浮窗样式
				floatStyle: {
					bottom: '200px',
					'z-index': '999999'
				}
			}
		],
		[
			'@vuepress-reco/vuepress-plugin-kan-ban-niang',
			{
				theme: ['haru1', 'haru2', 'haruto', 'koharu', 'izumi', 'shizuku', 'miku', 'z16'],
				messages: {
					home: '~~~~',
					theme: '好吧，希望你能喜欢我的其他小伙伴。',
					close: '~~~'
				}
			}
		],
		['cursor-effects', {
			size: 2, // size of the particle, default: 2
			shape: ['star' | 'circle'], // ['star' | 'circle'], // shape of the particle, default: 'star'
			zIndex: 999999999, // z-index property of the canvas, default: 999999999
		}],
		[
			'dynamic-title',
			{
				showIcon: '/favicon.ico',
				showText: '(づ｡◕‿‿◕｡)づ咦！亲一个！😘',
				hideIcon: '/failure.ico',
				hideText: ' ヽ(。>д<)ｐ不要走！🤥',
				recoverTime: 2000,
			},
		],
		'@vuepress-reco/extract-code',
		'go-top'
	]
}
