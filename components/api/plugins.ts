import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plugin, RequestConfig, Response } from './http';

// 认证插件
export const authPlugin: Plugin = {
    prepare: async (config: RequestConfig) => {
        // 如果 auth 为 true，则添加认证信息
        if (config.auth === true) {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    return {
                        ...config,
                        headers: {
                            ...config.headers,
                            'Authorization': `Bearer ${token}`
                        }
                    };
                }
            } catch (error) {
                console.error('获取 token 失败:', error);
            }
        }
        return config;
    }
};

// 响应处理插件
export const responsePlugin: Plugin = {
    didReceive: (response: Response) => {
        const { data, status } = response;
        //console.log('responsePlugin 收到响应:', { data, status });
        
        // 处理 HTTP 状态码错误
        if (status < 200 || status >= 300) {
            throw new Error(`HTTP Error: ${status}`);
        }

        // 处理业务错误
        if (!data || typeof data !== 'object') {
            throw new Error('无效的响应数据');
        }

        if (data.errorCode !== 0) {
            // 处理 401 未授权
            if (data.errorCode === 401) {
                AsyncStorage.removeItem('token').catch(console.error);
                throw new Error('需要重新登录');
            }
            throw new Error(data.errorMsg || '请求失败');
        }

        // 返回正常数据
        if (!data.data) {
            console.warn('响应数据中没有 data 字段:', data);
            return [];
        }

        return data.data;
    }
};

// 日志插件
export const loggerPlugin: Plugin = {
    willSend: (config: RequestConfig) => {
        console.log('🚀 Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            auth: config.auth
        });
    },
    didReceive: (response: Response | any) => {
        // 如果 response 是原始响应对象
        if (response && typeof response === 'object' && 'data' in response && 'status' in response) {
            // 收到原始响应数据
            console.log('✨ Response:', {
                status: response.status,
                data: response.data
            });
        } else {
            // 收到处理后的数据
            console.log('🎉 Response:', response);
        }
        return response;
    }
}; 