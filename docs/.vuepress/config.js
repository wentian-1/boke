module.exports = {
	title: '闻天',
	description: '',
	theme: 'reco',
	base: '/boke/',
	head: [
		['meta', {
				name: 'baidu-site-verification',
				content: 'codeva-cG42ilFkN7'
			},
			['meta', {
				name: 'viewport',
				content: 'width=device-width,initial-scale=1,user-scalable=no'
			}]
		]
	],
	themeConfig: {
		lastUpdated: '上次更新',
		smoothScroll: false,
		logo: '/hero.png',
		type: 'blog',
		author: '闻天',
		valineConfig: {
			appId: 'ETy9szzhI94n6LyxxxazrtAp-gzGzoHsz', // your appId
			appKey: 'z60zZnDGACWnkKKy7VxWdzqW', // your appKey
		},
		blogConfig: {
			category: {
				location: 1, // 在导航栏菜单中所占的位置，默认2
				text: '分类' // 默认文案 “分类”
			},
			tag: {
				location: 2, // 在导航栏菜单中所占的位置，默认3
				text: '文章' // 默认文案 “标签”
			},
		},
		subSidebar: 'auto',
		nav: [{
			text: '闻天的博客',
			items: [{
					text: 'Github',
					link: 'https://github.com/wentian-1'
				},
				{
					text: '码云',
					link: 'https://gitee.com/y-f-c'
				}, {
					text: '掘金',
					link: 'https://juejin.cn/user/1802854801608109/posts'
				}
			]
		}],
	},
	markdown: {
		lineNumbers: true,
		anchor: true
	},
	plugins: [
		// 音乐播放器
		[
			'@vuepress-reco/vuepress-plugin-bgm-player',
			{
				audios: [
					{
						name: '星星点灯',
						artist: '郑智化',
						url: '/music/xxddzzh.mp3',
						// cover: 'https://abc.dtxy.xyz/boke/hero.png'
					},
					{
						name: 'Faded纯音乐',
						artist: 'Alan Walker',
						url: '/music/faded.mp3',
						// cover: 'https://abc.dtxy.xyz/boke/hero.png'
					},
					{
						name: '星星点灯',
						artist: '葛漂亮',
						url: '/music/xxddgpl.mp3',
						// cover: 'https://abc.dtxy.xyz/boke/hero.png'
					},
					{
						name: '黄昏',
						artist: '周传雄',
						url: '/music/hh.mp3',
						// cover: 'https://abc.dtxy.xyz/boke/hero.png'
					},
					{
						name: '卡农（经典钢琴版）',
						artist: 'dylanf',
						url: '/music/kn.mp3',
						// cover: 'https://abc.dtxy.xyz/boke/hero.png'
					},
					{
						name: '七里香',
						artist: '周杰伦',
						url: '/music/qlx.mp3',
						// cover: 'https://abc.dtxy.xyz/boke/hero.png'
					},
					{
						name: 'Something Just Like This',
						artist: 'The Chainsmokers、Coldplay',
						url: '/music/sjlt.mp3',
						// cover: 'https://abc.dtxy.xyz/boke/hero.png'
					},
					{
						name: 'That Girl',
						artist: 'Olly Murs',
						url: '/music/tg.mp3',
						// cover: 'https://abc.dtxy.xyz/boke/hero.png'
					},
					{
						name: 'That is Why (You Go Away)',
						artist: 'Michael Learns To Rock',
						url: '/music/tw.mp3',
						// cover: 'https://abc.dtxy.xyz/boke/hero.png'
					},
					{
						name: 'Until You',
						artist: 'Shayne Ward',
						url: '/music/uy.mp3',
						// cover: 'https://abc.dtxy.xyz/boke/hero.png'
					},
				],
				// 是否默认缩小
				autoShrink: true,
				// 缩小时缩为哪种模式
				shrinkMode: 'float',
				// 悬浮窗样式
				floatStyle: {
					bottom: '200px',
					'z-index': '999999'
				}
			}
		],
		// 看板娘
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
		// 点击样式
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
		// 返回顶部
		'go-top',
		[
			'sitemap',
			{
				hostname: 'https://ts.yayujs.com'
			}
		]
	]
}
