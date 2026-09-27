# GooseBlog（Hexo 版）

原 GooseBlog 是 **Cloudflare Pages（SPA 静态壳）+ Pages Functions 透传 + Worker 查 Supabase** 的动态架构。
这一版把它改成了**纯静态 Hexo 站**：后端删除、UI 换成 `hexo-theme-redefine`，**资源一件不丢**。

| | 旧 | 新 |
| --- | --- | --- |
| 生成 | 运行时 `fetch('/api/posts')` | `hexo generate` 构建期 |
| 数据 | Supabase `posts` 表 | `source/_posts/*.md` |
| 主题 | 自写紫色玻璃风 SPA | hexo-theme-redefine 2.9.0 |
| 后端 | Worker + Pages Functions | 无 |
| 部署 | `wrangler pages deploy blog/` | `hexo g` → `wrangler pages deploy public` |
| 域名 | blog.goose.cc.cd | 不变 |

## 保留下来的东西

**资源（原文件直接搬，未重新生成）**

- `background.webp` / `background-1920.webp` / `background-1280.webp` —— 三档响应式壁纸
- `avatar.webp`、`avatar-256.webp`（favicon）、`logo.svg`、`og-default.jpg`
- `DingTalk JinBuTi.ttf` —— 钉钉进步体，Logo / 站点名 / Banner 标题沿用
- `vendor/prism/` —— 主题与全部 18 个语言包（代码高亮资产不丢）

**功能**

| 原功能 | 现在的落点 |
| --- | --- |
| 首页发文热力图 | `scripts/generate-heatmap.js` 构建期算好 → `source/js/goose/heatmap.js` 渲染，零请求 |
| 复制链接 / 生成海报悬浮球 | `source/js/goose/share.js`（海报仍走 html2canvas + quickchart 二维码） |
| 链接社交媒体卡片 | `source/js/goose/link-card.js`，去掉后端抓取，改为域名 + favicon + 链接标题 |
| 侧栏《流浪地球》台词打字机 | 81 句台词写进主题配置 `home_banner.subtitle.text`，零网络请求 |
| 公告横幅 | 主题配置 `home.sidebar.announcement` |
| 归档 / 标签 / 友链 / 项目 / 关于 | Hexo 原生归档标签 + `source/friends`、`source/projects`、`source/about` |
| 代码高亮、复制按钮、TOC、字数统计 | 主题自带（原 `code-copy.js` / `toc-ball.js` 由主题承接） |
| OG / Twitter 卡片 | 主题 `open_graph`，默认图 = `og-default.jpg` |
| 阅读进度条、站内搜索 | 主题自带（原站没有搜索，静态站补上了） |

## 目录结构

```
.
├── _config.yml                 站点配置（url / permalink / 分页 6 篇 / marked 对齐旧站）
├── package.json
├── scripts/                    ⚠️ Hexo 会把这里的文件当插件加载，只能放 .js
│   ├── generate-heatmap.js     构建期生成热力图数据
│   └── extra-assets.js         把 source/_headers 带进 public/（hexo 默认忽略 _ 开头）
├── tools/                      独立 CLI 脚本，不参与 hexo 构建
│   ├── export-from-goose.mjs   从旧站 Supabase 导出文章/友链/关于页
│   └── export-projects.mjs     从旧站导出项目页
├── source/
│   ├── _posts/                 文章（Markdown）
│   ├── _headers                Cloudflare Pages 缓存头
│   ├── _data/links.yml         友链（导出脚本生成，主题自动读取）
│   ├── about/  friends/  projects/  tags/  categories/
│   ├── images/                 ★ Goose 原站图片资源
│   ├── fonts/                  ★ 钉钉进步体
│   ├── vendor/prism/           ★ prism 与语言包
│   ├── css/goose-skin.css      Goose 组件皮肤（热力图/分享球/海报/链接卡片）
│   └── js/goose/               Goose 组件脚本
└── themes/redefine/            hexo-theme-redefine（源码内置，含 Goose 定制 _config.yml）
```

## 本地跑

```bash
npm install
npm run server       # http://localhost:4000
npm run build        # 产物在 public/
```

## 把旧文章搬进来

```bash
export SUPABASE_URL=https://xxxx.supabase.co
export SUPABASE_KEY=<service_role key>      # 用 service_role 才能绕过 RLS 读到草稿
npm run export:goose                        # posts → source/_posts，friends → source/_data/links.yml
npm run export:projects                     # gc_projects → source/projects/index.md
```

导出后：

- 友链：已写到 `source/_data/links.yml`，主题在 `generateBefore` 自动读取，**不用再手抄进主题配置**
- 公告：把 `source/_data/announcement.txt` 的内容填进 `home.sidebar.announcement`
- 文章正文是旧站 marked 渲染过的 HTML，Hexo 直接吃，不需要二次转换
- 然后 `npm run build` 重新生成即可

## 部署（Cloudflare Pages）

1. 仓库 Settings → Secrets and variables → Actions 配两个 Secret：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
2. Pages 项目 `gooseblog` 的 **Production branch** 设为 `production`
3. 推 `main` 或 `production` 分支 → `.github/workflows/deploy.yml` 自动 `npm ci` → `hexo g` → `wrangler pages deploy public`

推其他分支只出 Preview，自定义域名不会变。

> 旧的 `gooseblog-api` Worker 已不再需要，可以在 Cloudflare 后台停掉或删除。

## 已知取舍

- **评论**：原站就没接评论系统，主题配置里 `comment.enable: false`。要开填 waline / twikoo / giscus 任一即可。
- **链接卡片**：原站靠 `/api/link-preview` 实时抓标题和缩略图，静态站没有后端，降级为「域名 + favicon + 链接文字」。想要原效果可在 Markdown 里直接贴卡片 HTML。
- **写文章**：原来的 `/admin` 后台（Supabase 写库）随后端一起删除，改为本地写 Markdown 后 `git push`。
- **紫色玻璃风**：按需求弃用，视觉走 Redefine 原味；背景图、Logo、字体仍是 Goose 的。
