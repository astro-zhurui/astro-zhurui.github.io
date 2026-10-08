# Rui Zhu · 朱睿

双语科研与摄影个人网站，目标地址 **https://astro-zhurui.github.io**。

采用 Astro 7、TypeScript、静态页面和本地字体。内容无需运行后端，浏览器只加载导航、语言偏好和照片查看所需的少量脚本。科研只展示用户明确指定的 QHSC 论文，不自动导入 CV、ORCID 或其他研究项目。

## 本机运行

需要 Node.js ≥22.12（推荐 Node.js 24 LTS）。

```sh
cd /Users/rui/astro-zhurui.github.io
npm ci
npm run dev
```

打开 http://localhost:4321 。英文为默认入口，中文在 `/zh/`。语言切换保留页面及锚点，并记住选择。

```sh
npm run check
npm run build
npm run preview
npm test
npm run test:photos
```

## 目录

```text
astro-zhurui.github.io/
├── src/
│   ├── data/               # 双语个人信息、批准公开的论文、摄影清单
│   ├── pages/              # 首页、科研、论文、摄影、关于、404、站点地图
│   ├── components/         # 首页、论文、QHSC 图
│   ├── layouts/            # 共用导航、语言切换、页脚和页面元数据
│   └── styles/             # 颜色、字体、响应式布局、动画
├── incoming/
│   ├── photos/             # 放精选照片原片与说明；不会进入 Git 或网站
│   └── cv/                 # 待审阅的本机简历；不会进入 Git 或网站
├── public/
│   ├── photos/             # 自动生成的网页展示图（将公开）
│   └── documents/          # 明确允许公开的文件（将公开）
├── scripts/                # 图片处理与构建检查
├── tests/                  # 双语、导航、布局等浏览器测试
├── docs/                   # 内容来源、维护及部署说明
├── .github/workflows/      # GitHub Pages 自动发布
├── work/                   # 测试截图、临时素材、测试记录；不发布
└── dist/                   # 构建生成的网站；不手工修改
```

## 加入摄影作品

把精选照片放进 `incoming/photos/`（JPEG、PNG、TIFF、WebP、AVIF），运行：

```sh
npm run photos
npm run build
```

脚本按照片逐张处理，每张生成长边不超过 480、960、1600、2800 像素的 WebP，不放大原图。保持方向与比例、转为 sRGB、移除 EXIF（含 GPS），原片不变。缩略图按屏幕宽度加载，大图仅点击时获取。RAW/HEIC 请先导出 JPEG 或 TIFF。

说明写入与原图同名的 JSON；可先不填写，此时标题使用文件名。例：`mountain.jpg` 与 `mountain.json`，格式见 `docs/photo-metadata.example.json`。文件名最好简短清楚，内部图片目录自动使用稳定 ID。

把 `published` 设为 `false` 或移出 `incoming/photos/` 后重新处理，即从当前图库删除。历史 Git 提交里的已发布图片仍可能存在。只把你决定公开的照片加入这里。

**此文件夹用于本机整理，不是网页上传界面。** 后续发布时只推送代码、内容清单和展示图。

## 内容修改

- 身份、经历、邮箱：`src/data/profile.ts`
- 按钮与导航文字：`src/data/i18n.ts`
- 已批准论文：`src/data/publications.ts`
- 照片：`incoming/photos/` → 运行 `npm run photos`
- 视觉：`src/styles/global.css`

原始简历含其他研究内容，因此当前不提供整份简历下载。若以后加入，先制作适合公开的 PDF，再放到 `public/documents/`，填写 `profile.ts` 的 `cv.en` / `cv.zh` 路径即可。不要将未审阅的原始简历直接放进 `public/`。

## 发布

仓库名必须为 `astro-zhurui.github.io`，默认分支为 `main`。在仓库 Settings → Pages 中选择 **GitHub Actions**。推送后部署工作流会做类型检查、构建与本地链接检查，然后发布。详细说明见 `docs/deployment.md`。

测试截图与记录存放在 `work/`。本机已安装的测试浏览器也在项目内；运行测试时：

```sh
PLAYWRIGHT_BROWSERS_PATH="$PWD/work/browsers" npm test
PLAYWRIGHT_BROWSERS_PATH="$PWD/work/browsers" npm run test:photos
```

在新设备上先运行 `PLAYWRIGHT_BROWSERS_PATH="$PWD/work/browsers" npx playwright install chromium`。照片测试使用独立临时目录，生成约 69 MB 的合成 TIFF，验证处理与相册交互后自动删除素材。
