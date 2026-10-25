---
title: 'GooseHost CLI 使用文档'
date: '2026-07-19 21:31:09'
updated: '2026-10-25 14:47:27'
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

<p style="text-align: center;"><img src="https://host.goose.cc.cd/logo.svg" alt="GooseHost Logo" style="height:auto; width:auto;"></p>

<h1 style="text-align: center;">CLI文档</h1>

在终端里管理 GooseHost 的静态网站，不需要开浏览器。

---

## 安装

从 GitHub Releases 下载对应平台的二进制：

**Windows（64 位）**
```
https://github.com/Minecraftgoose/GooseHost/releases/latest/download/goosehost-windows-amd64.exe
```

**Windows（32 位 / 老系统）**
```
https://github.com/Minecraftgoose/GooseHost/releases/latest/download/goosehost-windows-386.exe
```

**Linux（amd64）**
```
https://github.com/Minecraftgoose/GooseHost/releases/latest/download/goosehost-linux-amd64
```

**macOS（Apple 芯片 / Intel）**
```
https://github.com/Minecraftgoose/GooseHost/releases/latest/download/goosehost-darwin-arm64
https://github.com/Minecraftgoose/GooseHost/releases/latest/download/goosehost-darwin-amd64
```

**放在 PATH 里，方便全局调用**

Windows加进系统环境变量 `Path`。Linux/macOS：

```bash
chmod +x goosehost-*
sudo mv goosehost-* /usr/local/bin/goosehost
```

安装后，在终端输入 `goosehost` 就可以用了。

* * *

## 快速开始

### 1. 获取 API 密钥

