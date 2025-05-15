// 请求方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 请求配置
export interface RequestConfig {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: string;
    auth?: boolean; // 是否需要认证
}

// 响应类型
export interface Response<T = any> {
    data: T;
    status: number;
}

// 插件接口
export interface Plugin {
    // 请求前处理
    prepare?: (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;
    // 请求发送前处理
    willSend?: (config: RequestConfig) => Promise<void> | void;
    // 响应处理
    didReceive?: (response: Response) => Promise<any> | any;
}

// Provider 配置
export interface ProviderConfig {
    baseURL: string;
    timeout: number;
    plugins?: Plugin[];
}

export class Provider {
    private baseURL: string;
    private timeout: number;
    private plugins: Plugin[];

    constructor(config: ProviderConfig) {
        this.baseURL = config.baseURL;
        this.timeout = config.timeout;
        this.plugins = config.plugins || [];
    }

    private async applyPlugins<T>(
        type: 'prepare' | 'willSend' | 'didReceive',
        data: T
    ): Promise<T> {
        let result = data;
        for (const plugin of this.plugins) {
            const handler = plugin[type];
            if (handler) {
                result = await handler(result as any);
            }
        }
        return result;
    }

    private async handleFetch<T>(url: string, options: RequestInit & { auth?: boolean } = {}): Promise<T> {
        const { auth, ...rest } = options;
        const config: RequestConfig = {
            url: url.startsWith('http') ? url : `${this.baseURL}${url}`,
            method: (rest.method as HttpMethod) || 'GET',
            headers: rest.headers as Record<string, string> || {},
            body: rest.body as string,
            auth
        };

        try {
            // 应用 prepare 插件
            const preparedConfig = await this.applyPlugins('prepare', config);
            
            // 应用 willSend 插件
            await this.applyPlugins('willSend', preparedConfig);

            const response = await fetch(preparedConfig.url, {
                method: preparedConfig.method,
                headers: preparedConfig.headers,
                body: preparedConfig.body
            });

            const data = await response.json();
            const result: Response = { data, status: response.status };

            // 应用 didReceive 插件处理响应
            return await this.applyPlugins('didReceive', result) as T;
        } catch (error) {
            // 网络错误等直接抛出
            throw error;
        }
    }

    async get<T>(url: string, options: RequestInit & { auth?: boolean } = {}): Promise<T> {
        const { auth, ...rest } = options;
        return this.handleFetch<T>(url, { ...rest, method: 'GET', auth });
    }

    async post<T>(url: string, data?: Record<string, any> | string, options: RequestInit & { auth?: boolean } = {}): Promise<T> {
        const { auth, ...rest } = options;
        const body = typeof data === 'string' ? data : JSON.stringify(data);
        return this.handleFetch<T>(url, {
            ...rest,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...rest.headers
            },
            body,
            auth
        });
    }

    async put<T>(url: string, data?: Record<string, any> | string, options: RequestInit & { auth?: boolean } = {}): Promise<T> {
        const { auth, ...rest } = options;
        const body = typeof data === 'string' ? data : JSON.stringify(data);
        return this.handleFetch<T>(url, {
            ...rest,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...rest.headers
            },
            body,
            auth
        });
    }

    async delete<T>(url: string, options: RequestInit & { auth?: boolean } = {}): Promise<T> {
        const { auth, ...rest } = options;
        return this.handleFetch<T>(url, { ...rest, method: 'DELETE', auth });
    }

    async patch<T>(url: string, data?: Record<string, any> | string, options: RequestInit & { auth?: boolean } = {}): Promise<T> {
        const { auth, ...rest } = options;
        const body = typeof data === 'string' ? data : JSON.stringify(data);
        return this.handleFetch<T>(url, {
            ...rest,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...rest.headers
            },
            body,
            auth
        });
    }
}

