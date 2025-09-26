# Cloudinary 图片上传配置指南

## 概述

该项目已集成 Cloudinary 前端图片上传功能，用于处理新闻文章的首页配图。用户可以直接在前端选择本地图片，上传到 Cloudinary 并获取 URL 进行存储和展示。

## 配置步骤

### 1. 创建 Cloudinary 账户

1. 访问 [Cloudinary 官网](https://cloudinary.com/)
2. 注册免费账户
3. 登录到 Cloudinary 控制台

### 2. 获取配置信息

在 Cloudinary 控制台首页，记录以下信息：

- **Cloud Name**: 在页面顶部显示，格式如 `dxxxxxxxxxxxxx`

### 3. 创建 Upload Preset

1. 在 Cloudinary 控制台，导航到 **Settings** > **Upload** > **Upload presets**
2. 点击 **Add upload preset**
3. 配置如下：
   - **Preset name**: 自定义名称，如 `news_images`
   - **Signing Mode**: 选择 **Unsigned** (重要！)
   - **Allowed formats**: 选择图片格式 (jpg, png, gif, webp 等)
   - **Transformation**: 可以设置自动优化，如：
     - **Quality**: auto
     - **Format**: auto
     - **Width**: 1200 (限制最大宽度)
4. 点击 **Save**

### 4. 配置代码

在 `src/pages/NewsAdd.jsx` 文件中，找到 `CLOUDINARY_CONFIG` 对象并修改：

```javascript
const CLOUDINARY_CONFIG = {
  cloud_name: "your_actual_cloud_name", // 替换为您的 Cloud Name
  upload_preset: "news_images", // 替换为您创建的 upload preset 名称
};
```

### 5. 测试上传功能

1. 启动开发服务器
2. 进入新闻添加页面
3. 选择一张图片进行上传
4. 确认图片成功上传并显示预览

## 免费套餐限制

Cloudinary 免费套餐提供：

- **25 个积分/月**，可用于：
  - 存储空间：25 GB
  - 访问带宽：25 GB
  - 图片处理：25,000 次

## 错误排查

### 1. 上传失败：401 Unauthorized

- 检查 `cloud_name` 是否正确
- 确认 `upload_preset` 存在且为 **Unsigned** 模式

### 2. 上传失败：400 Bad Request

- 检查 `upload_preset` 名称是否正确
- 确认文件格式是否被允许

### 3. 网络错误

- 检查网络连接
- 确认防火墙没有阻止 `api.cloudinary.com`

## 功能特性

### 已实现功能

- ✅ 图片文件类型验证
- ✅ 文件大小限制 (10MB)
- ✅ 上传进度显示
- ✅ 错误处理和用户提示
- ✅ 图片预览
- ✅ 删除图片功能
- ✅ 暗黑模式支持

### 上传流程

1. 用户选择本地图片文件
2. 前端验证文件类型和大小
3. 直接上传到 Cloudinary (不经过后端)
4. 获取 Cloudinary URL
5. 显示预览图片
6. 保存 URL 到表单数据

## 安全考虑

- 使用 **Unsigned Upload Preset**，不需要在前端暴露 API Secret
- 可以在 Upload Preset 中设置上传限制和转换规则
- Cloudinary 自动处理图片优化和格式转换

## 扩展建议

1. **图片压缩**: 在 Upload Preset 中配置自动压缩
2. **多尺寸生成**: 配置自动生成缩略图
3. **水印添加**: 在 Upload Preset 中添加水印配置
4. **文件夹管理**: 使用 folder 参数组织图片

## 相关文档

- [Cloudinary Upload API 文档](https://cloudinary.com/documentation/image_upload_api_reference)
- [Upload Presets 文档](https://cloudinary.com/documentation/upload_presets)
- [前端上传指南](https://cloudinary.com/documentation/upload_images#uploading_from_the_client_side)