浏览器打开 [GooseHost 控制台](https://host.goose.cc.cd/)，登录后进入 **账户 → API 密钥 → 新建密钥**。

密钥格式是 `gooseh-` 开头的一串字符，**创建时明文只显示一次，请立即保存**。

### 2. 登录

```bash
goosehost login --key gooseh-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

密钥会保存在本地，之后不用再输入。

### 3. 部署一个文件

```bash
goosehost deploy ./index.html
```

工具会自动用文件名作为站点名称，并在终端显示访问地址。

### 4. 查看所有站点

```bash
goosehost list
```

* * *

## 完整命令列表

### 认证

命令 | 说明
--- | ---
`goosehost login --key <gooseh-xxx>` | 保存 API 密钥到本地并校验
`goosehost me` | 查看当前账号信息（ID、邮箱、昵称、认证方式）
`goosehost logout` | 清除本地凭证

> 注册账号、修改昵称、创建/吊销 API 密钥等账号级操作**只能在网页端进行**，CLI 不提供。

### 站点管理

命令 | 说明
--- | ---
`goosehost list` | 列出你的所有站点
`goosehost create --slug <名称> --type html --file <文件>` | 从文件创建 HTML 站点
`goosehost create --slug <名称> --type md --content "<内容>"` | 从文字创建 Markdown 站点
`goosehost create --slug <名称> --type project --file <目录>` | 从目录创建多文件站点
`goosehost get --slug <名称>` | 查看站点内容（直接打印）
`goosehost get --slug <名称> --output <路径>` | 下载内容到本地文件
`goosehost update --slug <名称> --file <文件>` | 用本地文件更新
`goosehost update --slug <名称> --content "<内容>"` | 直接更新内容
`goosehost delete --slug <名称> --force` | 删除站点（需要加 `--force`）

### 快捷部署

命令 | 说明
--- | ---
`goosehost deploy ./文件.html` | 部署 HTML 文件（自动起名）
`goosehost deploy ./文件.md` | 部署 Markdown 文件（自动起名）
`goosehost deploy ./目录/` | 部署目录（自动打包为多文件站点）
`goosehost deploy ./文件.html --slug <名称>` | 部署并指定站点名称

### 多文件站点（project）

命令 | 说明
--- | ---
`goosehost list-files --slug <名称>` | 列出站点内所有文件及大小
`goosehost download --slug <名称> --path <路径>` | 下载单个文件
`goosehost put-file --slug <名称> --path <路径> --file <本地文件>` | 写入/替换单个文件
`goosehost rm-file --slug <名称> --path <路径> --force` | 删除单个文件

### 其他

命令 | 说明
--- | ---
`goosehost config` | 查看当前配置和认证状态
`goosehost --version` | 显示版本号
`goosehost --help` | 查看所有命令的帮助
`goosehost help <命令>` | 查看某个子命令的详细用法

* * *

## 多文件站点（beta）

`project` 类型用于托管包含多个文件的网站，例如带 CSS/JS 的页面或静态前端项目。整个目录会被打包成 zip 上传，目录里的 `index.html`（或 `index.md`）作为站点入口。

### 创建

```bash
goosehost create --slug <名称> --type project --file ./my-project/
```

或用 deploy 直接部署目录（自动识别为 project 类型）：

```bash
goosehost deploy ./my-project/
```

### 查看文件列表

```bash
goosehost list-files --slug <名称>
```

### 下载单个文件

```bash
goosehost download --slug <名称> --path css/style.css --output ./style.css
```

不写 `--path` 时默认下载 `index.html`。

### 写入 / 替换单个文件

```bash
goosehost put-file --slug <名称> --path css/style.css --file ./local.css
goosehost put-file --slug <名称> --path index.html --content "<h1>Hi</h1>"
```

单文件内容上限 **200 KB**。

### 删除单个文件

```bash
goosehost rm-file --slug <名称> --path old.js --force
```

### 更新整个目录

修改本地目录后，重新部署整个目录即可。若提示名称已被占用（409），先删除再部署：

```bash
goosehost delete --slug <名称> --force
goosehost deploy ./my-project/
```

> project 为 beta 功能。`update` 命令对多文件站点的支持尚未完全验证，建议用上面的「删除后重新部署」流程来更新。

* * *

## 文件路径怎么写

在命令中，所有 `--file` 和 `--output` 后面的路径都支持两种写法：

- **相对路径**：相对于当前终端所在的目录
  例如：`./index.html`、`backup.html`、`../my-site/index.html`
- **绝对路径**：从磁盘根目录开始的完整路径
  例如：`D:/my-site/index.html`、`C:\Users\Administrator\backup.html`

如果不确定当前终端在哪个目录，可以输入：

- Windows CMD：`cd`
- Git Bash / Mac / Linux：`pwd`

* * *

## 常用操作示例

### 部署当前文件夹里的首页

```bash
goosehost deploy ./index.html
```

输出示例：

```text
部署成功！
  访问地址: https://page.goose.cc.cd/s/my-site
  网站名称: my-site
```

### 直接用文字创建一个 Markdown 站点

```bash
goosehost create --slug my-doc --type md --content "# 我的文档

这是内容"
```

### 把线上站点下载到本地修改

**第一步：下载到当前目录**

```bash
goosehost get --slug my-site --output backup.html
```

当前目录会多出一个 `backup.html` 文件。想保存到其他文件夹就写完整路径：

```bash
goosehost get --slug my-site --output D:/my-backup/index.html
```

> ⚠️ `--output` 后面必须是**完整文件名**，不能只写目录。写 `--output ./` 会报错 `is a directory`。

**第二步：用编辑器修改 `backup.html`**

**第三步：传回去**

```bash
goosehost update --slug my-site --file backup.html
```

### 查看站点内容（不保存，只显示）

```bash
goosehost get --slug my-site
```

终端会直接打印出站点的全部内容。

### 删除一个站点

```bash
goosehost delete --slug my-site --force
```

* * *

## 卸载

- **Windows**：删除 `goosehost.exe`，并把 `D:\app\cli` 从系统环境变量 `Path` 里移除。
- **Linux / macOS**：`sudo rm /usr/local/bin/goosehost`

* * *

## 常见问题

### 登录后每次都要重新登录吗？

不用。API 密钥保存在 `~/.goosehost/token`（Windows 是 `C:\Users\<用户名>\.goosehost\token`），下次打开终端会自动生效。

### 密钥会过期吗？

不会。GooseHost 的 API 密钥**长期有效、不轮换**，只有你在网页端手动吊销才会失效。

### 一台机器可以用多个密钥吗？

同一时间只能保存一个。想切换账号就再跑一次 `goosehost login --key <新密钥>`，会覆盖旧的。

### `goosehost` 提示找不到命令？

- **Windows**：把 exe 所在目录加进系统环境变量 `Path`，然后**重开终端**。
- **Linux/macOS**：确认 `/usr/local/bin` 在 `$PATH` 里，或者用 `./goosehost` 直接跑。

### 输出里有 `[96m`、`[92m` 这种乱码？

这是 Win7 的 CMD 不认 ANSI 颜色码导致的。跑一次：

```cmd
setx NO_COLOR 1
```

然后重开终端，颜色会关闭，输出变成纯文本。Git Bash / Windows Terminal / Linux / macOS 不受影响。

### `--output` 不填会怎样？

内容会直接打印在终端，不会保存成文件。

### 为什么删除站点必须加 `--force`？

防止手滑误删。确认你真的要删，再加 `--force`。

### slug 有什么限制？

长度 1–64 字符，仅允许字母、数字以及 `_ - . ~` 这几个符号。**不支持中文。**

### Markdown 站点和 HTML 站点怎么区分？

创建时用 `--type md` 或 `--type html` 区分。之后查看、更新时直接写 `--slug <名称>` 即可，CLI 会自动判断站点类型，不需要加 `md/` 前缀（`md/` 前缀的旧写法仍然兼容，会自动修正）。

### 内容有大小限制吗？

有：
- HTML / Markdown 单文件：**≤ 500 KB**
- project 单文件：**≤ 200 KB**
- project 总解压后：**≤ 2 MB**，文件数 **≤ 50**

### 为什么创建时提示 409？

站点名称（slug）被占用了。三种站点类型共享同一命名空间，换一个名字。

### 为什么创建时提示 429？

触发了限流。`/api/create` 是**每 IP 每 60 秒 2 次**，超了会锁 10 分钟。等一会儿再试。

### 为什么某个接口返回 403？

GooseHost 的 API 密钥**只开放站点管理与文件操作**。AI Copilot、广场互动、账号设置这些接口，密钥调用一律 403，需要网页端登录会话。CLI 里不会用到这些，忽略即可。

---

<footer style="text-align: center; color: #888; font-size: 14px; padding: 20px 0; border-top: 1px solid #ddd;">
  <p>© 2026 GooseHost. </p>
  <p>
    <a href="https://host.goose.cc.cd/" style="color: #02ff8e; text-decoration: none;">官网</a> &nbsp;|&nbsp;
    <a href="mailto:support@mail.goose.cc.cd" style="color: #02ff8e; text-decoration: none;">联系我们</a>
  </p>
</footer>
---

**Enjoy your static sites!**
