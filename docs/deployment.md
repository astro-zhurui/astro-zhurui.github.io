# GitHub Pages 部署

本机项目：`/Users/rui/astro-zhurui.github.io`。

1. 在你自己的 GitHub 账号下创建公开仓库 `astro-zhurui.github.io`。不要给空仓库添加 README，避免初始提交冲突。
2. 登录本机 GitHub 命令行：`gh auth login`。
3. 在项目目录运行：

```sh
git remote add origin https://github.com/astro-zhurui/astro-zhurui.github.io.git
git push -u origin main
```

4. 在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。
5. 在 Actions 检查 `Deploy personal website` 工作流。若首次推送发生在 Pages 启用之前，启用后手动运行工作流。
6. 等部署成功后访问 https://astro-zhurui.github.io ，并检查中文页面与手机显示。

后续更新：修改本机内容，运行 `npm run check && npm run build`，再提交推送。摄影先运行 `npm run photos`。

依赖版本固定在 `package-lock.json`，日常用 `npm ci` 复现。原片、原始简历、测试截图、node_modules、dist 被 `.gitignore` 排除。Pages 发布只读取构建结果 `dist/`。

官方说明：https://docs.astro.build/en/guides/deploy/github/
