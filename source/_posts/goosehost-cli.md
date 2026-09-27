---
title: 'GooseHost CLI 使用文档'
date: '2026-07-19 21:31:09'
updated: '2026-07-27 13:19:47'
tags:
  - GooseHost
  - '文档'
categories:
  - '项目'
cover: 'https://img.goose.cc.cd/i/d712485cd56be9505fa0b146697885f3.png'
og_image: 'https://img.goose.cc.cd/i/d712485cd56be9505fa0b146697885f3.png'
excerpt: 'GooseHost 命令行工具完整使用指南——部署、管理、下载、更新，全在终端搞定。'
description: 'GooseHost 命令行工具完整使用指南——部署、管理、下载、更新，全在终端搞定。'
slug: goosehost-cli
---

# GooseHost CLI 是一个在终端里管理 GooseHost 静态网站的命令行工具，不需要开浏览器。

---

## 安装

```bash
pip install goosehost-cli
```

安装后，在终端输入 `goosehost` 就可以用了。

---

## 快速开始

### 1. 登录（只做一次）

```bash
goosehost login --email 你的邮箱 --password 你的密码
```

登录后凭证保存在本地，下次不用再输入。

### 2. 部署一个 HTML 文件

```bash
goosehost deploy ./index.html
```

`./index.html` 表示当前目录下的 `index.html` 文件。
工具会自动用文件名作为网站名称，并在终端显示访问地址。

### 3. 查看所有网站

```bash
goosehost list
```

---

## 完整命令列表

### 登录与账号

| 命令 | 说明 |
|------|------|
| `goosehost login --email xxx --password xxx` | 登录并保存凭证 |
| `goosehost logout` | 退出登录（清除本地凭证） |
| `goosehost register --email xxx --password xxx` | 注册新账号 |

### 网站管理

| 命令 | 说明 |
|------|------|
| `goosehost list` | 列出你的所有网站 |
| `goosehost create --slug 名称 --type html --file 文件路径` | 从文件创建网站 |
| `goosehost create --slug 名称 --type html --content "<h1>Hi</h1>"` | 直接从文字创建网站 |
| `goosehost get --slug 网站名称` | 查看 html 内容 |
| `goosehost get --slug md/网站名称` | 查看 markdown 内容 |
| `goosehost get --slug 网站名称 --output 保存路径` | 下载 html 到本地文件 |
| `goosehost get --slug md/网站名称 --output 保存路径` | 下载 markdown 到本地文件 |
| `goosehost update --slug 网站名称 --file 文件路径` | 用本地 html 文件更新 |
| `goosehost update --slug md/网站名称 --file 文件路径` | 用本地 markdown 文件更新 |
| `goosehost update --slug 网站名称 --content "新内容"` | 直接更新内容 |
| `goosehost delete --slug 网站名称 --force` | 删除 html 网站 |
| `goosehost delete --slug md/网站名称 --force` | 删除 markdown 网站 |

### 快捷部署

| 命令 | 说明 |
|------|------|
| `goosehost deploy ./文件.html` | 部署 HTML 文件（自动起名） |
| `goosehost deploy ./文件.md` | 部署 Markdown 文件（自动起名） |
| `goosehost deploy ./文件.html --slug 自定义名称` | 部署并指定网站名称 |

### 其他

| 命令 | 说明 |
|------|------|
| `goosehost config` | 查看当前登录状态和配置 |
| `goosehost --help` | 查看所有命令的帮助 |

---

## 文件路径怎么写

在命令中，所有 `--file` 和 `--output` 后面的路径都支持两种写法：

- **相对路径**：相对于当前终端所在的目录
  例如：`./index.html`、`backup.html`、`../my-site/index.html`

- **绝对路径**：从磁盘根目录开始的完整路径
  例如：`D:/my-site/index.html`、`C:\Users\Administrator\backup.html`

如果不确定当前终端在哪个目录，可以输入：

- Windows：`cd`
- Mac/Linux：`pwd`

---

## 常用操作示例

### 部署当前文件夹里的首页

```bash
goosehost deploy ./index.html
```

输出示例：

```
部署成功！
  访问地址: https://page.goose.cc.cd/s/my-site
  网站名称: my-site
```

### 直接用文字创建一个 Markdown 网站

```bash
goosehost create --slug my-doc --type md --content "# 我的文档\n\n这是内容"
```

### 把线上网站下载到本地修改

下载到当前目录：

```bash
goosehost get --slug my-site --output backup.html
```

下载后，当前目录会多出一个 `backup.html` 文件。
如果你想保存到其他文件夹，可以写完整路径：

```bash
goosehost get --slug my-site --output D:/my-backup/index.html
```

修改后用本地文件更新：

```bash
goosehost update --slug my-site --file backup.html
```

如果文件在其他路径，就填完整路径：

```bash
goosehost update --slug my-site --file D:/my-backup/index.html
```

### 查看网站内容（不保存，只显示）

```bash
goosehost get --slug my-site
```

终端会直接打印出网站的全部代码。

### 删除一个网站

```bash
goosehost delete --slug my-site --force
```

---

## 卸载

```bash
pip uninstall goosehost-cli
```

---

## 常见问题

### 登录后每次都要重新登录吗？

不用。凭证保存在本地，下次打开终端会自动生效。

### 安装后输入 `goosehost` 提示找不到命令？

重启终端。如果还不行，检查 Python 的 Scripts 目录是否在系统 PATH 里。

### 为什么删除网站必须加 `--force`？

防止手滑误删。确认你真的要删，再加 `--force`。

---

## 更多帮助

查看所有命令：

```bash
goosehost --help
```

查看某个命令的详细用法：

```bash
goosehost create --help
```

---

**Enjoy your static sites!**
