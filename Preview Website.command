#!/bin/zsh
set -e
cd -- "${0:A:h}/website"
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  print '未找到 Node.js，请安装 Node.js 后重试。'
  read '?按回车关闭。'
  exit 1
fi
trap 'print "预览失败，请查看上方提示。"; read "?按回车关闭。"' ZERR
npm run photos
print '\n这是本机预览。按 Control+C 停止；不会自动发布。'
npm run dev -- --open
