# 照片与内容维护

## 摄影

入口是顶层 `photos/`。放好照片后运行 `Import Photos.command`，再用 `Preview Website.command` 查看效果。这两步只操作本机，不发布。

逐张生成长边不超过 480、960、1600、2800 像素的 WebP，不放大；校正方向、保留构图、转为 sRGB、移除 EXIF。图像处理线程最多两个，缓存受限，适合本机大照片。

画廊沿水平方向滚动，中心照片正面显示，旁侧照片通过透视和缩放形成转盘效果。支持触屏滑动、鼠标拖动、滚轮、方向键和按钮，点击可查看高清大图。系统开启减少动态效果时，关闭 3D 变换与动画。照片不显示标题。

同名 JSON 可设置 `order`、`description`、`homepage`、`published`。`description` 是无障碍描述；`homepage: true` 最多一张；`published: false` 不展示。示例见 `photo-metadata.example.json`。

## 程序与内容

`website/src/data` 保存个人信息、双语文字、论文与摄影清单。`pages` 是页面，`components` 是共用内容，`layouts` 是导航和页脚，`styles` 是视觉。

`website/public/photos/` 与 `website/src/data/photos.json` 自动生成。`website/.local/build/` 是构建结果；`.local/qa/` 是测试、截图与核对资料；`.local/cache/` 是缓存，这些不加入 Git。

论文保存在 `website/src/data/publications.json`，每条含 DOI、作者、引用等字段。首页明确选择 `id: qhsc`，不依赖列表顺序。完整列表按年份排列，作者名单突出 Rui Zhu，每篇保留期刊文章链接；有公开预印本或星表时提供对应链接。

照片原片不进入 Git；展示图会公开。移除展示图不抹去历史提交，请只导入已经决定公开的作品。
