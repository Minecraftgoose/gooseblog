---
title: TimeFreeze
date: '2026-09-24 14:16:01'
updated: '2026-09-24 14:16:01'
tags:
  - '文档'
categories:
  - '折腾'
cover: 'https://img.goose.cc.cd/i/ae4a4cfd534a2fbd63788dd79e943e84.png'
og_image: 'https://img.goose.cc.cd/i/ae4a4cfd534a2fbd63788dd79e943e84.png'
excerpt: '无人时自动冻结 Minecraft 服务器的时间与天气'
description: '无人时自动冻结 Minecraft 服务器的时间与天气'
slug: TimeFreeze
---

# TimeFreeze：无人时自动冻结 Minecraft 服务器的时间与天气

> 最后一个玩家离开，世界按下暂停键；第一个玩家进入，时间无缝继续。

如果你运营过一个 Minecraft 服务器，一定遇到过这样的烦恼：玩家下线后，服务器里的时间依然流逝、天气依然变化——白天黑夜轮转，暴雨说来就来。等你再次上线，世界早已不是你离开时的模样。TimeFreeze 就是为解决这个问题而生的插件：**无人时冻结 Minecraft 服务器的时间与天气，有玩家进入后自动恢复。**

## 核心功能

**⏸️ 无人时自动冻结**
最后一个玩家离开服务器后，插件立即暂停昼夜循环与天气变化——时间不再流逝、天气不再变化，世界就像被按下了暂停键。

**▶️ 有人时自动恢复**
第一个玩家进入服务器后，昼夜与天气立即恢复正常运转，世界从离开时的状态无缝继续，玩家感受不到任何停顿。

**🔄 卸载自动恢复**
插件卸载或重载时，可自动将 `doDaylightCycle` 与 `doWeatherCycle` 恢复为默认开启状态，避免服务器陷入永久冻结。

**🛡️ 无副作用实现**
通过切换 GameRule 实现"冻结/恢复"，不修改服务器时间数据，完全安全透明。

**🧵 多线程安全**
Folia 版严格遵循区域化多线程规范，使用 AtomicInteger 计数 + GlobalRegionScheduler 操作全局状态。

**📦 跨版本稳定**
仅依赖 Bukkit 最核心稳定的 API，支持 1.20.x · 1.21.x · 26.1.x · 26.2.x，长期无需维护。

## 版本选择

TimeFreeze 提供两个版本，对应不同类型的服务端：

| 版本 | 服务端 | 支持 MC 版本 |
| --- | --- | --- |
| PaperTimeFreeze | Paper / Purpur / Spigot / Bukkit 系 | 1.20.x · 1.21.x · 26.1.x · 26.2.x |
| FoliaTimeFreeze | Folia | 1.20.x · 1.21.x · 26.1.x · 26.2.x |

两个 jar 均以最低版本 API 编译、字节码为 Java 17，可运行于 Java 17/21/25 环境。

## 安装指南

1. **下载对应版本**：普通单线程服务端（Paper / Purpur / Spigot）选择 **PaperTimeFreeze**；Folia 多线程服务端选择 **FoliaTimeFreeze**。
2. **放入 plugins 目录**：将下载好的 jar 文件放入服务器的 `plugins/` 目录中。
3. **启动服务器**：插件会自动生成配置文件 `plugins/TimeFreeze/config.yml`。按需修改配置后，执行重载命令即可生效，无需重启服务器。

如需自行编译，环境要求为 JDK 17+ 与 Maven 3.6+：

```bash
# 编译 Paper 版
cd paper
mvn clean package
# 产物：paper/target/PaperTimeFreeze-1.0.0.jar

# 编译 Folia 版
cd folia
mvn clean package
# 产物：folia/target/FoliaTimeFreeze-1.0.0.jar
```

## 配置说明

配置文件 `config.yml` 仅有四项，简洁明了：

```yaml
# 无人时是否暂停昼夜循环（doDaylightCycle）
pause-daylight: true

# 无人时是否暂停天气变化（doWeatherCycle）
pause-weather: true

# 插件卸载/重载时是否恢复默认（昼夜、天气恢复运转）
restore-on-disable: true

# 是否在控制台输出状态变化日志
log: true
```

- `pause-daylight`（默认: true）：无人时是否冻结昼夜循环
- `pause-weather`（默认: true）：无人时是否冻结天气变化
- `restore-on-disable`（默认: true）：插件卸载时是否恢复昼夜/天气运转
- `log`（默认: true）：是否在控制台打印状态变化日志

## 命令与权限

**Paper 版：**

| 命令 | 权限 | 说明 |
| --- | --- | --- |
| `/papertimefreeze` | `papertimefreeze.admin` | 主命令 |
| `/papertimefreeze status` | `papertimefreeze.admin` | 查看在线人数与昼夜/天气状态 |
| `/papertimefreeze reload` | `papertimefreeze.admin` | 重载配置文件 |

别名：`/ptf`（权限默认授予 OP）

**Folia 版：**

| 命令 | 权限 | 说明 |
| --- | --- | --- |
| `/foliatimefreeze` | `foliatimefreeze.admin` | 主命令 |
| `/foliatimefreeze status` | `foliatimefreeze.admin` | 查看在线人数与昼夜/天气状态 |
| `/foliatimefreeze reload` | `foliatimefreeze.admin` | 重载配置文件 |

别名：`/ftf`（权限默认授予 OP）

## 常见问题

**Q：为什么服务器没人的时候时间会停住？**
这是插件的核心功能——最后一名玩家离开后自动冻结昼夜循环，有玩家进入即恢复。如果你不希望这样，可以将 `pause-daylight` 设为 `false`。

**Q：天气也会被冻结吗？**
会。`pause-weather` 开启时，无人期间天气状态不再变化。注意：如果最后一名玩家离开时正在下雨，雨会一直下到有人回来——这是"冻结"而非"停雨"。

**Q：Paper 版和 Folia 版怎么选？**
看你的服务端类型。普通的 Paper / Purpur / Spigot 服选 Paper 版；Folia 多线程服选 Folia 版。选错版本会导致插件无法加载。

**Q：支持哪些 Minecraft 版本？**
1.20.x、1.21.x、26.1.x、26.2.x。两个 jar 均以最低版本 API 编译、字节码为 Java 17，可运行于 Java 17/21/25 环境。

**Q：修改配置后需要重启服务器吗？**
不需要，执行 `/ptf reload`（Paper 版）或 `/ftf reload`（Folia 版）即可热重载配置。

## 关于与支持

TimeFreeze 使用 GNU General Public License v3.0 开源（Copyright (C) 2026），无任何第三方依赖，单个 jar 即装即用。觉得好用的话，欢迎在 GitHub 点个 Star——你的支持是持续更新的动力。

---

**网站地址**：https://timefreeze.totalh.net/
