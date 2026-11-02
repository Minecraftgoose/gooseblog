---
title: '设置Kimi动态头像教程'
date: '2026-11-02 21:14:38'
updated: '2026-11-02 21:14:38'
tags:
  - '教程'
categories:
  - '文档'
cover: 'https://img.goose.cc.cd/i/bc58a6084469605e7bc75cce83565067.webp'
og_image: 'https://img.goose.cc.cd/i/bc58a6084469605e7bc75cce83565067.webp'
excerpt: '通过油猴脚本在浏览器中为 Kimi 上传 GIF 动态头像，脚本读取本地登录 token 并调用 Kimi 头像接口；附 Android、iOS、Windows/macOS 安装方法与偷懒 Python 上传方案。'
description: '本文介绍如何用油猴脚本为 Kimi 设置动态头像：从 localStorage 读取 access_token，在页面添加“设置头像”按钮，选择 GIF 后调用 Kimi 头像接口上传；包含 Android VIA、iOS Stay/Userscripts、桌面 Tampermonkey 配置、脚本代码、常见错误处理、Python 一键上传方法和 access_token 获取步骤。'
sticky: false
slug: kimi-gif
---

通过油猴脚本在浏览器中为 Kimi 设置动态头像。脚本读取本地登录 token，在页面添加一个上传按钮，选择 GIF 后调用 Kimi 头像接口。

如果你想偷懒，请见文章结尾~

## 1. 原理

脚本主要做四件事：

- 从 `localStorage` 读取 `access_token` 或 `token`
- 在页面右下角添加“设置头像”按钮
- 选择本地图片文件
- 用 `fetch` 以 `FormData` 向 `https://www.kimi.com/api/user/avatar` 发送 POST 请求

请求头模拟 Android 客户端，`Authorization` 使用 `Bearer token`。

## 2. 安装方法

### Android

推荐 VIA 浏览器，体积不到 1MB，自带脚本管理。

1. 安装 VIA 浏览器。
2. 打开 VIA → 设置 → 通用 → 脚本 → 点击右上角 `+`。
3. 选择“新建”，删除默认内容，粘贴脚本代码并保存。
4. 打开 `kimi.com`，登录账号并刷新页面。
5. 右下角出现“设置头像”按钮后，点击选择 GIF 上传。

其他可选：Kiwi Browser + Tampermonkey、Edge + Tampermonkey、Firefox + Violentmonkey。

### iOS

1. 在 App Store 安装 Stay 或 Userscripts。
2. 设置 → Safari → 扩展 → 启用 Stay/Userscripts。
3. 打开 `kimi.com` 并登录。
4. 点击扩展图标 → 新建脚本 → 粘贴代码 → 保存。
5. 刷新页面，右下角出现“设置头像”按钮。

### Windows / macOS

1. Chrome / Edge / Firefox 安装 Tampermonkey。
2. 打开 `kimi.com` 并登录。
3. 点击 Tampermonkey 图标 → 创建新脚本 → 粘贴代码 → 保存。
4. 刷新页面，右下角出现“设置头像”按钮。

其他可选扩展：Violentmonkey、Greasemonkey、ScriptCat。

## 3. 脚本代码

将以下代码粘贴到脚本管理器中，保存。

```javascript
// ==UserScript==
// @name         Kimi 头像设置器
// @namespace    https://viayoo.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @run-at       document-idle
// @match        https://*/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    const btn = document.createElement('button');
    btn.textContent = '设置头像';
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;background:#111;color:#fff;border:2px solid #111;padding:12px 20px;font-size:13px;font-weight:600;cursor:pointer;font-family:sans-serif;';
    btn.onclick = () => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('token') || '';
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!token) { alert('未找到 Token，请先登录 Kimi'); return; }

            const fd = new FormData();
            fd.append('file', file);

            try {
                const resp = await fetch('https://www.kimi.com/api/user/avatar', {
                    method: 'POST',
                    headers: {
                        'R-Timezone': 'Asia/Shanghai',
                        'x-msh-platform': 'android',
                        'x-msh-os-version': 'GOOGLE 10',
                        'x-msh-device-model': 'Google',
                        'x-msh-session-id': '1',
                        'x-msh-device-id': '1',
                        'x-msh-version': '2.5.1',
                        'x-msh-app-channel': 'kimi',
                        'x-msh-android-version': '29',
                        'Authorization': 'Bearer ' + token,
                        'X-Language': 'zh-CN',
                        'Accept': 'application/json',
                        'Accept-Charset': 'UTF-8',
                        'User-Agent': 'ktor-client',
                    },
                    body: fd,
                });
                const data = await resp.json().catch(() => ({}));
                alert(resp.ok ? '上传成功!' : '失败 ' + resp.status + '\n' + JSON.stringify(data));
            } catch (err) {
                alert('异常: ' + err.message);
            }
        };
        fileInput.click();
    };

    document.body.appendChild(btn);
})();
```

