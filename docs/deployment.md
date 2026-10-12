# 更新与发布

主页：https://astro-zhurui.github.io/
仓库：https://github.com/astro-zhurui/astro-zhurui.github.io

## 本机确认

添加照片后，双击 `Import Photos.command` 和 `Preview Website.command`。也可使用：

```sh
cd /Users/rui/astro-zhurui.github.io/website
npm run photos
npm run check
npm run build
```

## 发布

在项目根目录提交与推送：

```sh
cd /Users/rui/astro-zhurui.github.io
git add website docs README.md photos/README.md .github .gitignore *.command
git commit -m "Update website"
git push
```

GitHub Actions 从 `website/` 检查、构建，再发布 `website/.local/build/`。等待 `Deploy personal website` 成功后检查线上页面。

原片、说明 JSON、简历、依赖、缓存和测试文件不提交。新设备在 `website/` 使用 `npm ci` 安装依赖。

配置依据 Astro 官方指南：https://docs.astro.build/en/guides/deploy/github/ ，Action 参数：https://github.com/withastro/action 。
