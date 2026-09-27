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
- `avatar.webp`（导航栏 Logo + 侧栏头像）、`avatar-256.webp`（favicon）、`og-default.jpg`
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
| **评论（新增）** | giscus → GitHub Discussions，配置见下文 |

导航栏与首页侧栏统一用英文（HOME / ARCHIVES / TAGS / CATEGORIES / PROJECTS / FRIENDS / ABOUT），
文字写在 `navbar.links[*].text` 和 `home.sidebar.links[*].text`，想改回中文直接改 `text`。

## 目录结构

```
.
├── _config.yml                 站点配置（url / permalink / 分页 6 篇 / marked 对齐旧站）
├── package.json
├── scripts/                    ⚠️ Hexo 会把这里的文件当插件加载，只能放 .js
│   ├── generate-heatmap.js     构建期生成热力图数据
│   └── extra-assets.js         把 source/_headers 带进 public/（hexo 默认忽略 _ 开头）
├── tools/                      独立 CLI 脚本，不参与 hexo 构建
│   ├── import-from-csv.mjs     从自备 CSV 恢复文章/友链/关于页/公告（含分类映射）
│   ├── export-from-goose.mjs   从旧站 Supabase 导出文章/友链/关于页
│   └── export-projects.mjs     从旧站导出项目页
├── source/
│   ├── _posts/                 ★ 15 篇旧文章（Markdown，只有 drive 是 HTML）
│   ├── _headers                Cloudflare Pages 缓存头
│   ├── _data/links.yml         友链（导出脚本生成，主题自动读取）
│   ├── about/  friends/  projects/  tags/  categories/
│   ├── images/                 ★ Goose 原站图片资源
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

## 内容迁移

旧站数据已经导入完毕：**15 篇文章 + 5 条友链 + 关于页 + 公告**。

两种方式，任选：

```bash
# 方式一：从导出的 CSV 恢复（CSV 不入库，按需自备）
npm run import:csv -- --dir=/path/to/csv

# 方式二：直接从线上 Supabase 拉
export SUPABASE_URL=https://xxxx.supabase.co
export SUPABASE_KEY=<service_role key>      # 用 service_role 才能绕过 RLS 读到草稿
npm run export:goose                        # posts → source/_posts，friends → source/_data/links.yml
npm run export:projects                     # gc_projects → source/projects/index.md
```

导入要点：

- **正文**：优先用 `markdown` 原文字段（以后还能继续编辑），只有 `drive` 这篇没存原文，退回用渲染后的 HTML
- **时间**：`created_at` 是 UTC，脚本统一转成东八区再写 front-matter，否则文章时间会比原站早 8 小时
- **友链**：写到 `source/_data/links.yml`，主题在 `generateBefore` 自动读取，**不用手抄进主题配置**
- **分类**：原站 `posts` 表没有 category 字段，15 篇文章的分类是**人工补的**（见下表），写在 `tools/import-from-csv.mjs` 的 `CATEGORY_MAP` 里，重跑导入会自动带上
- 然后 `npm run build` 重新生成即可

### 分类方案

tag 记品牌与类型（GooseHost / 文档 / 教程…），分类记内容域，两者互补。只做单层，不搞层级（避免嵌套 URL）。

| 分类 | 篇数 | 文章 |
| --- | --- | --- |
| 项目 | 7 | GooseHost 教程 / 自托管指南 / CLI 文档、GooseHyperGlass 问题汇总 / 2.0 日志 / 难绷事件、GooseAI 为什么消失 |
| 折腾 | 3 | 驾考模拟器、TimeFreeze、Kimi 发现只读面板 |
| 随笔 | 2 | 九一八事变 95 周年、为什么 Github 正在变差 |
| 教程 | 2 | Markdown 入门、怎么查网站有没有被收录 |
| 建站 | 1 | GooseBlog 升级日志 2026-07-27 |

标签共 9 个：文档(6) / GooseHyperGlass(3) / GooseHost(3) / 教程(2) / 历史 / html小游戏 / GitHub / GooseAI / GooseBlog。
## 部署（Cloudflare Pages）

1. 仓库 Settings → Secrets and variables → Actions 配两个 Secret：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
2. Pages 项目 `gooseblog` 的 **Production branch** 设为 `production`
3. 推 `main` 或 `production` 分支 → `.github/workflows/deploy.yml` 自动 `npm ci` → `hexo g` → `wrangler pages deploy public`

推其他分支只出 Preview，自定义域名不会变。

> 旧的 `gooseblog-api` Worker 已不再需要，可以在 Cloudflare 后台停掉或删除。

## 主题文件的定制点

改了 Redefine 的 3 个 ejs（升级主题时需要重新打上），目的都是让文字可由配置驱动、不依赖语言文件：

| 文件 | 改动 |
| --- | --- |
| `layout/components/header/navbar.ejs` | 导航项文字优先取 `theme.navbar.links[*].text` |
| `layout/pages/home/home-sidebar.ejs` | 侧栏链接文字优先取 `theme.home.sidebar.links[*].text` |
| `layout/components/sidebar/statistics.ejs` | 侧栏计数标签取 `theme.home.sidebar.statistics_labels` |

## 已知取舍

- **评论**：原站本来就没有评论功能。这次新增 giscus，评论存进 `Minecraftgoose/gooseblog` 的 GitHub Discussions，零后端、免费、支持 Reactions。**已启用**（`comment.enable: true`），分类 = Announcements（只有仓库维护者和 giscus bot 能开帖，防垃圾）。
- **链接卡片**：原站靠 `/api/link-preview` 实时抓标题和缩略图，静态站没有后端，降级为「域名 + favicon + 链接文字」。想要原效果可在 Markdown 里直接贴卡片 HTML。
- **写文章**：原来的 `/admin` 后台（Supabase 写库）随后端一起删除，改为本地写 Markdown 后 `git push`。
- **紫色玻璃风 / 钉钉进步体**：按需求弃用。视觉与字体全走 Redefine 原味（Chillax / Geist），只有壁纸、头像、OG 图还是 Goose 的。
