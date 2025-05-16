import { authPlugin, loggerPlugin, responsePlugin } from '@/components/api/plugins';
import { Provider } from '@/components/api/request';
import { Article, Banner, Chapter, PageData, Project, Tool, WxArticle } from './types';
import {
    articleListUrl,
    articleTopUrl,
    bannerUrl,
    chapterListUrl,
    chapterUrl,
    projectListUrl,
    projectUrl,
    toolUrl,
    treeListUrl,
    treeUrl,
    wxarticleListUrl,
    wxarticleSearchUrl,
    wxarticleUrl
} from './url';

// 创建 Provider 实例
const api = new Provider({
    baseURL: '',  // 移除 baseURL，因为 url.tsx 中已经包含了完整的 URL
    timeout: 10000,
    plugins: [
        authPlugin,
        responsePlugin,
        loggerPlugin  // 将 loggerPlugin 放在最后，这样它可以看到 responsePlugin 处理后的结果
    ]
});

// 首页相关接口
export const homeApi = {
    // 获取轮播图
    getBanner: () => api.get<Banner[]>(bannerUrl),
    
    // 获取置顶文章
    getTopArticles: () => api.get<Article[]>(articleTopUrl),
    
    // 获取文章列表 `注意页码从0开始, page_size 控制分页数量，取值为[1-40]`
    getArticleList: (page: number, pageSize: number) => 
        api.get<PageData<Article>>(`${articleListUrl}/${page}/json?page_size=${pageSize}`)
};

// 项目相关接口
export const projectApi = {
    // 获取项目分类
    getProjectTree: () => api.get<Chapter[]>(projectUrl),
    
    // 获取项目列表
    getProjectList: (page: number, cid: number) => 
        api.get<PageData<Project>>(`${projectListUrl}/${page}/json?cid=${cid}`)
};

// 体系相关接口
export const treeApi = {
    // 获取体系分类
    getTreeList: () => api.get<Chapter[]>(treeUrl),
    
    // 获取体系文章列表
    getTreeArticleList: (page: number, cid: number) => 
        api.get<PageData<Article>>(`${treeListUrl}/${page}/json?cid=${cid}`)
};

// 公众号相关接口
export const wxarticleApi = {
    // 获取公众号列表
    getWxArticleList: () => api.get<Chapter[]>(wxarticleUrl),
    
    // 获取公众号文章列表
    getWxArticleDetail: (page: number, cid: number) => 
        api.get<PageData<WxArticle>>(`${wxarticleListUrl}/${cid}/${page}/json`),
    
    // 搜索公众号文章
    searchWxArticle: (page: number, cid: number, keyword: string) => 
        api.get<PageData<WxArticle>>(`${wxarticleSearchUrl}/${cid}/${page}/json?k=${keyword}`)
};

// 导航相关接口
export const naviApi = {
    // 获取导航列表
    getNaviList: () => api.get<Chapter[]>(chapterUrl),
    
    // 获取导航文章列表
    getNaviArticleList: (page: number, cid: number) => 
        api.get<PageData<Article>>(`${chapterListUrl}/${page}/json?cid=${cid}&order_type=1`)
};

// 工具相关接口
export const toolApi = {
    // 获取工具列表
    getToolList: () => api.get<Tool[]>(toolUrl)
};

// 导出 Provider 实例，以便在需要时直接使用
export { api };
