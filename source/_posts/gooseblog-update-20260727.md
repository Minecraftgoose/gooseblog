---
title: 'GooseBlog 升级日志 2026-07-27'
date: '2026-07-27 16:17:21'
updated: '2026-07-27 16:29:45'
tags:
  - GooseBlog
categories:
  - '建站'
cover: 'https://www.bing.com/th?id=OHR.AlphornBavaria_ZH-CN5896237112_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp'
og_image: 'https://www.bing.com/th?id=OHR.AlphornBavaria_ZH-CN5896237112_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp'
excerpt: '一次性十几个功能的大更新。'
description: '一次性十几个功能的大更新。'
slug: gooseblog-update-20260727
---

一次性十几个功能的更新，外加一堆 bug 修复。按模块记录。

## CSS 模块化

之前所有样式挤在 `index.html` 的 `<style>` 里 1170+ 行。拆成了 5 个独立 CSS 文件：`core.css`（变量/重置）、`layout.css`（侧栏/顶栏/响应式）、`article.css`（文章列表/详情/归档）、`components.css`（目录球/调色板/链接卡片）、`widgets.css`（图片查看器/分享球/开屏动画）。模块之间职责分离，改样式不用翻山越岭。

## 代码高亮（Prism）

引入 Prism.js，`prism-tomorrow` 暗色主题。bootcdn 加载，自动识别 language 类名，路由切换后自动重新着色。支持 autoloader 按需加载语言包。

## 国际化（i18n）

双向语言支持。`src/js/i18n-core.js` 同步加载，暴露全局 `window.__()` 给所有非模块脚本。侧栏导航、顶栏标题、分享球、代码复制、Toast、右键菜单、热力图、目录球、项目/关于/归档/友链页面——全部硬编码中文替换为 i18n key 调用。侧栏底部有语言切换（后移到顶栏月亮按钮旁），localStorage 持久化。

切语言时同步更新视图模式标签条、AI 屏蔽按钮、标签展开/收起——不需要页面刷新。

## 开屏动画

首次访问首页时，全屏深色遮罩 + "GooseBlog" SVG 描边画出（2.6s 由短到长）+ 底部 loader 条。后台组件正常加载，内容就绪后遮罩淡出，文章卡片以弹簧缓动（cubic-bezier 0.34 1.56 0.64 1）从小到大入场。遮罩最短展示 2.8s，入场提前 50ms 与淡出重叠。只播放一次，内部导航不重复。

## 调色板

侧栏底部小按钮，14 个预设色 + 自定义取色器。选了蓝全站变蓝，选了绿全绿。所有品牌色都走 CSS 变量，之前硬编码的 `#6d28d9` / `#7c3aed` 全部清空。localStorage 存用户偏好。

## 友链板块

侧栏新增"友链"导航，`/friends` 页网格卡片展示（头像、名称、描述）。后台管理加了标签切换（文章 / 友链），可以直接加/删友链。后端 Worker 加了 `POST/DELETE /api/admin/friends` 端点。

## 图片查看器

文章图片点击弹出全屏遮罩大图，点图片/空白/叉号或 ESC 关闭。

## 悬浮目录

文章页右下角圆球，展开 h2/h3 标题大纲，点击平滑跳转。

## 分享海报

右下角分享悬浮球，含"复制链接"和"生成海报"。海报方案：html2canvas + QuickChart 二维码，一次下载 PNG。踩坑记录：Canvas 硬画 CORS 堵死 → SVG foreignObject 自闭合爆炸 → html2canvas proxy 最终方案。

## 链接卡片

文章里裸链接自动拉 OG 标签渲染预览卡片，后端 `/api/link-preview` 端点抓取 title/description/image。

## 代码块复制

代码块鼠标悬停右上角出现复制按钮，点一下复制整块代码，按钮变绿反馈 2s。

## 前后篇导航

文章底部显示上一篇/下一篇标题和摘要，点击跳转。

## 文章进步体

正文也从系统字体换成了 DingTalk JinBuTi，全站字体统一。

## 品牌色硬编码清零

扫描全站 CSS 和 JS，所有 `#8b5cf6`、`#6d28d9`、`#7c3aed`、`#4c1d95` 实例清干净——只保留 `:root` 里的初始变量定义。color-picker 新增 `--brand-rgb` 变量同行更新。选橘色不会再露出紫色残影。

## 修复清单

- 热力图 hover transform scale 导致鼠标指针闪烁 → 关掉
- 前进后退内部栈和浏览器历史不同步 → 改原生 history.back/forward
- Safari 工具栏遮挡 → 100dvh 反复测试后定稿
- 广告拦截器干掉按钮 → 类名去广告关键词
- Worker 部署需手动激活（铁律 1）+ wrangler hash 缓存跳过（铁律 5）
- 友链点击后侧栏高亮停留首页 → 补 NAV_MAP
- 英文模式下落叶飘落/点击特效/调色板/屏蔽AI → 加 data-i18n
- 两处中文乱码：CSS 注释 + i18n 字典
- 两个悬浮球大小不统一 → 统一 44x44 / 40x40
- 图片点击不关闭 → 加 img 到关闭判定
- 封面图底部渐变和标题融合、竖屏适配
- 语言切换后分享球文字不更新 → 加 langchange 监听
- 海报下载 html2canvas CORS + foreignObject + proxy 曲折选择
- 导航高亮（友链、admin）

## 总结

博客从纯文字阅读器变成了一个勉强能用的多功能页面。功能代码量不大，踩坑密度极高。P.S. 海报下载功能让一个 CV 工程师体验了从 Canvas 到 foreignObject 到 html2canvas 再到 proxy 的完整前端"进化树"。
> 由workbuddy编写
