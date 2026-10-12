# Website icon

用户于 2026-10-12 选择 B「RZ Monogram」。Rui Zhu 的字母标使用深灰底与雾白图形，所有字母均为 SVG 路径，不依赖字体。

- 主图标：website/public/icons/rz.svg。
- PNG 兼容图标：website/public/icons/rz-32.png（32×32）。
- 手机主屏幕图标：website/public/icons/apple-touch-rz.png（180×180，不透明）。
- 浏览器默认路径：website/public/favicon.ico，含 16、32、48 像素版本。
- 旧地址 website/public/favicon.svg 同步保留 RZ，供历史页面使用。

PNG 和 ICO 均由同一 SVG 导出。双语页面共用 layouts/Layout.astro 中的图标设置；新链接使用 /icons/rz.svg 等地址，避免沿用旧图标的缓存。
