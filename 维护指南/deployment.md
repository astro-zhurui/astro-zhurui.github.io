# 更新与发布

网站已经部署到 https://astro-zhurui.github.io/ ，GitHub 仓库为 https://github.com/astro-zhurui/astro-zhurui.github.io 。

## 本机确认

添加照片后双击「导入照片.command」，再双击「预览网站.command」。这两步只在本机处理，不发布。

需要命令行时：

```sh
cd /Users/rui/astro-zhurui.github.io/网站
npm run photos
npm run check
npm run build
```

## 发布

在项目根目录提交与推送：

```sh
cd /Users/rui/astro-zhurui.github.io
git add 网站 维护指南 README.md 照片/README.md .github .gitignore *.command
git commit -m "Update website"
git push
```

GitHub Actions 会从「网站」子目录检查、构建，再发布 `网站/.local/build/`。在仓库 Actions 中等待 `Deploy personal website` 成功后查看线上效果。

原片、说明 JSON、简历、开发依赖、缓存、测试文件不会提交。日常依赖安装在「网站」目录使用 `npm ci`。

子目录构建与发布按 Astro 官方指南配置：https://docs.astro.build/en/guides/deploy/github/ ，Action 参数说明：https://github.com/withastro/action 。
