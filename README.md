# Rui Zhu · 朱睿

主页：https://astro-zhurui.github.io/

主页默认使用英文，中文版本通过页面上的语言按钮切换。

## 加照片

**照片放在 `/Users/rui/astro-zhurui.github.io/photos/`。**

1. 复制精选照片到 `photos/`。
2. 双击 `Import Photos.command` 生成展示图。
3. 双击 `Preview Website.command` 查看本机效果。

导入和预览不会自动发布。支持 JPEG、PNG、TIFF、WebP、AVIF；RAW、HEIC 先导出为 JPEG 或 TIFF。不必填写标题。

摄影页是横向滚动画廊，带透视与缩放效果。手机左右滑动，电脑可拖动、滚轮或使用切换按钮；点击放大。横竖图保留构图。原片与说明 JSON 只在本机保存，网页使用移除 EXIF 后的高清 WebP。

## 目录

- **photos/**：照片原片与可选说明。唯一的照片入口。
- **website/**：Astro 页面、公开数据、样式和维护工具。
- **docs/**：照片操作、内容来源与发布说明。
- **Import Photos.command**：导入照片。
- **Preview Website.command**：本机预览，Control+C 停止。

`website/public/photos/` 是自动生成的展示图，不要放原片。缓存、构建和测试文件集中在 `website/.local/`，不发布。

## 改内容

- 身份、经历、邮箱：`website/src/data/profile.ts`
- 论文：`website/src/data/publications.json`
- 中英文文字：`website/src/data/i18n.ts`
- 页面样式：`website/src/styles/global.css`
- 画廊样式：`website/src/styles/gallery.css`
- 自动摄影清单：`website/src/data/photos.json`，不要手改。

论文按用户授权，从 ORCID 的期刊文章记录核对 DOI、作者、期刊和年份，去重后共 11 篇。首页展示 QHSC，完整列表按年份排列。原始简历和未发表研究不发布。

## 开发与验证

使用 Astro、TypeScript、静态页面和本地字体，Node.js ≥22.12。命令在 `website/` 运行：

```sh
cd /Users/rui/astro-zhurui.github.io/website
npm ci
npm run photos
npm run check
npm run build
PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/qa/browsers" npm test
PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/qa/browsers" npm run test:photos
```

新设备用 `PLAYWRIGHT_BROWSERS_PATH="$PWD/.local/qa/browsers" npx playwright install chromium` 安装测试浏览器。合成测试照片会自动清理，不进入作品集。

详细步骤见 `docs/`。
