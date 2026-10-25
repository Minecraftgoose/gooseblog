---
title: 'Kimi Android App API 逆向文档'
date: '2026-10-25 16:27:25'
updated: '2026-10-25 16:27:25'
tags:
  - '文档'
  - 'Kimi'
categories:
  - '项目'
cover: 'https://img.goose.cc.cd/i/3802a42da9383f9e94e7f145c176b985.webp'
og_image: 'https://img.goose.cc.cd/i/3802a42da9383f9e94e7f145c176b985.webp'
excerpt: 'Kimi Android 3.1.0 客户端 260 个接口的完整逆向文档，含请求头、字段、示例与 protobuf 消息定义'
description: '69 个 Connect-RPC 服务、260 个接口逐条列出用途、请求/返回字段、调用示例与解析说明，并附 909 条 protobuf 消息、158 个枚举与流式帧结构。'
slug: kimi-android-api-reverse-doc
---

# Kimi Android App API 逆向文档

> `kimi_3.1.0.apk` · `com.moonshot.kimichat` · `3.1.0 (371)` · `260 APIs` · `69 services` · `909 messages` · `158 enums`

> **SHA-256**：`dfec71074faf75e5ae21c488538ff3a28a726ed2da33b609ee6a5953bcacc27f`
>
> **Git revision**：`11d1ceb9b5e653e5da0a014dde3cddc81fff41bc`

## 接口索引

共 69 个服务、260 个接口（⚡ = 服务端流式，需按帧解析）。

- **社区对话** · `moment.v1.ChatService`：`CreateChatV2`、`GetLastChatV2`、`GetOriginalMessageCount`、`GetRawShareChatV2`、`ReChat`
- **社区-评论** · `moment.v1.CommentService`：`CreateComment`、`DeleteComment`、`ListComments`、`ListSubComments`、`VoteComment`
- **社区-举报** · `moment.v1.ComplaintService`：`CreateComplaint`
- **社区配置** · `moment.v1.ConfigService`：`GetConfig`
- **社区-收藏** · `moment.v1.FavoriteService`：`CreateFavorite`、`DeleteFavorite`
- **社区信息流** · `moment.v1.FeedService`：`GetFeed`、`ListFeeds`、`ListFollowUnread`、`MarkReadForFollow`
- **社区-关注** · `moment.v1.FollowService`：`ListFollows`、`ModifyBlock`、`ModifyFollow`
- **社区-话题** · `moment.v1.HashtagService`：`GetHashtag`、`ListHashtags`、`RecommendHashtags`
- **社区-兴趣** · `moment.v1.InterestService`：`ReportSelections`、`SubmitSelections`
- **社区-动态** · `moment.v1.MomentService`：`CreateMoment`、`DeleteMoment`、`GetChatShareCard`、`ListMomentAskKimiQuestions`、`ListSimilarMoments`、`VoteMoment`
- **社区-屏蔽** · `moment.v1.MuteService`：`AppendMuteReasons`、`ListMuteReasons`、`Mute`、`UnMute`
- **社区通知** · `moment.v1.NotificationService`：`GetReminderStatus`、`ListNotification`、`ListReminders`、`MarkRead`、`MarkReadForReminder`
- **社区搜索** · `moment.v1.SearchService`：`ListHotHashtagsInSearch`、`SearchHashtags`、`SearchMoments`、`SearchUsers`、`SuggestSearchQuery`
- **社区-上传** · `moment.v1.UploadService`：`CreateFile`、`GeneratePresignedURL`
- **社区用户** · `moment.v1.UserService`：`GetMe`、`GetUserProfile`、`ListMentionableBots`
- **对话** · `kimi.gateway.chat.v1.ChatService`：`BatchDeleteChats`、`CancelChat`、`Chat`⚡、`ChatFromCase`⚡、`ContinueChat`⚡、`CreateChatFromShare`、`CreateChatShare`、`GetChat`、`GetChatShare`、`GetChatShareMessage`、`GetChatShareScreenshot`、`GetMessage`、`GetMessageRecommendPrompts`、`GetToolBlock`、`GetUnreadChats`、`ListChats`、`ListMessages`、`MarkChatAsRead`、`MessageSpeech`⚡、`ProcessAskUserResult`、`RegenerateMessage`⚡、`ReplayChatShareStream`⚡、`ReplyInteraction`、`ResumeChat`⚡、`ShareChatToCommunity`、`SubscribeMessageStream`⚡、`UpdateChat`、`VoteMessage`
- **对话分享** · `kimi.gateway.chat.v1.ChatShareService`：`GetChatShareDocx`
- **Kimi+** · `kimi.gateway.chat.v1.KimiPlusService`：`ListKimiPlus`、`ListPinnedKimiPlus`
- **提示词** · `kimi.gateway.chat.v1.PromptService`：`GetEnhancedPrompts`
- **IM 群聊** · `kimi.gateway.im.v1.IMService`：`CreateInvitation`、`CreateRoom`、`DeleteRoom`、`GetRoom`、`GetRoomByInvitation`、`GetThread`、`InviteMembers`、`ListMembers`、`ListMessages`、`ListRooms`、`ListTypingMembers`、`RemoveMember`、`SendMessage`、`SetMemberRole`、`UpdateRoom`
- **账号认证** · `account.gateway.v1.AuthService`：`BindPhone`、`ConfirmLoginQRCode`、`LoginWithOneClick`、`LoginWithSMS`、`LoginWithThirdParty`、`Logout`、`RefreshToken`、`ScanLoginQRCode`
- **账号设备** · `account.gateway.v1.DeviceService`：`RegisterDevice`
- **短信验证码** · `account.gateway.v1.SMSService`：`ListCountries`、`SendVerifyCode`
- **青少年模式** · `kimi.gateway.account.v1.MinorModeService`：`BindGuardian`、`GetMinorMode`、`ResetPasscode`、`UnbindGuardian`、`UpdateMinorMode`、`VerifyGuardianPhone`、`VerifyGuardianReset`
- **账号安全** · `kimi.gateway.account.v1.SecurityService`：`BindPhone`、`BindThirdAccount`、`DeactivateAccount`、`ListThirdAccounts`、`RebindPhone`、`SendVerifyCode`、`UnbindThirdAccount`、`VerifyCurrentPhone`
- **用户** · `kimi.gateway.account.v1.UserService`：`GetCurrentUser`、`ListWorkspaces`、`SwitchWorkspace`、`UpdateProfile`
- **Claw 文件** · `kimi.gateway.claw.v1.ClawFileService`：`ListFiles`
- **上下文** · `kimi.gateway.context.v1.ContextService`：`GetGoal`、`UpdateGoal`
- **文档转换** · `kimi.gateway.converter.v1.ConverterService`：`ExportDocument`、`GetExportDocumentJob`
- **文件** · `kimi.gateway.file.v1.FileService`：`GetFileParseProgress`
- **存储** · `kimi.gateway.storage.v1.StorageService`：`GetUserStorageQuota`
- **应用发布** · `kimi.gateway.app.v1.AppService`：`ListVersions`、`PreviewApp`、`PublishApp`、`UnpublishApp`
- **App 支持** · `kimi.gateway.appsupport.v1.AppSupportService`：`ScanQRCode`
- **产物分享** · `kimi.gateway.artifact.v1.ArtifactService`：`ShareArtifact`
- **Claw 机器人** · `kimi.gateway.claw.v1.ClawService`：`CreateBot`、`CreateModelAPIKey`、`DeleteBot`、`ListBots`
- **Claw 技能** · `kimi.gateway.claw.v1.ClawSkillService`：`DeleteRemoteSkill`、`InstallSkillToRemote`、`ListClawSkills`、`ListRemoteSkills`
- **配置** · `kimi.gateway.config.v1.ConfigService`：`GetAvailableModels`、`GetConfig`、`GetPrecheckConfig`
- **设备** · `kimi.gateway.device.v1.DeviceService`：`CountDevices`、`DeleteDevice`、`ListDevices`
- **实验** · `kimi.gateway.experiment.v1.ExperimentService`：`GetExperiments`
- **信息流** · `kimi.gateway.feed.v1.FeedService`：`ListFeeds`
- **凭证签发** · `kimi.gateway.issuance.v1.IssuanceService`：`GetCredential`
- **MCP OAuth** · `kimi.gateway.mcp.v1.MCPOAuthService`：`CreateMCPServerAuthorization`、`GetMCPServerAuthorization`
- **MCP** · `kimi.gateway.mcp.v1.MCPService`：`SetMCPUserSettingStatus`
- **OKC/产物** · `kimi.gateway.mcp.v1.OKCService`：`GetCitationsByChat`、`GetDeploymentByChatShare`、`GetManifest`、`GetOutputFileTree`、`GetOutputFileTreeByShare`、`PublishDeployment`、`ResolveFileURI`、`ResolveFileURIByShare`、`UnpublishDeployment`
- **会员** · `kimi.gateway.membership.v2.MembershipService`：`ClaimEventBalance`、`GetBalanceEventInfo`、`GetSubscription`、`GetSubscriptionStats`、`ListBalanceActions`
- **长期记忆** · `kimi.gateway.memory.v1.MemoryService`：`DeleteMemory`、`ListMemories`
- **记忆仓库** · `kimi.gateway.memory.v1.VaultService`：`GetDreamStatus`、`GetVaultPage`、`GetVaultTree`、`ResetDreamVault`
- **杂项** · `kimi.gateway.misc.v1.MiscService`：`GetDataSourceLocalizedInfo`
- **通知** · `kimi.gateway.notification.v1.NotificationService`：`ListUserNotifications`、`MarkNotificationsRead`
- **商品** · `kimi.gateway.order.v1.GoodsService`：`ListGoods`
- **订阅** · `kimi.gateway.order.v1.SubscriptionService`：`CreateSubscription`、`GetDiscountURL`、`GetPricePoster`、`VeryDiscountUser`
- **置顶** · `kimi.gateway.pin.v1.PinService`：`ListPinResources`、`PinResource`、`UnpinResource`
- **插件** · `kimi.gateway.plugin.v1.PluginService`：`GetPlugin`、`InstallPlugin`、`ListAvailablePlugins`、`ListInstalledPlugins`、`ListPluginCategories`、`ListPluginSections`、`UninstallPlugin`
- **项目** · `kimi.gateway.project.v1.ProjectService`：`CreateProject`、`DeleteProject`、`DeleteProjectFile`、`GetProject`、`ListProjectFiles`、`ListProjectUploadFiles`、`ListProjects`、`SetAvailableProjects`、`UpdateProject`
- **营销素材** · `kimi.gateway.promotionalasset.v1.PromotionalAssetService`：`ListPromotionalAssets`
- **风控** · `kimi.gateway.riskcontrol.v1.RiskControlService`：`ReportEvent`
- **技能任务** · `kimi.gateway.skill.v1.SkillJobService`：`CreateSkillJob`、`DeleteSkillJob`、`GetSkillJob`、`RetrySkillJob`
- **技能** · `kimi.gateway.skill.v1.SkillService`：`GetSkill`、`GetSkillFileTree`、`InstallSkill`、`ListInstalledSkills`、`ListSkillUseCases`、`ListSkills`、`RemoveSkill`
- **幻灯片** · `kimi.gateway.slides.v1.SlidesService`：`GetSlides`
- **展示位** · `kimi.gateway.suggest.v1.OpenShowcaseService`：`GetShowcaseByID`
- **展示位** · `kimi.gateway.suggest.v1.ShowcaseService`：`ListDefaultShowcases`、`ListMobileHomepageShowcases`
- **推荐** · `kimi.gateway.suggest.v1.SuggestService`：`ClaimPopupExposure`、`ListPopups`
- **多智能体** · `kimi.gateway.swarm.v1.SwarmService`：`ListAgentMessages`、`ListAgentMessagesByShare`、`ListAgents`、`StopAgents`
- **触发器** · `kimi.gateway.trigger.v1.TriggerService`：`CreateTask`、`DeleteTask`、`GetTask`、`ListTaskExecutions`、`ListTasks`、`MarkExecutionRead`、`RunTask`、`UpdateTask`
- **语音合成** · `kimi.gateway.tts.v1.TTSService`：`ListVoices`
- **网站别名** · `kimi.gateway.websites.v1.WebsiteSlugService`：`GetWebsiteSlug`、`SetWebsiteSlug`、`ValidateWebsiteSlug`
- **远程控制** · `kimi.gateway.work.v1.RemoteControlService`：`CreatePairing`、`CreateWebSocketTicket`、`GetPairing`、`ListClients`、`ListServers`、`RevokeClient`
- **发件箱** · `kimi.outbox.v1.OutboxService`：`ClearOutboxMessages`、`CreateOutboxMessage`、`DeleteOutboxMessage`、`ListOutboxMessages`、`ReorderOutboxMessages`、`ResumeOutbox`、`SendOutboxMessageNow`、`StopOutbox`、`UpdateOutboxMessage`
- **用户设置** · `kimi.usersetting.v1.UserSettingService`：`GetUserSetting`、`UpdateUserSetting`

## 基础环境信息

### 1. APK 版本号

- 文件名 `kimi_3.1.0.apk`（下载源 `https://appsupport.moonshot.cn/api/app/pkg/latest/android/download`，302 → `kimi-img.moonshot.cn/app/download/android/kimi_3.1.0.apk`）
- 包名 `com.moonshot.kimichat`；应用名 Kimi
- versionName **3.1.0**；versionCode **371**
- minSdk 26 / targetSdk 36；AGP 8.13.2；单 APK，3 个 dex，dex 版本 038
- 体积 35,683,906 字节

### 2. 基础 Base URL

| 用途 | URL | 说明 |
| --- | --- | --- |
| 主 API（生产） | `https://www.kimi.com/apiv2` | 所有 Connect-RPC 业务接口基址 |
| 主 API（测试） | `https://kimi.kimi.team/apiv2` | 内测环境基址 |
| Web 站 | `https://www.kimi.com` | 分享页/协议页 |
| 鉴权基址 | `https://auth.kimi.com` | 账号认证 |
| 应用支持 | `https://appsupport.moonshot.cn` | APK 下载/帮助 |
| 对象存储 | `https://kimi-img.moonshot.cn` | 图片/文件 CDN |

完整 URL = Base + `<路径>`；绝大多数服务走 `/apiv2`，账号服务 `account.gateway.v1.AuthService` 的 `Logout` / `RefreshToken` 走 **`/api`** 前缀。

### 3. 全局通用请求头（所有接口共用）

| 请求头 | 必填 | 取值性质 | 说明 |
| --- | --- | --- | --- |
| `Authorization` | 必填 | 动态 | `Bearer <accessToken>`；未登录接口（登录/短信）不带。由 AccountSessionManager 统一注入。 |
| `Content-Type` | 必填 | 动态 | **Unary 用 `application/json`；服务端流式用 `application/connect+json`**（实测：用错返回 415）。 |
| `Accept` | 可选 | 动态 | 期望的响应编码；流式可带 `application/connect+json`。 |
| `R-Timezone` | 必填 | 动态 | 设备时区（如 `Asia/Shanghai`）。 |
| `x-msh-platform` | 必填 | 固定 | 固定 `android`。 |
| `x-msh-os-version` | 必填 | 动态 | 系统 API 级别/版本号。 |
| `x-msh-device-model` | 必填 | 动态 | Build.MODEL 设备型号。 |
| `x-msh-device-id` | 必填 | 动态 | 设备唯一 ID（首次安装生成并持久化）。 |
| `x-msh-session-id` | 必填 | 动态 | 会话串 ID（getSsid）。 |
| `x-msh-version` | 必填 | 动态 | 客户端版本号（3.1.0）。 |
| `x-msh-app-channel` | 必填 | 动态 | 分发渠道号。 |
| `x-msh-android-version` | 必填 | 动态 | Android 版本（Build.VERSION.RELEASE）。 |
| `X-Language` | 必填 | 动态 | 语言（如 `zh-CN`）。 |
| `X-Msh-Shield-Data` | 必填 | 动态 | 风控/设备指纹数据，由风控 SDK 生成。 |
| `X-Auth-Block` | 可选 | 动态 | 鉴权拦截标记（账号被风控时）。 |
| `X-TC-Token` | 可选 | 动态 | 腾讯风控/验证 token。 |
| `x-user-region` | 可选 | 动态 | 用户区域。 |
| `X-App-Key` | 可选 | 固定 | 部分 OpenAPI/插件接口使用的应用 Key。 |

- **固定值**：`x-msh-platform=android`；`Content-Type` 按接口类型取 `application/json`（Unary）或 `application/connect+json`（流式）。
- **动态生成**：`Authorization`、`R-Timezone`、`x-msh-os-version`、`x-msh-device-model`、`x-msh-device-id`、`x-msh-session-id`、`x-msh-version`、`x-msh-app-channel`、`x-msh-android-version`、`X-Language`、`X-Msh-Shield-Data`。

### 4. 鉴权体系说明

- **Token 模型**：`Authorization: Bearer <accessToken>`；refresh token 以键 `android_tech_refresh_token` 持久化
- **刷新链路**：access token 失效时由 `AccountSessionManager`（`Lzr/d;`）调用 `/api/account.gateway.v1.AuthService/RefreshToken` 换新并重放原请求
- **登录方式**：短信验证码、一键登录、第三方、扫码
- **免鉴权接口**：`SMSService/*`、`AuthService/LoginWith*`、`AppService/ListVersions` 等

### 5. Connect-RPC 协议简要说明

- 协议 Connect-RPC； **Unary 请求用 `application/json`，服务端流式用 `application/connect+json`**（实测：互换会返回 415）
- 路径 `/{proto 全限定服务名}/{方法名}`，如 `/moment.v1.MomentService/CreateMoment`
- **Unary**：请求/响应各为一个 JSON 对象；HTTP 方法 **POST**
- **Server-Streaming**：响应为 Connect 流帧序列，每帧负载为 `ChatResponse` 事件信封；HTTP 方法 **POST**
- 消息命名约定 `<方法名>Request` / `<方法名>Response`（同 proto 包），字段为 proto JSON 映射（camelCase）

**本包内服务端流式 RPC 清单：**

| 路径 | 请求消息 |
| --- | --- |
| `/kimi.gateway.chat.v1.ChatService/Chat` | `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ChatRequest` |
| `/kimi.gateway.chat.v1.ChatService/ChatFromCase` | `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ChatFromCaseRequest` |
| `/kimi.gateway.chat.v1.ChatService/ContinueChat` | `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ContinueChatRequest` |
| `/kimi.gateway.chat.v1.ChatService/MessageSpeech` | `com.moonshot.kimi.proto.kimi.gateway.chat.v1.MessageSpeechRequest` |
| `/kimi.gateway.chat.v1.ChatService/RegenerateMessage` | `com.moonshot.kimi.proto.kimi.gateway.chat.v1.RegenerateMessageRequest` |
| `/kimi.gateway.chat.v1.ChatService/ReplayChatShareStream` | `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ReplayChatShareStreamRequest` |
| `/kimi.gateway.chat.v1.ChatService/ResumeChat` | `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ResumeChatRequest` |
| `/kimi.gateway.chat.v1.ChatService/SubscribeMessageStream` | `com.moonshot.kimi.proto.kimi.gateway.chat.v1.SubscribeMessageStreamRequest` |

### 6. 错误码总表

错误通过 `ErrorResponseV2`（应用类 `Lfx/o;`）返回：`{ code:int, message:string, details:List<ErrorDetail> }`。

| code | gRPC 状态 | 说明 |
| --- | --- | --- |
| `0` | OK | 成功 |
| `400` | INVALID_ARGUMENT | 请求参数非法（字段缺失/类型错误/超出约束） |
| `401` | UNAUTHENTICATED | 未认证：token 缺失/过期，需刷新或重新登录 |
| `403` | PERMISSION_DENIED | 无权限：账号受限、青少年模式、或资源不属于当前用户 |
| `404` | NOT_FOUND | 资源不存在（已删除） |
| `409` | ALREADY_EXISTS | 冲突（重复创建/重复关注） |
| `412` | FAILED_PRECONDITION | 前置条件不满足 |
| `429` | RESOURCE_EXHAUSTED | 频率/配额限制 |
| `499` | CANCELLED | 客户端取消（流式中断） |
| `500` | INTERNAL | 服务端内部错误 |
| `503` | UNAVAILABLE | 服务不可用/过载 |
| `504` | DEADLINE_EXCEEDED | 超时 |

### 7. 社区信息流分类（含“热门流”）

社区首页/发现页内容由 `moment.v1.FeedService/ListFeeds` 驱动，用请求体 `category` 区分不同“流”：

| category | 大白话 | 说明 |
| --- | --- | --- |
| `FEED_CATEGORY_UNSPECIFIED` | 默认 | 未指定，服务端兜底 |
| `FEED_CATEGORY_RECOMMEND` | **推荐流（即“热门/发现”）** | 算法推荐的热门与兴趣内容，社区默认首页 |
| `FEED_CATEGORY_FOLLOW` | 关注流 | 你关注的人发的动态 |
| `FEED_CATEGORY_HASHTAG` | 话题流 | 某话题下的动态（带 hashtagId） |
| `FEED_CATEGORY_USER_FAVORITE` | 我的收藏 | 我收藏过的动态 |
| `FEED_CATEGORY_USER_LIKES` | 我点赞过的 | 我点过赞的动态 |
| `FEED_CATEGORY_USER_PUBLISH` | 我发布的 | 我自己发的动态（传 userId 可看别人主页） |

- **“热门流”落点**：Kimi 社区 **没有单独的 HOT 枚举**， **热门/推荐 = `FEED_CATEGORY_RECOMMEND`**；单条卡片用 `GetFeed`（`feedType`：`FEED_TYPE_MOMENT` / `FEED_TYPE_INTEREST_CARD`）。
- **热门话题**：`moment.v1.SearchService/ListHotHashtagsInSearch`。
- 另有 **与社区无关** 的首页展示流 `kimi.gateway.feed.v1.FeedService/ListFeeds`，勿混淆。

### 8. Token 类型与刷新机制

**鉴权 Token 共两类**（均来自登录/刷新接口响应）：

| Token | 字段名 | 用途 | 有效期 | 存放 |
| --- | --- | --- | --- | --- |
| **访问令牌 accessToken** | `accessToken` | 每个请求头 `Authorization: Bearer` | **实测 900 秒（15 分钟）** | 内存 |
| **刷新令牌 refreshToken** | `refreshToken` | 仅用于换取新令牌 | 长（天级） | 本地持久化，键 `android_tech_refresh_token` |

- **获取（登录）**：`LoginWithSMS` / `LoginWithOneClick` / `LoginWithThirdParty` / 扫码两步 → 响应 `{ accessToken, refreshToken, newUser, userId }`。
- **刷新**：`POST https://www.kimi.com/api/account.gateway.v1.AuthService/RefreshToken`（App 端常量表指向 `/api`）；请求 `{ refreshToken }`，响应 `{ accessToken, refreshToken }` —— **双令牌轮换**，必须用新 refreshToken 覆盖旧值。 **实测**：该路径在 Web 生产网关返回 404（连同 8 种变体），refresh token 应视为由 **登录响应直接下发** 而非端点换取。
- **触发**：任意接口 401/403 时自动刷新并重放；失败则跳登录。
- **登出**：`POST /api/account.gateway.v1.AuthService/Logout`。
- **非鉴权 token**：`pageToken` / `nextPageToken` 是分页游标；推送 token、`tr_token`、`X-TC-Token`、`X-Msh-Shield-Data` 属推送/风控，与登录态无关。

## 社区对话 · `moment.v1.ChatService`（5 个方法）

### 001 · CreateChatV2 — 创建动态对话

**服务**：`moment.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.ChatService/CreateChatV2`

- **API用途**：基于动态创建一条对话（V2），返回对话 ID 供进入聊天。
- **这接口能干啥（大白话）**：在动态上开一个新对话，然后跳进聊天页。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.CreateChatV2Request`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `momentId` | string |
| `chatType` | enum `ChatType` |
| `chatTypeSubKey` | string |
| `askKimiQuestion` | string |

**字段取值**：

- `chatType`：`CHAT_TYPE_UNSPECIFIED`、`CHAT_TYPE_ASK_KIMI`、`CHAT_TYPE_CONTINUE`、`CHAT_TYPE_REMIX_CODE_ARTIFACT_DEEP_RESEARCH`、`CHAT_TYPE_REMIX_HTML`、`CHAT_TYPE_REMIX_IMAGE`、`CHAT_TYPE_REMIX_OKC_ARTIFACT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.ChatService/CreateChatV2
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.CreateChatV2Response`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `chat` | message `Chat` |
| `chatType` | enum `ChatType` |
| `chatTypeSubKey` | string |

**字段取值**：

- `chatType`：`CHAT_TYPE_UNSPECIFIED`、`CHAT_TYPE_ASK_KIMI`、`CHAT_TYPE_CONTINUE`、`CHAT_TYPE_REMIX_CODE_ARTIFACT_DEEP_RESEARCH`、`CHAT_TYPE_REMIX_HTML`、`CHAT_TYPE_REMIX_IMAGE`、`CHAT_TYPE_REMIX_OKC_ARTIFACT`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 002 · GetLastChatV2 — 获取最近动态对话

**服务**：`moment.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.ChatService/GetLastChatV2`

- **API用途**：获取某动态下用户最近一次创建的对话，实现“继续对话”。
- **这接口能干啥（大白话）**：回到上次在这条动态开的对话，接着聊。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.Feed`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `feedType` | enum `FeedType` |
| `feedId` | string |
| `moment` | message `Moment` |
| `interestCard` | message `InterestCard` |
| `recEventLog` | message `RecEventLog` |

**字段取值**：

- `feedType`：`FEED_TYPE_UNSPECIFIED`、`FEED_TYPE_INTEREST_CARD`、`FEED_TYPE_MOMENT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.ChatService/GetLastChatV2
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.GetLastChatV2Response`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `chatType` | enum `ChatType` |
| `chatTypeSubKey` | string |

**字段取值**：

- `chatType`：`CHAT_TYPE_UNSPECIFIED`、`CHAT_TYPE_ASK_KIMI`、`CHAT_TYPE_CONTINUE`、`CHAT_TYPE_REMIX_CODE_ARTIFACT_DEEP_RESEARCH`、`CHAT_TYPE_REMIX_HTML`、`CHAT_TYPE_REMIX_IMAGE`、`CHAT_TYPE_REMIX_OKC_ARTIFACT`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 003 · GetOriginalMessageCount — 获取原始消息数

**服务**：`moment.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.ChatService/GetOriginalMessageCount`

- **API用途**：获取该动态对话可展示的原始消息条数。
- **这接口能干啥（大白话）**：看这条动态对话原本有多少条消息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.GetOriginalMessageCountRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `momentId` | string |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.ChatService/GetOriginalMessageCount
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.GetOriginalMessageCountResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `messageCount` | int32 |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 004 · GetRawShareChatV2 — 获取原始分享对话

**服务**：`moment.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.ChatService/GetRawShareChatV2`

- **API用途**：获取分享卡片对应的原始对话内容（V2）。
- **这接口能干啥（大白话）**：把分享卡片背后的原始对话内容取出来。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.GetRawShareChatV2Request`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatShareId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.ChatService/GetRawShareChatV2
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.GetRawShareChatV2Response`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `share` | message `ChatShare` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 005 · ReChat — 动态追问

**服务**：`moment.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.ChatService/ReChat`

- **API用途**：在动态对话中继续发送追问消息。
- **这接口能干啥（大白话）**：在动态对话里继续追问。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.Feed`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `feedType` | enum `FeedType` |
| `feedId` | string |
| `moment` | message `Moment` |
| `interestCard` | message `InterestCard` |
| `recEventLog` | message `RecEventLog` |

**字段取值**：

- `feedType`：`FEED_TYPE_UNSPECIFIED`、`FEED_TYPE_INTEREST_CARD`、`FEED_TYPE_MOMENT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.ChatService/ReChat
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ReChatResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `chat` | message `Chat` |
| `chatType` | enum `ChatType` |
| `chatTypeSubKey` | string |

**字段取值**：

- `chatType`：`CHAT_TYPE_UNSPECIFIED`、`CHAT_TYPE_ASK_KIMI`、`CHAT_TYPE_CONTINUE`、`CHAT_TYPE_REMIX_CODE_ARTIFACT_DEEP_RESEARCH`、`CHAT_TYPE_REMIX_HTML`、`CHAT_TYPE_REMIX_IMAGE`、`CHAT_TYPE_REMIX_OKC_ARTIFACT`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区-评论 · `moment.v1.CommentService`（5 个方法）

### 006 · CreateComment — 发表评论

**服务**：`moment.v1.CommentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.CommentService/CreateComment`

- **API用途**：对动态发表评论或回复某条评论（parentCommentId），支持 @ 用户与图片。
- **这接口能干啥（大白话）**：发评论；也能回复别人的评论（带 targetCommentId）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.CreateCommentRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `momentId` | string |
| `targetCommentId` | string |
| `content` | message `CommentContent` |
| `mentions` | repeated |
| `links` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.CommentService/CreateComment
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.CreateCommentResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `comment` | message `Comment` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 007 · DeleteComment — 删除评论

**服务**：`moment.v1.CommentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.CommentService/DeleteComment`

- **API用途**：删除自己的评论；若有子评论会一并影响展示。
- **这接口能干啥（大白话）**：删掉自己的评论。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.DeleteCommentRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `commentId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.CommentService/DeleteComment
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式**

无独立 Response 消息；通常返回空对象 `{}`（删除/无返回体类接口）。

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 008 · ListComments — 列出评论

**服务**：`moment.v1.CommentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.CommentService/ListComments`

- **API用途**：分页拉取某动态的一级评论列表。
- **这接口能干啥（大白话）**：拉一页这条动态下的评论。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.Feed`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `feedType` | enum `FeedType` |
| `feedId` | string |
| `moment` | message `Moment` |
| `interestCard` | message `InterestCard` |
| `recEventLog` | message `RecEventLog` |

**字段取值**：

- `feedType`：`FEED_TYPE_UNSPECIFIED`、`FEED_TYPE_INTEREST_CARD`、`FEED_TYPE_MOMENT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.CommentService/ListComments
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListCommentsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `pageStat` | message `PageStat` |
| `isLastPage` | bool |
| `pinnedCommentId` | string |
| `comments` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 009 · ListSubComments — 列出子评论

**服务**：`moment.v1.CommentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.CommentService/ListSubComments`

- **API用途**：拉取某条评论下的二级（子）评论列表。
- **这接口能干啥（大白话）**：看某条评论下面的回复（二级评论）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListCommentsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `pageStat` | message `PageStat` |
| `isLastPage` | bool |
| `pinnedCommentId` | string |
| `comments` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.CommentService/ListSubComments
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListSubCommentsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `subComments` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 010 · VoteComment — 评论点赞/投票

**服务**：`moment.v1.CommentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.CommentService/VoteComment`

- **API用途**：对评论执行点赞/取消点赞/点踩，action 决定方向。
- **这接口能干啥（大白话）**：给评论点赞、取消点赞或点踩。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.VoteCommentRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `commentId` | string |
| `voteAction` | enum `CommentVoteAction` |

**字段取值**：

- `voteAction`：`COMMENT_VOTE_ACTION_UNSPECIFIED`、`COMMENT_VOTE_ACTION_CANCEL_DISLIKE`、`COMMENT_VOTE_ACTION_CANCEL_LIKE`、`COMMENT_VOTE_ACTION_DISLIKE`、`COMMENT_VOTE_ACTION_LIKE`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.CommentService/VoteComment
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.VoteCommentResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区-举报 · `moment.v1.ComplaintService`（1 个方法）

### 011 · CreateComplaint — 提交举报

**服务**：`moment.v1.ComplaintService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.ComplaintService/CreateComplaint`

- **API用途**：对动态/评论/用户提交举报，含举报类型、原因与佐证材料。
- **这接口能干啥（大白话）**：举报动态/评论/用户，选类型写理由。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.CreateComplaintRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `objectType` | enum `ComplaintObjectType` |
| `objectId` | string |
| `reason` | string |

**字段取值**：

- `objectType`：`COMPLAINT_OBJECT_TYPE_UNSPECIFIED`、`COMPLAINT_OBJECT_TYPE_COMMENT`、`COMPLAINT_OBJECT_TYPE_MOMENT`、`COMPLAINT_OBJECT_TYPE_USER`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.ComplaintService/CreateComplaint
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.CreateComplaintResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

## 社区配置 · `moment.v1.ConfigService`（1 个方法）

### 012 · GetConfig — 获取社区配置

**服务**：`moment.v1.ConfigService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.ConfigService/GetConfig`

- **API用途**：拉取社区模块的功能开关、文案与阈值配置。
- **这接口能干啥（大白话）**：拉社区的功能开关和文案配置。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.GetConfigRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.ConfigService/GetConfig
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.GetConfigResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `notification` | message `NotificationConfig` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区-收藏 · `moment.v1.FavoriteService`（2 个方法）

### 013 · CreateFavorite — 收藏动态

**服务**：`moment.v1.FavoriteService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.FavoriteService/CreateFavorite`

- **API用途**：收藏一条动态到个人收藏夹，支持分组/备注。
- **这接口能干啥（大白话）**：把动态收进自己的收藏夹。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.CreateFavoriteRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `momentId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.FavoriteService/CreateFavorite
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.CreateFavoriteResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 014 · DeleteFavorite — 取消收藏

**服务**：`moment.v1.FavoriteService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.FavoriteService/DeleteFavorite`

- **API用途**：取消对某条动态的收藏。
- **这接口能干啥（大白话）**：取消收藏。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.DeleteFavoriteRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `momentId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.FavoriteService/DeleteFavorite
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.DeleteFavoriteResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

## 社区信息流 · `moment.v1.FeedService`（4 个方法）

### 015 · GetFeed — 获取信息流

**服务**：`moment.v1.FeedService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.FeedService/GetFeed`

- **API用途**：按 feed 场景（推荐/关注/话题）拉取信息流单页数据，支持游标分页。
- **这接口能干啥（大白话）**：打开某条动态/某类卡片看详情时用。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.GetFeedRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `feedType` | enum `FeedType` |
| `feedId` | string |

**字段取值**：

- `feedType`：`FEED_TYPE_UNSPECIFIED`、`FEED_TYPE_INTEREST_CARD`、`FEED_TYPE_MOMENT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.FeedService/GetFeed
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.GetFeedResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `feed` | message `Feed` |
| `similarMoments` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 016 · ListFeeds — 列出信息流列表

**服务**：`moment.v1.FeedService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.FeedService/ListFeeds`

- **API用途**：批量拉取多个 feed 的信息流内容，社区首页主接口。
- **这接口能干啥（大白话）**：刷社区首页靠它：按分类拉一页动态（推荐/关注/话题/我的收藏/我点赞/我发布），翻页用 pageToken。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListFeedsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `sessionId` | string |
| `pageSize` | int32 |
| `pageToken` | string |
| `category` | enum `FeedCategory` |
| `userId` | string |
| `pinnedMomentId` | string |
| `hashtagId` | string |

**字段取值**：

- `category`：`FEED_CATEGORY_UNSPECIFIED`、`FEED_CATEGORY_FOLLOW`、`FEED_CATEGORY_HASHTAG`、`FEED_CATEGORY_RECOMMEND`、`FEED_CATEGORY_USER_FAVORITE`、`FEED_CATEGORY_USER_LIKES`、`FEED_CATEGORY_USER_PUBLISH`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.FeedService/ListFeeds
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListFeedsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `isLastPage` | bool |
| `feeds` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 017 · ListFollowUnread — 关注动态未读列表

**服务**：`moment.v1.FeedService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.FeedService/ListFollowUnread`

- **API用途**：拉取“关注”流中未读的新动态，用于红点与未读提示。
- **这接口能干啥（大白话）**：看“关注”里有没有新动态，用来点亮红点。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListFollowUnreadRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.FeedService/ListFollowUnread
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListFollowUnreadResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `items` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 018 · MarkReadForFollow — 标记关注流已读

**服务**：`moment.v1.FeedService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.FeedService/MarkReadForFollow`

- **API用途**：把关注流中的动态标记为已读，清除未读红点。
- **这接口能干啥（大白话）**：把关注流的新动态看过，清掉红点。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.MarkReadForFollowRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `followUserId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.FeedService/MarkReadForFollow
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.MarkReadForFollowResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区-关注 · `moment.v1.FollowService`（3 个方法）

### 019 · ListFollows — 列出关注关系

**服务**：`moment.v1.FollowService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.FollowService/ListFollows`

- **API用途**：分页列出某用户的关注/粉丝列表（followers/following）。
- **这接口能干啥（大白话）**：看某人的关注列表或粉丝列表。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListFollowsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `followType` | enum `FollowType` |
| `pageSize` | int32 |
| `pageToken` | string |
| `userId` | string |

**字段取值**：

- `followType`：`FOLLOW_TYPE_UNSPECIFIED`、`FOLLOW_TYPE_FOLLOWERS`、`FOLLOW_TYPE_FOLLOWINGS`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.FollowService/ListFollows
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListFollowsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `userInfos` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 020 · ModifyBlock — 拉黑/解除拉黑

**服务**：`moment.v1.FollowService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.FollowService/ModifyBlock`

- **API用途**：拉黑或解除拉黑某用户，拉黑后互相不可见动态与评论。
- **这接口能干啥（大白话）**：拉黑某人，或把某人从黑名单放出来。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ModifyBlockRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `userId` | string |
| `action` | enum `BlockAction` |

**字段取值**：

- `action`：`BLOCK_ACTION_UNSPECIFIED`、`BLOCK_ACTION_BLOCK`、`BLOCK_ACTION_UNBLOCK`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.FollowService/ModifyBlock
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ModifyBlockResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `userId` | string |
| `blockStatus` | enum `BlockStatus` |

**字段取值**：

- `blockStatus`：`BLOCK_STATUS_UNSPECIFIED`、`BLOCK_STATUS_BLOCKED`、`BLOCK_STATUS_NOT_BLOCKED`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 021 · ModifyFollow — 关注/取关

**服务**：`moment.v1.FollowService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.FollowService/ModifyFollow`

- **API用途**：关注或取消关注某用户，action 决定方向。
- **这接口能干啥（大白话）**：关注或取关某人。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ModifyFollowRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `userId` | string |
| `action` | enum `FollowAction` |

**字段取值**：

- `action`：`FOLLOW_ACTION_UNSPECIFIED`、`FOLLOW_ACTION_FOLLOW`、`FOLLOW_ACTION_UNFOLLOW`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.FollowService/ModifyFollow
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ModifyFollowResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `userId` | string |
| `followStatus` | enum `FollowStatus` |

**字段取值**：

- `followStatus`：`FOLLOW_STATUS_UNSPECIFIED`、`FOLLOW_STATUS_FOLLOWED`、`FOLLOW_STATUS_FOLLOWING`、`FOLLOW_STATUS_MUTUAL_FOLLOWING`、`FOLLOW_STATUS_NOT_FOLLOWING`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区-话题 · `moment.v1.HashtagService`（3 个方法）

### 022 · GetHashtag — 获取话题详情

**服务**：`moment.v1.HashtagService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.HashtagService/GetHashtag`

- **API用途**：按话题 ID 获取话题详情（标题、简介、参与量、代表动态）。
- **这接口能干啥（大白话）**：看一个话题的详情（介绍、热度、代表动态）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.GetHashtagRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.HashtagService/GetHashtag
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.GetHashtagResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `hashtag` | message `HashtagItem` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 023 · ListHashtags — 列出话题

**服务**：`moment.v1.HashtagService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.HashtagService/ListHashtags`

- **API用途**：分页列出话题列表（热门/推荐/全部）。
- **这接口能干啥（大白话）**：列出话题列表。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListHashtagsRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.HashtagService/ListHashtags
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListHashtagsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `topUpHashtags` | repeated |
| `recentUsedHashtags` | repeated |
| `allHashtags` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 024 · RecommendHashtags — 推荐话题

**服务**：`moment.v1.HashtagService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.HashtagService/RecommendHashtags`

- **API用途**：基于输入文本或草稿推荐相关话题，发布动态时的话题联想。
- **这接口能干啥（大白话）**：你打字时帮你联想该加什么话题。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.RecommendHashtagsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `title` | string |
| `text` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.HashtagService/RecommendHashtags
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.RecommendHashtagsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `hashtags` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区-兴趣 · `moment.v1.InterestService`（2 个方法）

### 025 · ReportSelections — 上报兴趣选择

**服务**：`moment.v1.InterestService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.InterestService/ReportSelections`

- **API用途**：上报兴趣标签的曝光/选择行为，用于推荐调优。
- **这接口能干啥（大白话）**：把你对兴趣标签的曝光/选择行为回报给推荐。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ReportSelectionsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `selections` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.InterestService/ReportSelections
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ReportSelectionsResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 026 · SubmitSelections — 提交兴趣选择

**服务**：`moment.v1.InterestService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.InterestService/SubmitSelections`

- **API用途**：新用户兴趣冷启动：提交所选兴趣标签。
- **这接口能干啥（大白话）**：新用户选兴趣标签，决定一开始给你推什么。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.SubmitSelectionsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `selections` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.InterestService/SubmitSelections
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.SubmitSelectionsResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区-动态 · `moment.v1.MomentService`（6 个方法）

### 027 · CreateMoment — 发布动态

**服务**：`moment.v1.MomentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.MomentService/CreateMoment`

- **API用途**：发布一条社区动态（moment），支持图文、话题、@ 用户、关联对话分享卡片（chatShareId）。文本与图片分别通过 text / images 上传；发布成功返回动态 ID。
- **这接口能干啥（大白话）**：发动态：配文字、图片、话题、@人，还能带上一条对话分享卡片。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.CreateMomentRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `text` | string |
| `title` | string |
| `chatShareId` | string |
| `visibility` | enum `MomentVisibility` |
| `artifactShareId` | string |
| `images` | repeated |
| `mentions` | repeated |
| `links` | repeated |
| `hashtagIds` | repeated |

**字段取值**：

- `visibility`：`MOMENT_VISIBILITY_UNSPECIFIED`、`MOMENT_VISIBILITY_PUBLIC`、`MOMENT_VISIBILITY_SELF`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.MomentService/CreateMoment
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.CreateMomentResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `moment` | message `Moment` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 028 · DeleteMoment — 删除动态

**服务**：`moment.v1.MomentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.MomentService/DeleteMoment`

- **API用途**：删除自己发布的动态。仅作者本人可删；成功后该动态从信息流与个人主页移除。
- **这接口能干啥（大白话）**：删掉自己发的动态。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.DeleteMomentRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `momentId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.MomentService/DeleteMoment
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式**

无独立 Response 消息；通常返回空对象 `{}`（删除/无返回体类接口）。

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 029 · GetChatShareCard — 获取对话分享卡片

**服务**：`moment.v1.MomentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.MomentService/GetChatShareCard`

- **API用途**：获取动态内嵌的对话分享卡片（ChatShareCard）渲染数据。
- **这接口能干啥（大白话）**：把动态里内嵌的对话分享卡片渲染出来。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.GetChatShareCardRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatShareId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.MomentService/GetChatShareCard
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.GetChatShareCardResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatShareCard` | message `ChatShareCard` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 030 · ListMomentAskKimiQuestions — 列出动态提问

**服务**：`moment.v1.MomentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.MomentService/ListMomentAskKimiQuestions`

- **API用途**：获取某动态下“问 Kimi”生成的问题列表及其回答入口。
- **这接口能干啥（大白话）**：看别人在这条动态下问了 Kimi 什么问题、Kimi 怎么答的。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListMomentAskKimiQuestionsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `momentId` | string |
| `limit` | int32 |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.MomentService/ListMomentAskKimiQuestions
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListMomentAskKimiQuestionsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `askKimiQuestions` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 031 · ListSimilarMoments — 列出相似动态

**服务**：`moment.v1.MomentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.MomentService/ListSimilarMoments`

- **API用途**：按当前动态内容/话题召回相似动态列表，用于详情页“更多相似内容”推荐。
- **这接口能干啥（大白话）**：看“更多相似动态”，在动态详情页往下刷类似内容。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListSimilarMomentsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `momentId` | string |
| `pageSize` | int32 |
| `pageToken` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.MomentService/ListSimilarMoments
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListSimilarMomentsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `items` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 032 · VoteMoment — 动态点赞/投票

**服务**：`moment.v1.MomentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.MomentService/VoteMoment`

- **API用途**：对动态执行投票动作（点赞/取消点赞/点踩等），action 决定方向。这是社区“点赞”的核心接口。
- **这接口能干啥（大白话）**：给动态点赞、取消点赞或点踩。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.VoteMomentRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `momentId` | string |
| `voteAction` | enum `MomentVoteAction` |

**字段取值**：

- `voteAction`：`MOMENT_VOTE_ACTION_UNSPECIFIED`、`MOMENT_VOTE_ACTION_CANCEL_DISLIKE`、`MOMENT_VOTE_ACTION_CANCEL_LIKE`、`MOMENT_VOTE_ACTION_DISLIKE`、`MOMENT_VOTE_ACTION_LIKE`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.MomentService/VoteMoment
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.VoteMomentResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区-屏蔽 · `moment.v1.MuteService`（4 个方法）

### 033 · AppendMuteReasons — 追加上报屏蔽原因

**服务**：`moment.v1.MuteService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.MuteService/AppendMuteReasons`

- **API用途**：用户执行屏蔽时追加/上报具体屏蔽原因，用于个性化推荐。
- **这接口能干啥（大白话）**：把你选的屏蔽原因上报给推荐系统。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.AppendMuteReasonsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `objectType` | enum `MuteObjectType` |
| `objectId` | string |
| `advice` | string |
| `reasonIds` | repeated |

**字段取值**：

- `objectType`：`MUTE_OBJECT_TYPE_UNSPECIFIED`、`MUTE_OBJECT_TYPE_AIGC_MOMENT_CONTENT`、`MUTE_OBJECT_TYPE_BOT_COMMENT`、`MUTE_OBJECT_TYPE_MOMENT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.MuteService/AppendMuteReasons
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.AppendMuteReasonsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `msg` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 034 · ListMuteReasons — 列出屏蔽原因

**服务**：`moment.v1.MuteService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.MuteService/ListMuteReasons`

- **API用途**：拉取可供选择的屏蔽原因枚举列表。
- **这接口能干啥（大白话）**：拉出“为什么不想看”的可选原因。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListMuteReasonsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `objectType` | enum `MuteObjectType` |

**字段取值**：

- `objectType`：`MUTE_OBJECT_TYPE_UNSPECIFIED`、`MUTE_OBJECT_TYPE_AIGC_MOMENT_CONTENT`、`MUTE_OBJECT_TYPE_BOT_COMMENT`、`MUTE_OBJECT_TYPE_MOMENT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.MuteService/ListMuteReasons
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListMuteReasonsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `reasons` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 035 · Mute — 屏蔽内容/用户

**服务**：`moment.v1.MuteService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.MuteService/Mute`

- **API用途**：屏蔽指定用户或内容（含屏蔽原因），屏蔽后不再出现于信息流。
- **这接口能干啥（大白话）**：不想再看到某人/某内容，直接屏蔽。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.MuteRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `objectType` | enum `MuteObjectType` |
| `objectId` | string |
| `reason` | string |

**字段取值**：

- `objectType`：`MUTE_OBJECT_TYPE_UNSPECIFIED`、`MUTE_OBJECT_TYPE_AIGC_MOMENT_CONTENT`、`MUTE_OBJECT_TYPE_BOT_COMMENT`、`MUTE_OBJECT_TYPE_MOMENT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.MuteService/Mute
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.MuteResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `msg` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 036 · UnMute — 取消屏蔽

**服务**：`moment.v1.MuteService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.MuteService/UnMute`

- **API用途**：解除对某用户/内容的屏蔽。
- **这接口能干啥（大白话）**：解除屏蔽。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.UnMuteRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `objectType` | enum `MuteObjectType` |
| `objectId` | string |

**字段取值**：

- `objectType`：`MUTE_OBJECT_TYPE_UNSPECIFIED`、`MUTE_OBJECT_TYPE_AIGC_MOMENT_CONTENT`、`MUTE_OBJECT_TYPE_BOT_COMMENT`、`MUTE_OBJECT_TYPE_MOMENT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.MuteService/UnMute
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.UnMuteResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区通知 · `moment.v1.NotificationService`（5 个方法）

### 037 · GetReminderStatus — 获取提醒状态

**服务**：`moment.v1.NotificationService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.NotificationService/GetReminderStatus`

- **API用途**：获取提醒的汇总状态（各类型未读数）。
- **这接口能干啥（大白话）**：看各类提醒的未读数（小红点数字）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.GetReminderStatusRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.NotificationService/GetReminderStatus
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.GetReminderStatusResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `hasUnread` | bool |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 038 · ListNotification — 列出社区通知

**服务**：`moment.v1.NotificationService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.NotificationService/ListNotification`

- **API用途**：分页拉取社区通知（点赞/评论/关注等）。
- **这接口能干啥（大白话）**：看社区里的通知（谁点赞、谁评论、谁关注）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListNotificationRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `idGt` | string |
| `idLt` | string |
| `limit` | int32 |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.NotificationService/ListNotification
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListNotificationResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `notifications` | repeated |
| `moments` | repeated |
| `comments` | repeated |
| `users` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 039 · ListReminders — 列出提醒

**服务**：`moment.v1.NotificationService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.NotificationService/ListReminders`

- **API用途**：拉取社区提醒（未读消息/待处理）列表。
- **这接口能干啥（大白话）**：看社区提醒列表。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListRemindersRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.NotificationService/ListReminders
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListRemindersResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `items` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 040 · MarkRead — 标记通知已读

**服务**：`moment.v1.NotificationService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.NotificationService/MarkRead`

- **API用途**：将指定社区通知标记为已读。
- **这接口能干啥（大白话）**：把社区通知标成已读。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.MarkReadRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `idLte` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.NotificationService/MarkRead
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.MarkReadResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 041 · MarkReadForReminder — 标记提醒已读

**服务**：`moment.v1.NotificationService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.NotificationService/MarkReadForReminder`

- **API用途**：把某类型提醒标记为已读。
- **这接口能干啥（大白话）**：把某类提醒标成已读。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.MarkReadForReminderRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.NotificationService/MarkReadForReminder
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.MarkReadForReminderResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区搜索 · `moment.v1.SearchService`（5 个方法）

### 042 · ListHotHashtagsInSearch — 搜索页热门话题

**服务**：`moment.v1.SearchService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.SearchService/ListHotHashtagsInSearch`

- **API用途**：搜索入口页展示的热门话题列表。
- **这接口能干啥（大白话）**：搜索页顶部展示的热门话题。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListHotHashtagsInSearchRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.SearchService/ListHotHashtagsInSearch
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListHotHashtagsInSearchResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `hashtags` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 043 · SearchHashtags — 搜索话题

**服务**：`moment.v1.SearchService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.SearchService/SearchHashtags`

- **API用途**：按关键词搜索话题。
- **这接口能干啥（大白话）**：按关键词搜话题。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.SearchHashtagsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `query` | string |
| `pageSize` | int32 |
| `pageToken` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.SearchService/SearchHashtags
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.SearchHashtagsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `hashtags` | repeated |
| `relatedHashtags` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 044 · SearchMoments — 搜索动态

**服务**：`moment.v1.SearchService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.SearchService/SearchMoments`

- **API用途**：按关键词搜索动态，返回命中动态列表与高亮信息。
- **这接口能干啥（大白话）**：按关键词搜动态。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.SearchMomentsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `query` | string |
| `pageSize` | int32 |
| `pageToken` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.SearchService/SearchMoments
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.SearchMomentsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `moments` | repeated |
| `relatedMoments` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 045 · SearchUsers — 搜索用户

**服务**：`moment.v1.SearchService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.SearchService/SearchUsers`

- **API用途**：按关键词搜索社区用户。
- **这接口能干啥（大白话）**：按关键词搜用户。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.SearchUsersRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `query` | string |
| `pageSize` | int32 |
| `pageToken` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.SearchService/SearchUsers
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.SearchUsersResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `users` | repeated |
| `relatedUsers` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 046 · SuggestSearchQuery — 搜索联想词

**服务**：`moment.v1.SearchService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.SearchService/SuggestSearchQuery`

- **API用途**：输入时返回搜索联想词/补全建议。
- **这接口能干啥（大白话）**：搜索框里给联想词/补全。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.SuggestSearchQueryRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `query` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.SearchService/SuggestSearchQuery
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.SuggestSearchQueryResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `suggestedQueries` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区-上传 · `moment.v1.UploadService`（2 个方法）

### 047 · CreateFile — 登记上传文件

**服务**：`moment.v1.UploadService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.UploadService/CreateFile`

- **API用途**：图片直传完成后，把对象存储 key 登记为社区文件，返回可引用的文件 ID/URL。
- **这接口能干啥（大白话）**：图片传完后登记一下，拿到社区里能引用的文件。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.CreateFileRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `fileName` | string |
| `fileId` | string |
| `extra` | message `ImageExtra` |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.UploadService/CreateFile
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.CreateFileResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `fileId` | string |
| `fileName` | string |
| `size` | int32 |
| `originUrl` | string |
| `thumbnailUrl` | string |
| `contentType` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 048 · GeneratePresignedURL — 获取上传预签名 URL

**服务**：`moment.v1.UploadService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.UploadService/GeneratePresignedURL`

- **API用途**：为动态图片/文件申请对象存储预签名直传 URL（PUT 到 OSS/COS）。
- **这接口能干啥（大白话）**：发图前先拿一个直传地址，图片直接传到云存储。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.GeneratePresignedURLRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `fileType` | enum `FileType` |

**字段取值**：

- `fileType`：`FILE_TYPE_UNSPECIFIED`、`FILE_TYPE_FILE`、`FILE_TYPE_IMAGE`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.UploadService/GeneratePresignedURL
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.GeneratePresignedURLResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `uploadUrl` | string |
| `objectName` | string |
| `fileId` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 社区用户 · `moment.v1.UserService`（3 个方法）

### 049 · GetMe — 获取我的社区资料

**服务**：`moment.v1.UserService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.UserService/GetMe`

- **API用途**：获取当前登录用户的社区侧资料（昵称、头像、统计、关注数等）。
- **这接口能干啥（大白话）**：看自己的社区资料（昵称、头像、粉丝/关注数）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.GetMeRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `view` | enum `UserProfileView` |

**字段取值**：

- `view`：`USER_PROFILE_VIEW_UNSPECIFIED`、`USER_PROFILE_VIEW_BASIC`、`USER_PROFILE_VIEW_FULL`、`USER_PROFILE_VIEW_LITE`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.UserService/GetMe
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.GetMeResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `userBase` | message `UserBase` |
| `userStat` | message `UserStat` |
| `userInfo` | message `UserInfo` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 050 · GetUserProfile — 获取用户主页

**服务**：`moment.v1.UserService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.UserService/GetUserProfile`

- **API用途**：按用户 ID 获取社区主页资料与关系状态（是否已关注/是否拉黑/是否互关）。
- **这接口能干啥（大白话）**：看别人的社区主页，顺带知道你有没有关注/拉黑对方。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.GetUserProfileRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `userId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.UserService/GetUserProfile
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.GetUserProfileResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `userBase` | message `UserBase` |
| `userStat` | message `UserStat` |
| `interactionStatus` | message `UserRelationStatus` |
| `userInfo` | message `UserInfo` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 051 · ListMentionableBots — 列出可 @ 的机器人

**服务**：`moment.v1.UserService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/moment.v1.UserService/ListMentionableBots`

- **API用途**：列出当前可在动态/评论中 @ 的机器人（Kimi 智能体）列表。
- **这接口能干啥（大白话）**：列出发动态/评论时能 @ 的机器人。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.moment.v1.ListMentionableBotsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `sceneType` | enum `MentionableSceneType` |

**字段取值**：

- `sceneType`：`MENTIONABLE_SCENE_TYPE_UNSPECIFIED`、`MENTIONABLE_SCENE_TYPE_AGENT`、`MENTIONABLE_SCENE_TYPE_COMMENT_KIMI`

**调用示例**

```http
POST https://www.kimi.com/apiv2/moment.v1.UserService/ListMentionableBots
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.moment.v1.ListMentionableBotsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `bots` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 对话 · `kimi.gateway.chat.v1.ChatService`（28 个方法）

### 052 · BatchDeleteChats — 批量删除会话

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/BatchDeleteChats`

- **API用途**：批量删除会话。
- **这接口能干啥（大白话）**：一次删掉多个会话。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.BatchDeleteChatsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatIds` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/BatchDeleteChats
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.BatchDeleteChatsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatIds` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 053 · CancelChat — 取消对话

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/CancelChat`

- **API用途**：取消正在进行的生成。
- **这接口能干啥（大白话）**：正在生成时点“停止”就调它。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.CancelChatRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/CancelChat
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.CancelChatResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 054 · Chat — 发起对话（流式）

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：流式 · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/Chat`

- **API用途**：服务端流式发起一轮对话，逐块返回 SSE/Connect 流事件（思考、正文增量、工具调用、引用等）。
- **这接口能干啥（大白话）**：发消息聊天，回答是一点点“流”出来的（打字机效果）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ChatRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `kimiplusId` | string |
| `scenario` | enum `Scenario` |
| `message` | message `ChatMessage` |
| `options` | message `ChatRequestOptions` |
| `projectId` | string |
| `tools` | repeated |

**字段取值**：

- `scenario`：`SCENARIO_UNSPECIFIED`、`SCENARIO_AUTOMATION`、`SCENARIO_AUTOMATION_K3`、`SCENARIO_BOT`、`SCENARIO_CHAT`、`SCENARIO_DEEP_RESEARCH`、`SCENARIO_K2`、`SCENARIO_K2D5`、`SCENARIO_K3`、`SCENARIO_KIMI_PLUS`、`SCENARIO_KODER`、`SCENARIO_OK_COMPUTER`、`SCENARIO_OK_COMPUTER_SWARM`、`SCENARIO_PROBLEM_SOLVE`、`SCENARIO_SKILLCREATOR`、`SCENARIO_SLIDES`、`SCENARIO_THINK`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/Chat
Content-Type: application/connect+json
Authorization: Bearer <accessToken>
x-msh-device-id: <deviceId>
Body(JSON): { ...<Request 字段>... }
--> 200 OK；响应为 Connect 流帧，逐帧 JSON 解析
```

**返回格式**

| 事件字段 | 类型 | 语义 |
| --- | --- | --- |
| `op` | enum `Operator` | 帧操作符（枚举 `Operator`：`SET` / `APPEND`），决定本帧是覆盖还是追加 |
| `mask` | string | 字段掩码（字符串），标记本帧实际携带了哪些字段 |
| `eventOffset` | int32 | 事件序号（int32），流内单调递增，用于断线续传定位 |
| `chat` | message `Chat` | 会话元信息变更事件（`Chat`） |
| `message` | message `ChatMessage` | 消息事件（`ChatMessage`）：一条新消息或消息状态更新 |
| `block` | message `Block` | 内容块事件（`Block`）：文本/搜索/思考/工具/产物等增量块 |
| `ref` | message `Ref` | 引用事件（`Ref`）：检索/联网/文件引用 |
| `usage` | message `Usage` | 用量事件（`Usage`）：token / 额度消耗 |
| `notification` | message `Notification` | 通知事件（`Notification`）：付费墙 / 提示条 |
| `done` | message `Done` | 结束事件（`Done`，空消息）：本轮流式结束 |
| `heartbeat` | message `Heartbeat` | 心跳事件（`Heartbeat`，空消息）：保活 |
| `tts` | message `MessageSpeechResponse` | 语音合成事件（`MessageSpeechResponse`）：音频分片 |
| `interaction` | message `Interaction` | 交互事件（`Interaction`）：需要用户回答/确认 |
| `interactionAck` | message `InteractionAck` | 交互确认事件（`InteractionAck`） |

**字段取值**：

- `op`：`OPERATOR_UNSPECIFIED`、`append`、`set`

流式响应： **无单一 Response 消息**，为 Connect 事件帧序列（帧负载 = `ChatResponse` 事件信封）。

**返回解析说明**

逐帧按行解析，按事件名（字段存在性）分派；`error` 帧需中断并展示错误；最后处理连接关闭/超时重连；断线后可用 ContinueChat/ResumeChat 续传。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

### 055 · ChatFromCase — 案例对话（流式）

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：流式 · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ChatFromCase`

- **API用途**：从案例/模板发起对话（流式）。
- **这接口能干啥（大白话）**：从案例/模板一键开启一段对话。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ChatFromCaseRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `caseId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ChatFromCase
Content-Type: application/connect+json
Authorization: Bearer <accessToken>
x-msh-device-id: <deviceId>
Body(JSON): { ...<Request 字段>... }
--> 200 OK；响应为 Connect 流帧，逐帧 JSON 解析
```

**返回格式**

| 事件字段 | 类型 | 语义 |
| --- | --- | --- |
| `op` | enum `Operator` | 帧操作符（枚举 `Operator`：`SET` / `APPEND`），决定本帧是覆盖还是追加 |
| `mask` | string | 字段掩码（字符串），标记本帧实际携带了哪些字段 |
| `eventOffset` | int32 | 事件序号（int32），流内单调递增，用于断线续传定位 |
| `chat` | message `Chat` | 会话元信息变更事件（`Chat`） |
| `message` | message `ChatMessage` | 消息事件（`ChatMessage`）：一条新消息或消息状态更新 |
| `block` | message `Block` | 内容块事件（`Block`）：文本/搜索/思考/工具/产物等增量块 |
| `ref` | message `Ref` | 引用事件（`Ref`）：检索/联网/文件引用 |
| `usage` | message `Usage` | 用量事件（`Usage`）：token / 额度消耗 |
| `notification` | message `Notification` | 通知事件（`Notification`）：付费墙 / 提示条 |
| `done` | message `Done` | 结束事件（`Done`，空消息）：本轮流式结束 |
| `heartbeat` | message `Heartbeat` | 心跳事件（`Heartbeat`，空消息）：保活 |
| `tts` | message `MessageSpeechResponse` | 语音合成事件（`MessageSpeechResponse`）：音频分片 |
| `interaction` | message `Interaction` | 交互事件（`Interaction`）：需要用户回答/确认 |
| `interactionAck` | message `InteractionAck` | 交互确认事件（`InteractionAck`） |

**字段取值**：

- `op`：`OPERATOR_UNSPECIFIED`、`append`、`set`

流式响应： **无单一 Response 消息**，为 Connect 事件帧序列（帧负载 = `ChatResponse` 事件信封）。

**返回解析说明**

逐帧按行解析，按事件名（字段存在性）分派；`error` 帧需中断并展示错误；最后处理连接关闭/超时重连；断线后可用 ContinueChat/ResumeChat 续传。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

### 056 · ContinueChat — 继续对话（流式）

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：流式 · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ContinueChat`

- **API用途**：对已中断/待继续的对话继续生成（流式）。
- **这接口能干啥（大白话）**：对话被中断后接着往下生成。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ContinueChatRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ContinueChat
Content-Type: application/connect+json
Authorization: Bearer <accessToken>
x-msh-device-id: <deviceId>
Body(JSON): { ...<Request 字段>... }
--> 200 OK；响应为 Connect 流帧，逐帧 JSON 解析
```

**返回格式**

| 事件字段 | 类型 | 语义 |
| --- | --- | --- |
| `op` | enum `Operator` | 帧操作符（枚举 `Operator`：`SET` / `APPEND`），决定本帧是覆盖还是追加 |
| `mask` | string | 字段掩码（字符串），标记本帧实际携带了哪些字段 |
| `eventOffset` | int32 | 事件序号（int32），流内单调递增，用于断线续传定位 |
| `chat` | message `Chat` | 会话元信息变更事件（`Chat`） |
| `message` | message `ChatMessage` | 消息事件（`ChatMessage`）：一条新消息或消息状态更新 |
| `block` | message `Block` | 内容块事件（`Block`）：文本/搜索/思考/工具/产物等增量块 |
| `ref` | message `Ref` | 引用事件（`Ref`）：检索/联网/文件引用 |
| `usage` | message `Usage` | 用量事件（`Usage`）：token / 额度消耗 |
| `notification` | message `Notification` | 通知事件（`Notification`）：付费墙 / 提示条 |
| `done` | message `Done` | 结束事件（`Done`，空消息）：本轮流式结束 |
| `heartbeat` | message `Heartbeat` | 心跳事件（`Heartbeat`，空消息）：保活 |
| `tts` | message `MessageSpeechResponse` | 语音合成事件（`MessageSpeechResponse`）：音频分片 |
| `interaction` | message `Interaction` | 交互事件（`Interaction`）：需要用户回答/确认 |
| `interactionAck` | message `InteractionAck` | 交互确认事件（`InteractionAck`） |

**字段取值**：

- `op`：`OPERATOR_UNSPECIFIED`、`append`、`set`

流式响应： **无单一 Response 消息**，为 Connect 事件帧序列（帧负载 = `ChatResponse` 事件信封）。

**返回解析说明**

逐帧按行解析，按事件名（字段存在性）分派；`error` 帧需中断并展示错误；最后处理连接关闭/超时重连；断线后可用 ContinueChat/ResumeChat 续传。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

### 057 · CreateChatFromShare — 创建由分享创建的会话

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/CreateChatFromShare`

- **API用途**：对话模块接口：创建由分享创建的会话（proto 方法 ChatService.CreateChatFromShare）。
- **这接口能干啥（大白话）**：对话：新建由分享创建的会话。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.CreateChatFromShareRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `shareId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/CreateChatFromShare
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.CreateChatFromShareResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chat` | message `Chat` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 058 · CreateChatShare — 创建对话分享

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/CreateChatShare`

- **API用途**：对话模块接口：创建对话分享（proto 方法 ChatService.CreateChatShare）。
- **这接口能干啥（大白话）**：对话：新建对话分享。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.CreateChatShareRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageIds` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/CreateChatShare
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.CreateChatShareResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `share` | message `ChatShare` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 059 · GetChat — 获取会话

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetChat`

- **API用途**：获取单个会话详情及消息。
- **这接口能干啥（大白话）**：打开某个会话看内容。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetChatRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `userId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetChat
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetChatResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chat` | message `Chat` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 060 · GetChatShare — 获取对话分享

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetChatShare`

- **API用途**：对话模块接口：获取对话分享（proto 方法 ChatService.GetChatShare）。
- **这接口能干啥（大白话）**：对话：查看对话分享。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetChatShareRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `shareId` | string |
| `messageOrder` | enum `MessageOrder` |

**字段取值**：

- `messageOrder`：`MESSAGE_ORDER_UNSPECIFIED`、`MESSAGE_ORDER_ASC`、`MESSAGE_ORDER_DESC`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetChatShare
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetChatShareResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `share` | message `ChatShare` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 061 · GetChatShareMessage — 获取对话分享消息

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetChatShareMessage`

- **API用途**：对话模块接口：获取对话分享消息（proto 方法 ChatService.GetChatShareMessage）。
- **这接口能干啥（大白话）**：对话：查看对话分享消息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetChatShareMessageRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `shareId` | string |
| `messageId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetChatShareMessage
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetChatShareMessageResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `message` | message `ChatMessage` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 062 · GetChatShareScreenshot — 获取对话分享截图

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetChatShareScreenshot`

- **API用途**：对话模块接口：获取对话分享截图（proto 方法 ChatService.GetChatShareScreenshot）。
- **这接口能干啥（大白话）**：对话：查看对话分享截图。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetChatShareScreenshotRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `shareId` | string |
| `theme` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetChatShareScreenshot
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetChatShareScreenshotResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `screenshotUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 063 · GetMessage — 获取单条消息

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetMessage`

- **API用途**：获取一条消息详情。
- **这接口能干啥（大白话）**：看某一条消息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetMessageRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetMessage
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetMessageResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `message` | message `ChatMessage` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 064 · GetMessageRecommendPrompts — 获取消息推荐提示词

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetMessageRecommendPrompts`

- **API用途**：对话模块接口：获取消息推荐提示词（proto 方法 ChatService.GetMessageRecommendPrompts）。
- **这接口能干啥（大白话）**：对话：查看消息推荐提示词。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetMessageRecommendPromptsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetMessageRecommendPrompts
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetMessageRecommendPromptsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `prompts` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 065 · GetToolBlock — 获取工具块

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetToolBlock`

- **API用途**：对话模块接口：获取工具块（proto 方法 ChatService.GetToolBlock）。
- **这接口能干啥（大白话）**：对话：查看工具块。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetToolBlockRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `toolCallId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetToolBlock
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetToolBlockResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `toolBlock` | message `ToolBlock` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 066 · GetUnreadChats — 获取未读会话

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetUnreadChats`

- **API用途**：对话模块接口：获取未读会话（proto 方法 ChatService.GetUnreadChats）。
- **这接口能干啥（大白话）**：对话：查看未读会话。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetUnreadChatsRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/GetUnreadChats
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetUnreadChatsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `unreadCount` | int32 |
| `chatIds` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 067 · ListChats — 列出会话

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ListChats`

- **API用途**：分页拉取会话列表。
- **这接口能干啥（大白话）**：拉一页历史会话列表。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ListChatsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `projectId` | string |
| `query` | string |
| `kimiPlusId` | string |
| `withMessageContent` | bool |
| `includePinned` | bool |
| `pageSize` | int32 |
| `pageToken` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ListChats
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ListChatsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `chats` | repeated |
| `pinnedChats` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 068 · ListMessages — 列出消息

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ListMessages`

- **API用途**：分页拉取会话消息。
- **这接口能干啥（大白话）**：拉一页会话里的消息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ListMessagesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `pageSize` | int32 |
| `pageToken` | string |
| `direction` | message |
| `startMessageId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ListMessages
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ListMessagesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `messages` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 069 · MarkChatAsRead — 调用会话已读标记

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/MarkChatAsRead`

- **API用途**：对话模块接口：调用会话已读标记（proto 方法 ChatService.MarkChatAsRead）。
- **这接口能干啥（大白话）**：对话：调用 会话已读标记。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.MarkChatAsReadRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/MarkChatAsRead
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.MarkChatAsReadResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 070 · MessageSpeech — 消息语音合成

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：流式 · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/MessageSpeech`

- **API用途**：把消息正文合成为语音（TTS）。
- **这接口能干啥（大白话）**：把回答读出来（转语音）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.MessageSpeechRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageId` | string |
| `voiceId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/MessageSpeech
Content-Type: application/connect+json
Authorization: Bearer <accessToken>
x-msh-device-id: <deviceId>
Body(JSON): { ...<Request 字段>... }
--> 200 OK；响应为 Connect 流帧，逐帧 JSON 解析
```

**返回格式**

| 事件字段 | 类型 | 语义 |
| --- | --- | --- |
| `op` | enum `Operator` | 帧操作符（枚举 `Operator`：`SET` / `APPEND`），决定本帧是覆盖还是追加 |
| `mask` | string | 字段掩码（字符串），标记本帧实际携带了哪些字段 |
| `eventOffset` | int32 | 事件序号（int32），流内单调递增，用于断线续传定位 |
| `chat` | message `Chat` | 会话元信息变更事件（`Chat`） |
| `message` | message `ChatMessage` | 消息事件（`ChatMessage`）：一条新消息或消息状态更新 |
| `block` | message `Block` | 内容块事件（`Block`）：文本/搜索/思考/工具/产物等增量块 |
| `ref` | message `Ref` | 引用事件（`Ref`）：检索/联网/文件引用 |
| `usage` | message `Usage` | 用量事件（`Usage`）：token / 额度消耗 |
| `notification` | message `Notification` | 通知事件（`Notification`）：付费墙 / 提示条 |
| `done` | message `Done` | 结束事件（`Done`，空消息）：本轮流式结束 |
| `heartbeat` | message `Heartbeat` | 心跳事件（`Heartbeat`，空消息）：保活 |
| `tts` | message `MessageSpeechResponse` | 语音合成事件（`MessageSpeechResponse`）：音频分片 |
| `interaction` | message `Interaction` | 交互事件（`Interaction`）：需要用户回答/确认 |
| `interactionAck` | message `InteractionAck` | 交互确认事件（`InteractionAck`） |

**字段取值**：

- `op`：`OPERATOR_UNSPECIFIED`、`append`、`set`

流式响应： **无单一 Response 消息**，为 Connect 事件帧序列（帧负载 = `ChatResponse` 事件信封）。

**返回解析说明**

逐帧按行解析，按事件名（字段存在性）分派；`error` 帧需中断并展示错误；最后处理连接关闭/超时重连；断线后可用 ContinueChat/ResumeChat 续传。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

### 071 · ProcessAskUserResult — 调用提问结果

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ProcessAskUserResult`

- **API用途**：对话模块接口：调用提问结果（proto 方法 ChatService.ProcessAskUserResult）。
- **这接口能干啥（大白话）**：对话：调用 提问结果。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ProcessAskUserResultRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `artifactId` | string |
| `chatId` | string |
| `answers` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ProcessAskUserResult
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ProcessAskUserResultResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 072 · RegenerateMessage — 重新生成（流式）

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：流式 · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/RegenerateMessage`

- **API用途**：对指定消息重新生成回答（流式）。
- **这接口能干啥（大白话）**：对某条回答不满意，让它重新答一遍。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.RegenerateMessageRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageId` | string |
| `kimiplusId` | string |
| `message` | message `ChatMessage` |
| `scenario` | enum `Scenario` |
| `options` | message `ChatRequestOptions` |
| `tools` | repeated |

**字段取值**：

- `scenario`：`SCENARIO_UNSPECIFIED`、`SCENARIO_AUTOMATION`、`SCENARIO_AUTOMATION_K3`、`SCENARIO_BOT`、`SCENARIO_CHAT`、`SCENARIO_DEEP_RESEARCH`、`SCENARIO_K2`、`SCENARIO_K2D5`、`SCENARIO_K3`、`SCENARIO_KIMI_PLUS`、`SCENARIO_KODER`、`SCENARIO_OK_COMPUTER`、`SCENARIO_OK_COMPUTER_SWARM`、`SCENARIO_PROBLEM_SOLVE`、`SCENARIO_SKILLCREATOR`、`SCENARIO_SLIDES`、`SCENARIO_THINK`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/RegenerateMessage
Content-Type: application/connect+json
Authorization: Bearer <accessToken>
x-msh-device-id: <deviceId>
Body(JSON): { ...<Request 字段>... }
--> 200 OK；响应为 Connect 流帧，逐帧 JSON 解析
```

**返回格式**

| 事件字段 | 类型 | 语义 |
| --- | --- | --- |
| `op` | enum `Operator` | 帧操作符（枚举 `Operator`：`SET` / `APPEND`），决定本帧是覆盖还是追加 |
| `mask` | string | 字段掩码（字符串），标记本帧实际携带了哪些字段 |
| `eventOffset` | int32 | 事件序号（int32），流内单调递增，用于断线续传定位 |
| `chat` | message `Chat` | 会话元信息变更事件（`Chat`） |
| `message` | message `ChatMessage` | 消息事件（`ChatMessage`）：一条新消息或消息状态更新 |
| `block` | message `Block` | 内容块事件（`Block`）：文本/搜索/思考/工具/产物等增量块 |
| `ref` | message `Ref` | 引用事件（`Ref`）：检索/联网/文件引用 |
| `usage` | message `Usage` | 用量事件（`Usage`）：token / 额度消耗 |
| `notification` | message `Notification` | 通知事件（`Notification`）：付费墙 / 提示条 |
| `done` | message `Done` | 结束事件（`Done`，空消息）：本轮流式结束 |
| `heartbeat` | message `Heartbeat` | 心跳事件（`Heartbeat`，空消息）：保活 |
| `tts` | message `MessageSpeechResponse` | 语音合成事件（`MessageSpeechResponse`）：音频分片 |
| `interaction` | message `Interaction` | 交互事件（`Interaction`）：需要用户回答/确认 |
| `interactionAck` | message `InteractionAck` | 交互确认事件（`InteractionAck`） |

**字段取值**：

- `op`：`OPERATOR_UNSPECIFIED`、`append`、`set`

流式响应： **无单一 Response 消息**，为 Connect 事件帧序列（帧负载 = `ChatResponse` 事件信封）。

**返回解析说明**

逐帧按行解析，按事件名（字段存在性）分派；`error` 帧需中断并展示错误；最后处理连接关闭/超时重连；断线后可用 ContinueChat/ResumeChat 续传。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

### 073 · ReplayChatShareStream — 回放分享对话流（流式）

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：流式 · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ReplayChatShareStream`

- **API用途**：流式回放某个对话分享内容。
- **这接口能干啥（大白话）**：回放某条对话分享的内容。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ReplayChatShareStreamRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `shareId` | string |
| `msgId` | string |
| `eventOffset` | int32 |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ReplayChatShareStream
Content-Type: application/connect+json
Authorization: Bearer <accessToken>
x-msh-device-id: <deviceId>
Body(JSON): { ...<Request 字段>... }
--> 200 OK；响应为 Connect 流帧，逐帧 JSON 解析
```

**返回格式**

| 事件字段 | 类型 | 语义 |
| --- | --- | --- |
| `op` | enum `Operator` | 帧操作符（枚举 `Operator`：`SET` / `APPEND`），决定本帧是覆盖还是追加 |
| `mask` | string | 字段掩码（字符串），标记本帧实际携带了哪些字段 |
| `eventOffset` | int32 | 事件序号（int32），流内单调递增，用于断线续传定位 |
| `chat` | message `Chat` | 会话元信息变更事件（`Chat`） |
| `message` | message `ChatMessage` | 消息事件（`ChatMessage`）：一条新消息或消息状态更新 |
| `block` | message `Block` | 内容块事件（`Block`）：文本/搜索/思考/工具/产物等增量块 |
| `ref` | message `Ref` | 引用事件（`Ref`）：检索/联网/文件引用 |
| `usage` | message `Usage` | 用量事件（`Usage`）：token / 额度消耗 |
| `notification` | message `Notification` | 通知事件（`Notification`）：付费墙 / 提示条 |
| `done` | message `Done` | 结束事件（`Done`，空消息）：本轮流式结束 |
| `heartbeat` | message `Heartbeat` | 心跳事件（`Heartbeat`，空消息）：保活 |
| `tts` | message `MessageSpeechResponse` | 语音合成事件（`MessageSpeechResponse`）：音频分片 |
| `interaction` | message `Interaction` | 交互事件（`Interaction`）：需要用户回答/确认 |
| `interactionAck` | message `InteractionAck` | 交互确认事件（`InteractionAck`） |

**字段取值**：

- `op`：`OPERATOR_UNSPECIFIED`、`append`、`set`

流式响应： **无单一 Response 消息**，为 Connect 事件帧序列（帧负载 = `ChatResponse` 事件信封）。

**返回解析说明**

逐帧按行解析，按事件名（字段存在性）分派；`error` 帧需中断并展示错误；最后处理连接关闭/超时重连；断线后可用 ContinueChat/ResumeChat 续传。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

### 074 · ReplyInteraction — 调用交互回复

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ReplyInteraction`

- **API用途**：对话模块接口：调用交互回复（proto 方法 ChatService.ReplyInteraction）。
- **这接口能干啥（大白话）**：对话：调用 交互回复。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ReplyInteractionRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageId` | string |
| `interaction` | message `InteractionReply` |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ReplyInteraction
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ReplyInteractionResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 075 · ResumeChat — 恢复对话（流式）

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：流式 · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ResumeChat`

- **API用途**：断线后恢复正在进行的流式对话（流式）。
- **这接口能干啥（大白话）**：断网/切后台回来，把没说完的对话接上。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ResumeChatRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageId` | string |
| `eventOffset` | int32 |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ResumeChat
Content-Type: application/connect+json
Authorization: Bearer <accessToken>
x-msh-device-id: <deviceId>
Body(JSON): { ...<Request 字段>... }
--> 200 OK；响应为 Connect 流帧，逐帧 JSON 解析
```

**返回格式**

| 事件字段 | 类型 | 语义 |
| --- | --- | --- |
| `op` | enum `Operator` | 帧操作符（枚举 `Operator`：`SET` / `APPEND`），决定本帧是覆盖还是追加 |
| `mask` | string | 字段掩码（字符串），标记本帧实际携带了哪些字段 |
| `eventOffset` | int32 | 事件序号（int32），流内单调递增，用于断线续传定位 |
| `chat` | message `Chat` | 会话元信息变更事件（`Chat`） |
| `message` | message `ChatMessage` | 消息事件（`ChatMessage`）：一条新消息或消息状态更新 |
| `block` | message `Block` | 内容块事件（`Block`）：文本/搜索/思考/工具/产物等增量块 |
| `ref` | message `Ref` | 引用事件（`Ref`）：检索/联网/文件引用 |
| `usage` | message `Usage` | 用量事件（`Usage`）：token / 额度消耗 |
| `notification` | message `Notification` | 通知事件（`Notification`）：付费墙 / 提示条 |
| `done` | message `Done` | 结束事件（`Done`，空消息）：本轮流式结束 |
| `heartbeat` | message `Heartbeat` | 心跳事件（`Heartbeat`，空消息）：保活 |
| `tts` | message `MessageSpeechResponse` | 语音合成事件（`MessageSpeechResponse`）：音频分片 |
| `interaction` | message `Interaction` | 交互事件（`Interaction`）：需要用户回答/确认 |
| `interactionAck` | message `InteractionAck` | 交互确认事件（`InteractionAck`） |

**字段取值**：

- `op`：`OPERATOR_UNSPECIFIED`、`append`、`set`

流式响应： **无单一 Response 消息**，为 Connect 事件帧序列（帧负载 = `ChatResponse` 事件信封）。

**返回解析说明**

逐帧按行解析，按事件名（字段存在性）分派；`error` 帧需中断并展示错误；最后处理连接关闭/超时重连；断线后可用 ContinueChat/ResumeChat 续传。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

### 076 · ShareChatToCommunity — 分享对话发布到社区

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ShareChatToCommunity`

- **API用途**：对话模块接口：分享对话发布到社区（proto 方法 ChatService.ShareChatToCommunity）。
- **这接口能干啥（大白话）**：对话：分享对话发布到社区。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ShareChatToCommunityRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageIds` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/ShareChatToCommunity
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ShareChatToCommunityResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `share` | message `ChatShare` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 077 · SubscribeMessageStream — 订阅消息流（流式）

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：流式 · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/SubscribeMessageStream`

- **API用途**：订阅指定会话的消息事件流，用于多端同步。
- **这接口能干啥（大白话）**：订阅会话消息流，多端同步用。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.SubscribeMessageStreamRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageId` | string |
| `eventOffset` | int32 |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/SubscribeMessageStream
Content-Type: application/connect+json
Authorization: Bearer <accessToken>
x-msh-device-id: <deviceId>
Body(JSON): { ...<Request 字段>... }
--> 200 OK；响应为 Connect 流帧，逐帧 JSON 解析
```

**返回格式**

| 事件字段 | 类型 | 语义 |
| --- | --- | --- |
| `op` | enum `Operator` | 帧操作符（枚举 `Operator`：`SET` / `APPEND`），决定本帧是覆盖还是追加 |
| `mask` | string | 字段掩码（字符串），标记本帧实际携带了哪些字段 |
| `eventOffset` | int32 | 事件序号（int32），流内单调递增，用于断线续传定位 |
| `chat` | message `Chat` | 会话元信息变更事件（`Chat`） |
| `message` | message `ChatMessage` | 消息事件（`ChatMessage`）：一条新消息或消息状态更新 |
| `block` | message `Block` | 内容块事件（`Block`）：文本/搜索/思考/工具/产物等增量块 |
| `ref` | message `Ref` | 引用事件（`Ref`）：检索/联网/文件引用 |
| `usage` | message `Usage` | 用量事件（`Usage`）：token / 额度消耗 |
| `notification` | message `Notification` | 通知事件（`Notification`）：付费墙 / 提示条 |
| `done` | message `Done` | 结束事件（`Done`，空消息）：本轮流式结束 |
| `heartbeat` | message `Heartbeat` | 心跳事件（`Heartbeat`，空消息）：保活 |
| `tts` | message `MessageSpeechResponse` | 语音合成事件（`MessageSpeechResponse`）：音频分片 |
| `interaction` | message `Interaction` | 交互事件（`Interaction`）：需要用户回答/确认 |
| `interactionAck` | message `InteractionAck` | 交互确认事件（`InteractionAck`） |

**字段取值**：

- `op`：`OPERATOR_UNSPECIFIED`、`append`、`set`

流式响应： **无单一 Response 消息**，为 Connect 事件帧序列（帧负载 = `ChatResponse` 事件信封）。

**返回解析说明**

逐帧按行解析，按事件名（字段存在性）分派；`error` 帧需中断并展示错误；最后处理连接关闭/超时重连；断线后可用 ContinueChat/ResumeChat 续传。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 流式接口：需处理增量事件、心跳与断线重连。

### 078 · UpdateChat — 更新会话

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/UpdateChat`

- **API用途**：对话模块接口：更新会话（proto 方法 ChatService.UpdateChat）。
- **这接口能干啥（大白话）**：对话：修改会话。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.UpdateChatRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chat` | message `ChatBrief` |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/UpdateChat
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.UpdateChatResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chat` | message `ChatBrief` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 079 · VoteMessage — 消息点赞/点踩

**服务**：`kimi.gateway.chat.v1.ChatService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/VoteMessage`

- **API用途**：对模型回答点赞或点踩（反馈）。
- **这接口能干啥（大白话）**：给回答点赞/点踩。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.VoteMessageRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `messageId` | string |
| `voteType` | enum `Vote` |

**字段取值**：

- `voteType`：`VOTE_UNSPECIFIED`、`VOTE_DOWN`、`VOTE_UP`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatService/VoteMessage
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.VoteMessageResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 对话分享 · `kimi.gateway.chat.v1.ChatShareService`（1 个方法）

### 080 · GetChatShareDocx — 获取对话分享文档

**服务**：`kimi.gateway.chat.v1.ChatShareService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatShareService/GetChatShareDocx`

- **API用途**：对话分享模块接口：获取对话分享文档（proto 方法 ChatShareService.GetChatShareDocx）。
- **这接口能干啥（大白话）**：对话分享：查看对话分享文档。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetChatShareDocxRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `shareId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.ChatShareService/GetChatShareDocx
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetChatShareDocxResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `docxUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## Kimi+ · `kimi.gateway.chat.v1.KimiPlusService`（2 个方法）

### 081 · ListKimiPlus — 列出Kimi+

**服务**：`kimi.gateway.chat.v1.KimiPlusService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.KimiPlusService/ListKimiPlus`

- **API用途**：Kimi+模块接口：列出Kimi+（proto 方法 KimiPlusService.ListKimiPlus）。
- **这接口能干啥（大白话）**：Kimi+：列出Kimi+（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ListKimiPlusRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.KimiPlusService/ListKimiPlus
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ListKimiPlusResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `kimiplus` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 082 · ListPinnedKimiPlus — 列出常用 Kimi+

**服务**：`kimi.gateway.chat.v1.KimiPlusService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.KimiPlusService/ListPinnedKimiPlus`

- **API用途**：Kimi+模块接口：列出常用 Kimi+（proto 方法 KimiPlusService.ListPinnedKimiPlus）。
- **这接口能干啥（大白话）**：Kimi+：列出常用 Kimi+（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ListPinnedKimiPlusRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.KimiPlusService/ListPinnedKimiPlus
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.ListPinnedKimiPlusResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `kimiplus` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 提示词 · `kimi.gateway.chat.v1.PromptService`（1 个方法）

### 083 · GetEnhancedPrompts — 获取增强提示词

**服务**：`kimi.gateway.chat.v1.PromptService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.chat.v1.PromptService/GetEnhancedPrompts`

- **API用途**：提示词模块接口：获取增强提示词（proto 方法 PromptService.GetEnhancedPrompts）。
- **这接口能干啥（大白话）**：提示词：查看增强提示词。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetEnhancedPromptsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `fileIds` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.chat.v1.PromptService/GetEnhancedPrompts
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.chat.v1.GetEnhancedPromptsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `placeholderPrompt` | message `EnhancedPrompt` |
| `enhancedPrompts` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## IM 群聊 · `kimi.gateway.im.v1.IMService`（15 个方法）

### 084 · CreateInvitation — 创建入群邀请

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/CreateInvitation`

- **API用途**：IM 群聊模块接口：创建入群邀请（proto 方法 IMService.CreateInvitation）。
- **这接口能干啥（大白话）**：IM 群聊：新建入群邀请。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.CreateInvitationRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `roomId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/CreateInvitation
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.CreateInvitationResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `ticket` | string |
| `invitationCoverUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 085 · CreateRoom — 创建群聊

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/CreateRoom`

- **API用途**：IM 群聊模块接口：创建群聊（proto 方法 IMService.CreateRoom）。
- **这接口能干啥（大白话）**：IM 群聊：新建群聊。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.CreateRoomRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `name` | string |
| `instruction` | string |
| `botIds` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/CreateRoom
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.CreateRoomResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `room` | message `Room` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 086 · DeleteRoom — 删除群聊

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/DeleteRoom`

- **API用途**：IM 群聊模块接口：删除群聊（proto 方法 IMService.DeleteRoom）。
- **这接口能干啥（大白话）**：IM 群聊：删除群聊。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.DeleteRoomRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `roomId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/DeleteRoom
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.DeleteRoomResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 087 · GetRoom — 获取群聊

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/GetRoom`

- **API用途**：IM 群聊模块接口：获取群聊（proto 方法 IMService.GetRoom）。
- **这接口能干啥（大白话）**：IM 群聊：查看群聊。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.GetRoomRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `roomId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/GetRoom
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.GetRoomResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `room` | message `Room` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 088 · GetRoomByInvitation — 获取凭邀请入群

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/GetRoomByInvitation`

- **API用途**：IM 群聊模块接口：获取凭邀请入群（proto 方法 IMService.GetRoomByInvitation）。
- **这接口能干啥（大白话）**：IM 群聊：查看凭邀请入群。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.GetRoomByInvitationRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `ticket` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/GetRoomByInvitation
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.GetRoomByInvitationResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `room` | message `Room` |
| `invitationCoverUrl` | string |
| `members` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 089 · GetThread — 获取会话线程

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/GetThread`

- **API用途**：IM 群聊模块接口：获取会话线程（proto 方法 IMService.GetThread）。
- **这接口能干啥（大白话）**：IM 群聊：查看会话线程。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.GetThreadRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `threadId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/GetThread
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.GetThreadResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `thread` | message `Thread` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 090 · InviteMembers — 邀请成员

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/InviteMembers`

- **API用途**：IM 群聊模块接口：邀请成员（proto 方法 IMService.InviteMembers）。
- **这接口能干啥（大白话）**：IM 群聊：邀请群成员。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.InviteMembersRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `roomId` | string |
| `memberIds` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/InviteMembers
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.InviteMembersResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `members` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 091 · ListMembers — 列出成员

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/ListMembers`

- **API用途**：IM 群聊模块接口：列出成员（proto 方法 IMService.ListMembers）。
- **这接口能干啥（大白话）**：IM 群聊：列出群成员（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.ListMembersRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `roomId` | string |
| `pageToken` | string |
| `pageSize` | int32 |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/ListMembers
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.ListMembersResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `members` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 092 · ListMessages — 列出消息

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/ListMessages`

- **API用途**：IM 群聊模块接口：列出消息（proto 方法 IMService.ListMessages）。
- **这接口能干啥（大白话）**：IM 群聊：列出消息（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.ListMessagesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `pageSize` | int32 |
| `pageToken` | string |
| `direction` | message |
| `startMessageId` | string |
| `includeStartMessage` | bool |
| `endMessageId` | string |
| `includeEndMessage` | bool |
| `noMarkAsRead` | bool |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/ListMessages
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.ListMessagesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `messages` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 093 · ListRooms — 列出群聊

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/ListRooms`

- **API用途**：IM 群聊模块接口：列出群聊（proto 方法 IMService.ListRooms）。
- **这接口能干啥（大白话）**：IM 群聊：列出群聊（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.ListRoomsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pageToken` | string |
| `pageSize` | int32 |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/ListRooms
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.ListRoomsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `rooms` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 094 · ListTypingMembers — 列出正在输入的成员

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/ListTypingMembers`

- **API用途**：IM 群聊模块接口：列出正在输入的成员（proto 方法 IMService.ListTypingMembers）。
- **这接口能干啥（大白话）**：IM 群聊：列出正在输入的成员（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.ListTypingMembersRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `roomId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/ListTypingMembers
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.ListTypingMembersResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `members` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 095 · RemoveMember — 移除成员

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/RemoveMember`

- **API用途**：IM 群聊模块接口：移除成员（proto 方法 IMService.RemoveMember）。
- **这接口能干啥（大白话）**：IM 群聊：移除群成员。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.RemoveMemberRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `roomId` | string |
| `memberId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/RemoveMember
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.RemoveMemberResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 096 · SendMessage — 发送消息

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/SendMessage`

- **API用途**：IM 群聊模块接口：发送消息（proto 方法 IMService.SendMessage）。
- **这接口能干啥（大白话）**：IM 群聊：发送消息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.SendMessageRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `blocks` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/SendMessage
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.SendMessageResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `messageId` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 097 · SetMemberRole — 设置成员角色

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/SetMemberRole`

- **API用途**：IM 群聊模块接口：设置成员角色（proto 方法 IMService.SetMemberRole）。
- **这接口能干啥（大白话）**：IM 群聊：设置成员角色。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.SetMemberRoleRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `roomId` | string |
| `memberId` | string |
| `role` | enum `MemberRole` |

**字段取值**：

- `role`：`MEMBER_ROLE_UNSPECIFIED`、`MEMBER_ROLE_AUDIENCE`、`MEMBER_ROLE_COORDINATOR`、`MEMBER_ROLE_MEMBER`、`MEMBER_ROLE_OWNER`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/SetMemberRole
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.SetMemberRoleResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 098 · UpdateRoom — 更新群聊

**服务**：`kimi.gateway.im.v1.IMService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/UpdateRoom`

- **API用途**：IM 群聊模块接口：更新群聊（proto 方法 IMService.UpdateRoom）。
- **这接口能干啥（大白话）**：IM 群聊：修改群聊。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.UpdateRoomRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `room` | message `Room` |
| `updateMask` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.im.v1.IMService/UpdateRoom
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.im.v1.UpdateRoomResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `room` | message `Room` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 账号认证 · `account.gateway.v1.AuthService`（8 个方法）

### 099 · BindPhone — 绑定手机号

**服务**：`account.gateway.v1.AuthService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/api/account.gateway.v1.AuthService/BindPhone`

- **API用途**：账号认证模块接口：绑定手机号（proto 方法 AuthService.BindPhone）。
- **这接口能干啥（大白话）**：登录鉴权：绑定手机号。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）；本接口注意：走 `/api` 前缀；登录/短信类可免 `Authorization`；`RefreshToken` / `Logout` 需携带 refresh token。

**请求体** — `com.moonshot.kimi.proto.account.gateway.v1.ThirdPartyCredential`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `thirdParty` | enum `ThirdParty` |
| `code` | string |

**字段取值**：

- `thirdParty`：`THIRD_PARTY_UNSPECIFIED`、`THIRD_PARTY_APPLE`、`THIRD_PARTY_EMAIL`、`THIRD_PARTY_GOOGLE`、`THIRD_PARTY_HUAWEI`、`THIRD_PARTY_WECHAT`

**调用示例**

```http
POST https://www.kimi.com/api/account.gateway.v1.AuthService/BindPhone
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.account.gateway.v1.BindPhoneResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `accessToken` | string |
| `refreshToken` | string |
| `newUser` | bool |
| `userId` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

### 100 · ConfirmLoginQRCode — 扫码登录-确认

**服务**：`account.gateway.v1.AuthService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/api/account.gateway.v1.AuthService/ConfirmLoginQRCode`

- **API用途**：PC/Web 端二维码登录：确认登录。
- **这接口能干啥（大白话）**：扫码后确认，完成登录。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）；本接口注意：走 `/api` 前缀；登录/短信类可免 `Authorization`；`RefreshToken` / `Logout` 需携带 refresh token。

**请求体** — `com.moonshot.kimi.proto.account.gateway.v1.ConfirmLoginQRCodeRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `code` | string |

**调用示例**

```http
POST https://www.kimi.com/api/account.gateway.v1.AuthService/ConfirmLoginQRCode
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.account.gateway.v1.ConfirmLoginQRCodeResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

### 101 · LoginWithOneClick — 一键登录

**服务**：`account.gateway.v1.AuthService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/api/account.gateway.v1.AuthService/LoginWithOneClick`

- **API用途**：运营商一键登录（本机号码校验）。
- **这接口能干啥（大白话）**：运营商一键登录，不用输验证码。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）；本接口注意：走 `/api` 前缀；登录/短信类可免 `Authorization`；`RefreshToken` / `Logout` 需携带 refresh token。

**请求体** — `com.moonshot.kimi.proto.account.gateway.v1.LoginWithOneClickRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `token` | string |

**调用示例**

```http
POST https://www.kimi.com/api/account.gateway.v1.AuthService/LoginWithOneClick
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.account.gateway.v1.LoginWithOneClickResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `accessToken` | string |
| `refreshToken` | string |
| `newUser` | bool |
| `userId` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

### 102 · LoginWithSMS — 短信验证码登录

**服务**：`account.gateway.v1.AuthService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/api/account.gateway.v1.AuthService/LoginWithSMS`

- **API用途**：手机号 + 短信验证码登录，返回 access/refresh token。
- **这接口能干啥（大白话）**：手机号 + 短信验证码登录，成功后拿到登录凭证。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）；本接口注意：走 `/api` 前缀；登录/短信类可免 `Authorization`；`RefreshToken` / `Logout` 需携带 refresh token。

**请求体** — `com.moonshot.kimi.proto.account.gateway.v1.LoginWithSMSRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `phone` | message `PhoneNumber` |
| `verifyCode` | string |

**调用示例**

```http
POST https://www.kimi.com/api/account.gateway.v1.AuthService/LoginWithSMS
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.account.gateway.v1.LoginWithSMSResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `accessToken` | string |
| `refreshToken` | string |
| `newUser` | bool |
| `userId` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

### 103 · LoginWithThirdParty — 第三方登录

**服务**：`account.gateway.v1.AuthService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/api/account.gateway.v1.AuthService/LoginWithThirdParty`

- **API用途**：微信/QQ/Apple 等第三方账号登录。
- **这接口能干啥（大白话）**：用微信/QQ/Apple 等第三方账号登录。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）；本接口注意：走 `/api` 前缀；登录/短信类可免 `Authorization`；`RefreshToken` / `Logout` 需携带 refresh token。

**请求体** — `com.moonshot.kimi.proto.account.gateway.v1.ThirdPartyCredential`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `thirdParty` | enum `ThirdParty` |
| `code` | string |

**字段取值**：

- `thirdParty`：`THIRD_PARTY_UNSPECIFIED`、`THIRD_PARTY_APPLE`、`THIRD_PARTY_EMAIL`、`THIRD_PARTY_GOOGLE`、`THIRD_PARTY_HUAWEI`、`THIRD_PARTY_WECHAT`

**调用示例**

```http
POST https://www.kimi.com/api/account.gateway.v1.AuthService/LoginWithThirdParty
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.account.gateway.v1.LoginWithThirdPartyResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `accessToken` | string |
| `refreshToken` | string |
| `newUser` | bool |
| `userId` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

### 104 · Logout — 登出

**服务**：`account.gateway.v1.AuthService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/api/account.gateway.v1.AuthService/Logout`

- **API用途**：注销当前会话（走 /api 前缀）。
- **这接口能干啥（大白话）**：退出登录（走 /api 前缀）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）；本接口注意：走 `/api` 前缀；登录/短信类可免 `Authorization`；`RefreshToken` / `Logout` 需携带 refresh token。

**请求体** — `com.moonshot.kimi.proto.account.gateway.v1.LogoutRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/api/account.gateway.v1.AuthService/Logout
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.account.gateway.v1.LogoutResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

### 105 · RefreshToken — 刷新 Token

**服务**：`account.gateway.v1.AuthService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/api/account.gateway.v1.AuthService/RefreshToken`

- **API用途**：用 refresh token 换取新的 access token（走 /api 前缀）。
- **这接口能干啥（大白话）**：登录凭证过期时，用它换一套新的（走 /api 前缀）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）；本接口注意：走 `/api` 前缀；登录/短信类可免 `Authorization`；`RefreshToken` / `Logout` 需携带 refresh token。

**请求体** — `com.moonshot.kimi.proto.account.gateway.v1.RefreshTokenRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `refreshToken` | string |

**调用示例**

```http
POST https://www.kimi.com/api/account.gateway.v1.AuthService/RefreshToken
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.account.gateway.v1.RefreshTokenResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `accessToken` | string |
| `refreshToken` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

### 106 · ScanLoginQRCode — 扫码登录-扫码

**服务**：`account.gateway.v1.AuthService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/api/account.gateway.v1.AuthService/ScanLoginQRCode`

- **API用途**：PC/Web 端二维码登录：客户端扫码。
- **这接口能干啥（大白话）**：电脑上扫码登录的第一步。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）；本接口注意：走 `/api` 前缀；登录/短信类可免 `Authorization`；`RefreshToken` / `Logout` 需携带 refresh token。

**请求体** — `com.moonshot.kimi.proto.account.gateway.v1.ScanLoginQRCodeRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `code` | string |

**调用示例**

```http
POST https://www.kimi.com/api/account.gateway.v1.AuthService/ScanLoginQRCode
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.account.gateway.v1.ScanLoginQRCodeResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

## 账号设备 · `account.gateway.v1.DeviceService`（1 个方法）

### 107 · RegisterDevice — 注册设备

**服务**：`account.gateway.v1.DeviceService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/api/account.gateway.v1.DeviceService/RegisterDevice`

- **API用途**：上报并注册设备信息，用于多端管理与风控。
- **这接口能干啥（大白话）**：把这台设备登记上来，方便多端管理和风控。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）；本接口注意：走 `/api` 前缀；登录/短信类可免 `Authorization`；`RefreshToken` / `Logout` 需携带 refresh token。

**请求体** — `com.moonshot.kimi.proto.account.gateway.v1.RegisterDeviceRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pushDevice` | message `PushDevice` |

**调用示例**

```http
POST https://www.kimi.com/api/account.gateway.v1.DeviceService/RegisterDevice
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.account.gateway.v1.RegisterDeviceResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

## 短信验证码 · `account.gateway.v1.SMSService`（2 个方法）

### 108 · ListCountries — 列出国家区号

**服务**：`account.gateway.v1.SMSService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/api/account.gateway.v1.SMSService/ListCountries`

- **API用途**：拉取支持的国家/地区与区号。
- **这接口能干啥（大白话）**：拉支持的国家和手机区号。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）；本接口注意：走 `/api` 前缀；登录/短信类可免 `Authorization`；`RefreshToken` / `Logout` 需携带 refresh token。

**请求体** — `com.moonshot.kimi.proto.account.gateway.v1.ListCountriesRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/api/account.gateway.v1.SMSService/ListCountries
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.account.gateway.v1.ListCountriesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `defaultCountry` | message `Country` |
| `countries` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

### 109 · SendVerifyCode — 发送短信验证码

**服务**：`account.gateway.v1.SMSService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/api/account.gateway.v1.SMSService/SendVerifyCode`

- **API用途**：向指定手机号发送短信验证码。
- **这接口能干啥（大白话）**：给手机号发短信验证码。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）；本接口注意：走 `/api` 前缀；登录/短信类可免 `Authorization`；`RefreshToken` / `Logout` 需携带 refresh token。

**请求体** — `com.moonshot.kimi.proto.kimi.common.v1.Captcha`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `captchaId` | string |
| `validate` | string |

**调用示例**

```http
POST https://www.kimi.com/api/account.gateway.v1.SMSService/SendVerifyCode
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.account.gateway.v1.SendVerifyCodeResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 本接口走 `/api` 前缀（非 `/apiv2`）。

## 青少年模式 · `kimi.gateway.account.v1.MinorModeService`（7 个方法）

### 110 · BindGuardian — 绑定监护人

**服务**：`kimi.gateway.account.v1.MinorModeService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/BindGuardian`

- **API用途**：青少年模式模块接口：绑定监护人（proto 方法 MinorModeService.BindGuardian）。
- **这接口能干啥（大白话）**：青少年模式：绑定监护人。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.BindGuardianRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `phone` | message `PhoneNumber` |
| `passcode` | string |
| `passcodeConfirm` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/BindGuardian
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.BindGuardianResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `minorMode` | message `MinorMode` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 111 · GetMinorMode — 获取青少年模式

**服务**：`kimi.gateway.account.v1.MinorModeService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/GetMinorMode`

- **API用途**：青少年模式模块接口：获取青少年模式（proto 方法 MinorModeService.GetMinorMode）。
- **这接口能干啥（大白话）**：青少年模式：查看青少年模式。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.GetMinorModeRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/GetMinorMode
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.GetMinorModeResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `minorMode` | message `MinorMode` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 112 · ResetPasscode — 重置密码

**服务**：`kimi.gateway.account.v1.MinorModeService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/ResetPasscode`

- **API用途**：青少年模式模块接口：重置密码（proto 方法 MinorModeService.ResetPasscode）。
- **这接口能干啥（大白话）**：青少年模式：重置密码。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.ResetPasscodeRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `passcode` | string |
| `passcodeConfirm` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/ResetPasscode
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.ResetPasscodeResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 113 · UnbindGuardian — 解绑监护人

**服务**：`kimi.gateway.account.v1.MinorModeService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/UnbindGuardian`

- **API用途**：青少年模式模块接口：解绑监护人（proto 方法 MinorModeService.UnbindGuardian）。
- **这接口能干啥（大白话）**：青少年模式：解绑监护人。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.UnbindGuardianRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `verifyCode` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/UnbindGuardian
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.UnbindGuardianResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `minorMode` | message `MinorMode` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 114 · UpdateMinorMode — 更新青少年模式

**服务**：`kimi.gateway.account.v1.MinorModeService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/UpdateMinorMode`

- **API用途**：青少年模式模块接口：更新青少年模式（proto 方法 MinorModeService.UpdateMinorMode）。
- **这接口能干啥（大白话）**：青少年模式：修改青少年模式。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.UpdateMinorModeRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `enabled` | bool |
| `passcode` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/UpdateMinorMode
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.UpdateMinorModeResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `minorMode` | message `MinorMode` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 115 · VerifyGuardianPhone — 校验监护人手机号

**服务**：`kimi.gateway.account.v1.MinorModeService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/VerifyGuardianPhone`

- **API用途**：青少年模式模块接口：校验监护人手机号（proto 方法 MinorModeService.VerifyGuardianPhone）。
- **这接口能干啥（大白话）**：青少年模式：校验监护人手机号。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.VerifyGuardianPhoneRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `phone` | message `PhoneNumber` |
| `verifyCode` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/VerifyGuardianPhone
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.VerifyGuardianPhoneResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 116 · VerifyGuardianReset — 校验监护人重置

**服务**：`kimi.gateway.account.v1.MinorModeService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/VerifyGuardianReset`

- **API用途**：青少年模式模块接口：校验监护人重置（proto 方法 MinorModeService.VerifyGuardianReset）。
- **这接口能干啥（大白话）**：青少年模式：校验监护人重置。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.VerifyGuardianResetRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `verifyCode` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.MinorModeService/VerifyGuardianReset
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.VerifyGuardianResetResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 账号安全 · `kimi.gateway.account.v1.SecurityService`（8 个方法）

### 117 · BindPhone — 绑定手机号

**服务**：`kimi.gateway.account.v1.SecurityService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/BindPhone`

- **API用途**：账号安全模块接口：绑定手机号（proto 方法 SecurityService.BindPhone）。
- **这接口能干啥（大白话）**：账号安全：绑定手机号。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.BindPhoneRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `phone` | message `PhoneNumber` |
| `verifyCode` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/BindPhone
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.BindPhoneResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 118 · BindThirdAccount — 绑定第三方账号

**服务**：`kimi.gateway.account.v1.SecurityService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/BindThirdAccount`

- **API用途**：账号安全模块接口：绑定第三方账号（proto 方法 SecurityService.BindThirdAccount）。
- **这接口能干啥（大白话）**：账号安全：绑定第三方账号。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.account.gateway.v1.ThirdPartyCredential`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `thirdParty` | enum `ThirdParty` |
| `code` | string |

**字段取值**：

- `thirdParty`：`THIRD_PARTY_UNSPECIFIED`、`THIRD_PARTY_APPLE`、`THIRD_PARTY_EMAIL`、`THIRD_PARTY_GOOGLE`、`THIRD_PARTY_HUAWEI`、`THIRD_PARTY_WECHAT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/BindThirdAccount
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.BindThirdAccountResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 119 · DeactivateAccount — 调用账号注销

**服务**：`kimi.gateway.account.v1.SecurityService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/DeactivateAccount`

- **API用途**：账号安全模块接口：调用账号注销（proto 方法 SecurityService.DeactivateAccount）。
- **这接口能干啥（大白话）**：账号安全：注销账号。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.DeactivateAccountRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/DeactivateAccount
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.DeactivateAccountResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 120 · ListThirdAccounts — 列出第三方账号

**服务**：`kimi.gateway.account.v1.SecurityService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/ListThirdAccounts`

- **API用途**：账号安全模块接口：列出第三方账号（proto 方法 SecurityService.ListThirdAccounts）。
- **这接口能干啥（大白话）**：账号安全：列出第三方账号（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.ListThirdAccountsRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/ListThirdAccounts
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.ListThirdAccountsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `thirdAccounts` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 121 · RebindPhone — 换绑手机号

**服务**：`kimi.gateway.account.v1.SecurityService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/RebindPhone`

- **API用途**：账号安全模块接口：换绑手机号（proto 方法 SecurityService.RebindPhone）。
- **这接口能干啥（大白话）**：账号安全：换绑手机号。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.RebindPhoneRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `phone` | message `PhoneNumber` |
| `verifyCode` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/RebindPhone
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.RebindPhoneResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 122 · SendVerifyCode — 发送验证码

**服务**：`kimi.gateway.account.v1.SecurityService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/SendVerifyCode`

- **API用途**：账号安全模块接口：发送验证码（proto 方法 SecurityService.SendVerifyCode）。
- **这接口能干啥（大白话）**：账号安全：发送验证码。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.SendVerifyCodeRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `scene` | enum `VerifyCodeScene` |
| `phone` | message `PhoneNumber` |
| `captcha` | message `Captcha` |

**字段取值**：

- `scene`：`VERIFY_CODE_SCENE_UNSPECIFIED`、`VERIFY_CODE_SCENE_BIND_PHONE`、`VERIFY_CODE_SCENE_DEACTIVATE_ACCOUNT`、`VERIFY_CODE_SCENE_GUARDIAN_BIND`、`VERIFY_CODE_SCENE_GUARDIAN_RESET`、`VERIFY_CODE_SCENE_GUARDIAN_UNBIND`、`VERIFY_CODE_SCENE_REBIND_PHONE`、`VERIFY_CODE_SCENE_VERIFY_CURRENT_PHONE`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/SendVerifyCode
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.SendVerifyCodeResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 123 · UnbindThirdAccount — 解绑第三方账号

**服务**：`kimi.gateway.account.v1.SecurityService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/UnbindThirdAccount`

- **API用途**：账号安全模块接口：解绑第三方账号（proto 方法 SecurityService.UnbindThirdAccount）。
- **这接口能干啥（大白话）**：账号安全：解绑第三方账号。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.UnbindThirdAccountRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `thirdParty` | enum `ThirdParty` |

**字段取值**：

- `thirdParty`：`THIRD_PARTY_UNSPECIFIED`、`THIRD_PARTY_APPLE`、`THIRD_PARTY_EMAIL`、`THIRD_PARTY_GOOGLE`、`THIRD_PARTY_HUAWEI`、`THIRD_PARTY_WECHAT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/UnbindThirdAccount
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.UnbindThirdAccountResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 124 · VerifyCurrentPhone — 校验当前手机号

**服务**：`kimi.gateway.account.v1.SecurityService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/VerifyCurrentPhone`

- **API用途**：账号安全模块接口：校验当前手机号（proto 方法 SecurityService.VerifyCurrentPhone）。
- **这接口能干啥（大白话）**：账号安全：校验当前手机号。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.VerifyCurrentPhoneRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `verifyCode` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.SecurityService/VerifyCurrentPhone
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.VerifyCurrentPhoneResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 用户 · `kimi.gateway.account.v1.UserService`（4 个方法）

### 125 · GetCurrentUser — 获取当前用户

**服务**：`kimi.gateway.account.v1.UserService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.UserService/GetCurrentUser`

- **API用途**：用户模块接口：获取当前用户（proto 方法 UserService.GetCurrentUser）。
- **这接口能干啥（大白话）**：用户：查看当前用户。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.GetCurrentUserRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.UserService/GetCurrentUser
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.GetCurrentUserResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `user` | message `User` |
| `workspace` | message `Workspace` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 126 · ListWorkspaces — 列出工作区

**服务**：`kimi.gateway.account.v1.UserService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.UserService/ListWorkspaces`

- **API用途**：用户模块接口：列出工作区（proto 方法 UserService.ListWorkspaces）。
- **这接口能干啥（大白话）**：用户：列出工作区（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.ListWorkspacesRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.UserService/ListWorkspaces
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.ListWorkspacesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `workspaces` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 127 · SwitchWorkspace — 切换工作区

**服务**：`kimi.gateway.account.v1.UserService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.UserService/SwitchWorkspace`

- **API用途**：用户模块接口：切换工作区（proto 方法 UserService.SwitchWorkspace）。
- **这接口能干啥（大白话）**：用户：切换工作区。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.SwitchWorkspaceRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `businessId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.UserService/SwitchWorkspace
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.SwitchWorkspaceResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `accessToken` | string |
| `refreshToken` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 128 · UpdateProfile — 更新资料

**服务**：`kimi.gateway.account.v1.UserService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.account.v1.UserService/UpdateProfile`

- **API用途**：用户模块接口：更新资料（proto 方法 UserService.UpdateProfile）。
- **这接口能干啥（大白话）**：用户：修改资料。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.UpdateProfileRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nickname` | string |
| `bio` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.account.v1.UserService/UpdateProfile
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.account.v1.UpdateProfileResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## Claw 文件 · `kimi.gateway.claw.v1.ClawFileService`（1 个方法）

### 129 · ListFiles — 列出文件

**服务**：`kimi.gateway.claw.v1.ClawFileService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawFileService/ListFiles`

- **API用途**：Claw 文件模块接口：列出文件（proto 方法 ClawFileService.ListFiles）。
- **这接口能干啥（大白话）**：Claw 文件：列出文件（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.ListFilesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `botId` | string |
| `path` | string |
| `showHidden` | bool |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawFileService/ListFiles
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.ListFilesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `info` | message `FileInfo` |
| `files` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 上下文 · `kimi.gateway.context.v1.ContextService`（2 个方法）

### 130 · GetGoal — 获取目标

**服务**：`kimi.gateway.context.v1.ContextService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.context.v1.ContextService/GetGoal`

- **API用途**：上下文模块接口：获取目标（proto 方法 ContextService.GetGoal）。
- **这接口能干啥（大白话）**：上下文：查看目标。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.context.v1.GetGoalRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.context.v1.ContextService/GetGoal
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.context.v1.GetGoalResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `goal` | message `Goal` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 131 · UpdateGoal — 更新目标

**服务**：`kimi.gateway.context.v1.ContextService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.context.v1.ContextService/UpdateGoal`

- **API用途**：上下文模块接口：更新目标（proto 方法 ContextService.UpdateGoal）。
- **这接口能干啥（大白话）**：上下文：修改目标。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.context.v1.UpdateGoalRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `objective` | string |
| `status` | enum `Status` |

**字段取值**：

- `status`：`STATUS_UNSPECIFIED`、`STATUS_ACTIVE`、`STATUS_BLOCKED`、`STATUS_COMPLETED`、`STATUS_DELETED`、`STATUS_PAUSED`、`STATUS_TERMINATED`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.context.v1.ContextService/UpdateGoal
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.context.v1.UpdateGoalResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `goal` | message `Goal` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 文档转换 · `kimi.gateway.converter.v1.ConverterService`（2 个方法）

### 132 · ExportDocument — 导出文档

**服务**：`kimi.gateway.converter.v1.ConverterService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.converter.v1.ConverterService/ExportDocument`

- **API用途**：文档转换模块接口：导出文档（proto 方法 ConverterService.ExportDocument）。
- **这接口能干啥（大白话）**：文档转换：导出文档。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.converter.v1.ExportDocumentRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `source` | message `DocumentSource` |
| `exportType` | enum `DocumentType` |
| `filename` | string |

**字段取值**：

- `exportType`：`DOCUMENT_TYPE_UNSPECIFIED`、`DOCUMENT_TYPE_DOCX`、`DOCUMENT_TYPE_MARKDOWN`、`DOCUMENT_TYPE_PDF`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.converter.v1.ConverterService/ExportDocument
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.converter.v1.ExportDocumentResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `jobId` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 133 · GetExportDocumentJob — 获取导出文档任务

**服务**：`kimi.gateway.converter.v1.ConverterService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.converter.v1.ConverterService/GetExportDocumentJob`

- **API用途**：文档转换模块接口：获取导出文档任务（proto 方法 ConverterService.GetExportDocumentJob）。
- **这接口能干啥（大白话）**：文档转换：查看导出文档任务。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.converter.v1.GetExportDocumentJobRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.converter.v1.ConverterService/GetExportDocumentJob
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.converter.v1.GetExportDocumentJobResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `job` | message `ExportDocumentJob` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 文件 · `kimi.gateway.file.v1.FileService`（1 个方法）

### 134 · GetFileParseProgress — 获取文件解析进度

**服务**：`kimi.gateway.file.v1.FileService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.file.v1.FileService/GetFileParseProgress`

- **API用途**：文件模块接口：获取文件解析进度（proto 方法 FileService.GetFileParseProgress）。
- **这接口能干啥（大白话）**：文件：查看文件解析进度。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.file.v1.GetFileParseProgressRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `fileIds` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.file.v1.FileService/GetFileParseProgress
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.file.v1.GetFileParseProgressResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `progresses` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 存储 · `kimi.gateway.storage.v1.StorageService`（1 个方法）

### 135 · GetUserStorageQuota — 获取用户存储配额

**服务**：`kimi.gateway.storage.v1.StorageService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.storage.v1.StorageService/GetUserStorageQuota`

- **API用途**：存储模块接口：获取用户存储配额（proto 方法 StorageService.GetUserStorageQuota）。
- **这接口能干啥（大白话）**：存储：查看用户存储配额。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.storage.v1.GetUserStorageQuotaRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.storage.v1.StorageService/GetUserStorageQuota
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.storage.v1.GetUserStorageQuotaResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `quota` | message `UserStorageQuota` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 应用发布 · `kimi.gateway.app.v1.AppService`（4 个方法）

### 136 · ListVersions — 列出版本

**服务**：`kimi.gateway.app.v1.AppService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.app.v1.AppService/ListVersions`

- **API用途**：应用发布模块接口：列出版本（proto 方法 AppService.ListVersions）。
- **这接口能干啥（大白话）**：应用发布：列出版本（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.app.v1.ListVersionsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.app.v1.AppService/ListVersions
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.app.v1.ListVersionsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `publishedVersionId` | string |
| `publishedUrl` | string |
| `publishState` | enum `PublishState` |
| `publishingVersionId` | string |
| `versions` | repeated |

**字段取值**：

- `publishState`：`PUBLISH_STATE_UNSPECIFIED`、`PUBLISH_STATE_FAILED`、`PUBLISH_STATE_MODERATION_BLOCKED`、`PUBLISH_STATE_PUBLISHED`、`PUBLISH_STATE_PUBLISHING`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 137 · PreviewApp — 预览应用

**服务**：`kimi.gateway.app.v1.AppService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.app.v1.AppService/PreviewApp`

- **API用途**：应用发布模块接口：预览应用（proto 方法 AppService.PreviewApp）。
- **这接口能干啥（大白话）**：应用发布：预览应用。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.app.v1.PreviewAppRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `forceRestart` | bool |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.app.v1.AppService/PreviewApp
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.app.v1.PreviewAppResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `previewUrl` | string |
| `expireTime` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 138 · PublishApp — 发布应用

**服务**：`kimi.gateway.app.v1.AppService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.app.v1.AppService/PublishApp`

- **API用途**：应用发布模块接口：发布应用（proto 方法 AppService.PublishApp）。
- **这接口能干啥（大白话）**：应用发布：发布应用。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.app.v1.PublishAppRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `versionId` | string |
| `customSlug` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.app.v1.AppService/PublishApp
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.app.v1.PublishAppResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `deployUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 139 · UnpublishApp — 取消发布应用

**服务**：`kimi.gateway.app.v1.AppService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.app.v1.AppService/UnpublishApp`

- **API用途**：应用发布模块接口：取消发布应用（proto 方法 AppService.UnpublishApp）。
- **这接口能干啥（大白话）**：应用发布：下线应用。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.app.v1.UnpublishAppRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.app.v1.AppService/UnpublishApp
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.app.v1.UnpublishAppResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## App 支持 · `kimi.gateway.appsupport.v1.AppSupportService`（1 个方法）

### 140 · ScanQRCode — 扫码二维码

**服务**：`kimi.gateway.appsupport.v1.AppSupportService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.appsupport.v1.AppSupportService/ScanQRCode`

- **API用途**：App 支持模块接口：扫码二维码（proto 方法 AppSupportService.ScanQRCode）。
- **这接口能干啥（大白话）**：应用支持：扫码二维码。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.appsupport.v1.ScanQRCodeRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `qrCode` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.appsupport.v1.AppSupportService/ScanQRCode
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.appsupport.v1.ScanQRCodeResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `urlScheme` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 产物分享 · `kimi.gateway.artifact.v1.ArtifactService`（1 个方法）

### 141 · ShareArtifact — 分享产物

**服务**：`kimi.gateway.artifact.v1.ArtifactService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.artifact.v1.ArtifactService/ShareArtifact`

- **API用途**：产物分享模块接口：分享产物（proto 方法 ArtifactService.ShareArtifact）。
- **这接口能干啥（大白话）**：产物分享：分享产物。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.artifact.v1.ShareArtifactRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `artifactId` | string |
| `version` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.artifact.v1.ArtifactService/ShareArtifact
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.artifact.v1.ShareArtifactResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `artifactShare` | message `ArtifactShare` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## Claw 机器人 · `kimi.gateway.claw.v1.ClawService`（4 个方法）

### 142 · CreateBot — 创建机器人

**服务**：`kimi.gateway.claw.v1.ClawService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawService/CreateBot`

- **API用途**：Claw 机器人模块接口：创建机器人（proto 方法 ClawService.CreateBot）。
- **这接口能干啥（大白话）**：Claw 机器人：新建机器人。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.CreateBotRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `name` | string |
| `description` | string |
| `type` | enum `BotType` |
| `personality` | enum `BotPersonality` |
| `backupId` | string |
| `scenarios` | repeated |
| `scenariosValue` | repeated |

**字段取值**：

- `type`：`BOT_TYPE_UNSPECIFIED`、`BOT_TYPE_ALIYUN`、`BOT_TYPE_ANDROID`、`BOT_TYPE_DESKTOP`、`BOT_TYPE_LOCAL`、`BOT_TYPE_REMOTE`、`BOT_TYPE_ROLLOUT`、`BOT_TYPE_VOLCENGINE`
- `personality`：`BOT_PERSONALITY_UNSPECIFIED`、`BOT_PERSONALITY_HYPE_FRIEND`、`BOT_PERSONALITY_MEME_ZOOMER`、`BOT_PERSONALITY_STOIC_ADVISOR`、`BOT_PERSONALITY_THE_LISTENER`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawService/CreateBot
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.CreateBotResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `bot` | message `Bot` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 143 · CreateModelAPIKey — 创建模型 API Key

**服务**：`kimi.gateway.claw.v1.ClawService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawService/CreateModelAPIKey`

- **API用途**：Claw 机器人模块接口：创建模型 API Key（proto 方法 ClawService.CreateModelAPIKey）。
- **这接口能干啥（大白话）**：Claw 机器人：新建模型 API Key。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.CreateModelAPIKeyRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `type` | enum `BotType` |
| `name` | string |
| `description` | string |
| `expireTime` | string |

**字段取值**：

- `type`：`BOT_TYPE_UNSPECIFIED`、`BOT_TYPE_ALIYUN`、`BOT_TYPE_ANDROID`、`BOT_TYPE_DESKTOP`、`BOT_TYPE_LOCAL`、`BOT_TYPE_REMOTE`、`BOT_TYPE_ROLLOUT`、`BOT_TYPE_VOLCENGINE`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawService/CreateModelAPIKey
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.CreateModelAPIKeyResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `modelApiKey` | message `ModelAPIKey` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 144 · DeleteBot — 删除机器人

**服务**：`kimi.gateway.claw.v1.ClawService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawService/DeleteBot`

- **API用途**：Claw 机器人模块接口：删除机器人（proto 方法 ClawService.DeleteBot）。
- **这接口能干啥（大白话）**：Claw 机器人：删除机器人。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.DeleteBotRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawService/DeleteBot
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.DeleteBotResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 145 · ListBots — 列出机器人

**服务**：`kimi.gateway.claw.v1.ClawService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawService/ListBots`

- **API用途**：Claw 机器人模块接口：列出机器人（proto 方法 ClawService.ListBots）。
- **这接口能干啥（大白话）**：Claw 机器人：列出机器人（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.ListBotsRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawService/ListBots
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.ListBotsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `bots` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## Claw 技能 · `kimi.gateway.claw.v1.ClawSkillService`（4 个方法）

### 146 · DeleteRemoteSkill — 删除远程技能

**服务**：`kimi.gateway.claw.v1.ClawSkillService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawSkillService/DeleteRemoteSkill`

- **API用途**：Claw 技能模块接口：删除远程技能（proto 方法 ClawSkillService.DeleteRemoteSkill）。
- **这接口能干啥（大白话）**：Claw 技能：删除远程技能。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.DeleteRemoteSkillRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `botId` | string |
| `remoteName` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawSkillService/DeleteRemoteSkill
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.DeleteRemoteSkillResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 147 · InstallSkillToRemote — 安装技能同步到远程

**服务**：`kimi.gateway.claw.v1.ClawSkillService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawSkillService/InstallSkillToRemote`

- **API用途**：Claw 技能模块接口：安装技能同步到远程（proto 方法 ClawSkillService.InstallSkillToRemote）。
- **这接口能干啥（大白话）**：Claw 技能：安装技能同步到远程。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.InstallSkillToRemoteRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `botId` | string |
| `skillId` | string |
| `overrideName` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawSkillService/InstallSkillToRemote
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.InstallSkillToRemoteResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `remoteName` | string |
| `skill` | message `ClawSkill` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 148 · ListClawSkills — 列出Claw 技能

**服务**：`kimi.gateway.claw.v1.ClawSkillService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawSkillService/ListClawSkills`

- **API用途**：Claw 技能模块接口：列出Claw 技能（proto 方法 ClawSkillService.ListClawSkills）。
- **这接口能干啥（大白话）**：Claw 技能：列出Claw 技能（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.ListClawSkillsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `botId` | string |
| `query` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawSkillService/ListClawSkills
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.ListClawSkillsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `skills` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 149 · ListRemoteSkills — 列出远程技能

**服务**：`kimi.gateway.claw.v1.ClawSkillService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawSkillService/ListRemoteSkills`

- **API用途**：Claw 技能模块接口：列出远程技能（proto 方法 ClawSkillService.ListRemoteSkills）。
- **这接口能干啥（大白话）**：Claw 技能：列出远程技能（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.ListRemoteSkillsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `botId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.claw.v1.ClawSkillService/ListRemoteSkills
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.claw.v1.ListRemoteSkillsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `skills` | repeated |
| `skillJobs` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 配置 · `kimi.gateway.config.v1.ConfigService`（3 个方法）

### 150 · GetAvailableModels — 获取可用模型

**服务**：`kimi.gateway.config.v1.ConfigService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.config.v1.ConfigService/GetAvailableModels`

- **API用途**：配置模块接口：获取可用模型（proto 方法 ConfigService.GetAvailableModels）。
- **这接口能干啥（大白话）**：配置：查看可用模型。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.config.v1.GetAvailableModelsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `scene` | enum `Scene` |

**字段取值**：

- `scene`：`SCENE_UNSPECIFIED`、`SCENE_KIMI_WORK`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.config.v1.ConfigService/GetAvailableModels
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.config.v1.GetAvailableModelsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `defaultScenario` | message `DefaultScenarioConfig` |
| `availableModels` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 151 · GetConfig — 获取配置

**服务**：`kimi.gateway.config.v1.ConfigService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.config.v1.ConfigService/GetConfig`

- **API用途**：配置模块接口：获取配置（proto 方法 ConfigService.GetConfig）。
- **这接口能干啥（大白话）**：配置：查看配置。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.config.v1.GetConfigRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `syncToken` | string |
| `source` | enum `ConfigSource` |
| `scriptContext` | message `ScriptConfigContext` |

**字段取值**：

- `source`：`CONFIG_SOURCE_UNSPECIFIED`、`CONFIG_SOURCE_LEGACY`、`CONFIG_SOURCE_SCRIPT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.config.v1.ConfigService/GetConfig
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.config.v1.GetConfigResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `config` | message `Config` |
| `syncToken` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 152 · GetPrecheckConfig — 获取预检配置

**服务**：`kimi.gateway.config.v1.ConfigService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.config.v1.ConfigService/GetPrecheckConfig`

- **API用途**：配置模块接口：获取预检配置（proto 方法 ConfigService.GetPrecheckConfig）。
- **这接口能干啥（大白话）**：配置：查看预检配置。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.config.v1.GetPrecheckConfigRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `scene` | enum `Scene` |

**字段取值**：

- `scene`：`SCENE_UNSPECIFIED`、`SCENE_SMS_CODE_SEND`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.config.v1.ConfigService/GetPrecheckConfig
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.config.v1.GetPrecheckConfigResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `captcha` | message `CaptchaConfig` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 设备 · `kimi.gateway.device.v1.DeviceService`（3 个方法）

### 153 · CountDevices — 统计设备

**服务**：`kimi.gateway.device.v1.DeviceService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.device.v1.DeviceService/CountDevices`

- **API用途**：设备模块接口：统计设备（proto 方法 DeviceService.CountDevices）。
- **这接口能干啥（大白话）**：设备：统计设备。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.device.v1.CountDevicesRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.device.v1.DeviceService/CountDevices
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.device.v1.CountDevicesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `count` | int32 |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 154 · DeleteDevice — 删除设备

**服务**：`kimi.gateway.device.v1.DeviceService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.device.v1.DeviceService/DeleteDevice`

- **API用途**：设备模块接口：删除设备（proto 方法 DeviceService.DeleteDevice）。
- **这接口能干啥（大白话）**：设备：删除设备。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.device.v1.DeleteDeviceRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.device.v1.DeviceService/DeleteDevice
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.device.v1.DeleteDeviceResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 155 · ListDevices — 列出设备

**服务**：`kimi.gateway.device.v1.DeviceService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.device.v1.DeviceService/ListDevices`

- **API用途**：设备模块接口：列出设备（proto 方法 DeviceService.ListDevices）。
- **这接口能干啥（大白话）**：设备：列出设备（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.device.v1.ListDevicesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pageSize` | int32 |
| `pageToken` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.device.v1.DeviceService/ListDevices
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.device.v1.ListDevicesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `devices` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 实验 · `kimi.gateway.experiment.v1.ExperimentService`（1 个方法）

### 156 · GetExperiments — 获取实验开关

**服务**：`kimi.gateway.experiment.v1.ExperimentService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.experiment.v1.ExperimentService/GetExperiments`

- **API用途**：实验模块接口：获取实验开关（proto 方法 ExperimentService.GetExperiments）。
- **这接口能干啥（大白话）**：实验：查看实验开关。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.experiment.v1.GetExperimentsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `withImpression` | bool |
| `experimentNames` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.experiment.v1.ExperimentService/GetExperiments
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.experiment.v1.GetExperimentsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `results` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 信息流 · `kimi.gateway.feed.v1.FeedService`（1 个方法）

### 157 · ListFeeds — 列出信息流

**服务**：`kimi.gateway.feed.v1.FeedService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.feed.v1.FeedService/ListFeeds`

- **API用途**：信息流模块接口：列出信息流（proto 方法 FeedService.ListFeeds）。
- **这接口能干啥（大白话）**：社区信息流：列出信息流（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.feed.v1.ListFeedsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pageSize` | int32 |
| `pageToken` | string |
| `projectId` | string |
| `unread` | bool |
| `includePinned` | bool |
| `filterTypes` | repeated |
| `filterTypesValue` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.feed.v1.FeedService/ListFeeds
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.feed.v1.ListFeedsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `items` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 凭证签发 · `kimi.gateway.issuance.v1.IssuanceService`（1 个方法）

### 158 · GetCredential — 获取凭证

**服务**：`kimi.gateway.issuance.v1.IssuanceService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.issuance.v1.IssuanceService/GetCredential`

- **API用途**：凭证签发模块接口：获取凭证（proto 方法 IssuanceService.GetCredential）。
- **这接口能干啥（大白话）**：凭证：查看凭证。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.issuance.v1.GetCredentialRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `service` | enum `Service` |

**字段取值**：

- `service`：`SERVICE_UNSPECIFIED`、`SERVICE_ASR`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.issuance.v1.IssuanceService/GetCredential
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.issuance.v1.GetCredentialResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `credential` | message `Credential` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## MCP OAuth · `kimi.gateway.mcp.v1.MCPOAuthService`（2 个方法）

### 159 · CreateMCPServerAuthorization — 创建MCP 服务端授权

**服务**：`kimi.gateway.mcp.v1.MCPOAuthService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.MCPOAuthService/CreateMCPServerAuthorization`

- **API用途**：MCP OAuth模块接口：创建MCP 服务端授权（proto 方法 MCPOAuthService.CreateMCPServerAuthorization）。
- **这接口能干啥（大白话）**：MCP 授权：新建MCP 服务端授权。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.CreateMCPServerAuthorizationRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `serverId` | string |
| `redirectUri` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.MCPOAuthService/CreateMCPServerAuthorization
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.CreateMCPServerAuthorizationResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `authorization` | message `MCPServerAuthorization` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 160 · GetMCPServerAuthorization — 获取MCP 服务端授权

**服务**：`kimi.gateway.mcp.v1.MCPOAuthService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.MCPOAuthService/GetMCPServerAuthorization`

- **API用途**：MCP OAuth模块接口：获取MCP 服务端授权（proto 方法 MCPOAuthService.GetMCPServerAuthorization）。
- **这接口能干啥（大白话）**：MCP 授权：查看MCP 服务端授权。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetMCPServerAuthorizationRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `requestId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.MCPOAuthService/GetMCPServerAuthorization
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetMCPServerAuthorizationResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `authorization` | message `MCPServerAuthorization` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## MCP · `kimi.gateway.mcp.v1.MCPService`（1 个方法）

### 161 · SetMCPUserSettingStatus — 设置MCP 授权状态

**服务**：`kimi.gateway.mcp.v1.MCPService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.MCPService/SetMCPUserSettingStatus`

- **API用途**：MCP模块接口：设置MCP 授权状态（proto 方法 MCPService.SetMCPUserSettingStatus）。
- **这接口能干啥（大白话）**：MCP：设置MCP 授权状态。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.SetMCPUserSettingStatusRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |
| `enable` | bool |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.MCPService/SetMCPUserSettingStatus
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.SetMCPUserSettingStatusResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## OKC/产物 · `kimi.gateway.mcp.v1.OKCService`（9 个方法）

### 162 · GetCitationsByChat — 获取会话引用

**服务**：`kimi.gateway.mcp.v1.OKCService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/GetCitationsByChat`

- **API用途**：OKC/产物模块接口：获取会话引用（proto 方法 OKCService.GetCitationsByChat）。
- **这接口能干啥（大白话）**：OKC 产物：查看会话引用。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetCitationsByChatRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/GetCitationsByChat
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetCitationsByChatResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `citations` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 163 · GetDeploymentByChatShare — 获取分享会话的部署

**服务**：`kimi.gateway.mcp.v1.OKCService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/GetDeploymentByChatShare`

- **API用途**：OKC/产物模块接口：获取分享会话的部署（proto 方法 OKCService.GetDeploymentByChatShare）。
- **这接口能干啥（大白话）**：OKC 产物：查看分享会话的部署。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetDeploymentByChatShareRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatShareId` | string |
| `version` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/GetDeploymentByChatShare
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetDeploymentByChatShareResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `deployment` | message `Deployment` |
| `downloadUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 164 · GetManifest — 获取清单

**服务**：`kimi.gateway.mcp.v1.OKCService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/GetManifest`

- **API用途**：OKC/产物模块接口：获取清单（proto 方法 OKCService.GetManifest）。
- **这接口能干啥（大白话）**：OKC 产物：查看清单。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetManifestRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/GetManifest
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetManifestResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `manifest` | message `Manifest` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 165 · GetOutputFileTree — 获取产出文件树

**服务**：`kimi.gateway.mcp.v1.OKCService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/GetOutputFileTree`

- **API用途**：OKC/产物模块接口：获取产出文件树（proto 方法 OKCService.GetOutputFileTree）。
- **这接口能干啥（大白话）**：OKC 产物：查看产出文件树。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetOutputFileTreeRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `chatShareId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/GetOutputFileTree
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetOutputFileTreeResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `root` | message `FileTreeNode` |
| `downloadUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 166 · GetOutputFileTreeByShare — 获取分享产出文件树

**服务**：`kimi.gateway.mcp.v1.OKCService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/GetOutputFileTreeByShare`

- **API用途**：OKC/产物模块接口：获取分享产出文件树（proto 方法 OKCService.GetOutputFileTreeByShare）。
- **这接口能干啥（大白话）**：OKC 产物：查看分享产出文件树。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetOutputFileTreeByShareRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatShareId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/GetOutputFileTreeByShare
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.GetOutputFileTreeByShareResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `root` | message `FileTreeNode` |
| `downloadUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 167 · PublishDeployment — 发布部署

**服务**：`kimi.gateway.mcp.v1.OKCService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/PublishDeployment`

- **API用途**：OKC/产物模块接口：发布部署（proto 方法 OKCService.PublishDeployment）。
- **这接口能干啥（大白话）**：OKC 产物：发布部署。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.PublishDeploymentRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `version` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/PublishDeployment
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.PublishDeploymentResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `url` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 168 · ResolveFileURI — 调用文件 URI

**服务**：`kimi.gateway.mcp.v1.OKCService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/ResolveFileURI`

- **API用途**：OKC/产物模块接口：调用文件 URI（proto 方法 OKCService.ResolveFileURI）。
- **这接口能干啥（大白话）**：OKC 产物：解析文件 URI。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.ResolveFileURIRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `fileUri` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/ResolveFileURI
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.ResolveFileURIResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `downloadUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 169 · ResolveFileURIByShare — 调用分享文件 URI

**服务**：`kimi.gateway.mcp.v1.OKCService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/ResolveFileURIByShare`

- **API用途**：OKC/产物模块接口：调用分享文件 URI（proto 方法 OKCService.ResolveFileURIByShare）。
- **这接口能干啥（大白话）**：OKC 产物：解析分享的文件 URI。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.ResolveFileURIByShareRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatShareId` | string |
| `fileUri` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/ResolveFileURIByShare
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.ResolveFileURIByShareResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `downloadUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 170 · UnpublishDeployment — 取消发布部署

**服务**：`kimi.gateway.mcp.v1.OKCService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/UnpublishDeployment`

- **API用途**：OKC/产物模块接口：取消发布部署（proto 方法 OKCService.UnpublishDeployment）。
- **这接口能干啥（大白话）**：OKC 产物：下线部署。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.UnpublishDeploymentRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.mcp.v1.OKCService/UnpublishDeployment
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.mcp.v1.UnpublishDeploymentResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 会员 · `kimi.gateway.membership.v2.MembershipService`（5 个方法）

### 171 · ClaimEventBalance — 领取事件余额

**服务**：`kimi.gateway.membership.v2.MembershipService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.membership.v2.MembershipService/ClaimEventBalance`

- **API用途**：会员模块接口：领取事件余额（proto 方法 MembershipService.ClaimEventBalance）。
- **这接口能干啥（大白话）**：会员：领取事件余额。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.membership.v2.ClaimEventBalanceRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `eventId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.membership.v2.MembershipService/ClaimEventBalance
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.membership.v2.ClaimEventBalanceResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 172 · GetBalanceEventInfo — 获取余额事件详情

**服务**：`kimi.gateway.membership.v2.MembershipService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.membership.v2.MembershipService/GetBalanceEventInfo`

- **API用途**：会员模块接口：获取余额事件详情（proto 方法 MembershipService.GetBalanceEventInfo）。
- **这接口能干啥（大白话）**：会员：查看余额事件详情。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.membership.v2.GetBalanceEventInfoRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `eventId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.membership.v2.MembershipService/GetBalanceEventInfo
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.membership.v2.GetBalanceEventInfoResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `eventId` | string |
| `subscriptionId` | string |
| `eventTitle` | string |
| `eventDesc` | string |
| `eventImgUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 173 · GetSubscription — 获取订阅

**服务**：`kimi.gateway.membership.v2.MembershipService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.membership.v2.MembershipService/GetSubscription`

- **API用途**：会员模块接口：获取订阅（proto 方法 MembershipService.GetSubscription）。
- **这接口能干啥（大白话）**：会员：查看订阅。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.membership.v2.GetSubscriptionRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `domain` | enum `Domain` |

**字段取值**：

- `domain`：`DOMAIN_UNSPECIFIED`、`DOMAIN_CODE`、`DOMAIN_KIMI`、`DOMAIN_NEXUS`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.membership.v2.MembershipService/GetSubscription
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.membership.v2.GetSubscriptionResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `subscription` | message `Subscription` |
| `nextSubscription` | message `Subscription` |
| `bonus` | message `Duration` |
| `bonusGoodsTitle` | string |
| `highestLevel` | bool |
| `usingBonus` | bool |
| `subscribed` | bool |
| `purchaseSubscription` | message `Subscription` |
| `purchaseExpireSeconds` | int32 |
| `purchaseExpireTime` | string |
| `balances` | repeated |
| `capabilities` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 174 · GetSubscriptionStats — 获取订阅统计

**服务**：`kimi.gateway.membership.v2.MembershipService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.membership.v2.MembershipService/GetSubscriptionStats`

- **API用途**：会员模块接口：获取订阅统计（proto 方法 MembershipService.GetSubscriptionStats）。
- **这接口能干啥（大白话）**：会员：查看订阅统计。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.membership.v2.GetSubscriptionStatsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `domain` | enum `Domain` |

**字段取值**：

- `domain`：`DOMAIN_UNSPECIFIED`、`DOMAIN_CODE`、`DOMAIN_KIMI`、`DOMAIN_NEXUS`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.membership.v2.MembershipService/GetSubscriptionStats
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.membership.v2.GetSubscriptionStatsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `ratelimit5h` | message `RateLimitStat` |
| `ratelimitCode5h` | message `RateLimitStat` |
| `ratelimit7d` | message `RateLimitStat` |
| `ratelimitCode7d` | message `RateLimitStat` |
| `subscriptionBalance` | message `Balance` |
| `notice` | message `Notice` |
| `overdrawn` | bool |
| `eventId` | string |
| `giftBalances` | repeated |
| `boosterWallets` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 175 · ListBalanceActions — 列出余额事件

**服务**：`kimi.gateway.membership.v2.MembershipService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.membership.v2.MembershipService/ListBalanceActions`

- **API用途**：会员模块接口：列出余额事件（proto 方法 MembershipService.ListBalanceActions）。
- **这接口能干啥（大白话）**：会员：列出余额事件（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.membership.v2.ListBalanceActionsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pageSize` | int32 |
| `pageToken` | string |
| `filter` | message `Filter` |
| `domain` | enum `Domain` |

**字段取值**：

- `domain`：`DOMAIN_UNSPECIFIED`、`DOMAIN_CODE`、`DOMAIN_KIMI`、`DOMAIN_NEXUS`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.membership.v2.MembershipService/ListBalanceActions
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.membership.v2.ListBalanceActionsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `actions` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 长期记忆 · `kimi.gateway.memory.v1.MemoryService`（2 个方法）

### 176 · DeleteMemory — 删除记忆

**服务**：`kimi.gateway.memory.v1.MemoryService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.memory.v1.MemoryService/DeleteMemory`

- **API用途**：长期记忆模块接口：删除记忆（proto 方法 MemoryService.DeleteMemory）。
- **这接口能干啥（大白话）**：长期记忆：删除记忆。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.DeleteMemoryRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `memoryId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.memory.v1.MemoryService/DeleteMemory
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.DeleteMemoryResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 177 · ListMemories — 列出长期记忆

**服务**：`kimi.gateway.memory.v1.MemoryService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.memory.v1.MemoryService/ListMemories`

- **API用途**：长期记忆模块接口：列出长期记忆（proto 方法 MemoryService.ListMemories）。
- **这接口能干啥（大白话）**：长期记忆：列出长期记忆（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.ListMemoriesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pageSize` | int32 |
| `pageToken` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.memory.v1.MemoryService/ListMemories
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.ListMemoriesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `totalCount` | int32 |
| `memoryLimit` | int32 |
| `memories` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 记忆仓库 · `kimi.gateway.memory.v1.VaultService`（4 个方法）

### 178 · GetDreamStatus — 获取梦境状态

**服务**：`kimi.gateway.memory.v1.VaultService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.memory.v1.VaultService/GetDreamStatus`

- **API用途**：记忆仓库模块接口：获取梦境状态（proto 方法 VaultService.GetDreamStatus）。
- **这接口能干啥（大白话）**：记忆仓库：查看梦境状态。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.GetDreamStatusRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.memory.v1.VaultService/GetDreamStatus
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.GetDreamStatusResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `dreamVault` | message `DreamVaultState` |
| `featureAvailable` | bool |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 179 · GetVaultPage — 获取仓库页

**服务**：`kimi.gateway.memory.v1.VaultService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.memory.v1.VaultService/GetVaultPage`

- **API用途**：记忆仓库模块接口：获取仓库页（proto 方法 VaultService.GetVaultPage）。
- **这接口能干啥（大白话）**：记忆仓库：查看仓库页。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.GetVaultPageRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `sandboxUri` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.memory.v1.VaultService/GetVaultPage
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.GetVaultPageResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `markdown` | string |
| `outgoingLinks` | repeated |
| `backlinks` | repeated |
| `citations` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 180 · GetVaultTree — 获取仓库树

**服务**：`kimi.gateway.memory.v1.VaultService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.memory.v1.VaultService/GetVaultTree`

- **API用途**：记忆仓库模块接口：获取仓库树（proto 方法 VaultService.GetVaultTree）。
- **这接口能干啥（大白话）**：记忆仓库：查看仓库树。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.GetVaultTreeRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.memory.v1.VaultService/GetVaultTree
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.GetVaultTreeResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `root` | message `FileTreeNode` |
| `downloadUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 181 · ResetDreamVault — 重置梦境仓库

**服务**：`kimi.gateway.memory.v1.VaultService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.memory.v1.VaultService/ResetDreamVault`

- **API用途**：记忆仓库模块接口：重置梦境仓库（proto 方法 VaultService.ResetDreamVault）。
- **这接口能干啥（大白话）**：记忆仓库：重置梦境仓库。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.ResetDreamVaultRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.memory.v1.VaultService/ResetDreamVault
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.memory.v1.ResetDreamVaultResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 杂项 · `kimi.gateway.misc.v1.MiscService`（1 个方法）

### 182 · GetDataSourceLocalizedInfo — 获取数据源本地化信息

**服务**：`kimi.gateway.misc.v1.MiscService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.misc.v1.MiscService/GetDataSourceLocalizedInfo`

- **API用途**：杂项模块接口：获取数据源本地化信息（proto 方法 MiscService.GetDataSourceLocalizedInfo）。
- **这接口能干啥（大白话）**：杂项：查看数据源本地化信息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.misc.v1.GetDataSourceLocalizedInfoRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.misc.v1.MiscService/GetDataSourceLocalizedInfo
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.misc.v1.GetDataSourceLocalizedInfoResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `infos` | map |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 通知 · `kimi.gateway.notification.v1.NotificationService`（2 个方法）

### 183 · ListUserNotifications — 列出用户通知

**服务**：`kimi.gateway.notification.v1.NotificationService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.notification.v1.NotificationService/ListUserNotifications`

- **API用途**：通知模块接口：列出用户通知（proto 方法 NotificationService.ListUserNotifications）。
- **这接口能干啥（大白话）**：社区通知：列出用户通知（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.notification.v1.ListUserNotificationsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pageSize` | int32 |
| `pageToken` | string |
| `unread` | bool |
| `hide` | bool |
| `types` | repeated |
| `typesValue` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.notification.v1.NotificationService/ListUserNotifications
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.notification.v1.ListUserNotificationsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `unreadCount` | int32 |
| `userNotifications` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 184 · MarkNotificationsRead — 调用通知已读标记

**服务**：`kimi.gateway.notification.v1.NotificationService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.notification.v1.NotificationService/MarkNotificationsRead`

- **API用途**：通知模块接口：调用通知已读标记（proto 方法 NotificationService.MarkNotificationsRead）。
- **这接口能干啥（大白话）**：社区通知：调用 通知已读标记。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.notification.v1.MarkNotificationsReadRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `all` | bool |
| `ids` | repeated |
| `types` | repeated |
| `typesValue` | repeated |
| `extras` | map |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.notification.v1.NotificationService/MarkNotificationsRead
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.notification.v1.MarkNotificationsReadResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `markedCount` | int32 |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 商品 · `kimi.gateway.order.v1.GoodsService`（1 个方法）

### 185 · ListGoods — 列出商品

**服务**：`kimi.gateway.order.v1.GoodsService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.order.v1.GoodsService/ListGoods`

- **API用途**：商品模块接口：列出商品（proto 方法 GoodsService.ListGoods）。
- **这接口能干啥（大白话）**：商品：列出商品（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.order.v1.ListGoodsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pageSize` | int32 |
| `pageToken` | string |
| `discountId` | string |
| `paymentChannel` | enum `PaymentChannel` |
| `domains` | repeated |
| `domainsValue` | repeated |

**字段取值**：

- `paymentChannel`：`PAYMENT_CHANNEL_UNSPECIFIED`、`PAYMENT_CHANNEL_AIRWALLEX`、`PAYMENT_CHANNEL_ALIPAY`、`PAYMENT_CHANNEL_APPLE`、`PAYMENT_CHANNEL_GOOGLE_PLAY`、`PAYMENT_CHANNEL_PAYERMAX`、`PAYMENT_CHANNEL_STRIPE`、`PAYMENT_CHANNEL_WECHAT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.order.v1.GoodsService/ListGoods
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.order.v1.ListGoodsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `recommendChannel` | enum `PaymentChannel` |
| `goods` | repeated |

**字段取值**：

- `recommendChannel`：`PAYMENT_CHANNEL_UNSPECIFIED`、`PAYMENT_CHANNEL_AIRWALLEX`、`PAYMENT_CHANNEL_ALIPAY`、`PAYMENT_CHANNEL_APPLE`、`PAYMENT_CHANNEL_GOOGLE_PLAY`、`PAYMENT_CHANNEL_PAYERMAX`、`PAYMENT_CHANNEL_STRIPE`、`PAYMENT_CHANNEL_WECHAT`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 订阅 · `kimi.gateway.order.v1.SubscriptionService`（4 个方法）

### 186 · CreateSubscription — 创建订阅

**服务**：`kimi.gateway.order.v1.SubscriptionService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.order.v1.SubscriptionService/CreateSubscription`

- **API用途**：订阅模块接口：创建订阅（proto 方法 SubscriptionService.CreateSubscription）。
- **这接口能干啥（大白话）**：订阅：新建订阅。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.order.v1.CreateSubscriptionRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `goodsId` | string |
| `subscriptionAction` | enum `SubscriptionAction` |
| `paymentChannel` | enum `PaymentChannel` |
| `discountId` | string |
| `trackingMsg` | string |
| `domain` | enum `Domain` |

**字段取值**：

- `subscriptionAction`：`SUBSCRIPTION_ACTION_UNSPECIFIED`、`SUBSCRIPTION_ACTION_CREATE`、`SUBSCRIPTION_ACTION_DOWNGRADE`、`SUBSCRIPTION_ACTION_RESUME`、`SUBSCRIPTION_ACTION_UPGRADE`
- `paymentChannel`：`PAYMENT_CHANNEL_UNSPECIFIED`、`PAYMENT_CHANNEL_AIRWALLEX`、`PAYMENT_CHANNEL_ALIPAY`、`PAYMENT_CHANNEL_APPLE`、`PAYMENT_CHANNEL_GOOGLE_PLAY`、`PAYMENT_CHANNEL_PAYERMAX`、`PAYMENT_CHANNEL_STRIPE`、`PAYMENT_CHANNEL_WECHAT`
- `domain`：`DOMAIN_UNSPECIFIED`、`DOMAIN_CODE`、`DOMAIN_KIMI`、`DOMAIN_NEXUS`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.order.v1.SubscriptionService/CreateSubscription
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.order.v1.CreateSubscriptionResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `subscription` | message `Subscription` |
| `redirectUrl` | string |
| `orderId` | string |
| `wechatPassthroughParams` | message `WechatPassthroughParams` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 187 · GetDiscountURL — 获取折扣链接

**服务**：`kimi.gateway.order.v1.SubscriptionService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.order.v1.SubscriptionService/GetDiscountURL`

- **API用途**：订阅模块接口：获取折扣链接（proto 方法 SubscriptionService.GetDiscountURL）。
- **这接口能干啥（大白话）**：订阅：查看折扣链接。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.chat.v1.ToolContentGoods`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `goods` | message `Goods` |
| `discountId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.order.v1.SubscriptionService/GetDiscountURL
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.order.v1.GetDiscountURLResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `discountUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 188 · GetPricePoster — 获取价格海报

**服务**：`kimi.gateway.order.v1.SubscriptionService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.order.v1.SubscriptionService/GetPricePoster`

- **API用途**：订阅模块接口：获取价格海报（proto 方法 SubscriptionService.GetPricePoster）。
- **这接口能干啥（大白话）**：订阅：查看价格海报。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.order.v1.GetPricePosterRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.order.v1.SubscriptionService/GetPricePoster
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.order.v1.GetPricePosterResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pricePoster` | map |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 189 · VeryDiscountUser — 调用超值折扣用户

**服务**：`kimi.gateway.order.v1.SubscriptionService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.order.v1.SubscriptionService/VeryDiscountUser`

- **API用途**：订阅模块接口：调用超值折扣用户（proto 方法 SubscriptionService.VeryDiscountUser）。
- **这接口能干啥（大白话）**：订阅：调用 超值折扣用户。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.order.v1.VeryDiscountUserRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `discountId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.order.v1.SubscriptionService/VeryDiscountUser
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.order.v1.VeryDiscountUserResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `sameUser` | bool |
| `discountUserStatus` | enum `DiscountUserStatus` |

**字段取值**：

- `discountUserStatus`：`DISCOUNT_USER_STATUS_UNSPECIFIED`、`DISCOUNT_USER_STATUS_DISCOUNT_BONUS`、`DISCOUNT_USER_STATUS_DISCOUNT_MEMBER`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 置顶 · `kimi.gateway.pin.v1.PinService`（3 个方法）

### 190 · ListPinResources — 列出置顶资源

**服务**：`kimi.gateway.pin.v1.PinService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.pin.v1.PinService/ListPinResources`

- **API用途**：置顶模块接口：列出置顶资源（proto 方法 PinService.ListPinResources）。
- **这接口能干啥（大白话）**：置顶：列出置顶资源（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.pin.v1.ListPinResourcesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pageSize` | int32 |
| `pageToken` | string |
| `resourceTypes` | repeated |
| `resourceTypesValue` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.pin.v1.PinService/ListPinResources
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.pin.v1.ListPinResourcesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `resources` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 191 · PinResource — 调用置顶资源

**服务**：`kimi.gateway.pin.v1.PinService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.pin.v1.PinService/PinResource`

- **API用途**：置顶模块接口：调用置顶资源（proto 方法 PinService.PinResource）。
- **这接口能干啥（大白话）**：置顶：置顶资源。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.pin.v1.PinResourceRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `resourceType` | enum `PinResourceType` |
| `resourceId` | string |

**字段取值**：

- `resourceType`：`PIN_RESOURCE_TYPE_UNSPECIFIED`、`PIN_RESOURCE_TYPE_CHAT`、`PIN_RESOURCE_TYPE_PROJECT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.pin.v1.PinService/PinResource
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.pin.v1.PinResourceResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `resource` | message `Resource` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 192 · UnpinResource — 调用置顶资源

**服务**：`kimi.gateway.pin.v1.PinService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.pin.v1.PinService/UnpinResource`

- **API用途**：置顶模块接口：调用置顶资源（proto 方法 PinService.UnpinResource）。
- **这接口能干啥（大白话）**：置顶：取消置顶资源。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.pin.v1.UnpinResourceRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `resourceType` | enum `PinResourceType` |
| `resourceId` | string |

**字段取值**：

- `resourceType`：`PIN_RESOURCE_TYPE_UNSPECIFIED`、`PIN_RESOURCE_TYPE_CHAT`、`PIN_RESOURCE_TYPE_PROJECT`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.pin.v1.PinService/UnpinResource
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.pin.v1.UnpinResourceResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `resource` | message `Resource` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 插件 · `kimi.gateway.plugin.v1.PluginService`（7 个方法）

### 193 · GetPlugin — 获取插件

**服务**：`kimi.gateway.plugin.v1.PluginService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/GetPlugin`

- **API用途**：插件模块接口：获取插件（proto 方法 PluginService.GetPlugin）。
- **这接口能干啥（大白话）**：插件：查看插件。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.GetPluginRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/GetPlugin
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.GetPluginResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `plugin` | message `Plugin` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 194 · InstallPlugin — 安装插件

**服务**：`kimi.gateway.plugin.v1.PluginService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/InstallPlugin`

- **API用途**：插件模块接口：安装插件（proto 方法 PluginService.InstallPlugin）。
- **这接口能干啥（大白话）**：插件：安装插件。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.InstallPluginRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/InstallPlugin
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.InstallPluginResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `plugin` | message `Plugin` |
| `oauthRequiredMcpSettingIds` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 195 · ListAvailablePlugins — 列出可用插件

**服务**：`kimi.gateway.plugin.v1.PluginService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/ListAvailablePlugins`

- **API用途**：插件模块接口：列出可用插件（proto 方法 PluginService.ListAvailablePlugins）。
- **这接口能干啥（大白话）**：插件：列出可用插件（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.ListAvailablePluginsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `categoryId` | string |
| `query` | string |
| `pageSize` | int32 |
| `pageToken` | string |
| `clientRuntime` | message `ClientRuntime` |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/ListAvailablePlugins
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.ListAvailablePluginsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `totalSize` | int32 |
| `plugins` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 196 · ListInstalledPlugins — 列出已安装插件

**服务**：`kimi.gateway.plugin.v1.PluginService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/ListInstalledPlugins`

- **API用途**：插件模块接口：列出已安装插件（proto 方法 PluginService.ListInstalledPlugins）。
- **这接口能干啥（大白话）**：插件：列出已安装插件（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.ListInstalledPluginsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pageSize` | int32 |
| `pageToken` | string |
| `query` | string |
| `clientRuntime` | message `ClientRuntime` |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/ListInstalledPlugins
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.ListInstalledPluginsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `totalSize` | int32 |
| `plugins` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 197 · ListPluginCategories — 列出插件分类

**服务**：`kimi.gateway.plugin.v1.PluginService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/ListPluginCategories`

- **API用途**：插件模块接口：列出插件分类（proto 方法 PluginService.ListPluginCategories）。
- **这接口能干啥（大白话）**：插件：列出插件分类（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.ListPluginCategoriesRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/ListPluginCategories
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.ListPluginCategoriesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `categories` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 198 · ListPluginSections — 列出插件分区

**服务**：`kimi.gateway.plugin.v1.PluginService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/ListPluginSections`

- **API用途**：插件模块接口：列出插件分区（proto 方法 PluginService.ListPluginSections）。
- **这接口能干啥（大白话）**：插件：列出插件分区（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.ListPluginSectionsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `query` | string |
| `pageSize` | int32 |
| `clientRuntime` | message `ClientRuntime` |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/ListPluginSections
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.ListPluginSectionsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `installed` | message `PluginSection` |
| `sections` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 199 · UninstallPlugin — 卸载插件

**服务**：`kimi.gateway.plugin.v1.PluginService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/UninstallPlugin`

- **API用途**：插件模块接口：卸载插件（proto 方法 PluginService.UninstallPlugin）。
- **这接口能干啥（大白话）**：插件：卸载插件。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.UninstallPluginRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.plugin.v1.PluginService/UninstallPlugin
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.plugin.v1.UninstallPluginResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 项目 · `kimi.gateway.project.v1.ProjectService`（9 个方法）

### 200 · CreateProject — 创建项目

**服务**：`kimi.gateway.project.v1.ProjectService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/CreateProject`

- **API用途**：项目模块接口：创建项目（proto 方法 ProjectService.CreateProject）。
- **这接口能干啥（大白话）**：项目：新建项目。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.CreateProjectRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `name` | string |
| `prompt` | string |
| `description` | string |
| `iconUrl` | string |
| `useMemory` | bool |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/CreateProject
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.CreateProjectResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `project` | message `Project` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 201 · DeleteProject — 删除项目

**服务**：`kimi.gateway.project.v1.ProjectService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/DeleteProject`

- **API用途**：项目模块接口：删除项目（proto 方法 ProjectService.DeleteProject）。
- **这接口能干啥（大白话）**：项目：删除项目。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.DeleteProjectRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `projectId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/DeleteProject
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.DeleteProjectResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `project` | message `Project` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 202 · DeleteProjectFile — 删除项目文件

**服务**：`kimi.gateway.project.v1.ProjectService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/DeleteProjectFile`

- **API用途**：项目模块接口：删除项目文件（proto 方法 ProjectService.DeleteProjectFile）。
- **这接口能干啥（大白话）**：项目：删除项目文件。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.DeleteProjectFileRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `projectId` | string |
| `path` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/DeleteProjectFile
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式**

无独立 Response 消息；通常返回空对象 `{}`（删除/无返回体类接口）。

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 203 · GetProject — 获取项目

**服务**：`kimi.gateway.project.v1.ProjectService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/GetProject`

- **API用途**：项目模块接口：获取项目（proto 方法 ProjectService.GetProject）。
- **这接口能干啥（大白话）**：项目：查看项目。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.GetProjectRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `projectId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/GetProject
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.GetProjectResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `project` | message `Project` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 204 · ListProjectFiles — 列出项目文件

**服务**：`kimi.gateway.project.v1.ProjectService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/ListProjectFiles`

- **API用途**：项目模块接口：列出项目文件（proto 方法 ProjectService.ListProjectFiles）。
- **这接口能干啥（大白话）**：项目：列出项目文件（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.ListProjectFilesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `projectId` | string |
| `path` | string |
| `showHidden` | bool |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/ListProjectFiles
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.ListProjectFilesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `info` | message `FileInfo` |
| `files` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 205 · ListProjectUploadFiles — 列出项目待上传文件

**服务**：`kimi.gateway.project.v1.ProjectService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/ListProjectUploadFiles`

- **API用途**：项目模块接口：列出项目待上传文件（proto 方法 ProjectService.ListProjectUploadFiles）。
- **这接口能干啥（大白话）**：项目：列出项目待上传文件（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.ListProjectUploadFilesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `projectId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/ListProjectUploadFiles
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.ListProjectUploadFilesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `info` | message `FileInfo` |
| `files` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 206 · ListProjects — 列出项目

**服务**：`kimi.gateway.project.v1.ProjectService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/ListProjects`

- **API用途**：项目模块接口：列出项目（proto 方法 ProjectService.ListProjects）。
- **这接口能干啥（大白话）**：项目：列出项目（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.ListProjectsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pageSize` | int32 |
| `pageToken` | string |
| `includePinned` | bool |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/ListProjects
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.ListProjectsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `projectCountUsed` | string |
| `projectCountLimit` | string |
| `availableCount` | string |
| `projects` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 207 · SetAvailableProjects — 设置可用项目

**服务**：`kimi.gateway.project.v1.ProjectService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/SetAvailableProjects`

- **API用途**：项目模块接口：设置可用项目（proto 方法 ProjectService.SetAvailableProjects）。
- **这接口能干啥（大白话）**：项目：设置可用项目。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.SetAvailableProjectsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `projectIds` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/SetAvailableProjects
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.SetAvailableProjectsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `projectCountUsed` | repeated |
| `projectCountLimit` | string |
| `projects` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 208 · UpdateProject — 更新项目

**服务**：`kimi.gateway.project.v1.ProjectService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/UpdateProject`

- **API用途**：项目模块接口：更新项目（proto 方法 ProjectService.UpdateProject）。
- **这接口能干啥（大白话）**：项目：修改项目。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.Project`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |
| `name` | string |
| `prompt` | string |
| `iconUrl` | string |
| `description` | string |
| `createTime` | string |
| `updateTime` | string |
| `useMemory` | bool |
| `availability` | enum `ProjectAvailability` |
| `unreadCount` | int32 |

**字段取值**：

- `availability`：`PROJECT_AVAILABILITY_UNSPECIFIED`、`PROJECT_AVAILABILITY_AVAILABLE`、`PROJECT_AVAILABILITY_READ_ONLY`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.project.v1.ProjectService/UpdateProject
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.project.v1.UpdateProjectResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `project` | message `Project` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 营销素材 · `kimi.gateway.promotionalasset.v1.PromotionalAssetService`（1 个方法）

### 209 · ListPromotionalAssets — 列出营销素材

**服务**：`kimi.gateway.promotionalasset.v1.PromotionalAssetService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.promotionalasset.v1.PromotionalAssetService/ListPromotionalAssets`

- **API用途**：营销素材模块接口：列出营销素材（proto 方法 PromotionalAssetService.ListPromotionalAssets）。
- **这接口能干啥（大白话）**：营销素材：列出营销素材（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.promotionalasset.v1.ListPromotionalAssetsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pages` | repeated |
| `pagesValue` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.promotionalasset.v1.PromotionalAssetService/ListPromotionalAssets
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.promotionalasset.v1.ListPromotionalAssetsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `doodles` | repeated |
| `cards` | repeated |
| `homeBanners` | repeated |
| `persistentActivityCards` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 风控 · `kimi.gateway.riskcontrol.v1.RiskControlService`（1 个方法）

### 210 · ReportEvent — 上报事件

**服务**：`kimi.gateway.riskcontrol.v1.RiskControlService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.riskcontrol.v1.RiskControlService/ReportEvent`

- **API用途**：风控模块接口：上报事件（proto 方法 RiskControlService.ReportEvent）。
- **这接口能干啥（大白话）**：风控：上报事件。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.riskcontrol.v1.ReportEventRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `customPayload` | message `CustomPayload` |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.riskcontrol.v1.RiskControlService/ReportEvent
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.riskcontrol.v1.ReportEventResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 技能任务 · `kimi.gateway.skill.v1.SkillJobService`（4 个方法）

### 211 · CreateSkillJob — 创建技能任务

**服务**：`kimi.gateway.skill.v1.SkillJobService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillJobService/CreateSkillJob`

- **API用途**：技能任务模块接口：创建技能任务（proto 方法 SkillJobService.CreateSkillJob）。
- **这接口能干啥（大白话）**：技能任务：新建技能任务。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.CreateSkillJobRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `prompt` | string |
| `targetType` | enum `SkillJobType` |
| `botId` | string |
| `fileIds` | repeated |

**字段取值**：

- `targetType`：`SKILL_JOB_TYPE_UNSPECIFIED`、`SKILL_JOB_TYPE_CLAW_SKILL`、`SKILL_JOB_TYPE_KIMI_SKILL`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillJobService/CreateSkillJob
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.CreateSkillJobResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `job` | message `SkillJob` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 212 · DeleteSkillJob — 删除技能任务

**服务**：`kimi.gateway.skill.v1.SkillJobService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillJobService/DeleteSkillJob`

- **API用途**：技能任务模块接口：删除技能任务（proto 方法 SkillJobService.DeleteSkillJob）。
- **这接口能干啥（大白话）**：技能任务：删除技能任务。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.DeleteSkillJobRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `jobId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillJobService/DeleteSkillJob
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.DeleteSkillJobResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `job` | message `SkillJob` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 213 · GetSkillJob — 获取技能任务

**服务**：`kimi.gateway.skill.v1.SkillJobService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillJobService/GetSkillJob`

- **API用途**：技能任务模块接口：获取技能任务（proto 方法 SkillJobService.GetSkillJob）。
- **这接口能干啥（大白话）**：技能任务：查看技能任务。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.GetSkillJobRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `jobId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillJobService/GetSkillJob
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.GetSkillJobResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `job` | message `SkillJob` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 214 · RetrySkillJob — 重试技能任务

**服务**：`kimi.gateway.skill.v1.SkillJobService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillJobService/RetrySkillJob`

- **API用途**：技能任务模块接口：重试技能任务（proto 方法 SkillJobService.RetrySkillJob）。
- **这接口能干啥（大白话）**：技能任务：重试技能任务。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.RetrySkillJobRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `jobId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillJobService/RetrySkillJob
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.RetrySkillJobResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `job` | message `SkillJob` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 技能 · `kimi.gateway.skill.v1.SkillService`（7 个方法）

### 215 · GetSkill — 获取技能

**服务**：`kimi.gateway.skill.v1.SkillService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/GetSkill`

- **API用途**：技能模块接口：获取技能（proto 方法 SkillService.GetSkill）。
- **这接口能干啥（大白话）**：技能：查看技能。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.GetSkillRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `skillId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/GetSkill
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.GetSkillResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `skill` | message `Skill` |
| `hasNameConflict` | bool |
| `canUpdate` | bool |
| `activeVersion` | int32 |
| `latestVersion` | int32 |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 216 · GetSkillFileTree — 获取技能文件树

**服务**：`kimi.gateway.skill.v1.SkillService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/GetSkillFileTree`

- **API用途**：技能模块接口：获取技能文件树（proto 方法 SkillService.GetSkillFileTree）。
- **这接口能干啥（大白话）**：技能：查看技能文件树。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.GetSkillFileTreeRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `skillId` | string |
| `versionNo` | int32 |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/GetSkillFileTree
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.GetSkillFileTreeResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `root` | message `FileTreeNode` |
| `downloadUrl` | string |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 217 · InstallSkill — 安装技能

**服务**：`kimi.gateway.skill.v1.SkillService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/InstallSkill`

- **API用途**：技能模块接口：安装技能（proto 方法 SkillService.InstallSkill）。
- **这接口能干啥（大白话）**：技能：安装技能。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.InstallSkillRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `skillId` | string |
| `overrideName` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/InstallSkill
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.InstallSkillResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `skill` | message `Skill` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 218 · ListInstalledSkills — 列出已装技能

**服务**：`kimi.gateway.skill.v1.SkillService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/ListInstalledSkills`

- **API用途**：技能模块接口：列出已装技能（proto 方法 SkillService.ListInstalledSkills）。
- **这接口能干啥（大白话）**：技能：列出已装技能（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.ListInstalledSkillsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `query` | string |
| `category` | enum `Category` |
| `skillUseCaseId` | string |

**字段取值**：

- `category`：`CATEGORY_UNSPECIFIED`、`CATEGORY_AGENT`、`CATEGORY_CLAW`、`CATEGORY_SWARM`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/ListInstalledSkills
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.ListInstalledSkillsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `skills` | repeated |
| `generatingTasks` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 219 · ListSkillUseCases — 列出技能使用场景

**服务**：`kimi.gateway.skill.v1.SkillService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/ListSkillUseCases`

- **API用途**：技能模块接口：列出技能使用场景（proto 方法 SkillService.ListSkillUseCases）。
- **这接口能干啥（大白话）**：技能：列出技能使用场景（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.ListSkillUseCasesRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/ListSkillUseCases
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.ListSkillUseCasesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `useCases` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 220 · ListSkills — 列出技能

**服务**：`kimi.gateway.skill.v1.SkillService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/ListSkills`

- **API用途**：技能模块接口：列出技能（proto 方法 SkillService.ListSkills）。
- **这接口能干啥（大白话）**：技能：列出技能（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.ListSkillsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `query` | string |
| `pageSize` | int32 |
| `pageToken` | string |
| `category` | enum `Category` |
| `skillUseCaseId` | string |

**字段取值**：

- `category`：`CATEGORY_UNSPECIFIED`、`CATEGORY_AGENT`、`CATEGORY_CLAW`、`CATEGORY_SWARM`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/ListSkills
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.ListSkillsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `totalCount` | int32 |
| `skills` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 221 · RemoveSkill — 移除技能

**服务**：`kimi.gateway.skill.v1.SkillService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/RemoveSkill`

- **API用途**：技能模块接口：移除技能（proto 方法 SkillService.RemoveSkill）。
- **这接口能干啥（大白话）**：技能：移除技能。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.RemoveSkillRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `skillId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.skill.v1.SkillService/RemoveSkill
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.skill.v1.RemoveSkillResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 幻灯片 · `kimi.gateway.slides.v1.SlidesService`（1 个方法）

### 222 · GetSlides — 获取幻灯片

**服务**：`kimi.gateway.slides.v1.SlidesService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.slides.v1.SlidesService/GetSlides`

- **API用途**：幻灯片模块接口：获取幻灯片（proto 方法 SlidesService.GetSlides）。
- **这接口能干啥（大白话）**：幻灯片：查看幻灯片。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.slides.v1.GetSlidesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.slides.v1.SlidesService/GetSlides
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.slides.v1.GetSlidesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `slides` | message `Slides` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 展示位 · `kimi.gateway.suggest.v1.OpenShowcaseService`（1 个方法）

### 223 · GetShowcaseByID — 获取展示位详情

**服务**：`kimi.gateway.suggest.v1.OpenShowcaseService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.suggest.v1.OpenShowcaseService/GetShowcaseByID`

- **API用途**：展示位模块接口：获取展示位详情（proto 方法 OpenShowcaseService.GetShowcaseByID）。
- **这接口能干啥（大白话）**：展示位：查看展示位详情。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.suggest.v1.GetShowcaseByIDRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.suggest.v1.OpenShowcaseService/GetShowcaseByID
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.suggest.v1.GetShowcaseByIDResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `showcase` | message `Showcase` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 展示位 · `kimi.gateway.suggest.v1.ShowcaseService`（2 个方法）

### 224 · ListDefaultShowcases — 列出默认展示位

**服务**：`kimi.gateway.suggest.v1.ShowcaseService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.suggest.v1.ShowcaseService/ListDefaultShowcases`

- **API用途**：展示位模块接口：列出默认展示位（proto 方法 ShowcaseService.ListDefaultShowcases）。
- **这接口能干啥（大白话）**：展示位：列出默认展示位（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.suggest.v1.ListDefaultShowcasesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `scenario` | enum `Scenario` |
| `categoryName` | string |
| `limit` | int32 |
| `kimiPlusId` | string |
| `agentModeType` | enum `Type` |

**字段取值**：

- `scenario`：`SCENARIO_UNSPECIFIED`、`SCENARIO_AUTOMATION`、`SCENARIO_AUTOMATION_K3`、`SCENARIO_BOT`、`SCENARIO_CHAT`、`SCENARIO_DEEP_RESEARCH`、`SCENARIO_K2`、`SCENARIO_K2D5`、`SCENARIO_K3`、`SCENARIO_KIMI_PLUS`、`SCENARIO_KODER`、`SCENARIO_OK_COMPUTER`、`SCENARIO_OK_COMPUTER_SWARM`、`SCENARIO_PROBLEM_SOLVE`、`SCENARIO_SKILLCREATOR`、`SCENARIO_SLIDES`、`SCENARIO_THINK`
- `agentModeType`：`TYPE_UNSPECIFIED`、`TYPE_NORMAL`、`TYPE_ULTRA`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.suggest.v1.ShowcaseService/ListDefaultShowcases
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.suggest.v1.ListDefaultShowcasesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `showcases` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 225 · ListMobileHomepageShowcases — 列出移动首页展示位

**服务**：`kimi.gateway.suggest.v1.ShowcaseService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.suggest.v1.ShowcaseService/ListMobileHomepageShowcases`

- **API用途**：展示位模块接口：列出移动首页展示位（proto 方法 ShowcaseService.ListMobileHomepageShowcases）。
- **这接口能干啥（大白话）**：展示位：列出移动首页展示位（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.suggest.v1.ListMobileHomepageShowcasesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `isCommunityEnabled` | bool |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.suggest.v1.ShowcaseService/ListMobileHomepageShowcases
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.suggest.v1.ListMobileHomepageShowcasesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `recId` | string |
| `showcases` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 推荐 · `kimi.gateway.suggest.v1.SuggestService`（2 个方法）

### 226 · ClaimPopupExposure — 领取弹窗曝光

**服务**：`kimi.gateway.suggest.v1.SuggestService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.suggest.v1.SuggestService/ClaimPopupExposure`

- **API用途**：推荐模块接口：领取弹窗曝光（proto 方法 SuggestService.ClaimPopupExposure）。
- **这接口能干啥（大白话）**：推荐：领取弹窗曝光。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.suggest.v1.ClaimPopupExposureRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `popupName` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.suggest.v1.SuggestService/ClaimPopupExposure
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.suggest.v1.ClaimPopupExposureResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 227 · ListPopups — 列出弹窗

**服务**：`kimi.gateway.suggest.v1.SuggestService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.suggest.v1.SuggestService/ListPopups`

- **API用途**：推荐模块接口：列出弹窗（proto 方法 SuggestService.ListPopups）。
- **这接口能干啥（大白话）**：推荐：列出弹窗（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.suggest.v1.ListPopupsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `deviceLanguage` | string |
| `scenario` | message |
| `pwaInstallable` | bool |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.suggest.v1.SuggestService/ListPopups
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.suggest.v1.ListPopupsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `popups` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 多智能体 · `kimi.gateway.swarm.v1.SwarmService`（4 个方法）

### 228 · ListAgentMessages — 列出智能体消息

**服务**：`kimi.gateway.swarm.v1.SwarmService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.swarm.v1.SwarmService/ListAgentMessages`

- **API用途**：多智能体模块接口：列出智能体消息（proto 方法 SwarmService.ListAgentMessages）。
- **这接口能干啥（大白话）**：多智能体：列出智能体消息（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.swarm.v1.ListAgentMessagesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `agentId` | string |
| `pageSize` | int32 |
| `pageToken` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.swarm.v1.SwarmService/ListAgentMessages
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.swarm.v1.ListAgentMessagesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `messages` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 229 · ListAgentMessagesByShare — 列出分享会话的智能体消息

**服务**：`kimi.gateway.swarm.v1.SwarmService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.swarm.v1.SwarmService/ListAgentMessagesByShare`

- **API用途**：多智能体模块接口：列出分享会话的智能体消息（proto 方法 SwarmService.ListAgentMessagesByShare）。
- **这接口能干啥（大白话）**：多智能体：列出分享会话的智能体消息（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.swarm.v1.ListAgentMessagesByShareRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `agentId` | string |
| `pageSize` | int32 |
| `pageToken` | string |
| `shareId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.swarm.v1.SwarmService/ListAgentMessagesByShare
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.swarm.v1.ListAgentMessagesByShareResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `messages` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 230 · ListAgents — 列出智能体

**服务**：`kimi.gateway.swarm.v1.SwarmService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.swarm.v1.SwarmService/ListAgents`

- **API用途**：多智能体模块接口：列出智能体（proto 方法 SwarmService.ListAgents）。
- **这接口能干啥（大白话）**：多智能体：列出智能体（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.swarm.v1.ListAgentsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `includeTerminated` | bool |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.swarm.v1.SwarmService/ListAgents
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.swarm.v1.ListAgentsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `agents` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 231 · StopAgents — 停止智能体

**服务**：`kimi.gateway.swarm.v1.SwarmService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.swarm.v1.SwarmService/StopAgents`

- **API用途**：多智能体模块接口：停止智能体（proto 方法 SwarmService.StopAgents）。
- **这接口能干啥（大白话）**：多智能体：停止智能体。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.swarm.v1.StopAgentsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.swarm.v1.SwarmService/StopAgents
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.swarm.v1.StopAgentsResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 触发器 · `kimi.gateway.trigger.v1.TriggerService`（8 个方法）

### 232 · CreateTask — 创建任务

**服务**：`kimi.gateway.trigger.v1.TriggerService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/CreateTask`

- **API用途**：触发器模块接口：创建任务（proto 方法 TriggerService.CreateTask）。
- **这接口能干啥（大白话）**：定时任务：新建任务。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.CreateTaskRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `type` | enum `TaskType` |
| `chatId` | string |
| `title` | string |
| `cronExpr` | string |
| `nextTime` | string |
| `payload` | message `TaskPayload` |
| `expiredAt` | string |
| `projectId` | string |

**字段取值**：

- `type`：`TASK_TYPE_UNSPECIFIED`、`TASK_TYPE_CRON`、`TASK_TYPE_ONCE`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/CreateTask
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.CreateTaskResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `task` | message `Task` |
| `pauseReason` | message `ErrorDetail` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 233 · DeleteTask — 删除任务

**服务**：`kimi.gateway.trigger.v1.TriggerService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/DeleteTask`

- **API用途**：触发器模块接口：删除任务（proto 方法 TriggerService.DeleteTask）。
- **这接口能干啥（大白话）**：定时任务：删除任务。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.DeleteTaskRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `taskId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/DeleteTask
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.DeleteTaskResponse`

（空消息，无字段）

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 234 · GetTask — 获取任务

**服务**：`kimi.gateway.trigger.v1.TriggerService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/GetTask`

- **API用途**：触发器模块接口：获取任务（proto 方法 TriggerService.GetTask）。
- **这接口能干啥（大白话）**：定时任务：查看任务。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.GetTaskRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `taskId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/GetTask
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.GetTaskResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `task` | message `Task` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 235 · ListTaskExecutions — 列出任务执行记录

**服务**：`kimi.gateway.trigger.v1.TriggerService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/ListTaskExecutions`

- **API用途**：触发器模块接口：列出任务执行记录（proto 方法 TriggerService.ListTaskExecutions）。
- **这接口能干啥（大白话）**：定时任务：列出任务执行记录（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.ListTaskExecutionsRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `taskId` | string |
| `pageSize` | int32 |
| `pageToken` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/ListTaskExecutions
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.ListTaskExecutionsResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `executions` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 236 · ListTasks — 列出任务

**服务**：`kimi.gateway.trigger.v1.TriggerService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/ListTasks`

- **API用途**：触发器模块接口：列出任务（proto 方法 TriggerService.ListTasks）。
- **这接口能干啥（大白话）**：定时任务：列出任务（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.ListTasksRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `pageSize` | int32 |
| `pageToken` | string |
| `chatId` | string |
| `projectId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/ListTasks
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.ListTasksResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `nextPageToken` | string |
| `tasks` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 237 · MarkExecutionRead — 调用执行已读标记

**服务**：`kimi.gateway.trigger.v1.TriggerService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/MarkExecutionRead`

- **API用途**：触发器模块接口：调用执行已读标记（proto 方法 TriggerService.MarkExecutionRead）。
- **这接口能干啥（大白话）**：定时任务：标记已读。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.MarkExecutionReadRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `taskId` | string |
| `executionId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/MarkExecutionRead
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.MarkExecutionReadResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `execution` | message `TaskExecution` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 238 · RunTask — 执行任务

**服务**：`kimi.gateway.trigger.v1.TriggerService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/RunTask`

- **API用途**：触发器模块接口：执行任务（proto 方法 TriggerService.RunTask）。
- **这接口能干啥（大白话）**：定时任务：执行任务。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.RunTaskRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `taskId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/RunTask
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.RunTaskResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `execution` | message `TaskExecution` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 239 · UpdateTask — 更新任务

**服务**：`kimi.gateway.trigger.v1.TriggerService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/UpdateTask`

- **API用途**：触发器模块接口：更新任务（proto 方法 TriggerService.UpdateTask）。
- **这接口能干啥（大白话）**：定时任务：修改任务。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.UpdateTaskRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `task` | message `Task` |
| `updateMask` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.trigger.v1.TriggerService/UpdateTask
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.trigger.v1.UpdateTaskResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `task` | message `Task` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 语音合成 · `kimi.gateway.tts.v1.TTSService`（1 个方法）

### 240 · ListVoices — 列出音色

**服务**：`kimi.gateway.tts.v1.TTSService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.tts.v1.TTSService/ListVoices`

- **API用途**：语音合成模块接口：列出音色（proto 方法 TTSService.ListVoices）。
- **这接口能干啥（大白话）**：语音合成：列出音色（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.tts.v1.ListVoicesRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.tts.v1.TTSService/ListVoices
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.tts.v1.ListVoicesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `voices` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 网站别名 · `kimi.gateway.websites.v1.WebsiteSlugService`（3 个方法）

### 241 · GetWebsiteSlug — 获取网站别名

**服务**：`kimi.gateway.websites.v1.WebsiteSlugService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.websites.v1.WebsiteSlugService/GetWebsiteSlug`

- **API用途**：网站别名模块接口：获取网站别名（proto 方法 WebsiteSlugService.GetWebsiteSlug）。
- **这接口能干啥（大白话）**：网站别名：查看网站别名。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.websites.v1.GetWebsiteSlugRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.websites.v1.WebsiteSlugService/GetWebsiteSlug
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.websites.v1.GetWebsiteSlugResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `info` | message `WebsiteSlug` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 242 · SetWebsiteSlug — 设置网站别名

**服务**：`kimi.gateway.websites.v1.WebsiteSlugService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.websites.v1.WebsiteSlugService/SetWebsiteSlug`

- **API用途**：网站别名模块接口：设置网站别名（proto 方法 WebsiteSlugService.SetWebsiteSlug）。
- **这接口能干啥（大白话）**：网站别名：设置网站别名。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.websites.v1.SetWebsiteSlugRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `slug` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.websites.v1.WebsiteSlugService/SetWebsiteSlug
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.websites.v1.SetWebsiteSlugResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `info` | message `WebsiteSlug` |
| `reason` | enum `WebsiteSlugReason` |

**字段取值**：

- `reason`：`WEBSITE_SLUG_REASON_UNSPECIFIED`、`WEBSITE_SLUG_REASON_ALL_NUMERIC`、`WEBSITE_SLUG_REASON_ALREADY_TAKEN`、`WEBSITE_SLUG_REASON_CONFLICT`、`WEBSITE_SLUG_REASON_INVALID_FORMAT`、`WEBSITE_SLUG_REASON_MODERATION_UNAVAILABLE`、`WEBSITE_SLUG_REASON_OK`、`WEBSITE_SLUG_REASON_RESERVED_SHORTID_NAMESPACE`、`WEBSITE_SLUG_REASON_RESERVED_WORD`、`WEBSITE_SLUG_REASON_SENSITIVE_CONTENT`、`WEBSITE_SLUG_REASON_STARTS_OR_ENDS_WITH_HYPHEN`、`WEBSITE_SLUG_REASON_TOO_LONG`、`WEBSITE_SLUG_REASON_TOO_SHORT`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 243 · ValidateWebsiteSlug — 调用网站别名

**服务**：`kimi.gateway.websites.v1.WebsiteSlugService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.websites.v1.WebsiteSlugService/ValidateWebsiteSlug`

- **API用途**：网站别名模块接口：调用网站别名（proto 方法 WebsiteSlugService.ValidateWebsiteSlug）。
- **这接口能干啥（大白话）**：网站别名：校验网站别名。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.gateway.websites.v1.ValidateWebsiteSlugRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `slug` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.websites.v1.WebsiteSlugService/ValidateWebsiteSlug
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.gateway.websites.v1.ValidateWebsiteSlugResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `available` | bool |
| `reason` | enum `WebsiteSlugReason` |

**字段取值**：

- `reason`：`WEBSITE_SLUG_REASON_UNSPECIFIED`、`WEBSITE_SLUG_REASON_ALL_NUMERIC`、`WEBSITE_SLUG_REASON_ALREADY_TAKEN`、`WEBSITE_SLUG_REASON_CONFLICT`、`WEBSITE_SLUG_REASON_INVALID_FORMAT`、`WEBSITE_SLUG_REASON_MODERATION_UNAVAILABLE`、`WEBSITE_SLUG_REASON_OK`、`WEBSITE_SLUG_REASON_RESERVED_SHORTID_NAMESPACE`、`WEBSITE_SLUG_REASON_RESERVED_WORD`、`WEBSITE_SLUG_REASON_SENSITIVE_CONTENT`、`WEBSITE_SLUG_REASON_STARTS_OR_ENDS_WITH_HYPHEN`、`WEBSITE_SLUG_REASON_TOO_LONG`、`WEBSITE_SLUG_REASON_TOO_SHORT`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 远程控制 · `kimi.gateway.work.v1.RemoteControlService`（6 个方法）

### 244 · CreatePairing — 创建配对

**服务**：`kimi.gateway.work.v1.RemoteControlService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/CreatePairing`

- **API用途**：远程控制模块接口：创建配对（proto 方法 RemoteControlService.CreatePairing）。
- **这接口能干啥（大白话）**：远程控制：新建配对。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体**

（无独立 Request 消息；请求体为空对象 `{}`）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/CreatePairing
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式**

无独立 Response 消息；通常返回空对象 `{}`（删除/无返回体类接口）。

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 245 · CreateWebSocketTicket — 创建WebSocket 票据

**服务**：`kimi.gateway.work.v1.RemoteControlService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/CreateWebSocketTicket`

- **API用途**：远程控制模块接口：创建WebSocket 票据（proto 方法 RemoteControlService.CreateWebSocketTicket）。
- **这接口能干啥（大白话）**：远程控制：新建WebSocket 票据。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体**

（无独立 Request 消息；请求体为空对象 `{}`）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/CreateWebSocketTicket
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式**

无独立 Response 消息；通常返回空对象 `{}`（删除/无返回体类接口）。

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 246 · GetPairing — 获取配对

**服务**：`kimi.gateway.work.v1.RemoteControlService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/GetPairing`

- **API用途**：远程控制模块接口：获取配对（proto 方法 RemoteControlService.GetPairing）。
- **这接口能干啥（大白话）**：远程控制：查看配对。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体**

（无独立 Request 消息；请求体为空对象 `{}`）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/GetPairing
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式**

无独立 Response 消息；通常返回空对象 `{}`（删除/无返回体类接口）。

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 247 · ListClients — 列出客户端

**服务**：`kimi.gateway.work.v1.RemoteControlService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/ListClients`

- **API用途**：远程控制模块接口：列出客户端（proto 方法 RemoteControlService.ListClients）。
- **这接口能干啥（大白话）**：远程控制：列出已连客户端（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体**

（无独立 Request 消息；请求体为空对象 `{}`）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/ListClients
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式**

无独立 Response 消息；通常返回空对象 `{}`（删除/无返回体类接口）。

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 248 · ListServers — 列出服务端

**服务**：`kimi.gateway.work.v1.RemoteControlService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/ListServers`

- **API用途**：远程控制模块接口：列出服务端（proto 方法 RemoteControlService.ListServers）。
- **这接口能干啥（大白话）**：远程控制：列出可连服务端（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体**

（无独立 Request 消息；请求体为空对象 `{}`）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/ListServers
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式**

无独立 Response 消息；通常返回空对象 `{}`（删除/无返回体类接口）。

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 249 · RevokeClient — 调用客户端授权

**服务**：`kimi.gateway.work.v1.RemoteControlService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/RevokeClient`

- **API用途**：远程控制模块接口：调用客户端授权（proto 方法 RemoteControlService.RevokeClient）。
- **这接口能干啥（大白话）**：远程控制：撤销客户端。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体**

（无独立 Request 消息；请求体为空对象 `{}`）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.gateway.work.v1.RemoteControlService/RevokeClient
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式**

无独立 Response 消息；通常返回空对象 `{}`（删除/无返回体类接口）。

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 发件箱 · `kimi.outbox.v1.OutboxService`（9 个方法）

### 250 · ClearOutboxMessages — 调用发件箱消息

**服务**：`kimi.outbox.v1.OutboxService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/ClearOutboxMessages`

- **API用途**：发件箱模块接口：调用发件箱消息（proto 方法 OutboxService.ClearOutboxMessages）。
- **这接口能干啥（大白话）**：发件箱：清空发件箱消息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.outbox.v1.ClearOutboxMessagesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/ClearOutboxMessages
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式**

无独立 Response 消息；通常返回空对象 `{}`（删除/无返回体类接口）。

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 251 · CreateOutboxMessage — 创建发件箱消息

**服务**：`kimi.outbox.v1.OutboxService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/CreateOutboxMessage`

- **API用途**：发件箱模块接口：创建发件箱消息（proto 方法 OutboxService.CreateOutboxMessage）。
- **这接口能干啥（大白话）**：发件箱：新建发件箱消息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.chat.v1.ChatMessage`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |
| `parentId` | string |
| `role` | enum `Lup/ib;` |
| `status` | enum `MessageStatus` |
| `refs` | message `Refs` |
| `scenario` | enum `Scenario` |
| `kimiPlus` | message `KimiPlusBrief` |
| `vote` | enum `Vote` |
| `error` | message `Error` |
| `createTime` | string |
| `isGoal` | bool |
| `childrenMessageIds` | repeated |
| `blocks` | repeated |
| `references` | repeated |
| `labels` | repeated |
| `labelsValue` | repeated |

**字段取值**：

- `role`：`ROLE_UNSPECIFIED`、`assistant`、`system`、`user`
- `status`：`MESSAGE_STATUS_UNSPECIFIED`、`MESSAGE_STATUS_CANCELLED`、`MESSAGE_STATUS_COMPLETED`、`MESSAGE_STATUS_ERROR`、`MESSAGE_STATUS_GENERATING`、`MESSAGE_STATUS_PENDING`、`MESSAGE_STATUS_TRUNCATED`
- `scenario`：`SCENARIO_UNSPECIFIED`、`SCENARIO_AUTOMATION`、`SCENARIO_AUTOMATION_K3`、`SCENARIO_BOT`、`SCENARIO_CHAT`、`SCENARIO_DEEP_RESEARCH`、`SCENARIO_K2`、`SCENARIO_K2D5`、`SCENARIO_K3`、`SCENARIO_KIMI_PLUS`、`SCENARIO_KODER`、`SCENARIO_OK_COMPUTER`、`SCENARIO_OK_COMPUTER_SWARM`、`SCENARIO_PROBLEM_SOLVE`、`SCENARIO_SKILLCREATOR`、`SCENARIO_SLIDES`、`SCENARIO_THINK`
- `vote`：`VOTE_UNSPECIFIED`、`VOTE_DOWN`、`VOTE_UP`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/CreateOutboxMessage
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.outbox.v1.CreateOutboxMessageResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `outboxMessage` | message `OutboxMessage` |
| `status` | enum `OutboxStatus` |

**字段取值**：

- `status`：`OUTBOX_STATUS_UNSPECIFIED`、`OUTBOX_STATUS_ACTIVE`、`OUTBOX_STATUS_PAUSED`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 创建类接口需注意幂等/防重复提交。

### 252 · DeleteOutboxMessage — 删除发件箱消息

**服务**：`kimi.outbox.v1.OutboxService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/DeleteOutboxMessage`

- **API用途**：发件箱模块接口：删除发件箱消息（proto 方法 OutboxService.DeleteOutboxMessage）。
- **这接口能干啥（大白话）**：发件箱：删除发件箱消息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.outbox.v1.DeleteOutboxMessageRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/DeleteOutboxMessage
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式**

无独立 Response 消息；通常返回空对象 `{}`（删除/无返回体类接口）。

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。
- 删除类操作不可逆，客户端应二次确认。

### 253 · ListOutboxMessages — 列出发件箱消息

**服务**：`kimi.outbox.v1.OutboxService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/ListOutboxMessages`

- **API用途**：发件箱模块接口：列出发件箱消息（proto 方法 OutboxService.ListOutboxMessages）。
- **这接口能干啥（大白话）**：发件箱：列出发件箱消息（列表分页）。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.outbox.v1.ListOutboxMessagesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/ListOutboxMessages
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.outbox.v1.ListOutboxMessagesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `status` | enum `OutboxStatus` |
| `messages` | repeated |

**字段取值**：

- `status`：`OUTBOX_STATUS_UNSPECIFIED`、`OUTBOX_STATUS_ACTIVE`、`OUTBOX_STATUS_PAUSED`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 254 · ReorderOutboxMessages — 重排发件箱消息

**服务**：`kimi.outbox.v1.OutboxService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/ReorderOutboxMessages`

- **API用途**：发件箱模块接口：重排发件箱消息（proto 方法 OutboxService.ReorderOutboxMessages）。
- **这接口能干啥（大白话）**：发件箱：重新排序发件箱消息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.outbox.v1.ReorderOutboxMessagesRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |
| `ids` | repeated |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/ReorderOutboxMessages
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.outbox.v1.ReorderOutboxMessagesResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `messages` | repeated |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 255 · ResumeOutbox — 恢复发件箱

**服务**：`kimi.outbox.v1.OutboxService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/ResumeOutbox`

- **API用途**：发件箱模块接口：恢复发件箱（proto 方法 OutboxService.ResumeOutbox）。
- **这接口能干啥（大白话）**：发件箱：继续发件箱。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.outbox.v1.ResumeOutboxRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/ResumeOutbox
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.outbox.v1.ResumeOutboxResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `status` | enum `OutboxStatus` |
| `dispatched` | message `OutboxMessage` |

**字段取值**：

- `status`：`OUTBOX_STATUS_UNSPECIFIED`、`OUTBOX_STATUS_ACTIVE`、`OUTBOX_STATUS_PAUSED`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 256 · SendOutboxMessageNow — 发送发件箱消息

**服务**：`kimi.outbox.v1.OutboxService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/SendOutboxMessageNow`

- **API用途**：发件箱模块接口：发送发件箱消息（proto 方法 OutboxService.SendOutboxMessageNow）。
- **这接口能干啥（大白话）**：发件箱：发送发件箱消息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.outbox.v1.SendOutboxMessageNowRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/SendOutboxMessageNow
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.outbox.v1.SendOutboxMessageNowResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `interrupted` | bool |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 257 · StopOutbox — 停止发件箱

**服务**：`kimi.outbox.v1.OutboxService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/StopOutbox`

- **API用途**：发件箱模块接口：停止发件箱（proto 方法 OutboxService.StopOutbox）。
- **这接口能干啥（大白话）**：发件箱：停止发件箱。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.outbox.v1.StopOutboxRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `chatId` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/StopOutbox
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.outbox.v1.StopOutboxResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `status` | enum `OutboxStatus` |

**字段取值**：

- `status`：`OUTBOX_STATUS_UNSPECIFIED`、`OUTBOX_STATUS_ACTIVE`、`OUTBOX_STATUS_PAUSED`

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 258 · UpdateOutboxMessage — 更新发件箱消息

**服务**：`kimi.outbox.v1.OutboxService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/UpdateOutboxMessage`

- **API用途**：发件箱模块接口：更新发件箱消息（proto 方法 OutboxService.UpdateOutboxMessage）。
- **这接口能干啥（大白话）**：发件箱：修改发件箱消息。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.chat.v1.ChatMessage`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |
| `parentId` | string |
| `role` | enum `Lup/ib;` |
| `status` | enum `MessageStatus` |
| `refs` | message `Refs` |
| `scenario` | enum `Scenario` |
| `kimiPlus` | message `KimiPlusBrief` |
| `vote` | enum `Vote` |
| `error` | message `Error` |
| `createTime` | string |
| `isGoal` | bool |
| `childrenMessageIds` | repeated |
| `blocks` | repeated |
| `references` | repeated |
| `labels` | repeated |
| `labelsValue` | repeated |

**字段取值**：

- `role`：`ROLE_UNSPECIFIED`、`assistant`、`system`、`user`
- `status`：`MESSAGE_STATUS_UNSPECIFIED`、`MESSAGE_STATUS_CANCELLED`、`MESSAGE_STATUS_COMPLETED`、`MESSAGE_STATUS_ERROR`、`MESSAGE_STATUS_GENERATING`、`MESSAGE_STATUS_PENDING`、`MESSAGE_STATUS_TRUNCATED`
- `scenario`：`SCENARIO_UNSPECIFIED`、`SCENARIO_AUTOMATION`、`SCENARIO_AUTOMATION_K3`、`SCENARIO_BOT`、`SCENARIO_CHAT`、`SCENARIO_DEEP_RESEARCH`、`SCENARIO_K2`、`SCENARIO_K2D5`、`SCENARIO_K3`、`SCENARIO_KIMI_PLUS`、`SCENARIO_KODER`、`SCENARIO_OK_COMPUTER`、`SCENARIO_OK_COMPUTER_SWARM`、`SCENARIO_PROBLEM_SOLVE`、`SCENARIO_SKILLCREATOR`、`SCENARIO_SLIDES`、`SCENARIO_THINK`
- `vote`：`VOTE_UNSPECIFIED`、`VOTE_DOWN`、`VOTE_UP`

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.outbox.v1.OutboxService/UpdateOutboxMessage
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.outbox.v1.UpdateOutboxMessageResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `outboxMessage` | message `OutboxMessage` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 用户设置 · `kimi.usersetting.v1.UserSettingService`（2 个方法）

### 259 · GetUserSetting — 获取设置

**服务**：`kimi.usersetting.v1.UserSettingService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.usersetting.v1.UserSettingService/GetUserSetting`

- **API用途**：用户设置模块接口：获取设置（proto 方法 UserSettingService.GetUserSetting）。
- **这接口能干啥（大白话）**：设置：查看设置。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.usersetting.v1.GetUserSettingRequest`

（空消息，无字段）

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.usersetting.v1.UserSettingService/GetUserSetting
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.usersetting.v1.GetUserSettingResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `userSetting` | message `UserSetting` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

### 260 · UpdateUserSetting — 更新设置

**服务**：`kimi.usersetting.v1.UserSettingService` · **协议**：Unary · **HTTP**：POST

**地址**：`https://www.kimi.com/apiv2/kimi.usersetting.v1.UserSettingService/UpdateUserSetting`

- **API用途**：用户设置模块接口：更新设置（proto 方法 UserSettingService.UpdateUserSetting）。
- **这接口能干啥（大白话）**：设置：修改设置。

**请求头**：全局通用 18 项（见「3. 全局通用请求头」）

**请求体** — `com.moonshot.kimi.proto.kimi.usersetting.v1.UpdateUserSettingRequest`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `userSetting` | message `UserSetting` |
| `updateMask` | string |

**调用示例**

```http
POST https://www.kimi.com/apiv2/kimi.usersetting.v1.UserSettingService/UpdateUserSetting
Content-Type: application/json
Authorization: Bearer <accessToken>
x-msh-platform: android
x-msh-version: 3.1.0
X-Language: zh-CN
X-Msh-Shield-Data: <risk>
Body(JSON): { ...<Request 字段>... }
--> 200 OK, body = JSON(<Response>)
```

**返回格式** — `com.moonshot.kimi.proto.kimi.usersetting.v1.UpdateUserSettingResponse`

| 字段名(JSON key) | 类型 |
| --- | --- |
| `userSetting` | message `UserSetting` |

**返回解析说明**

按 proto JSON 解析为 Response 对象；`code != 0` 时读取 `message` 与 `details`；`401/403` 触发 token 刷新或登录引导；`429` 触发退避重试。

**特殊备注**

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

- 所有请求必须携带设备头（`x-msh-*`）与风控头（`X-Msh-Shield-Data`），否则可能被风控拦截。

## 附录

### 附录 A：protobuf 消息定义汇总

共 909 个消息。字段来自序列化器 descriptor 元素与字段声明签名还原。

**com.moonshot.kimi.proto.account.gateway.v1**

- **BindPhoneRequest**：`thirdParty` message ｜ `phone` message ｜ `verifyCode` string ｜ `wechatPhoneCode` string
- **BindPhoneResponse**：`accessToken` string ｜ `refreshToken` string ｜ `newUser` bool ｜ `userId` string
- **ConfirmLoginQRCodeRequest**：`code` string
- **ConfirmLoginQRCodeResponse**：（空消息）
- **Country**：`name` string ｜ `countryCode` string ｜ `locale` string
- **ListCountriesRequest**：（空消息）
- **ListCountriesResponse**：`defaultCountry` message ｜ `countries` repeated
- **LoginWithOneClickRequest**：`token` string
- **LoginWithOneClickResponse**：`accessToken` string ｜ `refreshToken` string ｜ `newUser` bool ｜ `userId` string
- **LoginWithSMSRequest**：`phone` message ｜ `verifyCode` string
- **LoginWithSMSResponse**：`accessToken` string ｜ `refreshToken` string ｜ `newUser` bool ｜ `userId` string
- **LoginWithThirdPartyRequest**：`credential` message
- **LoginWithThirdPartyResponse**：`accessToken` string ｜ `refreshToken` string ｜ `newUser` bool ｜ `userId` string
- **LogoutRequest**：（空消息）
- **LogoutResponse**：（空消息）
- **RefreshTokenRequest**：`refreshToken` string
- **RefreshTokenResponse**：`accessToken` string ｜ `refreshToken` string
- **RegisterDeviceRequest**：`pushDevice` message
- **RegisterDeviceResponse**：（空消息）
- **ScanLoginQRCodeRequest**：`code` string
- **ScanLoginQRCodeResponse**：（空消息）
- **SendVerifyCodeRequest**：`scene` enum ｜ `phone` message ｜ `captcha` message
- **SendVerifyCodeResponse**：（空消息）
- **ThirdAccount**：`thirdParty` enum ｜ `unionId` string ｜ `nickname` string ｜ `avatar` string ｜ `email` string ｜ `bindTime` string
- **ThirdPartyCredential**：`thirdParty` enum ｜ `code` string
**com.moonshot.kimi.proto.account.gateway.v1.RegisterDeviceRequest**

- **PushDevice**：`id` string ｜ `provider` enum
**com.moonshot.kimi.proto.common.action.v1**

- **BoosterAction**：`needTopup` bool ｜ `needEnable` bool ｜ `source` string
- **PaywallAction**：`needUpgrade` bool ｜ `upgradeTo` enum ｜ `source` string
**com.moonshot.kimi.proto.common.error.v1**

- **ErrorDetail**：`reason` enum ｜ `localizedMessage` message ｜ `paywall` message
**com.moonshot.kimi.proto.google.rpc**

- **LocalizedMessage**：`locale` string ｜ `message` string
**com.moonshot.kimi.proto.growth.pay.v1**

- **WechatPassthroughParams**：`miniprogramUsername` string ｜ `miniprogramPath` string
**com.moonshot.kimi.proto.kimi.artifact.v1**

- **ArtifactShare**：`id` string ｜ `path` string ｜ `type` enum ｜ `title` string ｜ `content` string ｜ `isActive` bool ｜ `shareTime` string ｜ `version` string ｜ `artifactId` string
**com.moonshot.kimi.proto.kimi.chat.v1**

- **AIPPTBlock**：`status` string ｜ `designId` string ｜ `coverUrl` string ｜ `pptTaskId` string ｜ `title` string ｜ `pdfSizeByte` int32 ｜ `pptSizeByte` int32 ｜ `pptDownloadUrl` string ｜ `pdfDownloadUrl` string
- **AgentMessageBlock**：`agentId` string ｜ `agentIcon` string ｜ `agentName` string ｜ `content` string
- **ArtifactBlock**：`artifactId` string ｜ `type` enum ｜ `version` string ｜ `content` string ｜ `path` string ｜ `title` string
- **Block**：`id` string ｜ `parentId` string ｜ `messageId` string ｜ `text` message ｜ `search` message ｜ `file` message ｜ `think` message ｜ `exception` message ｜ `memory` message ｜ `contractReview` message ｜ `tool` message ｜ `artifact` message ｜ `slidesView` message ｜ `stage` message ｜ `multiStage` message ｜ `elemeMenuCard` message ｜ `elemeOrderCard` message ｜ `videoCards` message ｜ `visualEdit` message ｜ `websitesTemplate` message ｜ `slidesAnnotation` message ｜ `explorerResearch` message ｜ `explorerResearchReanswer` message ｜ `aippt` message ｜ `contentViewZhidemaiCard` message ｜ `resourceLink` message ｜ `imRoomSystem` message ｜ `agentMessage` message ｜ `error` message ｜ `createTime` string
- **Card**：`title` string ｜ `abstract` string
- **Chat**：`id` string ｜ `name` string ｜ `messageContent` string ｜ `kimiPlus` message ｜ `projectId` string ｜ `project` message ｜ `pinned` bool ｜ `lastRequest` message ｜ `createTime` string ｜ `updateTime` string ｜ `source` message ｜ `status` enum ｜ `statusText` string ｜ `goal` message ｜ `model` string ｜ `labels` repeated ｜ `labelsValue` repeated ｜ `files` repeated
- **ChatBrief**：`id` string ｜ `name` string ｜ `labels` repeated ｜ `labelsValue` repeated
- **ChatMessage**：`id` string ｜ `parentId` string ｜ `role` enum ｜ `status` enum ｜ `refs` message ｜ `scenario` enum ｜ `kimiPlus` message ｜ `vote` enum ｜ `error` message ｜ `createTime` string ｜ `isGoal` bool ｜ `childrenMessageIds` repeated ｜ `blocks` repeated ｜ `references` repeated ｜ `labels` repeated ｜ `labelsValue` repeated
- **ChatRequestOptions**：`lbs` message ｜ `voiceId` string ｜ `thinking` bool ｜ `systemPrompt` string ｜ `slides` message ｜ `kimiClaw` message ｜ `enablePlugin` bool ｜ `reasoningEffort` enum ｜ `contextLength` enum ｜ `model` string ｜ `arena` message
- **ChatShare**：`id` string ｜ `chat` message ｜ `creator` message ｜ `createTime` string ｜ `url` string ｜ `card` message ｜ `messages` repeated
- **ChatShareCreator**：`name` string ｜ `avatarUrl` string
- **ChatSource**：`type` enum ｜ `projectId` string ｜ `momentId` string ｜ `kimiplusId` string
- **CodeReference**：`path` string
- **ContentViewZhidemaiBlock**：`source` string ｜ `list` repeated
- **ContractReviewBlock**：`status` enum ｜ `id` string ｜ `url` string
- **DreamVaultPageRef**：`sandboxUri` string
- **EditOperation**：`instruction` string ｜ `visualSelection` message ｜ `codeReference` message
- **ElemeCardSKU**：`name` string ｜ `amount` double ｜ `picUrl` string ｜ `clickUrl` string
- **ElemeMenuCardBlock**：`query` string ｜ `title` string ｜ `description` string ｜ `minOrderAmount` double ｜ `deliveryTime` string ｜ `deliveryFee` double ｜ `clickUrl` string ｜ `sku` repeated
- **ElemeOrderCardBlock**：`extId` string ｜ `title` string ｜ `status` string ｜ `amount` double ｜ `paymentSuccessTime` string ｜ `clickUrl` string ｜ `sku` repeated
- **Error**：`reason` enum ｜ `localizedMessage` message ｜ `severity` enum
- **ExceptionBlock**：`error` message
- **ExplorerResearchBlock**：`status` enum ｜ `steps` repeated
- **ExplorerResearchReanswerBlock**：`usedTargetCount` int32 ｜ `usedUrlCount` int32 ｜ `readUrlCount` int32
- **ExtensionRef**：`plugin` message ｜ `skill` message
- **FileRef**：`file` message ｜ `externalId` string ｜ `sandboxUri` string ｜ `slidesId` string ｜ `skillId` string ｜ `etag` string ｜ `skillVersion` int32
- **Highlight**：`text` string ｜ `anchorUrl` string ｜ `origin` message
- **IMMentionedMemberRef**：`shortId` string ｜ `name` string
- **IMRoomSystemBlock**：`membersJoined` message ｜ `memberLeft` message
- **ImageItem**：`id` string ｜ `caption` string ｜ `state` enum ｜ `url` string ｜ `originUrl` string ｜ `thumbnailUrl` string ｜ `fullSizeUrl` string ｜ `displaySource` string ｜ `width` int32 ｜ `height` int32 ｜ `source` enum ｜ `fileId` string ｜ `sourceSiteUrl` string ｜ `refIndex` string
- **KimiClawRequestOptions**：`botId` string
- **KimiPlus**：`id` string ｜ `name` string ｜ `avatarUrl` string ｜ `introduction` string ｜ `greeting` string ｜ `filePrompt` string ｜ `category` string ｜ `specialId` string ｜ `recommended` bool ｜ `pinned` bool ｜ `creatorName` string ｜ `deprecated` bool ｜ `inputPlaceholder` string ｜ `sceneIconUrl` message ｜ `scenario` enum ｜ `filePreset` enum ｜ `skillSupport` bool ｜ `recommendedPrompts` repeated ｜ `agentModes` repeated
- **KimiPlusBrief**：`id` string ｜ `avatarUrl` string ｜ `name` string ｜ `specialId` string
- **LastRequestContext**：`options` message ｜ `scenario` enum ｜ `tools` repeated
- **MemoryBlock**：`currentMemoryCount` int32 ｜ `maxMemoryCount` int32 ｜ `created` repeated ｜ `updated` repeated ｜ `deleted` repeated
- **MultiStageBlock**：`stages` repeated
- **OutboxEvent**：`type` enum ｜ `status` enum ｜ `chatId` string
- **OutboxMessage**：`id` string ｜ `chatId` string ｜ `message` message ｜ `position` int32 ｜ `status` enum ｜ `createTime` string ｜ `updateTime` string
- **PluginExtension**：`id` string ｜ `displayName` string ｜ `iconUrl` string ｜ `colorLight` string ｜ `colorDark` string
- **ProductRef**：`id` string ｜ `products` repeated
- **Reference**：`matchedText` string ｜ `type` enum ｜ `items` repeated
- **Refs**：`searchChunks` repeated ｜ `urls` repeated ｜ `images` repeated ｜ `products` repeated ｜ `usedSearchChunks` repeated ｜ `sandboxFiles` repeated
- **ResourceLink**：`title` string ｜ `uri` string ｜ `downloadUrl` int32 ｜ `etag` string ｜ `sizeBytes` string
- **SandboxFileRef**：`uri` string ｜ `externalId` string ｜ `downloadUrl` string ｜ `etag` string ｜ `sizeBytes` string ｜ `slidesId` string ｜ `skillId` string ｜ `skillVersion` int32
- **SearchBlock**：`keywords` repeated ｜ `webPages` repeated
- **SearchChunkBrief**：`id` string ｜ `base` message ｜ `refIndex` string ｜ `chunk` string
- **SearchResultBase**：`title` string ｜ `url` string ｜ `siteName` string ｜ `iconUrl` string ｜ `coverUrl` string ｜ `snippet` string ｜ `publishTime` string ｜ `siteQuality` message ｜ `fileType` message ｜ `fileId` string ｜ `keyword` string ｜ `downloadUrl` string ｜ `highlight` string ｜ `textFragment` string
- **SearchSiteQuality**：`isTrustedSite` string ｜ `description` bool
- **SkillExtension**：`id` string ｜ `name` string ｜ `displayName` string
- **SlideAnnotation**：`annotationId` string ｜ `annotation` string ｜ `pageId` string ｜ `pageIndex` int32 ｜ `elementId` string ｜ `cx` int32 ｜ `cy` int32
- **SlidesAnnotationBlock**：`currentPage` string ｜ `annotations` repeated
- **SlidesRequestOptions**：`type` enum ｜ `templateId` string ｜ `templateType` enum ｜ `bananaStyleId` string ｜ `htmlStyleId` string ｜ `pptdStyleId` string ｜ `customStyleId` string ｜ `pageLimit` enum ｜ `designOptions` message ｜ `colorScheme` message
- **SlidesViewBlock**：`payloadUrl` string ｜ `coverUrl` string ｜ `name` string ｜ `slidesId` string ｜ `templateId` string ｜ `createTime` string ｜ `updateTime` string ｜ `status` enum ｜ `type` enum
- **StageBlock**：`name` enum ｜ `createTime` string ｜ `durationSeconds` string ｜ `description` string ｜ `index` int32 ｜ `status` enum
- **TextBlock**：`content` string ｜ `tips` string
- **ThemedIcon**：`light` string ｜ `dark` string ｜ `tintable` string
- **ThinkBlock**：`content` string ｜ `summary` string
- **Tool**：`type` enum ｜ `search` message ｜ `genImage` message ｜ `name` string
- **ToolBlock**：`toolCallId` string ｜ `name` string ｜ `args` string ｜ `isError` bool ｜ `errorCode` enum ｜ `mcp` message ｜ `status` enum ｜ `task` message ｜ `createSubagent` message ｜ `slidesGenerator` message ｜ `appVersion` message ｜ `cronJob` message ｜ `subagent` message ｜ `paywall` message ｜ `loadType` enum ｜ `contentCount` int32 ｜ `plugin` message ｜ `contents` repeated
- **ToolBlockContent**：`text` string ｜ `resourceLink` message ｜ `image` message ｜ `searchResult` message ｜ `slides` message ｜ `memory` message ｜ `goods` message ｜ `mutableText` message ｜ `webOpenUrl` message
- **ToolContentGoods**：`goods` message ｜ `discountId` string
- **ToolContentMemory**：`action` enum ｜ `memory` message ｜ `error` message ｜ `totalCount` int32 ｜ `memoryLimit` int32
- **ToolContentMutableText**：`artifactId` string ｜ `content` string
- **ToolContentSlides**：`slidesId` string ｜ `outlineArtifactId` string
- **ToolContentWebOpenURL**：`url` string ｜ `title` string ｜ `icon` string ｜ `status` string
- **ToolMetaAppVersion**：`versionId` string ｜ `version` string ｜ `name` string ｜ `description` string ｜ `thumbnailUrl` string ｜ `bigVersion` int32
- **ToolMetaCreateSubagent**：`name` string ｜ `workers` repeated
- **ToolMetaCronJob**：`cronJobId` string
- **ToolMetaSlidesGenerator**：`slidesId` string
- **ToolMetaSubagent**：`agentId` string ｜ `agentIndex` string ｜ `agentIcon` int32 ｜ `agentName` string ｜ `agentType` string
- **ToolMetaTask**：`msgId` string ｜ `name` string ｜ `todoList` string ｜ `worker` message ｜ `startTime` string ｜ `durationSeconds` string
- **ToolSubagentWorker**：`name` string ｜ `iconUrl` string ｜ `motto` string
- **URLRef**：`id` string ｜ `url` string ｜ `status` enum ｜ `wordCount` int32 ｜ `title` string ｜ `iconUrl` string
- **VideoCard**：`source` string ｜ `iconUrl` string ｜ `title` string ｜ `author` message ｜ `iframeUrl` string ｜ `coverUrl` string ｜ `coverThumbnailUrl` string
- **VideoCardsBlock**：`cards` repeated
- **VisualEditBlock**：`operations` repeated
- **VisualSelection**：`screenshot` message
- **WebsitesTemplateBlock**：`id` string ｜ `title` string ｜ `templateName` string ｜ `coverUrl` string ｜ `templateType` enum
**com.moonshot.kimi.proto.kimi.chat.v1.ChatRequestOptions**

- **LBS**：`longitude` double ｜ `latitude` double ｜ `coordSystem` string ｜ `address` string
**com.moonshot.kimi.proto.kimi.chat.v1.ContentViewZhidemaiBlock**

- **Card**：`title` string ｜ `price` double ｜ `mallName` string ｜ `url` string ｜ `pic` string
**com.moonshot.kimi.proto.kimi.chat.v1.ExplorerResearchBlock**

- **Step**：`title` string ｜ `status` enum ｜ `keywords` repeated ｜ `webPages` repeated
**com.moonshot.kimi.proto.kimi.chat.v1.Highlight**

- **Origin**：`startOffset` int32 ｜ `endOffset` int32 ｜ `text` string
**com.moonshot.kimi.proto.kimi.chat.v1.IMRoomSystemBlock**

- **Member**：`id` string ｜ `name` string ｜ `avatarUrl` string
- **MemberLeft**：`members` repeated
- **MembersJoined**：`members` repeated
**com.moonshot.kimi.proto.kimi.chat.v1.KimiPlus**

- **AgentMode**：`displayName` string ｜ `description` string ｜ `type` enum ｜ `minMembershipLevel` enum ｜ `greeting` string
**com.moonshot.kimi.proto.kimi.chat.v1.ProductRef**

- **Product**：`id` string ｜ `siteName` string ｜ `title` string ｜ `price` float ｜ `sales` int32 ｜ `siteUrl` string ｜ `imageUrls` repeated
**com.moonshot.kimi.proto.kimi.chat.v1.Reference**

- **RefItem**：`search` message ｜ `file` message ｜ `image` message ｜ `imMember` message ｜ `extension` message ｜ `vaultPage` message
**com.moonshot.kimi.proto.kimi.chat.v1.Tool**

- **GenImage**：`force` bool ｜ `ratio` message
- **Search**：`force` bool
**com.moonshot.kimi.proto.kimi.chat.v1.ToolBlock**

- **SourceMCP**：`id` string ｜ `name` string ｜ `iconUrl` string
**com.moonshot.kimi.proto.kimi.chat.v1.VideoCard**

- **AuthorInfo**：`name` string ｜ `avatar` string
**com.moonshot.kimi.proto.kimi.chatty.v1**

- **AgentRecipeOverrides**：`modelConfig` message ｜ `promptConfig` message ｜ `toolPreset` string
- **ArenaModelConfig**：`model` string ｜ `temperature` float
- **ArenaPromptConfig**：`spKeyZh` string ｜ `spKeyEn` string
- **ChatArenaConfig**：`overrides` message
- **GenericToolReply**：`result` string
- **GenericToolRequest**：`name` string ｜ `args` string
- **Interaction**：`id` string ｜ `type` enum ｜ `expireTime` string ｜ `genericTool` message ｜ `interrupt` message
- **InteractionReply**：`id` string ｜ `type` enum ｜ `lbs` message ｜ `genericTool` message ｜ `slidesOutline` message ｜ `interrupt` message ｜ `error` message ｜ `internalData` message
- **InternalData**：`data` map
- **InterruptReply**：`action` enum
- **InterruptRequest**：`toolCallId` string
- **LBSReply**：`latitude` double ｜ `longitude` double
- **SlidesOutlineReply**：`action` enum
- **ToolError**：`code` enum ｜ `msg` string
- **ToolResultResourceLink**：`url` string ｜ `title` string ｜ `mimeType` string ｜ `originalUrl` string ｜ `fileId` string ｜ `uri` string
**com.moonshot.kimi.proto.kimi.common.v1**

- **Captcha**：`captchaId` string ｜ `validate` string
- **PhoneNumber**：`countryCode` string ｜ `number` string
**com.moonshot.kimi.proto.kimi.config.v1**

- **AccountConfig**：`disableChangePhone` bool ｜ `disableChangeAvatar` bool
- **AppStoreConfig**：`packageName` string ｜ `minVersionCode` int32
- **CacheLimitsConfig**：`maxImageSizeMb` float ｜ `maxDownloadSizeMb` float
- **ClawGroupChatConfig**：`kimiclawInstallCmd` string ｜ `inviteCardImages` repeated
- **Config**：`system` message ｜ `model` message ｜ `taskbar` message ｜ `upgrade` message ｜ `feedback` message
- **DefaultScenarioConfig**：`tip` string ｜ `scenario` enum ｜ `thinking` bool ｜ `model` string
- **Feedback**：`type` enum ｜ `description` string ｜ `positiveOptions` repeated ｜ `negativeOptions` repeated
- **FeedbackConfig**：`items` repeated
- **ImageGenPreferences**：`prompt` string ｜ `ratios` repeated
- **KimiplusPlazaConfig**：`enabled` bool ｜ `offlineTitle` string ｜ `offlineMessage` string
- **LikesPopup**：`enabled` bool ｜ `maxTriggerTimes` int32
- **MembershipConfig**：`featureConfig` message ｜ `balanceConfig` message
- **Model**：`scenario` enum ｜ `displayName` string ｜ `description` string ｜ `thinking` bool ｜ `legacy` bool ｜ `kimiPlusId` string ｜ `agentMode` enum ｜ `filePreset` enum ｜ `inputPlaceholder` string ｜ `key` string ｜ `defaultReasoningEffort` enum ｜ `modelId` string ｜ `defaultContextLength` enum ｜ `id` string ｜ `minMembershipLevel` enum ｜ `greeting` string ｜ `label` repeated ｜ `switchableTo` repeated ｜ `reasoningEffortOptions` repeated ｜ `contextLengthOptions` repeated
- **ModelConfig**：`default` message ｜ `items` repeated
- **OKCConfig**：`ultraModeConfig` message
- **PopupInteractionConfig**：`continuousActive` message ｜ `likesReminder` message
- **ProjectConfig**：`enabled` bool ｜ `iconUrls` repeated ｜ `cases` repeated
- **RemoteControlConfig**：`enabled` bool
- **SlidesConfig**：`bananaStyles` repeated ｜ `pageLimits` repeated ｜ `styleCategoryOrders` repeated
- **SystemConfig**：`greeting` int32 ｜ `popupConfig` int32 ｜ `cacheLimits` message ｜ `enablePhotoRotationCheck` message ｜ `allowAnonymous` message ｜ `enablePhotoSolve` bool ｜ `activityPromoEnded` bool ｜ `blackFridayEnded` bool ｜ `blackFridayUrl` bool ｜ `blackFridayIcon` bool ｜ `blackFridayIconEnabled` string ｜ `blackFridayShareTurn` string ｜ `blackFridayWebCharmUrl` bool ｜ `bananaPptState` int32 ｜ `wpsAppId` string ｜ `kimiplusPlaza` int32 ｜ `slidesConfig` string ｜ `okcConfig` message ｜ `domains` message ｜ `androidClawDownloadLink` message ｜ `membershipConfig` message ｜ `clawGroupChatConfig` string ｜ `workDiscountConfig` message ｜ `projectConfig` message ｜ `widgetDomain` message ｜ `accountConfig` message ｜ `webDomainMigrationDialog` string ｜ `subscribeDomain` message ｜ `appDownloadQrUrl` message ｜ `remoteControlConfig` string ｜ `blockedUrls` string ｜ `trustedImageDomains` message ｜ `jsBridgeDomains` repeated ｜ `webviewRedirectAllowSchemes` repeated
- **Taskbar**：`type` enum ｜ `displayName` string ｜ `iconUrl` string ｜ `redirectUrl` string ｜ `imageGenPreferences` message ｜ `translatePreferences` message ｜ `writingPreferences` message ｜ `scenario` enum ｜ `position` int32 ｜ `kimiplusId` string ｜ `minMembershipLevel` enum ｜ `appearance` message ｜ `model` string
- **TaskbarAppearance**：`light` message ｜ `dark` message
- **TaskbarAppearanceVariant**：`iconUrl` string ｜ `textColor` string ｜ `backgroundColor` string
- **TaskbarConfig**：`items` repeated
- **TranslateOption**：`autoLanguagePrompt` string ｜ `prompt` string ｜ `name` string ｜ `style` enum ｜ `targetLanguages` repeated ｜ `sourceLanguages` repeated ｜ `replaces` repeated
- **TranslatePreferences**：`options` repeated
- **TranslateReplace**：`sourceLanguage` string ｜ `targetLanguage` string ｜ `prompt` string
- **UpgradeConfig**：`version` string ｜ `displayVersion` string ｜ `downloadUrl` string ｜ `packageSizeMb` float ｜ `upgradeStrategy` enum ｜ `upgradeDialog` message ｜ `showDialogIntervalMs` string ｜ `inCanary` bool ｜ `appStores` repeated
- **UpgradeRemind**：`title` string ｜ `content` string ｜ `primaryAction` string ｜ `secondaryAction` string
- **WebDomainMigrationDialog**：`show` bool ｜ `title` string ｜ `content` string ｜ `btnLabel` string
- **WorkDiscountConfig**：`startTime` string ｜ `endTime` string
- **WritingPreferences**：`defaultTypePrompt` string ｜ `types` repeated
**com.moonshot.kimi.proto.kimi.config.v1.MembershipConfig**

- **BalanceConfig**：`creditRatioThreshold` float
- **FeatureConfig**：`itemConfigs` repeated
**com.moonshot.kimi.proto.kimi.config.v1.MembershipConfig.FeatureConfig**

- **ItemConfig**：`feature` enum ｜ `displayName` string
**com.moonshot.kimi.proto.kimi.config.v1.Model**

- **ContextLengthOption**：`contextLength` enum ｜ `displayName` string ｜ `description` string ｜ `label` string ｜ `available` bool ｜ `minMembershipLevel` enum
- **ReasoningEffortOption**：`effort` enum ｜ `displayName` string ｜ `description` string ｜ `reasoningEffort` string
**com.moonshot.kimi.proto.kimi.config.v1.OKCConfig**

- **UltraModeConfig**：`multiplier` int32 ｜ `workerActions` repeated ｜ `workersForLoading` repeated ｜ `workerIdleActions` repeated
**com.moonshot.kimi.proto.kimi.config.v1.OKCConfig.UltraModeConfig**

- **WorkerConfig**：`name` string ｜ `avatarUrl` string ｜ `role` string
**com.moonshot.kimi.proto.kimi.config.v1.PopupInteractionConfig**

- **ContinuousActivePopup**：`enabled` bool ｜ `requiredActiveDays` int32 ｜ `maxTriggerTimes` int32
**com.moonshot.kimi.proto.kimi.config.v1.ProjectConfig**

- **CaseConfig**：`name` string ｜ `iconUrl` string
**com.moonshot.kimi.proto.kimi.config.v1.SlidesConfig**

- **BananaStyle**：`id` string ｜ `name` string ｜ `thumbnailUrl` string
- **PageLimitOption**：`value` string ｜ `label` string
- **StyleCategoryOrder**：`type` enum ｜ `categories` repeated
**com.moonshot.kimi.proto.kimi.config.v1.SystemConfig**

- **Domains**：`api` string ｜ `cdnDomains` repeated
- **Greeting**：`content` string
**com.moonshot.kimi.proto.kimi.config.v1.WritingPreferences**

- **Option**：`name` string ｜ `optionType` enum ｜ `prompt` string ｜ `items` repeated
- **Replace**：`genre` string ｜ `prompt` string
- **Type**：`name` string ｜ `prompt` string ｜ `promptDefault` string ｜ `replaces` repeated ｜ `options` repeated
**com.moonshot.kimi.proto.kimi.file.v1**

- **Thumbnail**：`thumbnailUrl` string ｜ `previewUrl` string ｜ `mobileThumbnailUrl` string
- **URL**：`title` string ｜ `date` string ｜ `textUrl` string ｜ `wordCount` string ｜ `icon` string
**com.moonshot.kimi.proto.kimi.gateway.account.v1**

- **BindGuardianRequest**：`phone` message ｜ `passcode` string ｜ `passcodeConfirm` string
- **BindGuardianResponse**：`minorMode` message
- **BindPhoneRequest**：`phone` message ｜ `verifyCode` string
- **BindPhoneResponse**：（空消息）
- **BindThirdAccountRequest**：`credential` message
- **BindThirdAccountResponse**：（空消息）
- **DeactivateAccountRequest**：（空消息）
- **DeactivateAccountResponse**：（空消息）
- **GetCurrentUserRequest**：（空消息）
- **GetCurrentUserResponse**：`user` message ｜ `workspace` message
- **GetMinorModeRequest**：（空消息）
- **GetMinorModeResponse**：`minorMode` message
- **ListThirdAccountsRequest**：（空消息）
- **ListThirdAccountsResponse**：`thirdAccounts` repeated
- **ListWorkspacesRequest**：（空消息）
- **ListWorkspacesResponse**：`workspaces` repeated
- **MinorMode**：`userId` string ｜ `enabled` bool ｜ `guardianBound` bool ｜ `guardianPhoneMasked` message ｜ `passcodeLocked` bool ｜ `lockExpireTime` string ｜ `passcodeSet` bool
- **RebindPhoneRequest**：`phone` message ｜ `verifyCode` string
- **RebindPhoneResponse**：（空消息）
- **ResetPasscodeRequest**：`passcode` string ｜ `passcodeConfirm` string
- **ResetPasscodeResponse**：（空消息）
- **SendVerifyCodeRequest**：`scene` enum ｜ `phone` message ｜ `captcha` message
- **SendVerifyCodeResponse**：（空消息）
- **SwitchWorkspaceRequest**：`businessId` string
- **SwitchWorkspaceResponse**：`accessToken` string ｜ `refreshToken` string
- **UnbindGuardianRequest**：`verifyCode` string
- **UnbindGuardianResponse**：`minorMode` message
- **UnbindThirdAccountRequest**：`thirdParty` enum
- **UnbindThirdAccountResponse**：（空消息）
- **UpdateMinorModeRequest**：`enabled` bool ｜ `passcode` string
- **UpdateMinorModeResponse**：`minorMode` message
- **UpdateProfileRequest**：`nickname` string ｜ `bio` string
- **UpdateProfileResponse**：（空消息）
- **User**：`id` string ｜ `nickname` string ｜ `avatar` string ｜ `bio` string ｜ `phone` message ｜ `region` enum ｜ `globalId` string
- **VerifyCurrentPhoneRequest**：`verifyCode` string
- **VerifyCurrentPhoneResponse**：（空消息）
- **VerifyGuardianPhoneRequest**：`phone` message ｜ `verifyCode` string
- **VerifyGuardianPhoneResponse**：（空消息）
- **VerifyGuardianResetRequest**：`verifyCode` string
- **VerifyGuardianResetResponse**：（空消息）
- **Workspace**：`business` message ｜ `current` bool ｜ `user` message ｜ `roles` repeated ｜ `rolesValue` repeated
**com.moonshot.kimi.proto.kimi.gateway.account.v1.Workspace**

- **User**：`nickname` string
**com.moonshot.kimi.proto.kimi.gateway.app.v1**

- **AppVersion**：`id` string ｜ `version` string ｜ `description` string ｜ `thumbnailUrl` string ｜ `createTime` string ｜ `bigVersion` int32
- **ListVersionsRequest**：`chatId` string
- **ListVersionsResponse**：`publishedVersionId` string ｜ `publishedUrl` string ｜ `publishState` enum ｜ `publishingVersionId` string ｜ `versions` repeated
- **PreviewAppRequest**：`chatId` string ｜ `forceRestart` bool
- **PreviewAppResponse**：`previewUrl` string ｜ `expireTime` string
- **PublishAppRequest**：`chatId` string ｜ `versionId` string ｜ `customSlug` string
- **PublishAppResponse**：`deployUrl` string
- **UnpublishAppRequest**：`chatId` string
- **UnpublishAppResponse**：（空消息）
**com.moonshot.kimi.proto.kimi.gateway.appsupport.v1**

- **ScanQRCodeRequest**：`qrCode` string
- **ScanQRCodeResponse**：`urlScheme` string
**com.moonshot.kimi.proto.kimi.gateway.artifact.v1**

- **ShareArtifactRequest**：`artifactId` string ｜ `version` string
- **ShareArtifactResponse**：`artifactShare` message
**com.moonshot.kimi.proto.kimi.gateway.business.v1**

- **Business**：`id` string ｜ `name` string ｜ `description` string ｜ `status` enum ｜ `memberCount` string ｜ `freeCount` string ｜ `frozenCount` string ｜ `expireTime` string
**com.moonshot.kimi.proto.kimi.gateway.chat.common.v1**

- **AgentPhaseEvent**：`chatId` string ｜ `messageId` string ｜ `phase` enum ｜ `agentId` string ｜ `toolName` string ｜ `statusText` string ｜ `progressPercent` int32 ｜ `time` string
**com.moonshot.kimi.proto.kimi.gateway.chat.v1**

- **AskUserAnswer**：`question` string ｜ `customText` string ｜ `selectedOptions` repeated
- **BatchDeleteChatsRequest**：`chatIds` repeated
- **BatchDeleteChatsResponse**：`chatIds` repeated
- **CancelChatRequest**：`chatId` string ｜ `messageId` string
- **CancelChatResponse**：（空消息）
- **Card**：`title` string ｜ `abstract` string
- **ChatFromCaseRequest**：`caseId` string
- **ChatRequest**：`chatId` string ｜ `kimiplusId` string ｜ `scenario` enum ｜ `message` message ｜ `options` message ｜ `projectId` string ｜ `tools` repeated
- **ChatRequestOptions**：`lbs` message ｜ `voiceId` string ｜ `thinking` bool ｜ `systemPrompt` string ｜ `slides` message ｜ `kimiClaw` message ｜ `enablePlugin` bool ｜ `reasoningEffort` enum ｜ `contextLength` enum ｜ `model` string ｜ `arena` message
- **ChatResponse**：`op` enum ｜ `mask` string ｜ `eventOffset` int32 ｜ `chat` message ｜ `message` message ｜ `block` message ｜ `ref` message ｜ `usage` message ｜ `notification` message ｜ `done` Done ｜ `heartbeat` Heartbeat ｜ `tts` message ｜ `interaction` message ｜ `interactionAck` message
- **ChatShare**：`id` string ｜ `chat` message ｜ `creator` message ｜ `createTime` string ｜ `url` string ｜ `card` message ｜ `messages` repeated
- **ChatShareCreator**：`name` string ｜ `avatarUrl` string
- **ContinueChatRequest**：`chatId` string ｜ `messageId` string
- **CreateChatFromShareRequest**：`shareId` string
- **CreateChatFromShareResponse**：`chat` message
- **CreateChatShareRequest**：`chatId` string ｜ `messageIds` repeated
- **CreateChatShareResponse**：`share` message
- **Done**：（空消息）
- **EnhancedPrompt**：`id` string ｜ `userPrompt` string
- **GetChatRequest**：`chatId` string ｜ `userId` string
- **GetChatResponse**：`chat` message
- **GetChatShareDocxRequest**：`shareId` string
- **GetChatShareDocxResponse**：`docxUrl` string
- **GetChatShareMessageRequest**：`shareId` string ｜ `messageId` string
- **GetChatShareMessageResponse**：`message` message
- **GetChatShareRequest**：`shareId` string ｜ `messageOrder` enum
- **GetChatShareResponse**：`share` message
- **GetChatShareScreenshotRequest**：`shareId` string ｜ `theme` string
- **GetChatShareScreenshotResponse**：`screenshotUrl` string
- **GetEnhancedPromptsRequest**：`fileIds` repeated
- **GetEnhancedPromptsResponse**：`placeholderPrompt` message ｜ `enhancedPrompts` repeated
- **GetMessageRecommendPromptsRequest**：`chatId` string ｜ `messageId` string
- **GetMessageRecommendPromptsResponse**：`prompts` repeated
- **GetMessageRequest**：`chatId` string ｜ `messageId` string
- **GetMessageResponse**：`message` message
- **GetSearchCitationResponse**：`page` message ｜ `highlight` message
- **GetToolBlockRequest**：`chatId` string ｜ `toolCallId` string
- **GetToolBlockResponse**：`toolBlock` message
- **GetUnreadChatsRequest**：（空消息）
- **GetUnreadChatsResponse**：`unreadCount` int32 ｜ `chatIds` repeated
- **Heartbeat**：（空消息）
- **InteractionAck**：`interactionId` string
- **KimiClawRequestOptions**：`botId` string
- **ListChatsRequest**：`projectId` string ｜ `query` string ｜ `kimiPlusId` string ｜ `withMessageContent` bool ｜ `includePinned` bool ｜ `pageSize` int32 ｜ `pageToken` string
- **ListChatsResponse**：`nextPageToken` string ｜ `chats` repeated ｜ `pinnedChats` repeated
- **ListKimiPlusRequest**：（空消息）
- **ListKimiPlusResponse**：`kimiplus` repeated
- **ListMessagesRequest**：`chatId` string ｜ `pageSize` int32 ｜ `pageToken` string ｜ `direction` message ｜ `startMessageId` string
- **ListMessagesResponse**：`nextPageToken` string ｜ `messages` repeated
- **ListPinnedKimiPlusRequest**：（空消息）
- **ListPinnedKimiPlusResponse**：`kimiplus` repeated
- **MarkChatAsReadRequest**：`chatId` string
- **MarkChatAsReadResponse**：（空消息）
- **MessageSpeechRequest**：`chatId` string ｜ `messageId` string ｜ `voiceId` string
- **MessageSpeechResponse**：`sequenceId` int32 ｜ `synthesisStatus` enum ｜ `audioUrl` string ｜ `rawText` message
- **Notification**：`type` enum ｜ `message` string ｜ `paywall` message
- **ProcessAskUserResultRequest**：`artifactId` string ｜ `chatId` string ｜ `answers` repeated
- **ProcessAskUserResultResponse**：（空消息）
- **RecommendPrompt**：`content` string
- **Ref**：`id` string ｜ `messageId` string ｜ `search` message ｜ `image` message ｜ `url` message ｜ `product` message ｜ `sandboxFile` message
- **RegenerateMessageRequest**：`chatId` string ｜ `messageId` string ｜ `kimiplusId` string ｜ `message` message ｜ `scenario` enum ｜ `options` message ｜ `tools` repeated
- **ReplayChatShareStreamRequest**：`shareId` string ｜ `msgId` string ｜ `eventOffset` int32
- **ReplyInteractionRequest**：`chatId` string ｜ `messageId` string ｜ `interaction` message
- **ReplyInteractionResponse**：（空消息）
- **ResumeChatRequest**：`chatId` string ｜ `messageId` string ｜ `eventOffset` int32
- **ShareChatToCommunityRequest**：`chatId` string ｜ `messageIds` repeated
- **ShareChatToCommunityResponse**：`share` message
- **SlidesRequestOptions**：`type` enum ｜ `templateId` string ｜ `templateType` enum ｜ `bananaStyleId` string ｜ `htmlStyleId` string ｜ `pptdStyleId` string ｜ `customStyleId` string ｜ `pageLimit` enum ｜ `designOptions` message ｜ `colorScheme` message
- **SubscribeMessageStreamRequest**：`chatId` string ｜ `messageId` string ｜ `eventOffset` int32
- **Tool**：`type` enum ｜ `search` message ｜ `genImage` message ｜ `name` string
- **UpdateChatRequest**：`chat` message
- **UpdateChatResponse**：`chat` message
- **Usage**：`research` message
- **VoteMessageRequest**：`chatId` string ｜ `messageId` string ｜ `voteType` enum
- **VoteMessageResponse**：（空消息）
**com.moonshot.kimi.proto.kimi.gateway.chat.v1.ChatRequestOptions**

- **LBS**：`longitude` double ｜ `latitude` double ｜ `coordSystem` string ｜ `address` string
**com.moonshot.kimi.proto.kimi.gateway.chat.v1.MessageSpeechResponse**

- **RawText**：`text` string ｜ `startOffset` int32 ｜ `endOffset` int32 ｜ `blockId` int32
**com.moonshot.kimi.proto.kimi.gateway.chat.v1.Tool**

- **GenImage**：`force` bool ｜ `ratio` message
- **Search**：`force` bool
**com.moonshot.kimi.proto.kimi.gateway.chat.v1.Usage**

- **Research**：`id` string ｜ `name` string ｜ `type` string ｜ `status` string ｜ `limit` int32 ｜ `used` int32 ｜ `remain` int32
**com.moonshot.kimi.proto.kimi.gateway.claw.v1**

- **Bot**：`id` string ｜ `name` string ｜ `description` string ｜ `status` enum ｜ `userId` string ｜ `apiKey` string ｜ `type` enum ｜ `isAlive` bool ｜ `needUpgrade` bool ｜ `defaultChatId` string ｜ `profile` message ｜ `membershipExpiredAt` string ｜ `ongoingOperation` message ｜ `version` message ｜ `avatar` string ｜ `createdAt` string ｜ `updatedAt` string ｜ `availableOperations` repeated ｜ `skills` repeated ｜ `features` repeated ｜ `featuresValue` repeated
- **BotOperationCommand**：`name` string
- **BotOperationStatus**：`action` enum ｜ `status` enum ｜ `message` string
- **ClawSkill**：`skill` message ｜ `syncStatus` enum ｜ `remoteName` string
- **CreateBotRequest**：`name` string ｜ `description` string ｜ `type` enum ｜ `personality` enum ｜ `backupId` string ｜ `scenarios` repeated ｜ `scenariosValue` repeated
- **CreateBotResponse**：`bot` message
- **CreateModelAPIKeyRequest**：`type` enum ｜ `name` string ｜ `description` string ｜ `expireTime` string
- **CreateModelAPIKeyResponse**：`modelApiKey` message
- **DeleteBotRequest**：`id` string
- **DeleteBotResponse**：`id` string
- **DeleteRemoteSkillRequest**：`botId` string ｜ `remoteName` string
- **DeleteRemoteSkillResponse**：（空消息）
- **FileInfo**：`name` string ｜ `path` string ｜ `size` string ｜ `lastModifyTime` string ｜ `isDir` string ｜ `url` bool
- **InstallSkillToRemoteRequest**：`botId` string ｜ `skillId` string ｜ `overrideName` string
- **InstallSkillToRemoteResponse**：`remoteName` string ｜ `skill` message
- **ListBotsRequest**：（空消息）
- **ListBotsResponse**：`bots` repeated
- **ListClawSkillsRequest**：`botId` string ｜ `query` string
- **ListClawSkillsResponse**：`skills` repeated
- **ListFilesRequest**：`botId` string ｜ `path` string ｜ `showHidden` bool
- **ListFilesResponse**：`info` message ｜ `files` repeated
- **ListRemoteSkillsRequest**：`botId` string
- **ListRemoteSkillsResponse**：`skills` repeated ｜ `skillJobs` repeated
- **ModelAPIKey**：`apiKey` string ｜ `type` enum ｜ `name` string ｜ `description` string ｜ `expireTime` string ｜ `createTime` string
- **Profile**：`greeting` string ｜ `personality` enum ｜ `recommendPrompts` repeated ｜ `slashCommands` repeated ｜ `scenarios` repeated ｜ `scenariosValue` repeated
- **RemoteSkill**：`name` string ｜ `description` string ｜ `path` string
- **SlashCommand**：`command` string ｜ `description` string ｜ `sendContent` string
- **VersionInfo**：`openclawVersion` string ｜ `needUpgrade` string ｜ `latestVersion` bool ｜ `kimiclawVersion` int32
**com.moonshot.kimi.proto.kimi.gateway.config.v1**

- **GetAvailableModelsRequest**：`scene` enum
- **GetAvailableModelsResponse**：`defaultScenario` message ｜ `availableModels` repeated
- **GetConfigRequest**：`syncToken` string ｜ `source` enum ｜ `scriptContext` message
- **GetConfigResponse**：`config` message ｜ `syncToken` string
- **GetPrecheckConfigRequest**：`scene` enum
- **GetPrecheckConfigResponse**：`captcha` message
- **ScriptConfigContext**：`region` enum
**com.moonshot.kimi.proto.kimi.gateway.config.v1.GetPrecheckConfigResponse**

- **CaptchaConfig**：`enabled` bool
**com.moonshot.kimi.proto.kimi.gateway.context.v1**

- **GetGoalRequest**：`chatId` string
- **GetGoalResponse**：`goal` message
- **Goal**：`chatId` string ｜ `objective` string ｜ `status` enum ｜ `createTime` string ｜ `updateTime` string ｜ `turnStartTime` string ｜ `durationMs` string
- **UpdateGoalRequest**：`chatId` string ｜ `objective` string ｜ `status` enum
- **UpdateGoalResponse**：`goal` message
**com.moonshot.kimi.proto.kimi.gateway.converter.v1**

- **DocumentSource**：`type` enum ｜ `artifact` message ｜ `sandbox` message
- **ExportDocumentJob**：`id` string ｜ `source` message ｜ `exportType` enum ｜ `status` enum ｜ `details` message ｜ `outputFilePresignedUrl` string
- **ExportDocumentRequest**：`source` message ｜ `exportType` enum ｜ `filename` string
- **ExportDocumentResponse**：`jobId` string
- **GetExportDocumentJobRequest**：`id` string
- **GetExportDocumentJobResponse**：`job` message
**com.moonshot.kimi.proto.kimi.gateway.converter.v1.DocumentSource**

- **ChatArtifact**：`artifactId` string ｜ `version` string
- **OKCSandbox**：`chatId` string ｜ `chatShareId` string ｜ `sandboxUri` string
**com.moonshot.kimi.proto.kimi.gateway.device.v1**

- **CountDevicesRequest**：（空消息）
- **CountDevicesResponse**：`count` int32
- **DeleteDeviceRequest**：`id` string
- **DeleteDeviceResponse**：（空消息）
- **Device**：`id` string ｜ `deviceId` string ｜ `platform` enum ｜ `osModel` string ｜ `osVersion` string ｜ `appVersion` string ｜ `createTime` string ｜ `updateTime` string ｜ `lastActiveTime` string ｜ `lastActiveIp` string ｜ `current` bool
- **ListDevicesRequest**：`pageSize` int32 ｜ `pageToken` string
- **ListDevicesResponse**：`nextPageToken` string ｜ `devices` repeated
**com.moonshot.kimi.proto.kimi.gateway.doodle.v1**

- **Doodle**：`id` string ｜ `assetUrl` string ｜ `link` message ｜ `welcomeMessage` message ｜ `showStartTime` string ｜ `showEndTime` string ｜ `key` string ｜ `page` enum ｜ `assetUrls` repeated
- **Link**：`doodleLink` string
- **WelcomeMessage**：`messages` map
**com.moonshot.kimi.proto.kimi.gateway.experiment.v1**

- **GetExperimentsRequest**：`withImpression` bool ｜ `experimentNames` repeated
- **GetExperimentsResponse**：`results` repeated
**com.moonshot.kimi.proto.kimi.gateway.feed.v1**

- **FeedItem**：`type` enum ｜ `chat` message ｜ `task` message ｜ `userNotification` message
- **ListFeedsRequest**：`pageSize` int32 ｜ `pageToken` string ｜ `projectId` string ｜ `unread` bool ｜ `includePinned` bool ｜ `filterTypes` repeated ｜ `filterTypesValue` repeated
- **ListFeedsResponse**：`nextPageToken` string ｜ `items` repeated
**com.moonshot.kimi.proto.kimi.gateway.file.v1**

- **AIPPT**：`coverUrl` string ｜ `pdfUrl` string ｜ `pptUrl` string
- **File**：`id` string ｜ `meta` message ｜ `blob` message ｜ `tokenCount` string ｜ `parseResult` message ｜ `status` enum ｜ `failReason` string
- **FileBlob**：`signUrl` string ｜ `previewUrl` string
- **FileInfo**：`name` string ｜ `path` string ｜ `size` string ｜ `updateTime` string ｜ `isDir` bool ｜ `url` string ｜ `status` enum
- **FileMeta**：`name` string ｜ `contentType` string ｜ `sizeBytes` string ｜ `checksum` string ｜ `ext` string ｜ `createTime` string ｜ `type` enum
- **GetFileParseProgressRequest**：`fileIds` repeated
- **GetFileParseProgressResponse**：`progresses` repeated
- **ParseProgress**：`fileId` string ｜ `status` enum ｜ `error` message
- **ParseResult**：`thumbnail` message ｜ `url` message ｜ `aippt` message ｜ `slides` message
- **Slides**：`name` string
**com.moonshot.kimi.proto.kimi.gateway.im.v1**

- **BotReportEvent**：（空消息）
- **ChatChangeEvent**：`chatId` string ｜ `messageId` string ｜ `type` enum ｜ `title` string ｜ `summary` string ｜ `time` string ｜ `taskId` string ｜ `projectId` string
- **ChatMessageEvent**：`chatId` string ｜ `messageId` string ｜ `status` enum ｜ `senderId` string ｜ `role` enum ｜ `senderShortId` string ｜ `roomId` string ｜ `summary` string ｜ `roomType` enum ｜ `mentioned` bool
- **ChatStatusEvent**：`chatId` string ｜ `messageId` string ｜ `status` enum ｜ `title` string ｜ `statusText` string ｜ `time` string ｜ `taskId` string ｜ `projectId` string
- **CreateInvitationRequest**：`roomId` string
- **CreateInvitationResponse**：`ticket` string ｜ `invitationCoverUrl` string
- **CreateRoomRequest**：`name` string ｜ `instruction` string ｜ `botIds` repeated
- **CreateRoomResponse**：`room` message
- **DeleteRoomRequest**：`roomId` string
- **DeleteRoomResponse**：（空消息）
- **DisbandEvent**：`roomId` string
- **Event**：`id` string ｜ `ping` message ｜ `chatMessage` message ｜ `reconnect` message ｜ `typing` message ｜ `disband` message ｜ `botReport` message ｜ `chatStatus` message ｜ `chatChange` message ｜ `subagentStatus` message ｜ `outbox` message ｜ `agentPhase` message ｜ `notification` message ｜ `operation` message ｜ `pong` message ｜ `notificationEvent` message ｜ `pairing` message
- **GetRoomByInvitationRequest**：`ticket` string
- **GetRoomByInvitationResponse**：`room` message ｜ `invitationCoverUrl` string ｜ `members` repeated
- **GetRoomRequest**：`roomId` string
- **GetRoomResponse**：`room` message
- **GetThreadRequest**：`threadId` string
- **GetThreadResponse**：`thread` message
- **InviteMembersRequest**：`roomId` string ｜ `memberIds` repeated
- **InviteMembersResponse**：`members` repeated
- **ListMembersRequest**：`roomId` string ｜ `pageToken` string ｜ `pageSize` int32
- **ListMembersResponse**：`nextPageToken` string ｜ `members` repeated
- **ListMessagesRequest**：`chatId` string ｜ `pageSize` int32 ｜ `pageToken` string ｜ `direction` message ｜ `startMessageId` string ｜ `includeStartMessage` bool ｜ `endMessageId` string ｜ `includeEndMessage` bool ｜ `noMarkAsRead` bool
- **ListMessagesResponse**：`nextPageToken` string ｜ `messages` repeated
- **ListRoomsRequest**：`pageToken` string ｜ `pageSize` int32
- **ListRoomsResponse**：`nextPageToken` string ｜ `rooms` repeated
- **ListTypingMembersRequest**：`roomId` string
- **ListTypingMembersResponse**：`members` repeated
- **Message**：`message` message ｜ `senderId` string ｜ `senderShortId` string ｜ `senderName` string ｜ `senderAvatar` string ｜ `hasThread` bool ｜ `threadMessages` repeated
- **MessageSummary**：`messageId` string ｜ `senderId` string ｜ `senderName` string ｜ `senderAvatar` string ｜ `summary` string ｜ `createTime` string
- **NotificationEvent**：`notificationsRead` message
- **OperationEvent**：`type` enum
- **PingEvent**：（空消息）
- **PongEvent**：（空消息）
- **ReconnectEvent**：（空消息）
- **RemoveMemberRequest**：`roomId` string ｜ `memberId` string
- **RemoveMemberResponse**：（空消息）
- **Room**：`id` string ｜ `name` string ｜ `ownerId` string ｜ `ownerShortId` string ｜ `type` enum ｜ `assistantId` string ｜ `instruction` string ｜ `rules` string ｜ `createTime` string ｜ `updateTime` string ｜ `unreadCount` int32 ｜ `allowAudience` bool ｜ `lastMessage` message ｜ `dmTargetMember` message ｜ `memberCount` int32 ｜ `avatarUrls` repeated ｜ `slashCommands` repeated
- **RoomMember**：`id` string ｜ `shortId` string ｜ `name` string ｜ `avatarUrl` string ｜ `type` enum ｜ `online` bool ｜ `muted` bool ｜ `belongsTo` message ｜ `role` enum ｜ `botType` enum ｜ `skills` repeated
- **SendMessageRequest**：`chatId` string ｜ `blocks` repeated
- **SendMessageResponse**：`messageId` string
- **SetMemberRoleRequest**：`roomId` string ｜ `memberId` string ｜ `role` enum
- **SetMemberRoleResponse**：（空消息）
- **SlashCommand**：`command` string ｜ `description` string
- **SubagentStatusEvent**：`chatId` string ｜ `agentId` string ｜ `status` enum ｜ `progressPercent` int32
- **Thread**：`id` string ｜ `roomId` string ｜ `name` string ｜ `createTime` string ｜ `updateTime` string ｜ `unreadCount` int32
- **TypingEvent**：`roomId` string ｜ `member` message
- **TypingMember**：`id` string ｜ `name` string ｜ `avatar` string ｜ `status` enum ｜ `threadId` string ｜ `toolAction` message
- **UpdateRoomRequest**：`room` message ｜ `updateMask` string
- **UpdateRoomResponse**：`room` message
**com.moonshot.kimi.proto.kimi.gateway.im.v1.NotificationEvent**

- **NotificationsRead**：`type` enum ｜ `all` bool ｜ `extras` map
**com.moonshot.kimi.proto.kimi.gateway.issuance.v1**

- **Credential**：`secretId` string ｜ `secretKey` string ｜ `sessionToken` string ｜ `expireTime` string
- **GetCredentialRequest**：`service` enum
- **GetCredentialResponse**：`credential` message
**com.moonshot.kimi.proto.kimi.gateway.mcp.v1**

- **CreateMCPServerAuthorizationRequest**：`serverId` string ｜ `redirectUri` string
- **CreateMCPServerAuthorizationResponse**：`authorization` message
- **Deployment**：`version` string ｜ `pageContentUrl` string ｜ `downloadUrl` string
- **FileTreeNode**：`name` string ｜ `size` string ｜ `url` string ｜ `isDir` bool ｜ `lastModifyTime` string ｜ `thumbnailUrl` string ｜ `extra` message ｜ `children` repeated
- **GetCitationsByChatRequest**：`chatId` string
- **GetCitationsByChatResponse**：`citations` repeated
- **GetDeploymentByChatShareRequest**：`chatShareId` string ｜ `version` string
- **GetDeploymentByChatShareResponse**：`deployment` message ｜ `downloadUrl` string
- **GetMCPServerAuthorizationRequest**：`requestId` string
- **GetMCPServerAuthorizationResponse**：`authorization` message
- **GetManifestRequest**：`chatId` string
- **GetManifestResponse**：`manifest` message
- **GetOutputFileTreeByShareRequest**：`chatShareId` string
- **GetOutputFileTreeByShareResponse**：`root` message ｜ `downloadUrl` string
- **GetOutputFileTreeRequest**：`chatId` string ｜ `chatShareId` string
- **GetOutputFileTreeResponse**：`root` message ｜ `downloadUrl` string
- **MCPServerAuthorization**：`requestId` string ｜ `serverId` string ｜ `userId` string ｜ `oauthUrl` string ｜ `expireTime` string ｜ `status` enum
- **Manifest**：`publishedVersion` string ｜ `publicUrl` string ｜ `lastPublishTime` string ｜ `deployments` repeated
- **PublishDeploymentRequest**：`chatId` string ｜ `version` string
- **PublishDeploymentResponse**：`url` string
- **ResolveFileURIByShareRequest**：`chatShareId` string ｜ `fileUri` string
- **ResolveFileURIByShareResponse**：`downloadUrl` string
- **ResolveFileURIRequest**：`chatId` string ｜ `fileUri` string
- **ResolveFileURIResponse**：`downloadUrl` string
- **SearchCitation**：`id` string ｜ `title` string ｜ `url` string ｜ `siteName` string ｜ `iconUrl` string
- **SetMCPUserSettingStatusRequest**：`id` string ｜ `enable` bool
- **SetMCPUserSettingStatusResponse**：（空消息）
- **UnpublishDeploymentRequest**：`chatId` string
- **UnpublishDeploymentResponse**：（空消息）
**com.moonshot.kimi.proto.kimi.gateway.mcp.v1.FileTreeNode**

- **Extra**：`sandboxUri` string ｜ `externalId` string ｜ `etag` string
**com.moonshot.kimi.proto.kimi.gateway.membership.v2**

- **Balance**：`id` string ｜ `feature` enum ｜ `type` enum ｜ `unit` enum ｜ `amount` string ｜ `amountLeft` string ｜ `upcomingExpiration` message ｜ `amountUsedRatio` float ｜ `kimiCodeUsedRatio` float ｜ `expireTime` string ｜ `domain` enum ｜ `displayName` string
- **Capability**：`feature` enum ｜ `constraint` message
- **ClaimEventBalanceRequest**：`eventId` string
- **ClaimEventBalanceResponse**：（空消息）
- **GetBalanceEventInfoRequest**：`eventId` string
- **GetBalanceEventInfoResponse**：`eventId` string ｜ `subscriptionId` string ｜ `eventTitle` string ｜ `eventDesc` string ｜ `eventImgUrl` string
- **GetSubscriptionRequest**：`domain` enum
- **GetSubscriptionResponse**：`subscription` message ｜ `nextSubscription` message ｜ `bonus` message ｜ `bonusGoodsTitle` string ｜ `highestLevel` bool ｜ `usingBonus` bool ｜ `subscribed` bool ｜ `purchaseSubscription` message ｜ `purchaseExpireSeconds` int32 ｜ `purchaseExpireTime` string ｜ `balances` repeated ｜ `capabilities` repeated
- **GetSubscriptionStatsRequest**：`domain` enum
- **GetSubscriptionStatsResponse**：`ratelimit5h` message ｜ `ratelimitCode5h` message ｜ `ratelimit7d` message ｜ `ratelimitCode7d` message ｜ `subscriptionBalance` message ｜ `notice` message ｜ `overdrawn` bool ｜ `eventId` string ｜ `giftBalances` repeated ｜ `boosterWallets` repeated
- **ListBalanceActionsRequest**：`pageSize` int32 ｜ `pageToken` string ｜ `filter` message ｜ `domain` enum
- **ListBalanceActionsResponse**：`nextPageToken` string ｜ `actions` repeated
- **Wallet**：`id` string ｜ `userId` string ｜ `balanceId` string ｜ `moneyLeft` message ｜ `moneyTotal` message ｜ `status` enum ｜ `allowTopup` bool ｜ `topupLimit` message ｜ `autoRefillEnabled` bool ｜ `autoRefillCharge` message ｜ `autoRefillThreshold` message ｜ `monthlyChargeLimitEnabled` bool ｜ `monthlyChargeLimit` message ｜ `monthlyUsed` message ｜ `createdAt` string ｜ `updatedAt` string
**com.moonshot.kimi.proto.kimi.gateway.membership.v2.Balance**

- **Action**：`id` string ｜ `feature` enum ｜ `title` string ｜ `status` enum ｜ `timestamp` string ｜ `items` repeated
- **UpcomingExpiration**：`timestamp` string ｜ `amountLeft` string
**com.moonshot.kimi.proto.kimi.gateway.membership.v2.Balance.Action**

- **Item**：`balanceId` string ｜ `amount` string ｜ `amountRatio` float ｜ `unit` enum ｜ `discounted` bool ｜ `amountMoney` message ｜ `modifier` string
**com.moonshot.kimi.proto.kimi.gateway.membership.v2.Capability**

- **Constraint**：`parallelism` int32 ｜ `cronNum` int32 ｜ `projectNum` int32 ｜ `userCapacity` string ｜ `modelContextLength` string ｜ `modelretryTimes` string ｜ `rateLimits` repeated
**com.moonshot.kimi.proto.kimi.gateway.membership.v2.Capability.Constraint**

- **RateLimit**：`total` int32 ｜ `window` message
**com.moonshot.kimi.proto.kimi.gateway.membership.v2.GetSubscriptionStatsResponse**

- **Notice**：`tip` string ｜ `content` string ｜ `resetTime` string ｜ `actions` repeated
- **RateLimitStat**：`ratio` float ｜ `enabled` bool ｜ `resetTime` string
**com.moonshot.kimi.proto.kimi.gateway.membership.v2.GetSubscriptionStatsResponse.Notice**

- **Action**：`paywall` message ｜ `booster` message
**com.moonshot.kimi.proto.kimi.gateway.membership.v2.ListBalanceActionsRequest**

- **Filter**：`unit` enum ｜ `invertFeatureMatch` bool ｜ `features` repeated ｜ `featuresValue` repeated ｜ `balanceTypes` repeated ｜ `balanceTypesValue` repeated
**com.moonshot.kimi.proto.kimi.gateway.memory.v1**

- **DeleteMemoryRequest**：`memoryId` string
- **DeleteMemoryResponse**：（空消息）
- **DreamVaultState**：`status` enum ｜ `updateTime` string
- **GetDreamStatusRequest**：（空消息）
- **GetDreamStatusResponse**：`dreamVault` message ｜ `featureAvailable` bool
- **GetVaultPageRequest**：`sandboxUri` string
- **GetVaultPageResponse**：`markdown` string ｜ `outgoingLinks` repeated ｜ `backlinks` repeated ｜ `citations` repeated
- **GetVaultTreeRequest**：（空消息）
- **GetVaultTreeResponse**：`root` message ｜ `downloadUrl` string
- **ListMemoriesRequest**：`pageSize` int32 ｜ `pageToken` string
- **ListMemoriesResponse**：`nextPageToken` string ｜ `totalCount` int32 ｜ `memoryLimit` int32 ｜ `memories` repeated
- **ResetDreamVaultRequest**：（空消息）
- **ResetDreamVaultResponse**：（空消息）
**com.moonshot.kimi.proto.kimi.gateway.misc.v1**

- **DataSourceLocalizedInfo**：`displayName` string
- **GetDataSourceLocalizedInfoRequest**：（空消息）
- **GetDataSourceLocalizedInfoResponse**：`infos` map
**com.moonshot.kimi.proto.kimi.gateway.notification.v1**

- **InAppNotificationOptions**：（空消息）
- **ListUserNotificationsRequest**：`pageSize` int32 ｜ `pageToken` string ｜ `unread` bool ｜ `hide` bool ｜ `types` repeated ｜ `typesValue` repeated
- **ListUserNotificationsResponse**：`nextPageToken` string ｜ `unreadCount` int32 ｜ `userNotifications` repeated
- **MarkNotificationsReadRequest**：`all` bool ｜ `ids` repeated ｜ `types` repeated ｜ `typesValue` repeated ｜ `extras` map
- **MarkNotificationsReadResponse**：`markedCount` int32
- **MobileNotificationOptions**：`channelId` string ｜ `sound` string ｜ `badge` string
- **Notification**：`type` enum ｜ `title` string ｜ `content` string ｜ `deeplink` string ｜ `iconUrl` string ｜ `imageUrl` string ｜ `presentation` message ｜ `extras` map
- **NotificationPresentation**：`mobile` message ｜ `web` message ｜ `inApp` message ｜ `dataOnly` bool
- **UserNotification**：`id` string ｜ `notification` message ｜ `read` bool ｜ `hide` bool ｜ `readTime` string ｜ `createTime` string
- **WebNotificationOptions**：`tag` string ｜ `badgeUrl` string ｜ `requireInteraction` bool ｜ `silent` bool
**com.moonshot.kimi.proto.kimi.gateway.order.v1**

- **CreateSubscriptionRequest**：`goodsId` string ｜ `subscriptionAction` enum ｜ `paymentChannel` enum ｜ `discountId` string ｜ `trackingMsg` string ｜ `domain` enum
- **CreateSubscriptionResponse**：`subscription` message ｜ `redirectUrl` string ｜ `orderId` string ｜ `wechatPassthroughParams` message
- **DiscountPayload**：`code` string
- **GetDiscountURLRequest**：`discountId` string
- **GetDiscountURLResponse**：`discountUrl` string
- **GetGoodsResponse**：`goods` message ｜ `discountPayload` message
- **GetPricePosterRequest**：（空消息）
- **GetPricePosterResponse**：`pricePoster` map
- **ListGoodsRequest**：`pageSize` int32 ｜ `pageToken` string ｜ `discountId` string ｜ `paymentChannel` enum ｜ `domains` repeated ｜ `domainsValue` repeated
- **ListGoodsResponse**：`nextPageToken` string ｜ `recommendChannel` enum ｜ `goods` repeated
- **VeryDiscountUserRequest**：`discountId` string
- **VeryDiscountUserResponse**：`sameUser` bool ｜ `discountUserStatus` enum
**com.moonshot.kimi.proto.kimi.gateway.pin.v1**

- **ListPinResourcesRequest**：`pageSize` int32 ｜ `pageToken` string ｜ `resourceTypes` repeated ｜ `resourceTypesValue` repeated
- **ListPinResourcesResponse**：`nextPageToken` string ｜ `resources` repeated
- **PinResourceRequest**：`resourceType` enum ｜ `resourceId` string
- **PinResourceResponse**：`resource` message
- **Resource**：`chat` message ｜ `project` message
- **UnpinResourceRequest**：`resourceType` enum ｜ `resourceId` string
- **UnpinResourceResponse**：`resource` message
**com.moonshot.kimi.proto.kimi.gateway.plugin.v1**

- **ClientRuntime**：`hostKind` enum ｜ `platform` enum
- **GetPluginRequest**：`id` string
- **GetPluginResponse**：`plugin` message
- **InstallPluginRequest**：`id` string
- **InstallPluginResponse**：`plugin` message ｜ `oauthRequiredMcpSettingIds` repeated
- **ListAvailablePluginsRequest**：`categoryId` string ｜ `query` string ｜ `pageSize` int32 ｜ `pageToken` string ｜ `clientRuntime` message
- **ListAvailablePluginsResponse**：`nextPageToken` string ｜ `totalSize` int32 ｜ `plugins` repeated
- **ListInstalledPluginsRequest**：`pageSize` int32 ｜ `pageToken` string ｜ `query` string ｜ `clientRuntime` message
- **ListInstalledPluginsResponse**：`nextPageToken` string ｜ `totalSize` int32 ｜ `plugins` repeated
- **ListPluginCategoriesRequest**：（空消息）
- **ListPluginCategoriesResponse**：`categories` repeated
- **ListPluginSectionsRequest**：`query` string ｜ `pageSize` int32 ｜ `clientRuntime` message
- **ListPluginSectionsResponse**：`installed` message ｜ `sections` repeated
- **Plugin**：`id` string ｜ `name` string ｜ `displayName` string ｜ `version` string ｜ `description` string ｜ `installDescription` string ｜ `developerName` string ｜ `iconUrl` string ｜ `sandboxPath` string ｜ `installed` bool ｜ `enterpriseOnly` bool ｜ `consumerOnly` bool ｜ `extraCharge` bool ｜ `hostKind` enum ｜ `tryPrompt` string ｜ `installCount` int32 ｜ `minMembershipLevel` enum ｜ `introduction` string ｜ `colorLight` string ｜ `colorDark` string ｜ `coverImageUrlLight` string ｜ `coverImageUrlDark` string ｜ `categories` repeated ｜ `mcpServers` repeated ｜ `skills` repeated ｜ `platforms` repeated ｜ `platformsValue` repeated
- **PluginCategory**：`id` string ｜ `displayName` string
- **PluginMCP**：`mcpKey` string ｜ `displayName` string ｜ `description` string ｜ `iconUrl` string ｜ `mcpSettingId` string ｜ `needOauth` bool ｜ `connectionState` enum ｜ `expireTime` string ｜ `enabledTools` repeated ｜ `disabledTools` repeated
- **PluginSection**：`category` message ｜ `nextPageToken` string ｜ `totalCount` int32 ｜ `plugins` repeated ｜ `overflowPlugins` repeated
- **PluginSkill**：`displayName` string ｜ `description` string
- **UninstallPluginRequest**：`id` string
- **UninstallPluginResponse**：（空消息）
**com.moonshot.kimi.proto.kimi.gateway.project.v1**

- **CreateProjectRequest**：`name` string ｜ `prompt` string ｜ `description` string ｜ `iconUrl` string ｜ `useMemory` bool
- **CreateProjectResponse**：`project` message
- **DeleteProjectFileRequest**：`projectId` string ｜ `path` string
- **DeleteProjectRequest**：`projectId` string
- **DeleteProjectResponse**：`project` message
- **GetProjectRequest**：`projectId` string
- **GetProjectResponse**：`project` message
- **ListProjectFilesRequest**：`projectId` string ｜ `path` string ｜ `showHidden` bool
- **ListProjectFilesResponse**：`info` message ｜ `files` repeated
- **ListProjectUploadFilesRequest**：`projectId` string
- **ListProjectUploadFilesResponse**：`info` message ｜ `files` repeated
- **ListProjectsRequest**：`pageSize` int32 ｜ `pageToken` string ｜ `includePinned` bool
- **ListProjectsResponse**：`nextPageToken` string ｜ `projectCountUsed` string ｜ `projectCountLimit` string ｜ `availableCount` string ｜ `projects` repeated
- **Project**：`id` string ｜ `name` string ｜ `prompt` string ｜ `iconUrl` string ｜ `description` string ｜ `createTime` string ｜ `updateTime` string ｜ `useMemory` bool ｜ `availability` enum ｜ `unreadCount` int32
- **SetAvailableProjectsRequest**：`projectIds` repeated
- **SetAvailableProjectsResponse**：`projectCountUsed` repeated ｜ `projectCountLimit` string ｜ `projects` string
- **UpdateProjectRequest**：`project` message ｜ `updateMask` string
- **UpdateProjectResponse**：`project` message
**com.moonshot.kimi.proto.kimi.gateway.promotionalasset.v1**

- **AppHomeBanner**：`id` string ｜ `welcomeMessage` string ｜ `link` string ｜ `assetUrl` string ｜ `showRule` enum ｜ `showStartTime` string ｜ `showEndTime` string ｜ `key` string
- **Card**：`id` string ｜ `title` string ｜ `subtitle` string ｜ `link` string ｜ `showRule` enum ｜ `priority` int32 ｜ `showStartTime` string ｜ `showEndTime` string ｜ `key` string ｜ `assetUrls` repeated ｜ `buttons` repeated
- **ListPromotionalAssetsRequest**：`pages` repeated ｜ `pagesValue` repeated
- **ListPromotionalAssetsResponse**：`doodles` repeated ｜ `cards` repeated ｜ `homeBanners` repeated ｜ `persistentActivityCards` repeated
- **PersistentActivityCard**：`id` string ｜ `title` string ｜ `subtitle` string ｜ `link` string ｜ `assetUrl` string ｜ `showStartTime` string ｜ `showEndTime` string ｜ `key` string
**com.moonshot.kimi.proto.kimi.gateway.riskcontrol.v1**

- **ReportEventRequest**：`customPayload` message
- **ReportEventResponse**：（空消息）
**com.moonshot.kimi.proto.kimi.gateway.skill.v1**

- **CreateSkillJobRequest**：`prompt` string ｜ `targetType` enum ｜ `botId` string ｜ `fileIds` repeated
- **CreateSkillJobResponse**：`job` message
- **DeleteSkillJobRequest**：`jobId` string
- **DeleteSkillJobResponse**：`job` message
- **GetSkillFileTreeRequest**：`skillId` string ｜ `versionNo` int32
- **GetSkillFileTreeResponse**：`root` message ｜ `downloadUrl` string
- **GetSkillJobRequest**：`jobId` string
- **GetSkillJobResponse**：`job` message
- **GetSkillRequest**：`skillId` string
- **GetSkillResponse**：`skill` message ｜ `hasNameConflict` bool ｜ `canUpdate` bool ｜ `activeVersion` int32 ｜ `latestVersion` int32
- **InstallSkillRequest**：`skillId` string ｜ `overrideName` string
- **InstallSkillResponse**：`skill` message
- **ListInstalledSkillsRequest**：`query` string ｜ `category` enum ｜ `skillUseCaseId` string
- **ListInstalledSkillsResponse**：`skills` repeated ｜ `generatingTasks` repeated
- **ListSkillUseCasesRequest**：（空消息）
- **ListSkillUseCasesResponse**：`useCases` repeated
- **ListSkillsRequest**：`query` string ｜ `pageSize` int32 ｜ `pageToken` string ｜ `category` enum ｜ `skillUseCaseId` string
- **ListSkillsResponse**：`nextPageToken` string ｜ `totalCount` int32 ｜ `skills` repeated
- **RemoveSkillRequest**：`skillId` string
- **RemoveSkillResponse**：（空消息）
- **RetrySkillJobRequest**：`jobId` string
- **RetrySkillJobResponse**：`job` message
- **Skill**：`id` string ｜ `name` string ｜ `displayName` string ｜ `description` string ｜ `avatarUrl` message ｜ `source` enum ｜ `sourceName` string ｜ `installed` bool ｜ `installationCount` string ｜ `pinned` bool ｜ `sandboxPath` string ｜ `activeVersion` int32 ｜ `categories` repeated ｜ `categoriesValue` repeated ｜ `skillUseCaseIds` repeated ｜ `tags` repeated ｜ `versions` repeated
- **SkillJob**：`id` string ｜ `jobType` enum ｜ `skillName` string ｜ `status` enum ｜ `skillId` string ｜ `botId` string ｜ `remoteName` string ｜ `createTime` string ｜ `completeTime` string ｜ `failureCode` string ｜ `failureReason` string ｜ `prompt` string
- **SkillUseCase**：`id` string ｜ `displayName` string ｜ `order` int32 ｜ `region` enum
- **SkillVersion**：`versionNo` int32 ｜ `changelog` string ｜ `updateTime` string ｜ `isActive` bool ｜ `source` string ｜ `forkedFrom` string
**com.moonshot.kimi.proto.kimi.gateway.slides.v1**

- **GetSlidesRequest**：`id` string
- **GetSlidesResponse**：`slides` message
**com.moonshot.kimi.proto.kimi.gateway.storage.v1**

- **GetUserStorageQuotaRequest**：（空消息）
- **GetUserStorageQuotaResponse**：`quota` message
- **UserStorageQuota**：`usedBytes` string ｜ `limitBytes` string ｜ `fileCountUsed` string ｜ `fileCountLimit` string
**com.moonshot.kimi.proto.kimi.gateway.style.v1**

- **AssetVariant**：`theme` enum ｜ `assetUri` string
- **ThemedAssets**：`variants` repeated
**com.moonshot.kimi.proto.kimi.gateway.suggest.v1**

- **Action**：`type` enum ｜ `value` string ｜ `extra` string
- **ClaimPopupExposureRequest**：`popupName` string
- **ClaimPopupExposureResponse**：（空消息）
- **GetShowcaseByIDRequest**：`id` string
- **GetShowcaseByIDResponse**：`showcase` message
- **ImageInfo**：`fileId` string ｜ `url` string ｜ `thumbnailUrl` string ｜ `width` int32 ｜ `height` int32
- **ListDefaultShowcasesRequest**：`scenario` enum ｜ `categoryName` string ｜ `limit` int32 ｜ `kimiPlusId` string ｜ `agentModeType` enum
- **ListDefaultShowcasesResponse**：`showcases` repeated
- **ListMobileHomepageShowcasesRequest**：`isCommunityEnabled` bool
- **ListMobileHomepageShowcasesResponse**：`recId` string ｜ `showcases` repeated
- **ListPopupsRequest**：`deviceLanguage` string ｜ `scenario` message ｜ `pwaInstallable` bool
- **ListPopupsResponse**：`popups` repeated
- **MobileHomepageShowcase**：`id` string ｜ `emoji` string ｜ `pic` string ｜ `title` string ｜ `directedTo` string ｜ `prompt` string ｜ `kimiPlusId` string ｜ `nativeScheme` string ｜ `httpScheme` string ｜ `trackInfo` message ｜ `styleHint` message
- **MobileHomepageShowcaseStyleHint**：`color` string ｜ `backgroundPicLight` string ｜ `backgroundPicDark` string ｜ `useBackgroundPic` bool ｜ `prefixIconLight` string ｜ `prefixIconDark` string ｜ `backgroundColorLight` string ｜ `backgroundColorDark` string ｜ `fontForegroundColorLight` string ｜ `fontForegroundColorDark` string ｜ `trailingBackgroundPicLight` string ｜ `trailingBackgroundPicDark` string ｜ `highlightedTextColorLight` string ｜ `highlightedTextColorDark` string ｜ `trailingSpaceInsetWidth` int32
- **Popup**：`name` string ｜ `title` string ｜ `size` enum ｜ `type` enum ｜ `onboardingContent` message ｜ `theme` enum ｜ `contents` repeated ｜ `buttons` repeated
- **PromptCategory**：`name` string ｜ `localizedName` string ｜ `iconUrl` string ｜ `iconUrlDark` string ｜ `iconUrlMobile` string ｜ `scenario` enum
- **RecEventLog**：`via` string ｜ `trackVia` string
- **Showcase**：`id` string ｜ `title` string ｜ `author` message ｜ `stats` message ｜ `liked` bool ｜ `coverImage` message ｜ `url` string ｜ `category` message ｜ `recEventLog` message ｜ `remixPrompt` string ｜ `shareId` string ｜ `dominantColor` string ｜ `kimiplusId` string ｜ `agentModeType` enum ｜ `images` repeated
**com.moonshot.kimi.proto.kimi.gateway.suggest.v1.Popup**

- **Button**：`text` string ｜ `style` string ｜ `scenario` enum ｜ `customControl` bool ｜ `action` message
- **Content**：`text` message ｜ `image` message ｜ `video` message
- **Image**：`url` string
- **OnboardingContent**：`showMembershipPricing` bool ｜ `items` repeated
- **Text**：`content` string
- **Video**：`url` string
**com.moonshot.kimi.proto.kimi.gateway.suggest.v1.Popup.OnboardingContent**

- **Item**：`video` message ｜ `title` string ｜ `description` string ｜ `actionButton` message
**com.moonshot.kimi.proto.kimi.gateway.suggest.v1.Showcase**

- **Author**：`name` string ｜ `avatarUrl` string
- **Stats**：`readCount` int32 ｜ `likeCount` int32
**com.moonshot.kimi.proto.kimi.gateway.swarm.v1**

- **ListAgentMessagesByShareRequest**：`agentId` string ｜ `pageSize` int32 ｜ `pageToken` string ｜ `shareId` string
- **ListAgentMessagesByShareResponse**：`nextPageToken` string ｜ `messages` repeated
- **ListAgentMessagesRequest**：`agentId` string ｜ `pageSize` int32 ｜ `pageToken` string
- **ListAgentMessagesResponse**：`nextPageToken` string ｜ `messages` repeated
- **ListAgentsRequest**：`chatId` string ｜ `includeTerminated` bool
- **ListAgentsResponse**：`agents` repeated
- **StopAgentsRequest**：`chatId` string
- **StopAgentsResponse**：（空消息）
- **Subagent**：`id` string ｜ `index` int32 ｜ `name` string ｜ `iconUrl` string ｜ `motto` string ｜ `status` enum ｜ `progressPercent` int32 ｜ `description` string ｜ `type` string ｜ `isAsync` bool
**com.moonshot.kimi.proto.kimi.gateway.trigger.v1**

- **AgentTaskPayload**：`content` string ｜ `persistContext` bool ｜ `inheritContext` bool ｜ `target` string ｜ `sourceWorkflow` enum
- **CreateTaskRequest**：`type` enum ｜ `chatId` string ｜ `title` string ｜ `cronExpr` string ｜ `nextTime` string ｜ `payload` message ｜ `expiredAt` string ｜ `projectId` string
- **CreateTaskResponse**：`task` message ｜ `pauseReason` message
- **DeleteTaskRequest**：`taskId` string
- **DeleteTaskResponse**：（空消息）
- **GetTaskRequest**：`taskId` string
- **GetTaskResponse**：`task` message
- **ListTaskExecutionsRequest**：`taskId` string ｜ `pageSize` int32 ｜ `pageToken` string
- **ListTaskExecutionsResponse**：`nextPageToken` string ｜ `executions` repeated
- **ListTasksRequest**：`pageSize` int32 ｜ `pageToken` string ｜ `chatId` string ｜ `projectId` string
- **ListTasksResponse**：`nextPageToken` string ｜ `tasks` repeated
- **MarkExecutionReadRequest**：`taskId` string ｜ `executionId` string
- **MarkExecutionReadResponse**：`execution` message
- **RunTaskRequest**：`taskId` string
- **RunTaskResponse**：`execution` message
- **Task**：`chatId` string ｜ `taskId` string ｜ `title` string ｜ `type` enum ｜ `status` enum ｜ `statusText` string ｜ `cronExpr` string ｜ `nextTime` string ｜ `payload` message ｜ `lastExecution` message ｜ `expiredAt` string ｜ `updateAt` string ｜ `projectId` string
- **TaskExecution**：`executionId` string ｜ `taskId` string ｜ `executeTime` string ｜ `status` enum ｜ `chatId` string ｜ `failReason` message ｜ `summary` string ｜ `isRead` bool
- **TaskPayload**：`agentTask` message ｜ `webhook` message
- **UpdateTaskRequest**：`task` message ｜ `updateMask` string
- **UpdateTaskResponse**：`task` message
- **WebhookPayload**：`url` string ｜ `method` string ｜ `body` string ｜ `headers` map
**com.moonshot.kimi.proto.kimi.gateway.tts.v1**

- **ListVoicesRequest**：（空消息）
- **ListVoicesResponse**：`voices` repeated
- **Voice**：`id` string ｜ `displayName` string ｜ `description` string ｜ `isDefault` bool ｜ `playGreetingUrl` string ｜ `legacyVoiceId` string
**com.moonshot.kimi.proto.kimi.gateway.websites.v1**

- **GetWebsiteSlugRequest**：`chatId` string
- **GetWebsiteSlugResponse**：`info` message
- **SetWebsiteSlugRequest**：`chatId` string ｜ `slug` string
- **SetWebsiteSlugResponse**：`info` message ｜ `reason` enum
- **ValidateWebsiteSlugRequest**：`chatId` string ｜ `slug` string
- **ValidateWebsiteSlugResponse**：`available` bool ｜ `reason` enum
- **WebsiteSlug**：`chatId` string ｜ `shortId` string ｜ `customSlug` string ｜ `targetType` enum ｜ `canonicalDomain` string ｜ `displayUrl` string
**com.moonshot.kimi.proto.kimi.gateway.work.v1**

- **Pairing**：`id` string ｜ `state` enum ｜ `expireTime` string ｜ `clientId` string ｜ `name` string ｜ `model` string ｜ `platform` enum ｜ `serverId` string
**com.moonshot.kimi.proto.kimi.memory.v1**

- **DreamVaultCitation**：`sourceRef` int32 ｜ `date` string ｜ `display` string
- **SemanticMemory**：`id` string ｜ `content` string ｜ `createTime` string ｜ `updateTime` string
- **VaultAnchor**：`type` string ｜ `value` string
- **VaultLink**：`kind` enum ｜ `fromPath` string ｜ `fromSandboxUri` string ｜ `text` string ｜ `normalized` string ｜ `targetType` enum ｜ `targetPath` string ｜ `targetSandboxUri` string ｜ `targetSourceRef` int32 ｜ `displayText` string ｜ `targetAnchor` message
**com.moonshot.kimi.proto.kimi.order.v1**

- **Discount**：`money` message ｜ `duration` message
- **Duration**：`duration` int32 ｜ `timeUnit` enum
- **Goods**：`id` string ｜ `title` string ｜ `subtitle` string ｜ `priceInCents` string ｜ `currency` string ｜ `durationDays` int32 ｜ `status` enum ｜ `description` message ｜ `useRegion` enum ｜ `createTime` string ｜ `updateTime` string ｜ `membershipLevel` enum ｜ `transitionSummary` message ｜ `subscribed` bool ｜ `billingCycle` message ｜ `thirdPayParam` message ｜ `discount` message ｜ `type` enum ｜ `domain` enum ｜ `stock` message ｜ `version` enum ｜ `amounts` repeated ｜ `features` repeated
- **Money**：`priceId` string ｜ `currency` string ｜ `priceInCents` string
- **Subscription**：`subscriptionId` string ｜ `goods` message ｜ `subscriptionTime` string ｜ `currentStartTime` string ｜ `currentEndTime` string ｜ `nextBillingTime` string ｜ `status` enum ｜ `paymentChannel` enum ｜ `type` enum ｜ `active` bool ｜ `domain` enum
- **ThirdPayParam**：`productId` string ｜ `groupId` string
**com.moonshot.kimi.proto.kimi.order.v1.Goods**

- **Stock**：`enabled` bool ｜ `quantity` int32 ｜ `refreshTtl` int32 ｜ `status` enum
- **Transition**：`action` enum ｜ `refundAmount` message ｜ `bonusCycle` message ｜ `reason` enum
**com.moonshot.kimi.proto.kimi.outbox.v1**

- **ClearOutboxMessagesRequest**：`chatId` string
- **CreateOutboxMessageRequest**：`chatId` string ｜ `message` message
- **CreateOutboxMessageResponse**：`outboxMessage` message ｜ `status` enum
- **DeleteOutboxMessageRequest**：`id` string
- **ListOutboxMessagesRequest**：`chatId` string
- **ListOutboxMessagesResponse**：`status` enum ｜ `messages` repeated
- **ReorderOutboxMessagesRequest**：`chatId` string ｜ `ids` repeated
- **ReorderOutboxMessagesResponse**：`messages` repeated
- **ResumeOutboxRequest**：`chatId` string
- **ResumeOutboxResponse**：`status` enum ｜ `dispatched` message
- **SendOutboxMessageNowRequest**：`id` string
- **SendOutboxMessageNowResponse**：`interrupted` bool
- **StopOutboxRequest**：`chatId` string
- **StopOutboxResponse**：`status` enum
- **UpdateOutboxMessageRequest**：`id` string ｜ `message` message ｜ `status` enum
- **UpdateOutboxMessageResponse**：`outboxMessage` message
**com.moonshot.kimi.proto.kimi.riskcontrol.v1**

- **CaptchaRequestPayload**：（空消息）
- **CaptchaVerifyPayload**：`success` bool ｜ `validate` string
- **CustomPayload**：`captchaVerify` message ｜ `captchaRequest` message
**com.moonshot.kimi.proto.kimi.slides.v1**

- **CustomColors**：`background` string ｜ `primary` string ｜ `secondary` string ｜ `auxiliary` repeated
- **Slides**：`id` string ｜ `title` string ｜ `templateId` string ｜ `coverUrl` string ｜ `payloadUrl` string ｜ `createTime` string ｜ `updateTime` string ｜ `outlineArtifactId` string ｜ `type` enum ｜ `status` enum ｜ `pptdPath` string
- **SlidesDesignOptions**：`width` int32 ｜ `height` int32
**com.moonshot.kimi.proto.kimi.usersetting.v1**

- **AutoDreamSetting**：`enabled` bool ｜ `userConfigured` bool
- **ChatSetting**：`nickname` string ｜ `occupation` enum ｜ `instructions` string
- **GetUserSettingRequest**：（空消息）
- **GetUserSettingResponse**：`userSetting` message
- **MemorySetting**：`useSemanticMemory` bool ｜ `useEpisodicMemory` bool ｜ `userConfigured` bool ｜ `autoDream` message
- **MobileNotificationSetting**：`activityNotification` bool ｜ `taskCompletionNotification` bool
- **NotificationSetting**：`web` message ｜ `mobile` message
- **SkillEvoSetting**：`enabled` bool ｜ `enabledAt` string
- **UpdateUserSettingRequest**：`userSetting` message ｜ `updateMask` string
- **UpdateUserSettingResponse**：`userSetting` message
- **UserSetting**：`memory` message ｜ `skillEvo` message ｜ `notification` message ｜ `chat` message
- **WebNotificationSetting**：`pageNotification` bool ｜ `browserNotification` bool ｜ `showNotificationWidget` bool
**com.moonshot.kimi.proto.moment.type.v1**

- **CommentCard**：`id` string ｜ `content` string ｜ `author` message ｜ `likeNum` int32 ｜ `isLiked` bool ｜ `mentions` repeated ｜ `links` repeated
- **CommentPreset**：`id` string ｜ `content` string ｜ `mentions` repeated
- **FollowUnreadItem**：`user` message ｜ `isUnread` bool
- **Image**：`fileId` string ｜ `url` string ｜ `width` string ｜ `height` string
- **InteractionStatus**：`isLiked` bool ｜ `isDisliked` bool ｜ `isCollected` bool ｜ `isMuted` bool
- **Link**：`id` string ｜ `type` enum ｜ `displayText` string ｜ `text` string ｜ `offset` int32 ｜ `length` int32 ｜ `url` string
- **MentionedUser**：`userId` string ｜ `name` string
- **MomentCard**：`id` string ｜ `title` string ｜ `excerpt` string ｜ `author` message ｜ `type` enum ｜ `via` string ｜ `trackVia` string ｜ `image` message ｜ `backgroundColor` string ｜ `chatShareInfo` message ｜ `stat` message ｜ `interactionStatus` message ｜ `images` repeated
- **MomentChatInfo**：`rawMessage` string ｜ `isDeleted` bool ｜ `share` message ｜ `segments` repeated
- **MomentStat**：`likeNum` int32 ｜ `dislikeNum` int32 ｜ `commentNum` int32 ｜ `shareNum` int32 ｜ `collectNum` int32 ｜ `readNum` int32
- **MuteReason**：`id` string ｜ `content` string
- **ReminderItem**：`type` enum ｜ `count` int32 ｜ `lastUsers` repeated
- **UploadLink**：`id` string ｜ `type` enum ｜ `text` string ｜ `offset` int32 ｜ `length` int32 ｜ `url` string
- **UserMiniInfo**：`userId` string ｜ `name` string ｜ `bio` string ｜ `avatarUrl` string ｜ `isDeleted` int32
**com.moonshot.kimi.proto.moment.type.v1.MomentCard**

- **ChatShareInfo**：`chatShareId` string ｜ `chatInfo` message
**com.moonshot.kimi.proto.moment.type.v1.MomentChatInfo**

- **ChatFileRef**：`contentType` string ｜ `fileName` string ｜ `fileSize` string ｜ `fileId` string ｜ `imageUrl` string
- **ChatSegment**：`role` enum ｜ `text` string ｜ `groupId` string ｜ `kimiPlusInfo` message ｜ `fileRefs` repeated
- **KimiPlusInfo**：`kimiPlusId` string ｜ `avatarUrl` string
**com.moonshot.kimi.proto.moment.v1**

- **AppendMuteReasonsRequest**：`objectType` enum ｜ `objectId` string ｜ `advice` string ｜ `reasonIds` repeated
- **AppendMuteReasonsResponse**：`msg` string
- **AskKimiQuestion**：`question` string ｜ `id` string
- **AvatarImage**：`url` string
- **ChatShareCard**：`htmlFile` message ｜ `codeArtifact` message ｜ `imageList` message ｜ `okcArtifact` message ｜ `notice` string ｜ `noticeIconUrl` string
- **Comment**：`createTime` string ｜ `id` string ｜ `author` message ｜ `momentId` string ｜ `repliedComment` message ｜ `content` message ｜ `type` enum ｜ `stat` message ｜ `ipLocation` string ｜ `status` enum ｜ `interactionStatus` message ｜ `subCommentPageToken` string ｜ `subCommentNum` int32 ｜ `subCommentIsLastPage` bool ｜ `rootComment` message ｜ `aiGenerated` bool ｜ `subComments` repeated ｜ `mentions` repeated ｜ `links` repeated
- **CommentAuthor**：`userId` string ｜ `name` string ｜ `avatarImage` message
- **CommentContent**：`text` string
- **CommentInteractionStatus**：`isLiked` bool ｜ `isDisliked` bool ｜ `isMuted` int32
- **CommentStat**：`likeNum` int32 ｜ `replyNum` int32
- **CreateChatV2Request**：`momentId` string ｜ `chatType` enum ｜ `chatTypeSubKey` string ｜ `askKimiQuestion` string
- **CreateChatV2Response**：`chatId` string ｜ `chat` message ｜ `chatType` enum ｜ `chatTypeSubKey` string
- **CreateCommentRequest**：`momentId` string ｜ `targetCommentId` string ｜ `content` message ｜ `mentions` repeated ｜ `links` repeated
- **CreateCommentResponse**：`comment` message
- **CreateComplaintRequest**：`objectType` enum ｜ `objectId` string ｜ `reason` string
- **CreateComplaintResponse**：（空消息）
- **CreateFavoriteRequest**：`momentId` string
- **CreateFavoriteResponse**：（空消息）
- **CreateFileRequest**：`fileName` string ｜ `fileId` string ｜ `extra` message
- **CreateFileResponse**：`fileId` string ｜ `fileName` string ｜ `size` int32 ｜ `originUrl` string ｜ `thumbnailUrl` string ｜ `contentType` string
- **CreateMomentRequest**：`text` string ｜ `title` string ｜ `chatShareId` string ｜ `visibility` enum ｜ `artifactShareId` string ｜ `images` repeated ｜ `mentions` repeated ｜ `links` repeated ｜ `hashtagIds` repeated
- **CreateMomentResponse**：`moment` message
- **DeleteCommentRequest**：`commentId` string
- **DeleteFavoriteRequest**：`momentId` string
- **DeleteFavoriteResponse**：（空消息）
- **DeleteMomentRequest**：`momentId` string
- **Feed**：`feedType` enum ｜ `feedId` string ｜ `moment` message ｜ `interestCard` message ｜ `recEventLog` message
- **GeneratePresignedURLRequest**：`fileType` enum
- **GeneratePresignedURLResponse**：`uploadUrl` string ｜ `objectName` string ｜ `fileId` string
- **GetChatShareCardRequest**：`chatShareId` string
- **GetChatShareCardResponse**：`chatShareCard` message
- **GetConfigRequest**：（空消息）
- **GetConfigResponse**：`notification` message
- **GetFeedRequest**：`feedType` enum ｜ `feedId` string
- **GetFeedResponse**：`feed` message ｜ `similarMoments` repeated
- **GetHashtagRequest**：`id` string
- **GetHashtagResponse**：`hashtag` message
- **GetLastChatV2Request**：`momentId` string ｜ `chatType` enum ｜ `chatTypeSubKey` string
- **GetLastChatV2Response**：`chatId` string ｜ `chatType` enum ｜ `chatTypeSubKey` string
- **GetMeRequest**：`view` enum
- **GetMeResponse**：`userBase` message ｜ `userStat` message ｜ `userInfo` message
- **GetOriginalMessageCountRequest**：`momentId` string ｜ `chatId` string
- **GetOriginalMessageCountResponse**：`messageCount` int32
- **GetRawShareChatV2Request**：`chatShareId` string
- **GetRawShareChatV2Response**：`share` message
- **GetReminderStatusRequest**：（空消息）
- **GetReminderStatusResponse**：`hasUnread` bool
- **GetUserProfileRequest**：`userId` string
- **GetUserProfileResponse**：`userBase` message ｜ `userStat` message ｜ `interactionStatus` message ｜ `userInfo` message
- **HashtagIcon**：`fileId` string ｜ `url` int32 ｜ `width` int32 ｜ `height` int32
- **HashtagItem**：`id` string ｜ `name` string ｜ `createTime` string ｜ `updateTime` string ｜ `description` string ｜ `icon` message ｜ `status` enum ｜ `type` enum ｜ `momentCount` string
- **ImageExtra**：`width` int32 ｜ `height` int32
- **ImageInfo**：`fileId` string ｜ `extra` message ｜ `originUrl` string ｜ `thumbnailUrl` string ｜ `thumbnailExtra` message ｜ `downloadUrl` string
- **ImageUploadInfo**：`fileId` string ｜ `extra` message
- **Interest**：`name` string ｜ `imageUrl` string ｜ `subInterests` repeated
- **InterestCard**：`title` string ｜ `content` string ｜ `buttonText` string ｜ `interests` repeated
- **InterestSelection**：`interestName` string ｜ `subInterestName` string ｜ `domainTag` string
- **ListCommentsRequest**：`momentId` string ｜ `pageSize` int32 ｜ `pageToken` string ｜ `rootCommentId` string ｜ `pinnedCommentId` string
- **ListCommentsResponse**：`nextPageToken` string ｜ `pageStat` message ｜ `isLastPage` bool ｜ `pinnedCommentId` string ｜ `comments` repeated
- **ListFeedsRequest**：`sessionId` string ｜ `pageSize` int32 ｜ `pageToken` string ｜ `category` enum ｜ `userId` string ｜ `pinnedMomentId` string ｜ `hashtagId` string
- **ListFeedsResponse**：`nextPageToken` string ｜ `isLastPage` bool ｜ `feeds` repeated
- **ListFollowUnreadRequest**：（空消息）
- **ListFollowUnreadResponse**：`items` repeated
- **ListFollowsRequest**：`followType` enum ｜ `pageSize` int32 ｜ `pageToken` string ｜ `userId` string
- **ListFollowsResponse**：`nextPageToken` string ｜ `userInfos` repeated
- **ListHashtagsRequest**：（空消息）
- **ListHashtagsResponse**：`topUpHashtags` repeated ｜ `recentUsedHashtags` repeated ｜ `allHashtags` repeated
- **ListHotHashtagsInSearchRequest**：（空消息）
- **ListHotHashtagsInSearchResponse**：`hashtags` repeated
- **ListMentionableBotsRequest**：`sceneType` enum
- **ListMentionableBotsResponse**：`bots` repeated
- **ListMomentAskKimiQuestionsRequest**：`momentId` string ｜ `limit` int32
- **ListMomentAskKimiQuestionsResponse**：`askKimiQuestions` repeated
- **ListMuteReasonsRequest**：`objectType` enum
- **ListMuteReasonsResponse**：`reasons` repeated
- **ListNotificationRequest**：`idGt` string ｜ `idLt` string ｜ `limit` int32
- **ListNotificationResponse**：`notifications` repeated ｜ `moments` repeated ｜ `comments` repeated ｜ `users` repeated
- **ListRemindersRequest**：（空消息）
- **ListRemindersResponse**：`items` repeated
- **ListSimilarMomentsRequest**：`momentId` string ｜ `pageSize` int32 ｜ `pageToken` string
- **ListSimilarMomentsResponse**：`nextPageToken` string ｜ `items` repeated
- **ListSubCommentsRequest**：`rootCommentId` string ｜ `pageSize` int32 ｜ `pageToken` string
- **ListSubCommentsResponse**：`nextPageToken` string ｜ `subComments` repeated
- **MarkReadForFollowRequest**：`followUserId` string
- **MarkReadForFollowResponse**：（空消息）
- **MarkReadForReminderRequest**：（空消息）
- **MarkReadForReminderResponse**：（空消息）
- **MarkReadRequest**：`idLte` string
- **MarkReadResponse**：（空消息）
- **MentionedUser**：`userId` string ｜ `name` string ｜ `avatarUrl` string
- **ModifyBlockRequest**：`userId` string ｜ `action` enum
- **ModifyBlockResponse**：`userId` string ｜ `blockStatus` enum
- **ModifyFollowRequest**：`userId` string ｜ `action` enum
- **ModifyFollowResponse**：`userId` string ｜ `followStatus` enum
- **Moment**：`id` string ｜ `content` message ｜ `stat` message ｜ `createTime` string ｜ `updateTime` string ｜ `publishTime` string ｜ `author` message ｜ `interactionStatus` message ｜ `commentPermission` enum ｜ `askKimiQuestion` message ｜ `refMomentId` string ｜ `hotComment` message ｜ `chatShareCard` message ｜ `coverImage` message ｜ `hashtags` repeated ｜ `askKimiQuestions` repeated ｜ `commentPresets` repeated
- **MomentAuthor**：`userBase` message ｜ `userStat` message ｜ `type` enum ｜ `relationStatus` message
- **MomentContent**：`text` string ｜ `title` string ｜ `media` message ｜ `source` enum ｜ `externalLink` message ｜ `chatInfo` message ｜ `chatShareId` string ｜ `type` enum ｜ `excerpt` string ｜ `visibility` enum ｜ `textType` enum ｜ `artifactShareId` string ｜ `mentions` repeated ｜ `links` repeated
- **MuteRequest**：`objectType` enum ｜ `objectId` string ｜ `reason` string
- **MuteResponse**：`msg` string
- **Notification**：`id` string ｜ `notificationType` enum ｜ `momentId` string ｜ `commentId` string ｜ `happenedTime` string ｜ `readTime` string ｜ `fromUsers` repeated
- **NotificationConfig**：`pollSec` int32 ｜ `pollInCommunitySec` int32
- **PageStat**：`commentNum` int32 ｜ `likeNum` int32
- **ReChatRequest**：`momentId` string ｜ `lastChatId` string
- **ReChatResponse**：`chatId` string ｜ `chat` message ｜ `chatType` enum ｜ `chatTypeSubKey` string
- **RecEventLog**：`via` string ｜ `trackVia` string
- **RecommendHashtagsRequest**：`title` string ｜ `text` string
- **RecommendHashtagsResponse**：`hashtags` repeated
- **RepliedComment**：`id` string ｜ `user` message
- **ReportSelectionsRequest**：`selections` repeated
- **ReportSelectionsResponse**：（空消息）
- **SearchHashtagsRequest**：`query` string ｜ `pageSize` int32 ｜ `pageToken` string
- **SearchHashtagsResponse**：`nextPageToken` string ｜ `hashtags` repeated ｜ `relatedHashtags` repeated
- **SearchHashtagsResponseItem**：`hashtag` message ｜ `nameHighlights` repeated
- **SearchMomentsRequest**：`query` string ｜ `pageSize` int32 ｜ `pageToken` string
- **SearchMomentsResponse**：`nextPageToken` string ｜ `moments` repeated ｜ `relatedMoments` repeated
- **SearchMomentsResponseItem**：`moment` message ｜ `recEventLog` message ｜ `titleHighlights` repeated ｜ `excerptHighlights` repeated
- **SearchResponseItemHighlight**：`startFrom` int32 ｜ `endAt` int32
- **SearchUsersRequest**：`query` string ｜ `pageSize` int32 ｜ `pageToken` string
- **SearchUsersResponse**：`nextPageToken` string ｜ `users` repeated ｜ `relatedUsers` repeated
- **SearchUsersResponseItem**：`userInfo` message ｜ `nameHighlights` repeated ｜ `bioHighlights` repeated
- **SubInterest**：`name` string ｜ `domainTag` string
- **SubmitSelectionsRequest**：`selections` repeated
- **SubmitSelectionsResponse**：（空消息）
- **SuggestSearchQueryRequest**：`query` string
- **SuggestSearchQueryResponse**：`suggestedQueries` repeated
- **SuggestSearchQueryResponseItem**：`suggestedQuery` string ｜ `highlights` repeated
- **UnMuteRequest**：`objectType` enum ｜ `objectId` string
- **UnMuteResponse**：（空消息）
- **UserBase**：`userId` string ｜ `name` string ｜ `bio` string ｜ `avatarImage` message
- **UserInfo**：`userBase` message ｜ `userStat` message ｜ `interactionStatus` message ｜ `isDeleted` bool
- **UserRelationStatus**：`followStatus` enum ｜ `blockStatus` enum
- **UserStat**：`followingNum` int32 ｜ `followerNum` int32 ｜ `momentLikesNum` int32 ｜ `momentNum` int32
- **VoteCommentRequest**：`commentId` string ｜ `voteAction` enum
- **VoteCommentResponse**：（空消息）
- **VoteMomentRequest**：`momentId` string ｜ `voteAction` enum
- **VoteMomentResponse**：（空消息）
**com.moonshot.kimi.proto.moment.v1.ChatShareCard**

- **CodeArtifact**：`id` string ｜ `coverImage` message ｜ `coverImageDominantColor` string ｜ `subType` enum ｜ `remixPrompt` string
- **HtmlFile**：`cdnUrl` string ｜ `coverImage` message ｜ `coverImageDominantColor` string ｜ `remixPrompt` string ｜ `fileId` string
- **ImageListWithDominantColor**：`items` repeated
- **ImageWithDominantColor**：`imageInfo` message ｜ `dominantColor` string ｜ `remixPrompt` string
- **OKCArtifact**：`id` string ｜ `okcUrl` string ｜ `coverImage` message ｜ `coverImageDominantColor` string ｜ `remixPrompt` string ｜ `isPublished` bool
**com.moonshot.kimi.proto.moment.v1.CreateCommentRequest**

- **MentionedUser**：`userId` string ｜ `name` string
**com.moonshot.kimi.proto.moment.v1.CreateFileRequest**

- **ImageExtra**：`width` int32 ｜ `height` int32
**com.moonshot.kimi.proto.moment.v1.MomentContent**

- **MomentExternalLink**：`url` string ｜ `coverImage` message ｜ `title` string ｜ `description` string
- **MomentMedia**：`videoUrl` string ｜ `images` repeated

### 附录 B：枚举汇总

共 158 个。枚举类型名被 R8 剥离，下表按取值公共前缀推断命名。

**推断枚举名 · 混淆类 · 取值**

- `Action`（`Lgq/d0;`；`ACTION_RESET_TO_INITIAL`、`ACTION_AUTO_FIX`、`ACTION_UPGRADE_PLUGIN`、`ACTION_BACKUP_WORKSPACE`、`ACTION_INSTALL_WECOM_PLUGIN`、`ACTION_UNSPECIFIED`、`ACTION_UPGRADE_BOT`、`ACTION_RESTORE_WORKSPACE`、`ACTION_RESTART_INSTANCE`、`ACTION_RESTART_BOT`）
- `Action`（`Lvp/g1;`；`ACTION_INTERRUPT`、`ACTION_UNSPECIFIED`、`ACTION_CONTINUE`）
- `Action`（`Lvp/r0;`；`ACTION_INTERRUPT`、`ACTION_UNSPECIFIED`、`ACTION_CONTINUE`）
- `AgentPhase`（`Leq/o;`；`AGENT_PHASE_TOOL_END`、`AGENT_PHASE_TOOL_DETECT`、`AGENT_PHASE_TOOL_START`、`AGENT_PHASE_END`、`AGENT_PHASE_HISTORY_COMPACTION`、`AGENT_PHASE_MODEL_REASONING`、`AGENT_PHASE_AGENT_END`、`AGENT_PHASE_FAILED`、`AGENT_PHASE_AGENT_START`、`AGENT_PHASE_MODEL_TEXT`、`AGENT_PHASE_INTERACTION_START`、`AGENT_PHASE_UNSPECIFIED`）
- `ArtifactType`（`Ltp/l;`；`ARTIFACT_TYPE_SLIDES_BANANA`、`ARTIFACT_TYPE_CODE`、`ARTIFACT_TYPE_SLIDES_JSON`、`ARTIFACT_TYPE_SLIDES_HTML`、`ARTIFACT_TYPE_MARKDOWN`、`ARTIFACT_TYPE_UNSPECIFIED`）
- `AuthorType`（`Lvr/o;`；`AUTHOR_TYPE_BOT`、`AUTHOR_TYPE_UNSPECIFIED`、`AUTHOR_TYPE_USER`）
- `AuthorizationStatus`（`Lrq/g;`；`AUTHORIZATION_STATUS_PROCESSING`、`AUTHORIZATION_STATUS_AUTHORIZED`、`AUTHORIZATION_STATUS_FAILED`、`AUTHORIZATION_STATUS_UNSPECIFIED`）
- `BlockAction`（`Lvr/x;`；`BLOCK_ACTION_UNSPECIFIED`、`BLOCK_ACTION_UNBLOCK`、`BLOCK_ACTION_BLOCK`）
- `BlockStatus`（`Lvr/d0;`；`BLOCK_STATUS_UNSPECIFIED`、`BLOCK_STATUS_NOT_BLOCKED`、`BLOCK_STATUS_BLOCKED`）
- `BotPersonality`（`Lgq/u0;`；`BOT_PERSONALITY_HYPE_FRIEND`、`BOT_PERSONALITY_UNSPECIFIED`、`BOT_PERSONALITY_THE_LISTENER`、`BOT_PERSONALITY_STOIC_ADVISOR`、`BOT_PERSONALITY_MEME_ZOOMER`）
- `BotType`（`Lgq/o1;`；`BOT_TYPE_REMOTE`、`BOT_TYPE_ALIYUN`、`BOT_TYPE_DESKTOP`、`BOT_TYPE_ROLLOUT`、`BOT_TYPE_UNSPECIFIED`、`BOT_TYPE_VOLCENGINE`、`BOT_TYPE_LOCAL`、`BOT_TYPE_ANDROID`）
- `Category`（`Lcr/g;`；`CATEGORY_SWARM`、`CATEGORY_AGENT`、`CATEGORY_CLAW`、`CATEGORY_UNSPECIFIED`）
- `ChatRole`（`Lur/f;`；`CHAT_ROLE_UNSPECIFIED`、`CHAT_ROLE_USER`、`CHAT_ROLE_ASSISTANT`）
- `ChatSourceType`（`Lup/i1;`；`CHAT_SOURCE_TYPE_UNSPECIFIED`、`CHAT_SOURCE_TYPE_KIMIPLUS`、`CHAT_SOURCE_TYPE_MOMENT`、`CHAT_SOURCE_TYPE_PROJECT`）
- `ChatType`（`Lvr/h1;`；`CHAT_TYPE_REMIX_OKC_ARTIFACT`、`CHAT_TYPE_UNSPECIFIED`、`CHAT_TYPE_REMIX_CODE_ARTIFACT_DEEP_RESEARCH`、`CHAT_TYPE_CONTINUE`、`CHAT_TYPE_ASK_KIMI`、`CHAT_TYPE_REMIX_IMAGE`、`CHAT_TYPE_REMIX_HTML`）
- `CodeArtifactSubType`（`Lur/k;`；`CODE_ARTIFACT_SUB_TYPE_UNSPECIFIED`、`CODE_ARTIFACT_SUB_TYPE_DEEP_RESEARCH`）
- `CommentPermission`（`Lvr/z1;`；`COMMENT_PERMISSION_UNSPECIFIED`、`COMMENT_PERMISSION_PUBLIC`、`COMMENT_PERMISSION_DISABLED`）
- `CommentStatus`（`Lvr/i2;`；`COMMENT_STATUS_NORMAL`、`COMMENT_STATUS_DELETED`、`COMMENT_STATUS_UNSPECIFIED`）
- `CommentType`（`Lvr/o2;`；`COMMENT_TYPE_BOT`、`COMMENT_TYPE_UNSPECIFIED`、`COMMENT_TYPE_USER`）
- `CommentVoteAction`（`Lvr/w2;`；`COMMENT_VOTE_ACTION_CANCEL_DISLIKE`、`COMMENT_VOTE_ACTION_LIKE`、`COMMENT_VOTE_ACTION_DISLIKE`、`COMMENT_VOTE_ACTION_CANCEL_LIKE`、`COMMENT_VOTE_ACTION_UNSPECIFIED`）
- `ComplaintObjectType`（`Lvr/d3;`；`COMPLAINT_OBJECT_TYPE_COMMENT`、`COMPLAINT_OBJECT_TYPE_USER`、`COMPLAINT_OBJECT_TYPE_MOMENT`、`COMPLAINT_OBJECT_TYPE_UNSPECIFIED`）
- `ConfigSource`（`Lhq/g;`；`CONFIG_SOURCE_SCRIPT`、`CONFIG_SOURCE_LEGACY`、`CONFIG_SOURCE_UNSPECIFIED`）
- `ConnectionState`（`Lyq/i;`；`CONNECTION_STATE_CONNECTED`、`CONNECTION_STATE_UNSPECIFIED`、`CONNECTION_STATE_NOT_CONNECTED`）
- `ContextLength`（`Lwp/q;`；`CONTEXT_LENGTH_XXXXL`、`CONTEXT_LENGTH_XS`、`CONTEXT_LENGTH_XL`、`CONTEXT_LENGTH_UNSPECIFIED`、`CONTEXT_LENGTH_XXXL`、`CONTEXT_LENGTH_S`、`CONTEXT_LENGTH_M`、`CONTEXT_LENGTH_L`、`CONTEXT_LENGTH_XXS`、`CONTEXT_LENGTH_XXL`）
- `DiscountUserStatus`（`Lwq/o;`；`DISCOUNT_USER_STATUS_UNSPECIFIED`、`DISCOUNT_USER_STATUS_DISCOUNT_MEMBER`、`DISCOUNT_USER_STATUS_DISCOUNT_BONUS`）
- `DocumentExportStatus`（`Ljq/h;`；`DOCUMENT_EXPORT_STATUS_UNSPECIFIED`、`DOCUMENT_EXPORT_STATUS_PENDING`、`DOCUMENT_EXPORT_STATUS_SUCCESS`、`DOCUMENT_EXPORT_STATUS_FAILED`、`DOCUMENT_EXPORT_STATUS_PROCESSING`）
- `DocumentSourceType`（`Ljq/w;`；`DOCUMENT_SOURCE_TYPE_OKC_SANDBOX`、`DOCUMENT_SOURCE_TYPE_ARTIFACT`、`DOCUMENT_SOURCE_TYPE_UNSPECIFIED`）
- `DocumentType`（`Ljq/d0;`；`DOCUMENT_TYPE_UNSPECIFIED`、`DOCUMENT_TYPE_MARKDOWN`、`DOCUMENT_TYPE_PDF`、`DOCUMENT_TYPE_DOCX`）
- `Domain`（`Lwr/g;`；`DOMAIN_UNSPECIFIED`、`DOMAIN_KIMI`、`DOMAIN_CODE`、`DOMAIN_NEXUS`）
- `DreamVaultStatus`（`Ltq/r;`；`DREAM_VAULT_STATUS_DONE`、`DREAM_VAULT_STATUS_GENERATING`、`DREAM_VAULT_STATUS_UNSPECIFIED`、`DREAM_VAULT_STATUS_INSUFFICIENT_DATA`、`DREAM_VAULT_STATUS_PAUSED`、`DREAM_VAULT_STATUS_FAILED`）
- `Feature`（`Lsq/p1;`；`FEATURE_OFFICE_ADDIN`、`FEATURE_SLIDES_NBP`、`FEATURE_WIDGET_TASK`、`FEATURE_MY_KIMI`、`FEATURE_SAMPLE_TO_SKILL`、`FEATURE_AUTOMATION`、`FEATURE_UNSPECIFIED`、`FEATURE_DOCUMENTS`、`FEATURE_WORK`、`FEATURE_OMNI`、`FEATURE_CLAW`、`FEATURE_CHAT`、`FEATURE_PROJECT`、`FEATURE_WEBBRIDGE`、`FEATURE_DEEP_RESEARCH`、`FEATURE_SWARM`、`FEATURE_DREAM`、`FEATURE_AGENT`、`FEATURE_SLIDES`、`FEATURE_SHEETS`、`FEATURE_WEBSITES`、`FEATURE_PLUGIN`、`FEATURE_CODING`）
- `FeedCategory`（`Lvr/u5;`；`FEED_CATEGORY_FOLLOW`、`FEED_CATEGORY_HASHTAG`、`FEED_CATEGORY_USER_FAVORITE`、`FEED_CATEGORY_USER_LIKES`、`FEED_CATEGORY_UNSPECIFIED`、`FEED_CATEGORY_RECOMMEND`、`FEED_CATEGORY_USER_PUBLISH`）
- `FeedType`（`Lnq/j;`；`FEED_TYPE_NOTIFICATION`、`FEED_TYPE_TASK`、`FEED_TYPE_CHAT`、`FEED_TYPE_UNSPECIFIED`）
- `FeedType`（`Lvr/a6;`；`FEED_TYPE_MOMENT`、`FEED_TYPE_INTEREST_CARD`、`FEED_TYPE_UNSPECIFIED`）
- `FeedbackType`（`Lxp/h0;`；`FEEDBACK_TYPE_UNSPECIFIED`、`FEEDBACK_TYPE_SEARCH`、`FEEDBACK_TYPE_KIMI_V`、`FEEDBACK_TYPE_GENERAL`、`FEEDBACK_TYPE_GEN_IMAGE`、`FEEDBACK_TYPE_MEDIA_QUOTE`）
- `FileType`（`Lur/w;`；`FILE_TYPE_IMAGE`、`FILE_TYPE_FILE`、`FILE_TYPE_UNSPECIFIED`）
- `FileType`（`Lyp/k;`；`FILE_TYPE_DOCUMENT`、`FILE_TYPE_VIDEO`、`FILE_TYPE_IMAGE`、`FILE_TYPE_AUDIO`、`FILE_TYPE_AIPPT`、`FILE_TYPE_SLIDES`、`FILE_TYPE_UNSPECIFIED`、`FILE_TYPE_URL`）
- `FollowAction`（`Lvr/g6;`；`FOLLOW_ACTION_UNFOLLOW`、`FOLLOW_ACTION_UNSPECIFIED`、`FOLLOW_ACTION_FOLLOW`）
- `FollowStatus`（`Lvr/o6;`；`FOLLOW_STATUS_MUTUAL_FOLLOWING`、`FOLLOW_STATUS_UNSPECIFIED`、`FOLLOW_STATUS_FOLLOWING`、`FOLLOW_STATUS_NOT_FOLLOWING`、`FOLLOW_STATUS_FOLLOWED`）
- `FollowType`（`Lvr/u6;`；`FOLLOW_TYPE_FOLLOWERS`、`FOLLOW_TYPE_FOLLOWINGS`、`FOLLOW_TYPE_UNSPECIFIED`）
- `GoodsStatus`（`Lnr/a0;`；`GOODS_STATUS_UNSPECIFIED`、`GOODS_STATUS_ACTIVE`、`GOODS_STATUS_INACTIVE`）
- `GoodsType`（`Lnr/i0;`；`GOODS_TYPE_KOL`、`GOODS_TYPE_ENTERPRISE`、`GOODS_TYPE_SUBSCRIPTION`、`GOODS_TYPE_UNSPECIFIED`、`GOODS_TYPE_BOOSTER`）
- `GoodsVersion`（`Lnr/o0;`；`GOODS_VERSION_UNSPECIFIED`、`GOODS_VERSION_V2`、`GOODS_VERSION_V1`）
- `HashtagStatus`（`Lvr/x9;`；`HASHTAG_STATUS_DELETED`、`HASHTAG_STATUS_UNSPECIFIED`、`HASHTAG_STATUS_OFFLINE`、`HASHTAG_STATUS_NORMAL`）
- `HashtagType`（`Lvr/da;`；`HASHTAG_TYPE_ADMIN`、`HASHTAG_TYPE_UNSPECIFIED`、`HASHTAG_TYPE_USER`）
- `HostKind`（`Lpr/f;`；`HOST_KIND_LOCAL`、`HOST_KIND_UNSPECIFIED`、`HOST_KIND_HOSTED`）
- `InteractionType`（`Lvp/h0;`；`INTERACTION_TYPE_LBS`、`INTERACTION_TYPE_INTERRUPT`、`INTERACTION_TYPE_GENERIC_TOOL`、`INTERACTION_TYPE_UNSPECIFIED`、`INTERACTION_TYPE_INTERNAL`、`INTERACTION_TYPE_SLIDES_OUTLINE`）
- `Level`（`Lwr/v;`；`LEVEL_PREMIUM`、`LEVEL_TRIAL`、`LEVEL_ELITE`、`LEVEL_BASIC`、`LEVEL_PLUS`、`LEVEL_FREE`、`LEVEL_STANDARD`、`LEVEL_INTERMEDIATE`、`LEVEL_FREE_FRESHMAN`、`LEVEL_ANONYMOUS`、`LEVEL_ADVANCED`、`LEVEL_UNSPECIFIED`）
- `LinkType`（`Lur/o0;`；`LINK_TYPE_MOMENT`、`LINK_TYPE_UNSPECIFIED`、`LINK_TYPE_WEB`）
- `LoadType`（`Lup/qf;`；`LOAD_TYPE_UNSPECIFIED`、`LOAD_TYPE_EXTERNAL`）
- `Lsq/n;`（`Lsq/n;`；`STATUS_UNSPECIFIED`、`UNDO`、`DONE`、`ONGOING`、`ORACLE`）
- `Lsq/w;`（`Lsq/w;`；`BOOSTER`、`UNSPECIFIED`、`GIFT`、`SUBSCRIPTION`）
- `Lup/ib;`（`Lup/ib;`；`assistant`、`ROLE_UNSPECIFIED`、`user`、`system`）
- `Lwr/p0;`（`Lwr/p0;`；`web_extention`、`wx_work`、`desktop`、`windows`、`PLATFORM_UNSPECIFIED`、`kimi_code_cli`、`kimi_code_desktop`、`mira`、`web`、`mac`、`ios`、`harmonyos`、`kimi_cli`、`kimi_code_vscode`、`android`、`android_claw`）
- `MemberRole`（`Lpq/l3;`；`MEMBER_ROLE_MEMBER`、`MEMBER_ROLE_OWNER`、`MEMBER_ROLE_UNSPECIFIED`、`MEMBER_ROLE_AUDIENCE`、`MEMBER_ROLE_COORDINATOR`）
- `MemberType`（`Lpq/r3;`；`MEMBER_TYPE_HUMAN`、`MEMBER_TYPE_BOT`、`MEMBER_TYPE_UNSPECIFIED`）
- `MentionableSceneType`（`Lur/u0;`；`MENTIONABLE_SCENE_TYPE_AGENT`、`MENTIONABLE_SCENE_TYPE_UNSPECIFIED`、`MENTIONABLE_SCENE_TYPE_COMMENT_KIMI`）
- `MessageOrder`（`Lfq/t2;`；`MESSAGE_ORDER_ASC`、`MESSAGE_ORDER_UNSPECIFIED`、`MESSAGE_ORDER_DESC`）
- `MessageStatus`（`Lup/q7;`；`MESSAGE_STATUS_GENERATING`、`MESSAGE_STATUS_COMPLETED`、`MESSAGE_STATUS_PENDING`、`MESSAGE_STATUS_TRUNCATED`、`MESSAGE_STATUS_ERROR`、`MESSAGE_STATUS_CANCELLED`、`MESSAGE_STATUS_UNSPECIFIED`）
- `ModelApiKeyType`（`Lgq/p4;`；`MODEL_API_KEY_TYPE_UNSPECIFIED`、`MODEL_API_KEY_TYPE_KIMI_CODE`）
- `MomentSource`（`Lvr/fg;`；`MOMENT_SOURCE_UNSPECIFIED`、`MOMENT_SOURCE_AI`、`MOMENT_SOURCE_RESEARCHER`、`MOMENT_SOURCE_KODER`、`MOMENT_SOURCE_ADMIN`、`MOMENT_SOURCE_PARTNER`、`MOMENT_SOURCE_USER`、`MOMENT_SOURCE_CHAT`）
- `MomentType`（`Lur/a2;`；`MOMENT_TYPE_TEXT`、`MOMENT_TYPE_CHAT`、`MOMENT_TYPE_IMAGE`、`MOMENT_TYPE_UNSPECIFIED`、`MOMENT_TYPE_EXTERNAL_LINK`）
- `MomentVisibility`（`Lvr/lg;`；`MOMENT_VISIBILITY_SELF`、`MOMENT_VISIBILITY_PUBLIC`、`MOMENT_VISIBILITY_UNSPECIFIED`）
- `MomentVoteAction`（`Lvr/tg;`；`MOMENT_VOTE_ACTION_DISLIKE`、`MOMENT_VOTE_ACTION_LIKE`、`MOMENT_VOTE_ACTION_CANCEL_LIKE`、`MOMENT_VOTE_ACTION_UNSPECIFIED`、`MOMENT_VOTE_ACTION_CANCEL_DISLIKE`）
- `MuteObjectType`（`Lur/h2;`；`MUTE_OBJECT_TYPE_BOT_COMMENT`、`MUTE_OBJECT_TYPE_MOMENT`、`MUTE_OBJECT_TYPE_UNSPECIFIED`、`MUTE_OBJECT_TYPE_AIGC_MOMENT_CONTENT`）
- `NotificationType`（`Lvq/h0;`；`NOTIFICATION_TYPE_MY_KIMI`、`NOTIFICATION_TYPE_TASK`、`NOTIFICATION_TYPE_UNSPECIFIED`、`NOTIFICATION_TYPE_SKILL`、`NOTIFICATION_TYPE_ACTIVITY`、`NOTIFICATION_TYPE_OPERATIONAL`、`NOTIFICATION_TYPE_CHAT_STATUS_CHANGED`）
- `NotificationType`（`Lvr/qh;`；`NOTIFICATION_TYPE_FAVORITE`、`NOTIFICATION_TYPE_FOLLOW`、`NOTIFICATION_TYPE_UNSPECIFIED`、`NOTIFICATION_TYPE_REPLY_COMMENT`、`NOTIFICATION_TYPE_UP_COMMENT`、`NOTIFICATION_TYPE_UP_MOMENT`、`NOTIFICATION_TYPE_COMMENT_MOMENT`）
- `Occupation`（`Lsr/j0;`；`OCCUPATION_PRODUCT_GENERAL`、`OCCUPATION_FREELANCE_OTHER`、`OCCUPATION_EDUCATION_RESEARCH`、`OCCUPATION_DESIGN_CONTENT`、`OCCUPATION_ENGINEER_DEVELOPER`、`OCCUPATION_LEGAL`、`OCCUPATION_MANUFACTURING_INDUSTRY`、`OCCUPATION_ECOMMERCE_GROWTH`、`OCCUPATION_UNSPECIFIED`、`OCCUPATION_STUDENT`、`OCCUPATION_FINANCE_INVESTMENT`、`OCCUPATION_HEALTHCARE`）
- `Operator`（`Lfq/s7;`；`OPERATOR_UNSPECIFIED`、`set`、`append`）
- `OutboxMessageStatus`（`Lup/q8;`；`OUTBOX_MESSAGE_STATUS_UNSPECIFIED`、`OUTBOX_MESSAGE_STATUS_READY`、`OUTBOX_MESSAGE_STATUS_EDITING`、`OUTBOX_MESSAGE_STATUS_SENDING`）
- `OutboxStatus`（`Lup/w8;`；`OUTBOX_STATUS_PAUSED`、`OUTBOX_STATUS_ACTIVE`、`OUTBOX_STATUS_UNSPECIFIED`）
- `Page`（`Llq/q;`；`PAGE_AGENT_SWARM`、`PAGE_UNSPECIFIED`、`PAGE_SLIDES`、`PAGE_SHEETS`、`PAGE_HOME`、`PAGE_DOCS`、`PAGE_WEBSITES`、`PAGE_DEEP_RESEARCH`）
- `PageLimit`（`Lrr/m;`；`PAGE_LIMIT_SMALL`、`PAGE_LIMIT_LARGE`、`PAGE_LIMIT_XXSMALL`、`PAGE_LIMIT_UNSPECIFIED`、`PAGE_LIMIT_XSMALL`、`PAGE_LIMIT_XLARGE`、`PAGE_LIMIT_MEDIUM`）
- `PaymentChannel`（`Lsp/k;`；`PAYMENT_CHANNEL_APPLE`、`PAYMENT_CHANNEL_STRIPE`、`PAYMENT_CHANNEL_ALIPAY`、`PAYMENT_CHANNEL_GOOGLE_PLAY`、`PAYMENT_CHANNEL_UNSPECIFIED`、`PAYMENT_CHANNEL_AIRWALLEX`、`PAYMENT_CHANNEL_PAYERMAX`、`PAYMENT_CHANNEL_WECHAT`）
- `PinResourceType`（`Lxq/r;`；`PIN_RESOURCE_TYPE_CHAT`、`PIN_RESOURCE_TYPE_UNSPECIFIED`、`PIN_RESOURCE_TYPE_PROJECT`）
- `Platform`（`Lpr/p;`；`PLATFORM_UNSPECIFIED`、`PLATFORM_ANDROID`、`PLATFORM_HARMONYOS`、`PLATFORM_WINDOWS`、`PLATFORM_MACOS`、`PLATFORM_LINUX`、`PLATFORM_IOS`）
- `Preset`（`Lyp/r;`；`PRESET_PROJECT`、`PRESET_ANALYSE`、`PRESET_UNSPECIFIED`、`PRESET_VISION`）
- `ProcessStatus`（`Lyp/z;`；`PROCESS_STATUS_UNSPECIFIED`、`PROCESS_STATUS_PENDING`、`PROCESS_STATUS_SUCCESS`、`PROCESS_STATUS_FAILED`、`PROCESS_STATUS_PROCESSING`）
- `ProjectAvailability`（`Lzq/v0;`；`PROJECT_AVAILABILITY_UNSPECIFIED`、`PROJECT_AVAILABILITY_AVAILABLE`、`PROJECT_AVAILABILITY_READ_ONLY`）
- `PublishState`（`Laq/h0;`；`PUBLISH_STATE_MODERATION_BLOCKED`、`PUBLISH_STATE_FAILED`、`PUBLISH_STATE_UNSPECIFIED`、`PUBLISH_STATE_PUBLISHING`、`PUBLISH_STATE_PUBLISHED`）
- `PushProvider`（`Lop/y0;`；`PUSH_PROVIDER_UNSPECIFIED`、`PUSH_PROVIDER_JPUSH`）
- `Reason`（`Lqp/m6;`；`REASON_ACCOUNT_INVALID_PARAMETER`、`REASON_WAITLIST_FULL`、`REASON_CODE_BETA_NOT_ENROLLED`、`REASON_CHATTY_AGENT_LOOP_OUTBOX_STEER`、`REASON_BUSINESS_NOT_FOUND`、`REASON_UPDATE_CHAT_FAILED`、`REASON_ACCOUNT_QRCODE_BUSY`、`REASON_ACCOUNT_DISABLED`、`REASON_UNSPECIFIED`、`REASON_APP_SUPPORT_UNSUPPORTED_QRCODE`、`REASON_GIFTCARD_CODE_NOT_FOUND`、`REASON_ACCOUNT_DEACTIVATE_TOO_FREQUENT`、`REASON_MEMORY_INTERNAL_ERROR`、`REASON_ACCOUNT_GOOGLE_ALREADY_BOUND`、`REASON_GIFTCARD_SELF_CLAIM`、`REASON_WORK_REMOTE_CONTROL_RECONNECT`、`REASON_MEMORY_SPACE_FULL`、`REASON_ACCOUNT_EMAIL_SEND_FAILED`、`REASON_GIFTCARD_CODE_EXPIRED`、`REASON_ACCOUNT_EMAIL_SAME_AS_OLD`、`REASON_SUBSCRIPTION_REGION_NOT_ALLOWED`、`REASON_WEBSITE_REPORT_INVALID_ATTACHMENT_FILE_ID`、`REASON_TOO_MANY_ACTIVE_TASKS`、`REASON_MEMORY_NOT_FOUND`、`REASON_BUSINESS_REGION_NOT_SUPPORTED`、`REASON_ACCOUNT_CAPTCHA_VERIFY_FAILED`、`REASON_SERVER_OVERLOADED`、`REASON_SKILL_SSH_CONNECT_FAILED`、`REASON_CODE_BETA_NO_ACTIVE_PLAN`、`REASON_SKILL_GENERATION_LIMIT_REACHED`、`REASON_SUBSCRIPTION_NEXT`、`REASON_SUBSCRIPTION_ACTIVE_ON_ANOTHER_ACCOUNT`、`REASON_DUPLICATED_ORDER`、`REASON_BUSINESS_ACCOUNT_NOT_FOUND`、`REASON_USER_SETTING_CHAT_NICKNAME_REJECTED`、`REASON_USER_BUSINESS_LIMIT_EXCEEDED`、`REASON_CHAT_NOT_FOUND`、`REASON_INTERNAL_ERROR`、`REASON_PAYMENT_CHANNEL_NOT_MATCH`、`REASON_BOOSTER_TOPUP_QUOTA_EXCEEDED`、`REASON_CODE_BETA_ACTIVATE_LIMITED`、`REASON_ACCOUNT_GUARDIAN_NOT_BOUND`、`REASON_ANONYMOUS_REQUIRE_LOGIN`、`REASON_SKILL_DIRECTORY_EXISTS`、`REASON_CHAT_IN_PROGRESS`、`REASON_ACCOUNT_DATABASE_ERROR`、`REASON_BUSINESS_FORBIDDEN`、`REASON_WAITLIST_ENDED`、`REASON_ACCOUNT_PHONE_SAME_AS_OLD`、`REASON_ACCOUNT_QRCODE_EXPIRED`、`REASON_CHATTY_AGENT_LOOP_FATAL_ERROR`、`REASON_BUSINESS_MEMBER_NOT_FOUND`、`REASON_SMS_REGION_NOT_SUPPORTED`、`REASON_WEBSITE_REPORT_INVALID_TARGET_URL`、`REASON_ACCOUNT_CODE_FREQUENCY_EXCEEDED`、`REASON_USER_SETTING_CHAT_NICKNAME_TOO_LONG`、`REASON_TEXT_USAGE_EXCEEDED`、`REASON_WEBSITE_REPORT_INVALID_REASON`、`REASON_CODE_BETA_ALREADY_JOINED`、`REASON_ACCOUNT_PHONE_NOT_BOUND`、`REASON_CLAW_GROUP_INVITATION_EXPIRED`、`REASON_ACCOUNT_WECHAT_ALREADY_REGISTERED`、`REASON_ACTIVITY_DAILY_BONUS_RECEIVED`、`REASON_API_KEY_REVOKED`、`REASON_GIFTCARD_CLAIM_EXPIRED`、`REASON_CHATTY_MODEL_OVERLOAD`、`REASON_FEATURE_NO_PERMISSION`、`REASON_HAS_OWNER_BUSINESS`、`REASON_CHATTY_AGENT_LOOP_INTERRUPTED`、`REASON_WEBSITE_REPORT_DESCRIPTION_REQUIRED`、`REASON_GIFTCARD_ALREADY_CLAIMED`、`REASON_BOOSTER_TOPUP_COUNT_EXCEEDED`、`REASON_SUBSCRIPTION_IN_PROCESSING`、`REASON_ACCOUNT_OAUTH_DEVICE_CODE_EXPIRED`、`REASON_WEBSITE_REPORT_TOO_MANY_REPORTS_FOR_TARGET`、`REASON_USER_SETTING_CHAT_INSTRUCTIONS_REJECTED`、`REASON_BOOSTER_TOPUP_BELOW_MINIMUM`、`REASON_WORK_REMOTE_CONTROL_GRACEFUL_SHUTDOWN`、`REASON_ACCOUNT_SUSPENDED`、`REASON_CHATTY_EXCEED_REACT_MAX_ROUNDS`、`REASON_ACCOUNT_MINOR_MODE_REGION_NOT_AVAILABLE`、`REASON_ACCOUNT_NOT_FOUND`、`REASON_API_KEY_NOT_FOUND`、`REASON_MCP_OAUTH_REQUIRED`、`REASON_BUSINESS_NAME_DUPLICATE`、`REASON_SKILL_NO_FILES`、`REASON_ACCOUNT_OAUTH_CLIENT_UNBIND_FAILED`、`REASON_CHATTY_MODEL_SSE_IDLE_TIMEOUT`、`REASON_USER_SETTING_CHAT_INSTRUCTIONS_TOO_LONG`、`REASON_SKILL_TASK_NOT_OWNED`、`REASON_KIMI_FILE_MODERATION_FAIL`、`REASON_SKILL_TASK_NOT_FOUND`、`REASON_PROJECT_NAME_REJECTED`、`REASON_ACCOUNT_PHONE_ALREADY_BOUND`、`REASON_ACCOUNT_QRCODE_INVALID`、`REASON_ACCOUNT_GUARDIAN_ALREADY_BOUND`、`REASON_SUBSCRIPTION_NEED_APPLY`、`REASON_QUOTA_EXCEEDED_WINDOW_7D`、`REASON_QUOTA_EXCEEDED_WINDOW_5H`、`REASON_QUOTA_EXCEEDED`、`REASON_INVALID_AUTH_TOKEN`、`REASON_BOOSTER_TOPUP_PRESET_EXCEEDS_AVAILABLE`、`REASON_DISCOUNT_URL_INVALID`、`REASON_ACCOUNT_ROLE_IN_USE`、`REASON_GIFTCARD_DIFFERENT_REGION`、`REASON_ACCOUNT_VERIFY_CODE_INVALID`、`REASON_CLAW_BOT_DISCONNECTED`、`REASON_SKILL_INSTALL_LIMIT_REACHED`、`REASON_QUOTA_EXCEEDED_CYCLE`、`REASON_CHATTY_MODEL_UNAVAILABLE`、`REASON_CHAT_SHARE_NOT_FOUND`、`REASON_SUBSCRIPTION_APP_STORE_REFUND_REQUIRED`、`REASON_CLAW_MAINTENANCE_IN_PROGRESS`、`REASON_BUSINESS_INVITATION_INVALID`、`REASON_ACCOUNT_THIRD_CREDENTIAL_INVALID`、`REASON_REQUEST_RATE_EXCEEDED`、`REASON_FEATURE_NOT_AVAILABLE`、`REASON_WAITLIST_NOT_FOUND`、`REASON_CHATTY_EXCEED_TOOL_LIMIT`、`REASON_ACCOUNT_OAUTH_DEVICE_CODE_INVALID`、`REASON_BUSINESS_MEMBER_REMOVED`、`REASON_ACCOUNT_PROFILE_INVALID`、`REASON_CHAT_WITH_IMAGE_RESTRICTED`、`REASON_WORK_REMOTE_CONTROL_PREEMPTED`、`REASON_ACCOUNT_GUARDIAN_PASSCODE_INCORRECT`、`REASON_ACCOUNT_SERVICE_MAINTENANCE`、`REASON_SHARE_NOT_ALLOWED`、`REASON_GIFTCARD_BUSINESS_MEMBER_FORBIDDENED`、`REASON_ACCOUNT_NICKNAME_LIMIT`、`REASON_CHATTY_EXCEED_MODEL_CONTEXT`、`REASON_SUBSCRIPTION_APPLYING`、`REASON_ACCOUNT_FORBIDDEN`、`REASON_GIFTCARD_TOO_MANY_CLAIM`、`REASON_WORK_REMOTE_CONTROL_REVOKED`、`REASON_OUTBOX_MESSAGE_NOT_FOUND`、`REASON_SERVER_OVERLOADED_FOR_FREE_USER`、`REASON_SKILL_EVO_MEMBERSHIP_REQUIRED`、`REASON_ACCOUNT_PHONE_ALREADY_REGISTERED`、`REASON_BUSINESS_DISABLED`、`REASON_ACCOUNT_EMAIL_CONFLICT`、`REASON_OUTBOX_FULL`、`REASON_ACCOUNT_APPLE_ALREADY_REGISTERED`、`REASON_SKILL_NAME_DUPLICATE`、`REASON_ACCOUNT_OAUTH_CLIENT_INVALID`、`REASON_CHATTY_CONTENT_FILTER`、`REASON_SUBSCRIPTION_ACTIVE`、`REASON_ACCOUNT_HUAWEI_ALREADY_REGISTERED`、`REASON_ACCOUNT_DEVICE_LOGGED_OUT`、`REASON_CHAT_CONCURRENCY_EXCEEDED`、`REASON_GIFTCARD_CLAIM_ACTIVATE_LEVEL_MISMATCH`、`REASON_PROJECT_PROMPT_REJECTED`、`REASON_SUBSCRIPTION_DISCOUNT_CONFLICT`、`REASON_KIMI_FILE_PARSE_JOB_FAIL`、`REASON_ACCOUNT_HUAWEI_ALREADY_BOUND`、`REASON_ACCOUNT_GOOGLE_ALREADY_REGISTERED`、`REASON_SUBSCRIPTION_CHANNEL_NOT_IN_GROUP`、`REASON_WORK_REMOTE_CONTROL_DISCONNECTED`、`REASON_ACCOUNT_GUARDIAN_PASSCODE_LOCKED`、`REASON_ACCOUNT_APPLE_ALREADY_BOUND`、`REASON_ACCOUNT_OAUTH_CLIENT_UNAUTHORIZED`、`REASON_SMS_LIMIT_EXCEEDED`、`REASON_RATE_LIMIT_EXCEEDED`、`REASON_API_KEY_LIMIT_EXCEEDED`、`REASON_ACCOUNT_EMAIL_NOT_BOUND`、`REASON_ACCOUNT_PHONE_REGION_LIMIT`、`REASON_INVALID_PARAMETER`、`REASON_SKILL_NOT_READY`、`REASON_SKILL_NOT_FOUND`、`REASON_SKILL_REMOTE_INSTALL_FAILED`、`REASON_ACCOUNT_GUARDIAN_NOT_VERIFIED`、`REASON_CLAW_GROUP_DISBANDED`、`REASON_OUTBOX_MESSAGE_CONFLICT`、`REASON_SKILL_CONTENT_REJECTED`、`REASON_CODE_BETA_EMAIL_ALREADY_TAKEN`、`REASON_SKILL_TASK_NOT_RETRYABLE`、`REASON_WEBSITE_REPORT_TOO_MANY_ATTACHMENTS`、`REASON_BUSINESS_MEMBER_LIMIT_EXCEEDED`、`REASON_PROJECT_NOT_FOUND`、`REASON_ACCOUNT_BANNED`、`REASON_ACCOUNT_EMAIL_NOT_VERIFIED`、`REASON_SUBSCRIPTION_QUOTA_EXCEEDED`、`REASON_ACCOUNT_ACCESS_DENIED`、`REASON_ACCOUNT_WECHAT_ALREADY_BOUND`、`REASON_ACTIVITY_NO_BONUS_AVAILABLE`、`REASON_TOO_MANY_TASKS`、`REASON_ACCOUNT_PHONE_INVALID`、`REASON_CHAT_MESSAGE_NOT_FOUND`、`REASON_QUOTA_EXCEEDED_BALANCE`、`REASON_ACCOUNT_GUARDIAN_PASSCODE_NOT_SET`）
- `Reason`（`Lup/da;`；`REASON_UNSPECIFIED`、`REASON_CHAT_INTERRUPTED`、`REASON_RESEARCH_TASK_CONCURRENT_LIMIT`、`REASON_TOKEN_LENGTH_TOO_LONG`、`REASON_TEXT_USAGE_EXCEEDED`、`REASON_K2_USAGE_EXCEEDED`、`REASON_ABNORMAL_USER_USAGE_EXCEEDED`、`REASON_ANONYMOUS_USAGE_EXCEEDED`、`REASON_EXCEED_TOOL_CALL_MAX_ROUNDS`、`REASON_DEEP_RESEARCH_USAGE_EXCEEDED`、`REASON_REQUEST_RATE_EXCEEDED`、`REASON_REQUEST_ERROR`、`REASON_INCONSISTENT_FILE_TYPE`、`REASON_COMPLETION_OVERLOADED`、`REASON_THINK_USAGE_EXCEEDED`、`REASON_RATE_LIMIT_EXCEEDED`、`REASON_LLM_UNAVAILABLE`、`REASON_ABNORMAL_USER_SURVEY_REQUIRED`、`REASON_CONTENT_FILTER`、`REASON_CHAT_FATAL_ERROR`）
- `ReasoningEffort`（`Lwp/e0;`；`REASONING_EFFORT_MEDIUM`、`REASONING_EFFORT_UNSPECIFIED`、`REASONING_EFFORT_MAX`、`REASONING_EFFORT_LOW`、`REASONING_EFFORT_XHIGH`、`REASONING_EFFORT_MINIMAL`、`REASONING_EFFORT_NONE`、`REASONING_EFFORT_HIGH`）
- `Region`（`Lwr/v0;`；`REGION_OVERSEA`、`REGION_UNSPECIFIED`、`REGION_CN`）
- `ReminderType`（`Lur/u2;`；`REMINDER_TYPE_NEW_ENGAGEMENT`、`REMINDER_TYPE_NEW_FOLLOW_FEED`、`REMINDER_TYPE_UNSPECIFIED`）
- `RoomType`（`Lpq/n5;`；`ROOM_TYPE_DIRECT`、`ROOM_TYPE_UNSPECIFIED`、`ROOM_TYPE_GROUP`）
- `Scenario`（`Lup/gc;`；`SCENARIO_SLIDES`、`SCENARIO_K2D5`、`SCENARIO_CHAT`、`SCENARIO_BOT`、`SCENARIO_THINK`、`SCENARIO_KODER`、`SCENARIO_PROBLEM_SOLVE`、`SCENARIO_KIMI_PLUS`、`SCENARIO_OK_COMPUTER`、`SCENARIO_K3`、`SCENARIO_K2`、`SCENARIO_AUTOMATION_K3`、`SCENARIO_DEEP_RESEARCH`、`SCENARIO_SKILLCREATOR`、`SCENARIO_OK_COMPUTER_SWARM`、`SCENARIO_AUTOMATION`、`SCENARIO_UNSPECIFIED`）
- `Scene`（`Lhq/e0;`；`SCENE_UNSPECIFIED`、`SCENE_SMS_CODE_SEND`）
- `Scene`（`Lhq/n;`；`SCENE_UNSPECIFIED`、`SCENE_KIMI_WORK`）
- `Scene`（`Lop/b2;`；`SCENE_UNSPECIFIED`、`SCENE_BIND_PHONE`、`SCENE_LOGIN`）
- `Service`（`Lqq/o;`；`SERVICE_UNSPECIFIED`、`SERVICE_ASR`）
- `Severity`（`Lup/gd;`；`SEVERITY_BLOCK_RETRACT`、`SEVERITY_INFO`、`SEVERITY_UNSPECIFIED`、`SEVERITY_MESSAGE_RETRACT`）
- `ShowRule`（`Lar/w;`；`SHOW_RULE_DAILY`、`SHOW_RULE_ONCE`、`SHOW_RULE_ALWAYS`、`SHOW_RULE_UNSPECIFIED`）
- `Size`（`Lgr/y1;`；`SIZE_UNSPECIFIED`、`SIZE_SMALL`、`SIZE_LARGE`）
- `SkillJobStatus`（`Lcr/j2;`；`SKILL_JOB_STATUS_UNSPECIFIED`、`SKILL_JOB_STATUS_COMPLETED`、`SKILL_JOB_STATUS_CREATING`、`SKILL_JOB_STATUS_FAILED`）
- `SkillJobType`（`Lcr/p2;`；`SKILL_JOB_TYPE_UNSPECIFIED`、`SKILL_JOB_TYPE_CLAW_SKILL`、`SKILL_JOB_TYPE_KIMI_SKILL`）
- `Source`（`Lcr/c3;`；`SOURCE_OFFICIAL`、`SOURCE_CUSTOM`、`SOURCE_UNSPECIFIED`）
- `Source`（`Lup/a5;`；`SOURCE_SEARCH`、`SOURCE_GEN`、`SOURCE_UNSPECIFIED`）
- `StageName`（`Lvp/w1;`；`STAGE_NAME_PART_REPORT`、`STAGE_NAME_CLARIFY`、`STAGE_NAME_UNSPECIFIED`、`STAGE_NAME_OKC_REACT`、`STAGE_NAME_THINKING`、`STAGE_NAME_FINAL_REPORT`、`STAGE_NAME_REPORT`、`STAGE_NAME_OUTLINE`、`STAGE_NAME_HTML_REPORT`、`STAGE_NAME_SUMMARY`、`STAGE_NAME_RESEARCH`）
- `StageStatus`（`Lup/fe;`；`STAGE_STATUS_START`、`STAGE_STATUS_UNSPECIFIED`、`STAGE_STATUS_END`）
- `State`（`Llr/j;`；`STATE_UNSPECIFIED`、`STATE_PENDING`、`STATE_EXPIRED`、`STATE_DENIED`、`STATE_APPROVED`）
- `State`（`Lup/j5;`；`STATE_UNSPECIFIED`、`STATE_FAILURE`、`STATE_INIT`、`STATE_SUCCESS`、`STATE_GENERATION`、`STATE_CANCELLATION`）
- `Status`（`Ldq/i;`；`STATUS_UNSPECIFIED`、`STATUS_DISABLED`、`STATUS_ACTIVE`、`STATUS_INITIAL`）
- `Status`（`Leq/c0;`；`STATUS_UNSPECIFIED`、`STATUS_GENERATING`、`STATUS_USAGE_EXCEEDED`、`STATUS_USER_CANCELED`、`STATUS_COMPLETED`、`STATUS_FAILED`、`STATUS_OVERLOADED`、`STATUS_ASK_USER_QUESTION`）
- `Status`（`Lgq/l;`；`STATUS_CREATED`、`STATUS_UNSPECIFIED`、`STATUS_INACTIVE`、`STATUS_SUSPENDED`、`STATUS_ACTIVE`、`STATUS_CREATE_FAILED`、`STATUS_CREATING`）
- `Status`（`Lgq/l0;`；`STATUS_UNSPECIFIED`、`STATUS_FAILED`、`STATUS_SUCCEEDED`、`STATUS_RUNNING`）
- `Status`（`Lhr/z;`；`STATUS_IDLE`、`STATUS_UNSPECIFIED`、`STATUS_PENDING`、`STATUS_TERMINATED`、`STATUS_RUNNING`）
- `Status`（`Liq/s;`；`STATUS_UNSPECIFIED`、`STATUS_BLOCKED`、`STATUS_COMPLETED`、`STATUS_PAUSED`、`STATUS_TERMINATED`、`STATUS_ACTIVE`、`STATUS_DELETED`）
- `Status`（`Lnr/p;`；`STATUS_SELLABLE`、`STATUS_UNSPECIFIED`、`STATUS_UNSELLABLE`）
- `Status`（`Lpq/w;`；`STATUS_UNSPECIFIED`、`STATUS_GENERATING`、`STATUS_COMPLETED`）
- `Status`（`Lrr/d0;`；`STATUS_GENERATED`、`STATUS_INIT`、`STATUS_UNSPECIFIED`、`STATUS_GENERATING`、`STATUS_GENERATE_FAILED`、`STATUS_COMPLETED`、`STATUS_FAILED`、`STATUS_DELETED`）
- `Status`（`Lsq/q3;`；`STATUS_UNSPECIFIED`、`STATUS_DISABLED`、`STATUS_FROZEN`、`STATUS_ACTIVE`）
- `Status`（`Lup/j3;`；`STATUS_DONE`、`STATUS_UNSPECIFIED`、`STATUS_PENDING`）
- `Status`（`Lup/bi;`；`STATUS_WAITING`、`STATUS_UNSPECIFIED`、`STATUS_PARSING`、`STATUS_PARSED`、`STATUS_TIMEOUT`、`STATUS_FAILED`）
- `Status`（`Lup/ag;`；`STATUS_DONE`、`STATUS_UNSPECIFIED`、`STATUS_PENDING`、`STATUS_RUNNING`）
- `Status`（`Lup/d2;`；`STATUS_DONE`、`STATUS_UNSPECIFIED`、`STATUS_PENDING`、`STATUS_FAILED`、`STATUS_RUNNING`）
- `SubscriptionAction`（`Lnr/k1;`；`SUBSCRIPTION_ACTION_UNSPECIFIED`、`SUBSCRIPTION_ACTION_RESUME`、`SUBSCRIPTION_ACTION_DOWNGRADE`、`SUBSCRIPTION_ACTION_CREATE`、`SUBSCRIPTION_ACTION_UPGRADE`）
- `SubscriptionStatus`（`Lnr/v1;`；`SUBSCRIPTION_STATUS_UNPAID`、`SUBSCRIPTION_STATUS_CANCEL`、`SUBSCRIPTION_STATUS_ACTIVE`、`SUBSCRIPTION_STATUS_STOP`、`SUBSCRIPTION_STATUS_SUBSCRIPTION_REGION_NOT_ALLOWED`、`SUBSCRIPTION_STATUS_PRE_PAID`、`SUBSCRIPTION_STATUS_DISCARD`、`SUBSCRIPTION_STATUS_UNSPECIFIED`）
- `SyncStatus`（`Lgq/f5;`；`SYNC_STATUS_UPDATE_AVAILABLE`、`SYNC_STATUS_UNSPECIFIED`、`SYNC_STATUS_NOT_SYNCED`、`SYNC_STATUS_SYNCED`）
- `SynthesisStatus`（`Lfq/t6;`；`SYNTHESIS_STATUS_FAIL`、`SYNTHESIS_STATUS_SUCCESS`、`SYNTHESIS_STATUS_UNSPECIFIED`）
- `TaskExecutionStatus`（`Lir/i1;`；`TASK_EXECUTION_STATUS_PENDING`、`TASK_EXECUTION_STATUS_UNSPECIFIED`、`TASK_EXECUTION_STATUS_FAILED`、`TASK_EXECUTION_STATUS_SUCCESS`、`TASK_EXECUTION_STATUS_RUNNING`）
- `TaskStatus`（`Lir/t1;`；`TASK_STATUS_PAUSED`、`TASK_STATUS_DONE`、`TASK_STATUS_ACTIVE`、`TASK_STATUS_UNSPECIFIED`、`TASK_STATUS_DELETED`）
- `TaskType`（`Lir/z1;`；`TASK_TYPE_UNSPECIFIED`、`TASK_TYPE_ONCE`、`TASK_TYPE_CRON`）
- `TaskbarType`（`Lxp/q4;`；`TASKBAR_TYPE_SNIPPET`、`TASKBAR_TYPE_WEBSITES`、`TASKBAR_TYPE_OK_COMPUTER`、`TASKBAR_TYPE_KIMI_CLAW`、`TASKBAR_TYPE_IMAGE_GEN`、`TASKBAR_TYPE_DEEP_RESEARCH`、`TASKBAR_TYPE_WRITING`、`TASKBAR_TYPE_UNSPECIFIED`、`TASKBAR_TYPE_SLIDES`、`TASKBAR_TYPE_SHEETS`、`TASKBAR_TYPE_PHOTO_SOLVE`、`TASKBAR_TYPE_PROJECT`、`TASKBAR_TYPE_KIMI_SWARM`、`TASKBAR_TYPE_DESIGN`、`TASKBAR_TYPE_DOCS`、`TASKBAR_TYPE_CALL`、`TASKBAR_TYPE_TRANSLATE`、`TASKBAR_TYPE_DEEPLINK`）
- `TemplateType`（`Lrr/j0;`；`TEMPLATE_TYPE_PPTX`、`TEMPLATE_TYPE_HTML`、`TEMPLATE_TYPE_UNSPECIFIED`）
- `TemplateType`（`Ltr/f;`；`TEMPLATE_TYPE_STATIC`、`TEMPLATE_TYPE_FULLSTACK`、`TEMPLATE_TYPE_UNSPECIFIED`）
- `TextType`（`Lvr/uk;`；`TEXT_TYPE_PLAIN_TEXT`、`TEXT_TYPE_UNSPECIFIED`、`TEXT_TYPE_MARKDOWN`）
- `Theme`（`Lfr/i;`；`THEME_UNSPECIFIED`、`THEME_DARK`、`THEME_LIGHT`）
- `Theme`（`Lgr/h2;`；`THEME_UNSPECIFIED`、`THEME_DARK`、`THEME_LIGHT`）
- `ThirdParty`（`Lop/r2;`；`THIRD_PARTY_EMAIL`、`THIRD_PARTY_APPLE`、`THIRD_PARTY_WECHAT`、`THIRD_PARTY_HUAWEI`、`THIRD_PARTY_GOOGLE`、`THIRD_PARTY_UNSPECIFIED`）
- `TimeUnit`（`Lnr/h2;`；`TIME_UNIT_DAY`、`TIME_UNIT_MINUTE`、`TIME_UNIT_UNSPECIFIED`、`TIME_UNIT_MONTH`、`TIME_UNIT_YEAR`、`TIME_UNIT_WEEK`）
- `ToolErrorCode`（`Lqp/b7;`；`TOOL_ERROR_CODE_RESOURCE_NOT_FOUND`、`TOOL_ERROR_CODE_UNSPECIFIED`、`TOOL_ERROR_CODE_QUOTA_EXCEEDED`、`TOOL_ERROR_CODE_RESOURCE_EXHAUSTED`、`TOOL_ERROR_CODE_UNKNOWN`、`TOOL_ERROR_CODE_AUDIT_REJECTED`、`TOOL_ERROR_CODE_PERMISSION_DENIED`、`TOOL_ERROR_CODE_INVALID_ARGUMENTS`、`TOOL_ERROR_CODE_TOOL_NOT_FOUND`、`TOOL_ERROR_CODE_INTERNAL`、`TOOL_ERROR_CODE_CANCELLED`、`TOOL_ERROR_CODE_TIMEOUT`）
- `ToolMemoryAction`（`Lvp/g2;`；`TOOL_MEMORY_ACTION_UNSPECIFIED`、`TOOL_MEMORY_ACTION_UPDATE`、`TOOL_MEMORY_ACTION_DELETE`、`TOOL_MEMORY_ACTION_CREATE`）
- `ToolType`（`Lwp/v0;`；`TOOL_TYPE_DEVICE_TOOL`、`TOOL_TYPE_UNSPECIFIED`、`TOOL_TYPE_SEARCH`、`TOOL_TYPE_IMAGE_GENERATION`、`TOOL_TYPE_BANANA`、`TOOL_TYPE_PARALLEL_AGENT`、`TOOL_TYPE_SLIDES_OUTLINE`、`TOOL_TYPE_DEVICE_LBS`、`TOOL_TYPE_AUDIO_GENERATION`、`TOOL_TYPE_SEMANTIC_MEMORY`、`TOOL_TYPE_ASK_USER`、`TOOL_TYPE_GOAL`、`TOOL_TYPE_PARALLEL_AGENT_V2`、`TOOL_TYPE_CRON_JOB`）
- `TranslateStyle`（`Lxp/f5;`；`TRANSLATE_STYLE_UNSPECIFIED`、`TRANSLATE_STYLE_SIMPLE`、`TRANSLATE_STYLE_COMPLEX`）
- `Type`（`Lfq/l7;`；`TYPE_ROUTE_TO_SHEET`、`TYPE_ROUTE_TO_AGENT`、`TYPE_ROUTE_TO_WEBSITE`、`TYPE_REWARD`、`TYPE_ROUTE_TO_SLIDES`、`TYPE_UPGRADE`、`TYPE_UNSPECIFIED`、`TYPE_ROUTE_TO_DEEP_RESEARCH`、`TYPE_UPGRADE_K2_THINKING`、`TYPE_ROUTE_TO_DOC`、`TYPE_MODEL_DEGRADE`、`TYPE_UPGRADE_K2_TURBO`）
- `Type`（`Lgr/i;`；`TYPE_SCENARIO`、`TYPE_CUSTOM`、`TYPE_UNSPECIFIED`、`TYPE_LINK`）
- `Type`（`Lgr/p2;`；`TYPE_STRONG`、`TYPE_UNSPECIFIED`、`TYPE_ONBOARDING`、`TYPE_WEAK`）
- `Type`（`Lnr/b1;`；`TYPE_UNSPECIFIED`、`TYPE_EVENT`、`TYPE_PURCHASE`、`TYPE_ENTERPRISE`、`TYPE_INTERNAL`）
- `Type`（`Lpq/n;`；`TYPE_UNSPECIFIED`、`TYPE_NEW_CHAT`、`TYPE_READ`、`TYPE_DELETED`、`TYPE_TITLE_UPDATED`）
- `Type`（`Lpq/l4;`；`TYPE_UNSPECIFIED`、`TYPE_ALL_CHATS_READ`）
- `Type`（`Lrr/w0;`；`TYPE_AGENTIC_HTML`、`TYPE_PPTD_X4`、`TYPE_DESIGN`、`TYPE_BANANA_PPT`、`TYPE_UNSPECIFIED`、`TYPE_OKC_PPT`、`TYPE_AGENTIC_BANANA`、`TYPE_PPTD`、`TYPE_JSON`、`TYPE_HTML`）
- `Type`（`Lup/ta;`；`TYPE_ARTICLE`、`TYPE_UNSPECIFIED`、`TYPE_IMAGE`、`TYPE_IM_MENTION`、`TYPE_FILE`、`TYPE_CITE`、`TYPE_INVALID`、`TYPE_EXTENSION`）
- `Type`（`Lup/y5;`；`TYPE_NORMAL`、`TYPE_UNSPECIFIED`、`TYPE_ULTRA`）
- `Type`（`Lup/f8;`；`TYPE_UPDATED`、`TYPE_UNSPECIFIED`、`TYPE_DELETED`、`TYPE_REORDERED`、`TYPE_CREATED`、`TYPE_STATUS_CHANGED`、`TYPE_CLEARED`）
- `TypingStatus`（`Lpq/g7;`；`TYPING_STATUS_THINK`、`TYPING_STATUS_UNSPECIFIED`、`TYPING_STATUS_TOOL`、`TYPING_STATUS_TEXT`）
- `Unit`（`Lsq/h3;`；`UNIT_CURRENCY`、`UNIT_CREDIT`、`UNIT_UNSPECIFIED`、`UNIT_COUNT`）
- `UpgradeStrategy`（`Lxp/s5;`；`UPGRADE_STRATEGY_UNSPECIFIED`、`UPGRADE_STRATEGY_NORMAL`、`UPGRADE_STRATEGY_MANUAL`、`UPGRADE_STRATEGY_FORCE`）
- `UserProfileView`（`Lvr/nl;`；`USER_PROFILE_VIEW_LITE`、`USER_PROFILE_VIEW_FULL`、`USER_PROFILE_VIEW_BASIC`、`USER_PROFILE_VIEW_UNSPECIFIED`）
- `VaultLinkKind`（`Lmr/u;`；`VAULT_LINK_KIND_EMBED`、`VAULT_LINK_KIND_TAG`、`VAULT_LINK_KIND_MARKDOWN_LINK`、`VAULT_LINK_KIND_WIKILINK`、`VAULT_LINK_KIND_CITATION`、`VAULT_LINK_KIND_UNSPECIFIED`）
- `VaultTargetType`（`Lmr/g0;`；`VAULT_TARGET_TYPE_FILE`、`VAULT_TARGET_TYPE_SECTION`、`VAULT_TARGET_TYPE_UNSPECIFIED`、`VAULT_TARGET_TYPE_HEADING`、`VAULT_TARGET_TYPE_BLOCK`、`VAULT_TARGET_TYPE_SOURCE`、`VAULT_TARGET_TYPE_ENTITY`、`VAULT_TARGET_TYPE_TAG`、`VAULT_TARGET_TYPE_UNRESOLVED`）
- `VerifyCodeScene`（`Lzp/k3;`；`VERIFY_CODE_SCENE_REBIND_PHONE`、`VERIFY_CODE_SCENE_UNSPECIFIED`、`VERIFY_CODE_SCENE_GUARDIAN_UNBIND`、`VERIFY_CODE_SCENE_GUARDIAN_RESET`、`VERIFY_CODE_SCENE_GUARDIAN_BIND`、`VERIFY_CODE_SCENE_BIND_PHONE`、`VERIFY_CODE_SCENE_DEACTIVATE_ACCOUNT`、`VERIFY_CODE_SCENE_VERIFY_CURRENT_PHONE`）
- `Vote`（`Lup/m0;`；`VOTE_UP`、`VOTE_UNSPECIFIED`、`VOTE_DOWN`）
- `WebsiteSlugReason`（`Lkr/k0;`；`WEBSITE_SLUG_REASON_ALREADY_TAKEN`、`WEBSITE_SLUG_REASON_TOO_SHORT`、`WEBSITE_SLUG_REASON_CONFLICT`、`WEBSITE_SLUG_REASON_TOO_LONG`、`WEBSITE_SLUG_REASON_UNSPECIFIED`、`WEBSITE_SLUG_REASON_RESERVED_SHORTID_NAMESPACE`、`WEBSITE_SLUG_REASON_OK`、`WEBSITE_SLUG_REASON_INVALID_FORMAT`、`WEBSITE_SLUG_REASON_SENSITIVE_CONTENT`、`WEBSITE_SLUG_REASON_ALL_NUMERIC`、`WEBSITE_SLUG_REASON_STARTS_OR_ENDS_WITH_HYPHEN`、`WEBSITE_SLUG_REASON_MODERATION_UNAVAILABLE`、`WEBSITE_SLUG_REASON_RESERVED_WORD`）
- `WebsiteSlugTargetType`（`Lkr/r0;`；`WEBSITE_SLUG_TARGET_TYPE_FULLSTACK`、`WEBSITE_SLUG_TARGET_TYPE_STATIC`、`WEBSITE_SLUG_TARGET_TYPE_UNSPECIFIED`）
- `Workflow`（`Lvp/u3;`；`WORKFLOW_GROWTH_DIARY`、`WORKFLOW_AGENT_TASK`、`WORKFLOW_VISION`、`WORKFLOW_SLIDES`、`WORKFLOW_K1_5_THINKING`、`WORKFLOW_OK_COMPUTER`、`WORKFLOW_SKILLCREATOR`、`WORKFLOW_PROBLEM_SOLVE`、`WORKFLOW_KIMI_PROBLEM_SOLVE_WIKI`、`WORKFLOW_SUBAGENT`、`WORKFLOW_SKILLEVO`、`WORKFLOW_VIBE_CODING_FULLSTACK`、`WORKFLOW_AI_OFFICE_SHEETS`、`WORKFLOW_KIMI_CLAW_COORDINATOR`、`WORKFLOW_VIBE_CODING_WEBSITES`、`WORKFLOW_SLIDES_X4_BANANA`、`WORKFLOW_KIMI_ACTIVITIES`、`WORKFLOW_K2D5`、`WORKFLOW_ALPHA_LAB`、`WORKFLOW_KIMI_CHAT`、`WORKFLOW_KODER`、`WORKFLOW_DREAM`、`WORKFLOW_SLIDES_X4`、`WORKFLOW_BOT`、`WORKFLOW_K3`、`WORKFLOW_K2`、`WORKFLOW_OSS_COMPLETION`、`WORKFLOW_UNSPECIFIED`、`WORKFLOW_X5S_COMPLETION`、`WORKFLOW_COMPACT_MEMORY`、`WORKFLOW_DEEP_RESEARCH`、`WORKFLOW_K2_THINKING`、`WORKFLOW_AI_OFFICE_DOCS`、`WORKFLOW_KIMIPLUS`）
- `WritingOptionType`（`Lxp/m6;`；`WRITING_OPTION_TYPE_INTERVAL`、`WRITING_OPTION_TYPE_PERSPECTIVE`、`WRITING_OPTION_TYPE_TONE`、`WRITING_OPTION_TYPE_EDUCATION_LEVEL`、`WRITING_OPTION_TYPE_LENGTH`、`WRITING_OPTION_TYPE_WORD_COUNT`、`WRITING_OPTION_TYPE_LANGUAGE`、`WRITING_OPTION_TYPE_UNSPECIFIED`、`WRITING_OPTION_TYPE_GENRE`、`WRITING_OPTION_TYPE_PLATFORM`、`WRITING_OPTION_TYPE_STORY_CATEGORY`）

### 附录 C：流式 RPC 事件帧结构拆解

#### C.1 Connect 流式分帧

传输：HTTP POST，`Content-Type: application/connect+json`，响应为 chunked 流。

每帧遵循 Connect 信封：`[1B flags][4B length(BE)][payload]`。实测：普通数据帧 `flags=0x02`、payload 为 **明文 JSON（未压缩）**；bit0(`0x01`) 置位表示 End-of-Stream。

payload 为 UTF-8 JSON，即一个 `ChatResponse` 对象。

客户端按帧读取，用 `op` 判断覆盖/追加，用 `eventOffset` 排序去重。

#### C.2 事件信封 ChatResponse

流式响应为 **Connect 流帧序列**：每帧负载是一个 `ChatResponse`（proto JSON）。其字段即事件类型：

| 事件字段 | 类型 | 语义 |
| --- | --- | --- |
| `op` | enum `Operator` 取值：`OPERATOR_UNSPECIFIED`、`append`、`set` | 帧操作符（枚举 `Operator`：`SET` / `APPEND`），决定本帧是覆盖还是追加 |
| `mask` | string | 字段掩码（字符串），标记本帧实际携带了哪些字段 |
| `eventOffset` | int32 | 事件序号（int32），流内单调递增，用于断线续传定位 |
| `chat` | message `Chat` | 会话元信息变更事件（`Chat`） |
| `message` | message `ChatMessage` | 消息事件（`ChatMessage`）：一条新消息或消息状态更新 |
| `block` | message `Block` | 内容块事件（`Block`）：文本/搜索/思考/工具/产物等增量块 |
| `ref` | message `Ref` | 引用事件（`Ref`）：检索/联网/文件引用 |
| `usage` | message `Usage` | 用量事件（`Usage`）：token / 额度消耗 |
| `notification` | message `Notification` | 通知事件（`Notification`）：付费墙 / 提示条 |
| `done` | message `Done` | 结束事件（`Done`，空消息）：本轮流式结束 |
| `heartbeat` | message `Heartbeat` | 心跳事件（`Heartbeat`，空消息）：保活 |
| `tts` | message `MessageSpeechResponse` | 语音合成事件（`MessageSpeechResponse`）：音频分片 |
| `interaction` | message `Interaction` | 交互事件（`Interaction`）：需要用户回答/确认 |
| `interactionAck` | message `InteractionAck` | 交互确认事件（`InteractionAck`） |

#### C.3 事件负载结构

- `chat` → `Chat`
**字段名(JSON key) · 类型**

- `id`（string）
- `name`（string）
- `messageContent`（string）
- `kimiPlus`（message `KimiPlus`）
- `projectId`（string）
- `project`（message `Project`）
- `pinned`（bool）
- `lastRequest`（message `LastRequestContext`）
- `createTime`（string）
- `updateTime`（string）
- `source`（message `ChatSource`）
- `status`（enum `Status` 取值：`STATUS_UNSPECIFIED`、`STATUS_ASK_USER_QUESTION`、`STATUS_COMPLETED`、`STATUS_FAILED`、`STATUS_GENERATING`、`STATUS_OVERLOADED`、`STATUS_USAGE_EXCEEDED`、`STATUS_USER_CANCELED`）
- `statusText`（string）
- `goal`（message `Goal`）
- `model`（string）
- `labels`（repeated）
- `labelsValue`（repeated）
- `files`（repeated）

- `message` → `ChatMessage`
**字段名(JSON key) · 类型**

- `id`（string）
- `parentId`（string）
- `role`（enum `Lup/ib;` 取值：`ROLE_UNSPECIFIED`、`assistant`、`system`、`user`）
- `status`（enum `MessageStatus` 取值：`MESSAGE_STATUS_UNSPECIFIED`、`MESSAGE_STATUS_CANCELLED`、`MESSAGE_STATUS_COMPLETED`、`MESSAGE_STATUS_ERROR`、`MESSAGE_STATUS_GENERATING`、`MESSAGE_STATUS_PENDING`、`MESSAGE_STATUS_TRUNCATED`）
- `refs`（message `Refs`）
- `scenario`（enum `Scenario` 取值：`SCENARIO_UNSPECIFIED`、`SCENARIO_AUTOMATION`、`SCENARIO_AUTOMATION_K3`、`SCENARIO_BOT`、`SCENARIO_CHAT`、`SCENARIO_DEEP_RESEARCH`、`SCENARIO_K2`、`SCENARIO_K2D5`、`SCENARIO_K3`、`SCENARIO_KIMI_PLUS`、`SCENARIO_KODER`、`SCENARIO_OK_COMPUTER`、`SCENARIO_OK_COMPUTER_SWARM`、`SCENARIO_PROBLEM_SOLVE`、`SCENARIO_SKILLCREATOR`、`SCENARIO_SLIDES`、`SCENARIO_THINK`）
- `kimiPlus`（message `KimiPlusBrief`）
- `vote`（enum `Vote` 取值：`VOTE_UNSPECIFIED`、`VOTE_DOWN`、`VOTE_UP`）
- `error`（message `Error`）
- `createTime`（string）
- `isGoal`（bool）
- `childrenMessageIds`（repeated）
- `blocks`（repeated）
- `references`（repeated）
- `labels`（repeated）
- `labelsValue`（repeated）

- `block` → `Block`
| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |
| `parentId` | string |
| `messageId` | string |
| `text` | message `TextBlock` |
| `search` | message `SearchBlock` |
| `file` | message `File` |
| `think` | message `ThinkBlock` |
| `exception` | message `ExceptionBlock` |
| `memory` | message `MemoryBlock` |
| `contractReview` | message `ContractReviewBlock` |
| `tool` | message `ToolBlock` |
| `artifact` | message `ArtifactBlock` |
| `slidesView` | message `SlidesViewBlock` |
| `stage` | message `StageBlock` |
| `multiStage` | message `MultiStageBlock` |
| `elemeMenuCard` | message `ElemeMenuCardBlock` |
| `elemeOrderCard` | message `ElemeOrderCardBlock` |
| `videoCards` | message `VideoCardsBlock` |
| `visualEdit` | message `VisualEditBlock` |
| `websitesTemplate` | message `WebsitesTemplateBlock` |
| `slidesAnnotation` | message `SlidesAnnotationBlock` |
| `explorerResearch` | message `ExplorerResearchBlock` |
| `explorerResearchReanswer` | message `ExplorerResearchReanswerBlock` |
| `aippt` | message `AIPPTBlock` |
| `contentViewZhidemaiCard` | message `ContentViewZhidemaiBlock` |
| `resourceLink` | message `ResourceLink` |
| `imRoomSystem` | message `IMRoomSystemBlock` |
| `agentMessage` | message `AgentMessageBlock` |
| `error` | message `Error` |
| `createTime` | string |

- `ref` → `Ref`
| 字段名(JSON key) | 类型 |
| --- | --- |
| `id` | string |
| `messageId` | string |
| `search` | message `SearchChunkBrief` |
| `image` | message `ImageItem` |
| `url` | message `URLRef` |
| `product` | message `ProductRef` |
| `sandboxFile` | message `SandboxFileRef` |

- `usage` → `Usage`
| 字段名(JSON key) | 类型 |
| --- | --- |
| `research` | message `Research` |

- `notification` → `Notification`
**字段名(JSON key) · 类型**

- `type`（enum `Type` 取值：`TYPE_UNSPECIFIED`、`TYPE_MODEL_DEGRADE`、`TYPE_REWARD`、`TYPE_ROUTE_TO_AGENT`、`TYPE_ROUTE_TO_DEEP_RESEARCH`、`TYPE_ROUTE_TO_DOC`、`TYPE_ROUTE_TO_SHEET`、`TYPE_ROUTE_TO_SLIDES`、`TYPE_ROUTE_TO_WEBSITE`、`TYPE_UPGRADE`、`TYPE_UPGRADE_K2_THINKING`、`TYPE_UPGRADE_K2_TURBO`）
- `message`（string）
- `paywall`（message `PaywallAction`）

- `tts` → `MessageSpeechResponse`
| 字段名(JSON key) | 类型 |
| --- | --- |
| `sequenceId` | int32 |
| `synthesisStatus` | enum `SynthesisStatus` 取值：`SYNTHESIS_STATUS_UNSPECIFIED`、`SYNTHESIS_STATUS_FAIL`、`SYNTHESIS_STATUS_SUCCESS` |
| `audioUrl` | string |
| `rawText` | message `RawText` |

- `interaction` → `Interaction`
**字段名(JSON key) · 类型**

- `id`（string）
- `type`（enum `InteractionType` 取值：`INTERACTION_TYPE_UNSPECIFIED`、`INTERACTION_TYPE_GENERIC_TOOL`、`INTERACTION_TYPE_INTERNAL`、`INTERACTION_TYPE_INTERRUPT`、`INTERACTION_TYPE_LBS`、`INTERACTION_TYPE_SLIDES_OUTLINE`）
- `expireTime`（string）
- `genericTool`（message `GenericToolRequest`）
- `interrupt`（message `InterruptRequest`）

- `interactionAck` → `InteractionAck`
| 字段名(JSON key) | 类型 |
| --- | --- |
| `interactionId` | string |

#### C.4 流生命周期（以 Chat 为例）

1. 发送 `ChatRequest` 后先回 `{"op":"SET","mask":"chat","chat":{…},"eventOffset":0}`。

2. 陆续收到 `message`（新消息占位）与 `block`（正文/思考/搜索增量）。

3. 正文增量：`{"op":"APPEND","eventOffset":7,"block":{"id":"b1","messageId":"m1","text":{…}}}`。

4. 联网/文件场景插入 `ref`（引用）与 `usage`（用量）。

5. 需用户确认时下发 `interaction`，客户端回 `interactionAck`。

6. 结束：`{"done":{}}`，随后 End-of-Stream 帧/连接关闭。

#### C.5 解析要点

事件以字段存在性区分；未知字段必须忽略。

`mask` 标记本帧有效字段；`eventOffset` 用于乱序/重连合并。

`block` 内含多种子类型（text/search/think/tool/artifact/slidesView…），按存在字段分派渲染。

### 附录 D：常见调用排坑说明

1. **两套前缀**：账号服务 `Logout/RefreshToken` 走 `/api`，其余走 `/apiv2`，混用会 404。
2. **必须带全设备头 + 风控头**，缺失会被风控拦截（非普通 401）。
3. **Content-Type** 必须是 `application/connect+json`。
4. **流式接口** 需按帧解析，勿一次性读 body；注意 error 帧与中断。
5. **token 刷新** 需并发去重，避免 refresh token 失效。
6. **枚举取值** 是字符串（如 `FOLLOW_ACTION_FOLLOW`）。
7. **分页** 多用 pageToken/cursor，翻页需回传上次返回值。
8. **图片直传**：GeneratePresignedURL → PUT → CreateFile。
9. **删除类无返回体**，成功即 200 空体。
10. **R8 混淆**：proto 类名被混淆，字段名保留于 descriptor，枚举类型名被剥离（按前缀推断）。
