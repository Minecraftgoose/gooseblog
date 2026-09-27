---
title: 'Kimi发现只读面板'
date: '2026-09-24 14:58:41'
updated: '2026-09-24 14:58:41'
tags:
  - '文档'
categories:
  - '折腾'
cover: 'https://img.goose.cc.cd/i/3a9a71c7de17664c02a819acfea49b85.png'
og_image: 'https://img.goose.cc.cd/i/3a9a71c7de17664c02a819acfea49b85.png'
excerpt: '在网页版上浏览 Kimi 社区内容'
description: '在网页版上浏览 Kimi 社区内容'
slug: kimi-web
---

# Kimi发现只读面板：在网页版上浏览 Kimi 社区内容

> 作者：**Ranivye** · 开源协议：MIT · 仓库：https://gitee.com/ranivye/kimi.reading

Kimi 的发现页是 APP 端的一大特色功能，但网页版用户一直无法方便地浏览社区内容。**Kimi发现只读面板**（Kimi Community Read-Only Panel）是一个用户脚本（UserScript），它在 Kimi 网页版上提供一个浮动面板，用来浏览社区信息流、评论、相似动态、用户搜索和帖子详情——全部只读，安全透明。

## 特性

- **信息流**：浏览社区推荐动态
- **帖子详情**：AI 输出文本 + HTML 预览
- **评论列表**：含子评论、BOT / AI 标签
- **相似动态**：按 momentId 查相似帖子
- **用户搜索**：按昵称搜索用户
- **交互**：点标题看详情、点评论数看评论、点作者看主页
- **原始 JSON**：每条数据可展开查看原始响应

## 安装

### 前置条件

你的浏览器需要支持用户脚本，以下任选其一：

| 方式 | 说明 |
| --- | --- |
| 浏览器扩展 | Tampermonkey、Violentmonkey、Userscripts 等 |
| 浏览器自带 | 部分浏览器内置用户脚本管理 |

本文档不绑定具体扩展，请按你使用的浏览器选择对应方式。

### 安装脚本

**方式一：下载安装**

下载本仓库中的脚本文件，用户脚本管理器会自动拦截并弹出安装界面，点「安装」即可。

**方式二：手动新建**

1. 打开你的用户脚本管理器
2. 新建脚本
3. 把本仓库脚本文件的内容整段粘贴进去
4. 保存并启用

### 启用

安装后打开 https://www.kimi.com 并登录，右下角会出现浮动面板。

## 使用

| 标签 | 参数 | 说明 |
| --- | --- | --- |
| 信息流 | 可留空 | 浏览社区推荐 |
| 相似动态 | momentId | 查看与某帖子相似的动态 |
| 评论 | momentId | 查看某帖子的评论 |
| 用户搜索 | 昵称关键词 | 搜索用户 |

## 登录态说明

- 脚本使用**使用者自己浏览器**中的 `access_token`
- 请求直接发回 `www.kimi.com`，不经过任何第三方服务器
- 脚本**不存储、不记录、不外发** token
- 所有请求通过 `assertOfficialUrl()` 校验，只允许发往 `https://www.kimi.com/apiv2/`

## 安全说明

- **只读**：不发送任何写操作（不发帖、不评论、不点赞、不删除）
- **iframe 隔离**：AI 生成的 HTML 在 `sandbox="allow-scripts"` 的 iframe 中渲染，已移除 `allow-same-origin`，无法访问父页面同源资源
- **文本转义**：所有用户可控文本（评论、作者名、简介、话题名等）统一走 `esc()` 转义
- **类型守卫**：`esc()` 只接受 string / number / boolean，对象一律返回空串
- **referrer 保护**：图片与 iframe 均设置 `referrerpolicy="no-referrer"`

## 常见问题

**Q：加载不出数据？**
A：请先在 https://www.kimi.com 登录。如果已登录仍加载不出，大概率是 Kimi 改了登录态存储字段或接口，等更新。

**Q：自动更新不生效？**
A：部分代码托管平台的 raw 链接会校验 Referer，自动更新可能拿不到。可手动重新下载脚本文件安装。

**Q：点开帖子详情，HTML 预览空白？**
A：部分 HTML 依赖外部资源或同源 API，在 sandbox iframe 中可能被限制。这是安全隔离的代价，不是 bug。

**Q：会封号吗？**
A：脚本只调用只读接口，频率与手动浏览相当。但任何第三方工具都存在风险，请自行判断。

## 免责声明

本工具为非官方脚本，与 Moonshot AI 无关。

仅调用公开的只读接口，不发送任何写操作。登录态使用使用者自己浏览器中的 `access_token`，请求直接发回 `www.kimi.com`，不经过任何第三方服务器。

使用本脚本产生的任何后果由使用者自行承担。

## License

MIT License

Copyright (c) 2026 **Ranivye**

---

**项目地址**：https://gitee.com/ranivye/kimi.reading

**原作者**：Ranivye（Gitee：[@ranivye](https://gitee.com/ranivye)）
