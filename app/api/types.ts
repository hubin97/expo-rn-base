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
  name: string;
  desc: string;
  link: string;
  icon: string;
  order: number;
  visible: number;
  parentChapterId: number;
  userControlSetTop: boolean;
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