## 4. 使用方法

1. 在浏览器打开 `kimi.com` 并登录账号。
2. 刷新页面，等待右下角出现“设置头像”按钮。
3. 点击按钮，选择 GIF 文件，等待上传结果。

上传成功后头像会更新。如果 Kimi App 中没有变化，可以清除 App 缓存或重新登录。

## 注意事项

- 按钮未出现：确认已登录、页面已刷新、脚本已启用。
- 上传失败 413：GIF 文件过大，压缩到 5MB 以下。
- 上传失败 401：token 过期，重新登录后再试。
- 头像不动：App 可能有缓存，清除缓存或重新安装 App。
- iOS 无法安装扩展：使用 Stay App，无需越狱。


## 偷懒方法

将以下的话、你的GIF和你的`accesstoken`发给Kimi：

````markdown
这是要设置的头像GIF和我的登录凭证，请使用一下Python代码帮我上传头像
```python
#!/usr/bin/env python3
# 用法:
#   export KIMI_TOKEN="你的token"
#   python kimi_avatar.py avatar.gif
# 或:
#   python kimi_avatar.py avatar.gif --token "xxx"

import os
import sys
import argparse
import mimetypes

import requests

URL = "https://www.kimi.com/api/user/avatar"


def build_headers(token: str) -> dict:
    return {
        "R-Timezone": "Asia/Shanghai",
        "x-msh-platform": "android",
        "x-msh-os-version": "GOOGLE 10",
        "x-msh-device-model": "Google",
        "x-msh-session-id": "1",
        "x-msh-device-id": "1",
        "x-msh-version": "2.5.1",
        "x-msh-app-channel": "kimi",
        "x-msh-android-version": "29",
        "Authorization": f"Bearer {token}",
        "X-Language": "zh-CN",
        "Accept": "application/json",
        "Accept-Charset": "UTF-8",
        "User-Agent": "ktor-client",
    }


def upload(token: str, file_path: str, timeout: int = 60) -> int:
    if not os.path.isfile(file_path):
        print(f"文件不存在: {file_path}")
        return 2

    size = os.path.getsize(file_path)
    print(f"文件: {file_path}  ({size / 1024:.1f} KB)")
    if size > 5 * 1024 * 1024:
        print("警告: 文件超过 5MB，可能返回 413")

    mime = mimetypes.guess_type(file_path)[0] or "application/octet-stream"
    name = os.path.basename(file_path)

    with open(file_path, "rb") as f:
        files = {"file": (name, f, mime)}
        try:
            resp = requests.post(
                URL, headers=build_headers(token), files=files, timeout=timeout
            )
        except requests.RequestException as e:
            print(f"请求异常: {e}")
            return 2

    print(f"状态码: {resp.status_code}")
    print(f"响应: {resp.text[:1000]}")

    if resp.ok:
        print("上传成功")
        return 0
    if resp.status_code == 401:
        print("401: token 无效或已过期，重新登录后获取新的 token")
    elif resp.status_code == 413:
        print("413: 文件过大，压缩到 5MB 以下再试")
    elif resp.status_code == 403:
        print("403: 缺少签名/设备信息或被风控，需要抓包确认最新请求头")
    return 1


def main() -> int:
    p = argparse.ArgumentParser(description="Kimi 动态头像上传")
    p.add_argument("file", help="GIF/图片文件路径")
    p.add_argument("--token", help="Kimi token，默认读环境变量 KIMI_TOKEN")
    args = p.parse_args()

    token = args.token or os.environ.get("KIMI_TOKEN", "").strip()
    if not token:
        print("未提供 token。设置环境变量 KIMI_TOKEN 或使用 --token")
        return 2
    if token.lower().startswith("bearer "):
        token = token[7:].strip()

    return upload(token, args.file)


if __name__ == "__main__":
    sys.exit(main())
```
````

哎呀，忘了教你们怎么获取`access_token`了。。。

![按下F12，打开开发者工具](https://img.goose.cc.cd/i/433fcfa23c4c848cb95e33e90c423eed.webp)
![选择应用程序](https://img.goose.cc.cd/i/63ee2c3f1e21c21df4fe546017590d9e.webp)
![找到名为本地储存的东西](https://img.goose.cc.cd/i/1b76b02119de82117ac6c6965913cc01.webp)
![在右侧的列表中找到access_token](https://free.boltp.com/2026/11/02/6ae890b89b0e9.webp)
![复制](https://free.boltp.com/2026/11/02/6ae890b8c446a.webp)