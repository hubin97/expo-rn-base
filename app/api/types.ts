// 通用响应类型
// export interface ApiResponse<T = any> {
//   errorCode: number;
//   errorMsg: string;
//   data: T;
// }

// 分页请求参数
export interface PageParams {
  page: number;
  size?: number;
}

// 分页响应数据
export interface PageData<T> {
  curPage: number;
  datas: T[];
  offset: number;
  over: boolean;
  pageCount: number;
  size: number;
  total: number;
}

// banner
export interface Banner {
  desc: string;
  id: number;
  imagePath: string;
  isVisible: number;
  order: number;
  title: string;
  type: number;
  url: string;  
}

// 文章相关类型
export interface Article {
  id: number;
  title: string;
  desc: string;
  author: string;
  link: string;
  niceDate: string;
  chapterName: string;
  superChapterName: string;
  collect: boolean;
  fresh: boolean;
  top: boolean;
  tags: Tag[];
}

// 标签类型
export interface Tag {
  name: string;
  url: string;
}

// 项目相关类型
export interface Project {
  id: number;
  title: string;           // 标题
  desc: string;            // 描述
  link: string;            // 文章链接
  projectLink: string;     // 项目链接
  envelopePic: string;     // 封面图
  author: string;          // 作者
  chapterId: number;       // 章节ID
  chapterName: string;     // 章节名称
  superChapterId: number;  // 父章节ID
  superChapterName: string;// 父章节名称
  publishTime: number;     // 发布时间
  niceDate: string;        // 格式化后的时间
  collect: boolean;        // 是否收藏
  fresh: boolean;          // 是否新文章
  zan: number;            // 点赞数
  visible: number;        // 是否可见
  tags: ProjectTag[];     // 标签
}

export interface ProjectTag {
  name: string;
  url: string;
}

// 章节相关类型
export interface Chapter {
  id: number;
  name: string;
  children: Chapter[];
  courseId: number;
  order: number;
  parentChapterId: number;
  userControlSetTop: boolean;
  visible: number;
}

// 微信文章相关类型
export interface WxArticle {
  id: number;
  title: string;
  desc: string;
  author: string;
  link: string;
  niceDate: string;
  chapterName: string;
  superChapterName: string;
  collect: boolean;
  fresh: boolean;
  top: boolean;
  tags: Tag[];
}

// 工具相关类型
export interface Tool {
  id: number;
  name: string;
  desc: string;
  link: string;
  icon: string;
  order: number;
  visible: number;
} 