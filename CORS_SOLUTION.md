# CORS 问题解决指南

## 问题描述

CORS (Cross-Origin Resource Sharing) 错误是浏览器安全策略导致的跨域请求被阻止的问题。

## 解决方案

### 1. 开发环境解决方案

#### 使用 Vite 代理 (推荐)

在 `vite.config.ts` 中配置代理：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://www.moyu-idle.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      }
    }
  }
})
```

#### 使用方法

1. 启动开发服务器：`npm run dev`
2. 使用相对路径请求：`/api/game/market/price`
3. 请求会被代理到：`https://www.moyu-idle.com/api/game/market/price`

### 2. 生产环境解决方案

#### 方案A: 服务器端配置CORS

在服务器端添加CORS头：

```javascript
// Node.js Express 示例
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})
```

#### 方案B: 使用反向代理

配置 Nginx 反向代理：

```nginx
location /api/ {
    proxy_pass https://www.moyu-idle.com/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

#### 方案C: 使用CDN或API网关

使用 Cloudflare、AWS API Gateway 等服务。

### 3. 客户端解决方案

#### 更新请求配置

```typescript
// 开发环境使用代理
const API_CONFIG = {
  BASE_URL: import.meta.env.DEV ? '' : 'https://www.moyu-idle.com',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}
```

#### 添加错误处理

```typescript
import { isCorsError, getCorsErrorMessage } from '@/utils/corsHelper'

try {
  const response = await fetch('/api/data')
  // 处理响应
} catch (error) {
  if (isCorsError(error)) {
    console.error('CORS错误:', getCorsErrorMessage(error))
    // 显示用户友好的错误信息
  }
}
```

### 4. 临时解决方案

#### 使用浏览器插件

- Chrome: "CORS Unblock"
- Firefox: "CORS Everywhere"

#### 使用本地代理服务器

```bash
# 使用 npx 启动代理
npx http-server --proxy http://localhost:3000
```

### 5. 调试方法

#### 检查网络请求

1. 打开浏览器开发者工具
2. 查看 Network 面板
3. 检查请求头和响应头
4. 查看控制台错误信息

#### 测试不同请求方式

```typescript
// 测试多种请求方式
const testMethods = [
  () => fetch('/api/data'), // 代理方式
  () => fetch('https://api.example.com/data'), // 直接请求
  () => fetch('/api/data', { mode: 'no-cors' }) // 无CORS模式
]
```

## 常见错误信息

### 1. "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**原因**: 服务器没有设置正确的CORS头

**解决**: 
- 开发环境：使用Vite代理
- 生产环境：配置服务器CORS

### 2. "Failed to fetch"

**原因**: 网络连接问题或CORS阻止

**解决**:
- 检查网络连接
- 使用代理
- 检查服务器状态

### 3. "Request header field ... is not allowed by Access-Control-Allow-Headers"

**原因**: 请求头不被服务器允许

**解决**:
- 移除不必要的请求头
- 服务器配置允许的请求头

## 最佳实践

### 1. 开发环境

- 使用Vite代理避免CORS问题
- 配置环境变量区分开发和生产
- 添加详细的错误处理

### 2. 生产环境

- 服务器端正确配置CORS
- 使用HTTPS确保安全
- 限制允许的域名

### 3. 错误处理

- 检测CORS错误类型
- 提供用户友好的错误信息
- 实现重试机制

## 测试工具

### 1. API测试页面

访问 `/api-test` 页面测试：
- axios封装请求
- 直接fetch请求
- CORS修复方法

### 2. 浏览器开发者工具

- Network面板查看请求详情
- Console面板查看错误信息
- Application面板查看存储

### 3. 在线工具

- [CORS Tester](https://www.test-cors.org/)
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)

## 注意事项

1. **安全性**: 不要在生产环境禁用CORS
2. **性能**: 代理会增加请求延迟
3. **维护**: 定期检查CORS配置
4. **兼容性**: 考虑不同浏览器的CORS实现

## 故障排除

### 检查清单

- [ ] 开发环境是否使用了代理
- [ ] 生产环境服务器是否配置了CORS
- [ ] 请求URL是否正确
- [ ] 网络连接是否正常
- [ ] 浏览器是否支持CORS

### 调试步骤

1. 检查浏览器控制台错误
2. 查看Network面板请求详情
3. 测试不同的请求方式
4. 验证服务器CORS配置
5. 检查网络连接状态 