# 朱睿的个人网站

在线主页：https://astro-zhurui.github.io/zh/

## 照片放这里

**把精选照片复制到 `/Users/rui/astro-zhurui.github.io/照片/`。**

支持 JPEG、PNG、TIFF、WebP、AVIF。RAW 和 HEIC 请先导出 JPEG 或 TIFF。

1. 把照片放进「照片」文件夹。
2. 双击「导入照片.command」，生成适合网页的展示图。
3. 双击「预览网站.command」，在本机浏览器中检查。
4. 确认后再发布；导入和预览不会自动推送到线上。

相册按单列向下滚动浏览，不显示照片标题。横图与竖图保留完整构图，点击可放大。相机原片保留在本机；公开的是压缩后的 WebP，已移除 EXIF（含 GPS）。

## 顶层目录

- **照片/**：唯一的照片入口；原片与可选说明只在本机保存。
- **网站/**：页面、样式、公开内容、处理工具和开发依赖。日常加照片不用改这里。
- **维护指南/**：照片说明、内容维护、发布步骤及内容来源。
- **导入照片.command**：双击处理照片。
- **预览网站.command**：双击打开本地预览，按 Control+C 停止。

网站内部的 `public/photos/` 是生成结果，请不要手工把原片放进去。缓存、测试报告和构建结果集中在 `网站/.local/`，不发布。

## 内容与技术维护

- 身份、经历、邮箱：`网站/src/data/profile.ts`
- 已批准公开的论文：`网站/src/data/publications.ts`
- 中英文文字：`网站/src/data/i18n.ts`
- 样式：`网站/src/styles/global.css`
- 自动生成的摄影清单：`网站/src/data/photos.json`，不要手改。

使用 Astro、TypeScript、静态页面和本地字体。只展示已明确批准的 QHSC 公开论文，不自动从简历或 ORCID 导入成果。原始简历没有放进网站。

开发与验证在「网站」目录运行：

```sh
cd /Users/rui/astro-zhurui.github.io/网站
npm ci
npm run photos
npm run check
npm run build
PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/qa/browsers" npm test
PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/qa/browsers" npm run test:photos
```

新设备先用 `PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/qa/browsers" npx playwright install chromium` 安装测试浏览器。测试中的合成照片会自动删除，不会进入你的作品集。

详细步骤见「维护指南」。
