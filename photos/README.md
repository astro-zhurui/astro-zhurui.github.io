# Photos

精选照片直接放在这个文件夹，然后回到上一级，双击 `Import Photos.command`。无需标题。

支持 JPEG、PNG、TIFF、WebP、AVIF；RAW、HEIC 先导出。网页只使用生成的 WebP，原片和说明文件不会上传。

默认按文件名排序。需要指定顺序、无障碍描述或首页照片时，可添加同名 JSON，例如 `forest.jpg` 与 `forest.json`：

```json
{
  "order": 10,
  "description": {"zh": "晨光中的森林", "en": "A forest in the morning light"},
  "homepage": false,
  "published": true
}
```

`order` 越小越靠前；`description` 供读屏软件使用，不显示为标题；`homepage` 最多选一张。当前 UFO-1.PNG 作为首页个人照片，排在画廊第一张。

只放决定公开的作品。移出照片或设 `published: false` 后重新导入，会移除当前相册里的展示图。
