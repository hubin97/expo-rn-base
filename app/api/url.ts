// 环境配置
const ENV = {
    dev: {
        url: 'https://www.wanandroid.com',
    },
    test: {
        url: '',
    },
    prd: {
        url: '',
    }
};

// 当前环境
const host = ENV.dev.url;

// API 路径配置
export const API = {
    // 首页相关
    home: {
        banner: '/banner/json',
        articleTop: '/article/top/json',
        articleList: '/article/list', // /0/json
    },

    // 项目相关
    project: {
        tree: '/project/tree/json',
        list: '/project/list', // /1/json?cid=294
    },

    // 体系相关
    tree: {
        list: '/tree/json',
        articleList: '/article/list', // /0/json?cid=60
    },

    // 公众号相关
    wxarticle: {
        chapters: '/wxarticle/chapters/json',
        list: '/wxarticle/list', // /408/1/json
        search: '/wxarticle/list', // /405/1/json?k=Java
    },

    // 导航相关
    navi: {
        list: '/navi/json',
        articleList: '/article/list', // /0/json?cid=60&order_type=1
    },

    // 工具相关
    tool: {
        list: '/tools/list/json',
    },
};

// 导出完整 URL
export const bannerUrl = host + API.home.banner;
export const articleTopUrl = host + API.home.articleTop;
export const articleListUrl = host + API.home.articleList;

export const projectUrl = host + API.project.tree;
export const projectListUrl = host + API.project.list;

export const treeUrl = host + API.tree.list;
export const treeListUrl = host + API.tree.articleList;

export const wxarticleUrl = host + API.wxarticle.chapters;
export const wxarticleListUrl = host + API.wxarticle.list;
export const wxarticleSearchUrl = host + API.wxarticle.search;

export const chapterUrl = host + API.navi.list;
export const chapterListUrl = host + API.navi.articleList;

export const toolUrl = host + API.tool.list;

// 导出 host 供其他模块使用
export { host };
