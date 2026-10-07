---
title: 'GooseBlog为什么换成Hexo了'
date: '2026-10-07 11:42:00'
updated: '2026-10-07 11:42:00'
tags:
  - 'GooseBlog'
categories:
  - '随笔'
cover: 'https://img.goose.cc.cd/i/72cb24692746402d116a4be14511065f.webp'
og_image: 'https://img.goose.cc.cd/i/72cb24692746402d116a4be14511065f.webp'
excerpt: '有后端的博客和纯前端的差别'
description: '有后端的博客和纯前端的差别'
slug: sb-to-hexo
---

鹅键盘上的字磨没了，所以全靠盲打---有错别字别叫

## Hexo是什么

据我的了解，就是超大的静态页面

啥都有的那种

社区还有丰富的主题（就比如鹅用的这个）就挺好看的（我是这么觉得）

## 为啥我放弃SUPABASE和cloudflare打组合了

虽然上一个博客是手搓的，但是真的、真的很丑

~~我以前写网页不这样啊~~

> 我真的很怀念当年死抠一个单文件HTML的时光，真好

不知道各位有没有发现：我做出来的网站不是有个导航栏就是有个侧边栏

然后fa图标

这可能与我的经历有关吧：

我的网站从来不允许出现emoji，可能大家觉得emoji还挺好看的，但是我是苹果起家的，苹果美工的审美。。。。

我做网站总考虑竖屏、横屏、正方形屏幕？？？各种奇葩尺寸？？

。。。。

总之那个博客我比较失望

> 不知道谁看源代码看出来没，旧博客其实是GooseAI改造出来的

手搓博客太累了

http://sojizh.gt.tc/post.php?file=2026100501.md
http://sojizh.gt.tc/post.php?file=2026100401.md

松间照说的其实挺对的

但是实在太累了

我维护个GooseHost都要吐血Σ_(꒪ཀ꒪」∠)，哪有心情维护博客

知道我看见Hexo，研究了两下，行了，GitHubactions走起

## 旧博客很卡？

我用的时候就是有点卡

走SUPABASE在进cloudflare，最后到客户端，虽然架构和GooseHost一样，但是就是卡。。。

而Hexo你构建好就行了，不需要额外的网络请求（挺舒服）

：（

## 还有就是图床

原来的图床崩了，所以干脆一起弄了。。。
