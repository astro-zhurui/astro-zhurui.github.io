# 照片放在这个文件夹

直接复制精选照片到这里，然后回到上一级，双击「导入照片.command」。

- 支持 JPEG、PNG、TIFF、WebP、AVIF；RAW、HEIC 先导出。
- 原片不会上传，网页只使用自动生成的展示图。
- 不用写标题，网页不显示标题或说明文字。
- 默认按文件名排序。可用 `01-xxx.jpg`、`02-xxx.jpg` 安排顺序。
- 不需要为每张照片创建说明文件。

若要改变顺序、填写无障碍描述、选择首页照片，可以添加同名 JSON。例如 `forest.jpg` 对应 `forest.json`：

```json
{
  "order": 10,
  "description": {"zh": "晨光中的森林", "en": "A forest in the morning light"},
  "homepage": false,
  "published": true
}
```

`order` 越小越靠前；`description` 供读屏软件使用，不会成为照片标题；`homepage` 最多选一张。当前 UFO-1.PNG 已设为首页个人照片。

只放决定公开的作品。移出照片或设 `published: false` 后重新导入，会移除当前相册里的展示图。
