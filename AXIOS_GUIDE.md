# Axios 封装使用指南

## 概述

本项目封装了axios，提供了统一的HTTP请求接口，包含以下特性：

- 🔄 自动重试机制
- 🛡️ 统一错误处理
- 🔐 Token自动添加
- 📊 请求日志记录
- ⚙️ 可配置的请求参数

## 文件结构

```
src/
├── utils/
│   └── request.ts          # axios封装
├── config/
│   └── api.ts             # API配置
├── api/
│   └── market.ts          # 市场价格API服务
```

## 核心功能

### 1. 请求拦截器
- 自动添加Authorization token
- 记录请求开始日志
- 支持自定义请求头

### 2. 响应拦截器
- 统一处理HTTP状态码错误
- 自动处理401未授权情况
- 记录请求完成/失败日志

### 3. 重试机制
- 支持配置重试次数和延迟
- 自动重试失败的请求
- 避免重复重试

### 4. 错误处理
- 网络错误处理
- HTTP状态码错误处理
- 业务逻辑错误处理

## 使用方法

### 基本用法

```typescript
import { request } from '@/utils/request'

// GET请求
const data = await request.get('/api/users')

// POST请求
const result = await request.post('/api/users', {
  name: 'John',
  email: 'john@example.com'
})

// 带参数的GET请求
const items = await request.get('/api/items', {
  params: { page: 1, limit: 10 }
})
```

### 配置选项

```typescript
// 自定义配置
const response = await request.get('/api/data', {
  showError: false,        // 不显示错误信息
  showLoading: false,      // 不显示加载状态
  retry: 3,               // 重试3次
  retryDelay: 2000,       // 重试延迟2秒
  params: { id: 123 }     // 查询参数
})
```

### API服务封装

```typescript
// 创建API服务
export const userApi = {
  // 获取用户列表
  getUsers(params?: any) {
    return request.get('/api/users', { params })
  },

  // 创建用户
  createUser(data: any) {
    return request.post('/api/users', data)
  },

  // 更新用户
  updateUser(id: string, data: any) {
    return request.put(`/api/users/${id}`, data)
  },

  // 删除用户
  deleteUser(id: string) {
    return request.delete(`/api/users/${id}`)
  }
}
```

## 配置说明

### API配置 (`src/config/api.ts`)

```typescript
export const API_CONFIG = {
  // 基础URL
  BASE_URL: 'https://api.example.com',
  
  // 超时时间
  TIMEOUT: 10000,
  
  // 重试配置
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
  },
  
  // 请求头
  HEADERS: {
    'Content-Type': 'application/json'
  }
}
```

### 请求配置接口

```typescript
interface RequestConfig {
  showError?: boolean    // 是否显示错误信息
  showLoading?: boolean  // 是否显示加载状态
  retry?: number         // 重试次数
  retryDelay?: number    // 重试延迟
  params?: any           // 查询参数
}
```

## 错误处理

### HTTP状态码处理

- **400**: 请求参数错误
- **401**: 未授权，自动清除token
- **403**: 拒绝访问
- **404**: 请求地址不存在
- **500**: 服务器内部错误

### 网络错误处理

- 网络连接失败
- 请求超时
- 请求配置错误

## 最佳实践

### 1. 创建专门的API服务

```typescript
// src/api/user.ts
import { request } from '@/utils/request'

export const userApi = {
  getProfile() {
    return request.get('/api/user/profile')
  },
  
  updateProfile(data: any) {
    return request.put('/api/user/profile', data)
  }
}
```

### 2. 使用TypeScript类型

```typescript
interface User {
  id: string
  name: string
  email: string
}

interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

// 使用类型
const response = await request.get<User>('/api/user/1')
const user: User = response.data
```

### 3. 错误处理

```typescript
try {
  const data = await request.get('/api/data')
  // 处理成功响应
} catch (error) {
  // 处理错误
  console.error('请求失败:', error)
}
```

### 4. 配置重试

```typescript
// 重要请求配置重试
const response = await request.get('/api/critical-data', {
  retry: 5,
  retryDelay: 2000
})
```

## 扩展功能

### 1. 添加全局Loading状态

```typescript
// 在request.ts中添加
let loadingCount = 0

const showLoading = () => {
  loadingCount++
  // 显示全局loading
}

const hideLoading = () => {
  loadingCount--
  if (loadingCount <= 0) {
    // 隐藏全局loading
  }
}
```

### 2. 添加请求缓存

```typescript
const cache = new Map()

const getCachedData = (url: string) => {
  const cached = cache.get(url)
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data
  }
  return null
}
```

### 3. 添加请求取消

```typescript
import { CancelToken } from 'axios'

const cancelToken = CancelToken.source()

request.get('/api/data', {
  cancelToken: cancelToken.token
})

// 取消请求
cancelToken.cancel('请求被取消')
```

## 注意事项

1. **Token管理**: 确保localStorage中的token格式正确
2. **错误处理**: 根据业务需求自定义错误处理逻辑
3. **重试策略**: 避免对幂等性请求进行重试
4. **超时设置**: 根据网络环境调整超时时间
5. **日志记录**: 生产环境可以关闭详细日志

## 故障排除

### 常见问题

1. **CORS错误**: 检查服务器CORS配置
2. **Token过期**: 检查token格式和有效期
3. **网络超时**: 调整timeout配置
4. **重试失败**: 检查重试次数和延迟配置

### 调试技巧

1. 查看浏览器Network面板
2. 检查Console日志输出
3. 使用Vue DevTools调试
4. 添加断点调试请求流程 