#!/bin/zsh
set -e
cd -- "${0:A:h}/网站"
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  print '未找到 Node.js，请安装 Node.js 后重试。'
  read '?按回车关闭。'
  exit 1
fi
trap 'print "处理失败，请查看上方提示。"; read "?按回车关闭。"' ZERR
npm run photos
npm run build
print '\n照片已导入。双击「预览网站.command」检查效果；尚未发布到线上。'
read '?按回车关闭。'
