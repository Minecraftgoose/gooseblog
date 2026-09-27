---
title: 'GooseHost自托管指南'
date: '2026-08-23 22:00:01'
updated: '2026-08-23 22:00:01'
tags:
  - GooseHost
  - '文档'
categories:
  - '项目'
cover: 'https://img.goose.cc.cd/i/d712485cd56be9505fa0b146697885f3.png'
og_image: 'https://img.goose.cc.cd/i/d712485cd56be9505fa0b146697885f3.png'
excerpt: 'GooseHost自托管指南-维基文档'
description: 'GooseHost自托管指南-维基文档'
slug: goosehost-deploy-yourself
---

# GooseHost 自托管教程
> 作者：Minecraft_goose

教程很长，耐心看完~

如果喜欢GooseHost可以点个star~

本教程理论上手机即可操作完成，不同型号略有差异

在自托管过程中我会以`GooseHost`这个名字来方便表述，大家在建造的过程中可以换成自己的名字，自己的域名。

## No.1 —— 准备cloudflare和SUPABASE账号

分别前往[cloudflare](http://dash.cloudflare.com/)和[SUPABASE](https://supabase.com/dashboard/sign-up)注册账号

## No.2 —— 在SUPABASE中建立GooseHost的储存库

### 创建一个SUPABASE项目

注册后根据SUPABASE引导创建组织

<img width="948" height="581" alt="image" src="https://github.com/user-attachments/assets/e36e48d6-c564-4162-ba16-2e7f2fb634ce" />

设置强密码

<img width="673" height="118" alt="image" src="https://github.com/user-attachments/assets/e5274bd7-7616-4aae-a28b-909b3bb27ba4" />

进入主界面

<img width="945" height="577" alt="image" src="https://github.com/user-attachments/assets/1eb22136-9edc-4255-967b-a7894792e7e9" />

点击左侧第三个图标进入`SQL Editor`

<img width="948" height="579" alt="image" src="https://github.com/user-attachments/assets/3a20cb55-610e-4141-a439-96955f86a857" />

执行以下SQL
```sql
insert into storage.buckets (id, name, public) values ('sites', 'sites', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('md', 'md', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('projects', 'projects', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('admin', 'admin', false) on conflict (id) do nothing;
```
> 创建4个桶，前三个负责储存，第四个是放`email-map.json`的

继续执行
```sql
create table if not exists public.gh_site (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    type text not null check (type in ('html', 'md', 'project')),
    owner_id uuid not null,
    ip_address text,
    visit_count bigint default 0,
    macos_submit_id text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index if not exists idx_gh_site_owner_id on public.gh_site(owner_id);
create index if not exists idx_gh_site_name on public.gh_site(name);
```

<img width="387" height="246" alt="image" src="https://github.com/user-attachments/assets/591673f1-b8e9-40fa-9a84-67ba879dca92" />

点绿色按钮，以后都点绿色的

> 站点主表，名称`gh_site`，可改，但是后面的话就得小心了。

```sql
create table if not exists public.gh_announcement (
    id uuid primary key default gen_random_uuid(),
    content text not null,
    is_active boolean default false,
    created_at timestamptz default now()
);

create index if not exists idx_gh_announcement_active on public.gh_announcement(is_active);
```

> `gh_announcement`--全局公告

```sql
create table if not exists public.system_status (
    id int primary key default 1 check (id = 1),
    maintenance_mode boolean default false,
    maintenance_message text,
    services jsonb default '{}'::jsonb,
    updated_at timestamptz default now(),
    updated_by text
);
```

> 系统状态表

---

#### `get_sites_paginated`

```sql
create or replace function public.get_sites_paginated(
    p_limit int,
    p_offset int,
    p_order_by text default 'updated_at',
    p_order_dir text default 'DESC'
)
returns table(
    id uuid,
    name text,
    owner_id uuid,
    ip_address text,
    created_at timestamptz,
    updated_at timestamptz,
    total_count bigint
) language plpgsql as $$
declare
    order_sql text;
begin
    order_sql := format('order by %I %s', p_order_by, p_order_dir);
    return query execute format('
        select
            s.id,
            s.name,
            s.owner_id,
            s.ip_address,
            s.created_at,
            s.updated_at,
            count(*) over() as total_count
        from public.gh_site s
        %s
        limit $1 offset $2
    ', order_sql) using p_limit, p_offset;
end;
$$;
```

#### `get_users_paginated`

```sql
create or replace function public.get_users_paginated(
    p_limit int,
    p_offset int
)
returns table(
    owner_id uuid,
    site_count bigint,
    created_at timestamptz,
    sites jsonb,
    total_count bigint
) language plpgsql as $$
begin
    return query
    with agg as (
        select
            s.owner_id,
            count(*) as site_count,
            min(s.created_at) as created_at,
            jsonb_agg(jsonb_build_object('name', s.name, 'type', s.type)) as sites
        from public.gh_site s
        group by s.owner_id
    ),
    total as (select count(*) from agg)
    select
        agg.owner_id,
        agg.site_count,
        agg.created_at,
        agg.sites,
        (select count from total) as total_count
    from agg
    order by agg.created_at desc
    limit p_limit offset p_offset;
end;
$$;
```

#### `get_site_stats`
```sql
create or replace function public.get_site_stats()
returns table(
    total_sites bigint,
    total_users bigint,
    sites_today bigint
) language plpgsql as $$
begin
    return query
    select
        count(*) as total_sites,
        count(distinct owner_id) as total_users,
        count(*) filter (where created_at::date = current_date) as sites_today
    from public.gh_site;
end;
$$;
```

#### increment_visit

```sql
create or replace function public.increment_visit(p_name text)
returns void language plpgsql as $$
begin
    update public.gh_site
    set visit_count = visit_count + 1
    where name = p_name;
end;
$$;
```
#### rls策略

```sql
alter table public.gh_site disable row level security;
alter table public.gh_announcement disable row level security;
alter table public.system_status disable row level security;
```

#### `updated_at` 自动更新触发器
```sql
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger trigger_gh_site_updated_at
before update on public.gh_site
for each row execute function public.update_updated_at();
```

## No.3 现在前往cloudflare

> [!NOTE]
> 必须拥有一个可以绑定在cloudflare上的域名，这不是为了好看，因为worker域名在国内打不开
>
> 因为我没有域名了，所以用worker域名做演示，在实际使用中，你需要把worker域名换成你自己的

### 现在你从GitHub上下载了GooseHost源码

<img width="243" height="153" alt="image" src="https://github.com/user-attachments/assets/caa9a4ff-51b0-479f-861a-54d4ae4709b9" />

好打开cloudflare

<img width="1054" height="575" alt="image" src="https://github.com/user-attachments/assets/644604db-4d2f-4e61-a32e-95dcfd2354fc" />

按下`Ctrl+K`搜索`KV`

点击创建

<img width="1038" height="444" alt="image" src="https://github.com/user-attachments/assets/feb488cb-f31c-4016-93af-f60d3c10b330" />

命名为`RATE_LIMIT_KV`

<img width="332" height="229" alt="image" src="https://github.com/user-attachments/assets/d3cad22b-e185-4a67-ac51-026064e1948e" />

复制此iD

现在打开API文件夹

<img width="109" height="118" alt="image" src="https://github.com/user-attachments/assets/84500070-5462-42a9-98ff-bca3e2889fad" />


找到`wrangler.toml`


<img width="233" height="58" alt="image" src="https://github.com/user-attachments/assets/dd8a78ab-1746-4bc7-85b1-3d90dd8d64ed" />

然后

<img width="435" height="408" alt="image" src="https://github.com/user-attachments/assets/8e998116-e4cc-4cba-9987-3eeb58634f15" />

删成这样
> 详解：
 >
 > name = "这里填一会要创建的cloudflareworker名称"
 >
 > API_URL = "https://worker域名"
 >
 > ADMIN_USER_IDS = "管理员UID，用英文逗号分割"
 >
 > id = "这里填从cloudflare复制过来的2edc698e7f884d6ea146cdc5ad0a74e0"

完事长这样
```toml
name = "goosehost-example"  
main = "worker.js"
compatibility_date = "2026-07-27"

[vars]
API_URL = "https://goosehost-example.goose-bai.workers.dev"
ADMIN_USER_IDS = ""

[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "2edc698e7f884d6ea146cdc5ad0a74e0"

[triggers]
crons = ["*/30 * * * *"]
```

### 现在创建一个名为`goosehost-example`的worker

<img width="319" height="137" alt="image" src="https://github.com/user-attachments/assets/18b63e59-8d84-4b9e-a6a1-556d69ccf034" />

点击创建

<img width="564" height="381" alt="image" src="https://github.com/user-attachments/assets/e70cf388-1e27-45d4-a894-ba7911149651" />

从helloworld开始

<img width="561" height="509" alt="image" src="https://github.com/user-attachments/assets/6bcec803-78cf-402b-8371-59813cad434e" />

修改名称，部署

然后来到GitHub，新建一个仓库

<img width="399" height="355" alt="image" src="https://github.com/user-attachments/assets/80238b08-7373-4e3c-b481-5900214860a3" />

将整个API文件夹上传到这个仓库

上传完毕后点击设置>Security and quality>Secrets and variables>Actions>Repository secrets>New repository secret 新建以下机密：

- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_API_TOKEN
- CRON_SECRET
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_URL

#### CLOUDFLARE_ACCOUNT_ID 获取方法

看你的cloudflare网址

<img width="456" height="44" alt="image" src="https://github.com/user-attachments/assets/5c85bfa2-9e68-4617-9127-d53198e23c20" />

中间那一大串就是

#### CLOUDFLARE_API_TOKEN 获取方法

cloudflare dashboard 右上角小人头像，点击出现下拉菜单，点击配置文件，或者直接点[这里](https://dash.cloudflare.com/profile/api-tokens)

<img width="759" height="192" alt="image" src="https://github.com/user-attachments/assets/95d3cd83-0bb3-4ded-9629-a7d264633ddd" />

点击创建令牌>API 令牌模板>编辑 Cloudflare Workers

所有显示 `Select...` 的都填上，填啥随便，最好选`所有`,客户端 IP 地址筛选不用管

点击继续以显示摘要，创建成功，复制好填入GitHub机密

#### SUPABASE_URL获取方法

回到SUPABASE首页

<img width="489" height="220" alt="image" src="https://github.com/user-attachments/assets/e970fbef-3318-400f-811b-934e4ed5f27b" />

`.co` 网址就是

#### SUPABASE_ANON_KEY和SUPABASE_SERVICE_ROLE_KEY获取方法

<img width="185" height="67" alt="image" src="https://github.com/user-attachments/assets/b8cbe5fc-88d2-4724-ab66-5a89c6bf6fe9" />

点击左侧边栏设置图标

Settings>CONFIGURATION>API keys>Legacy anon, service_role API keys

<img width="582" height="341" alt="image" src="https://github.com/user-attachments/assets/8ef1acbf-a4eb-4007-8054-ea0e91ae9f85" />

这两个就是

#### CRON_SECRET

瞎填就行

---

全部完成后点击actions

<img width="768" height="50" alt="image" src="https://github.com/user-attachments/assets/79e0f4aa-f59c-457c-82f8-848bb59edec4" />

选择yourself

<img width="380" height="140" alt="image" src="https://github.com/user-attachments/assets/cc7a6a16-8da1-457f-b21b-6cfee9bd4c75" />

复制以下代码
```yml
name: Deploy GooseHost Worker

on:
  push:
    branches: [main, master]
  workflow_dispatch:

concurrency:
  group: deploy-goosehost-worker
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Install dependencies
        run: npm install

      - name: Build (esbuild 打包 index.js -> worker.js)
        run: npm run build

      - name: Push secrets to Cloudflare
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: |
          echo -n "${{ secrets.SUPABASE_URL }}" | npx wrangler secret put SUPABASE_URL
          echo -n "${{ secrets.SUPABASE_ANON_KEY }}" | npx wrangler secret put SUPABASE_ANON_KEY
          echo -n "${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" | npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
          echo -n "${{ secrets.CRON_SECRET }}" | npx wrangler secret put CRON_SECRET

      - name: Deploy to Cloudflare Workers
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: npx wrangler deploy
```

命名 `deploy.yml` ，保存后等待半分钟回到cloudflare

<img width="876" height="202" alt="image" src="https://github.com/user-attachments/assets/aa4ac79e-7c41-4926-af19-6477a8cc9614" />

action已经部署完了

## No.4 部署前端

### 改代码


#### 1. `auth/register.js`

**位置**：第 63 行

**原代码**：
```javascript
redirect_to: 'https://host.goose.gs.cn/login.html'
```

**改为**：
```javascript
redirect_to: 'https://你的前端域名/login.html'
```


---

#### 2. `auth/signup.js`


**原代码**：
```javascript
redirect_to: 'https://host.goose.gs.cn/login.html'
```

**改为**：
```javascript
redirect_to: 'https://你的前端域名/login.html'
```



---

#### 3. `auth/forgot-password.js` 

**位置**：第 3 行

**原代码**：
```javascript
const RESET_PAGE = 'https://host.goose.gs.cn/reset-password.html';
```

**改为**：
```javascript
const RESET_PAGE = 'https://你的前端域名/reset-password.html';
```


---

#### 4. `sites/serve.js` 


##### 位置 1：`render404Page` 函数
```javascript
<link rel="icon" type="image/x-icon" href="https://host.goose.gs.cn/icons/favicon.ico">
```
以及页脚和导航中的链接：
```javascript
<a href="https://host.goose.gs.cn/">返回首页</a>
```

**全部改为**：`https://你的前端域名/...`

##### 位置 2：Markdown 渲染 HTML
顶部导航、页脚水印、字体链接、CSS 引用等多处硬编码：
```javascript
<link rel="icon" type="image/x-icon" href="https://host.goose.gs.cn/icons/favicon.ico">
<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/font-awesome/...">
<a href="https://host.goose.gs.cn/" class="header-brand">
<a href="https://host.goose.gs.cn/docs/" class="header-link">
<a href="https://host.goose.gs.cn/" target="_blank">GooseHost</a>
```

**改为**：`https://你的前端域名/...`

#### 5. `utils/cors.js` 

打开就能看见

#### 6. 所有front目录里的page.goose.gs.cn替换为刚才的worker域名

[一键转换.bat](https://github.com/user-attachments/files/31348769/done.bat.txt)

---

现在部署pages

![创建应用程序](https://github.com/user-attachments/assets/2ebc3598-997f-403a-94a2-2c182d30c243)

![上传文件夹](https://github.com/user-attachments/assets/22ee7481-2995-43a3-b76a-cd5eacedb53d)

![拖入](https://github.com/user-attachments/assets/72729e73-7ac9-40ad-bb8a-5eb72a8ef2b5)

![quanq](https://github.com/user-attachments/assets/c6f23312-a9e9-451c-8647-910defbb9aa0)

此时你打开你的GooseHost链接，已经可以收到注册邮件了

<img width="483" height="184" alt="image" src="https://github.com/user-attachments/assets/546f596b-ee35-4f3c-b00f-eba5953cf248" />

但是，还没完

现在回到SUPABASE

<img width="203" height="148" alt="image" src="https://github.com/user-attachments/assets/fe7c5ff5-e7bc-40e8-9d69-ec26d506f20c" />

点击

<img width="252" height="467" alt="image" src="https://github.com/user-attachments/assets/d7a8b1e7-3df8-4315-b392-8766c6e8feec" />

跟着我鼠标

<img width="855" height="176" alt="image" src="https://github.com/user-attachments/assets/eade7d35-f460-4756-b027-1d5c751c01ce" />

换成

<img width="857" height="188" alt="image" src="https://github.com/user-attachments/assets/3a9dd13f-5b14-4999-a5ad-800beccbd8ba" />

同时下面

<img width="875" height="276" alt="image" src="https://github.com/user-attachments/assets/6407780c-acf7-41af-aa3c-928a1096754d" />

<h1>🎉 恭喜你，你的GooseHost已经具备基本可运行状态！</h1>

## 设置管理员

找到这里

<img width="1166" height="532" alt="image" src="https://github.com/user-attachments/assets/ca715a64-0030-4797-bb2a-a10b39c8c516" />

复制管理员uid

<img width="245" height="89" alt="image" src="https://github.com/user-attachments/assets/b6ea64ee-d116-4892-91ec-9a288421040d" />

回到 `wrangler.toml` 

<img width="481" height="144" alt="image" src="https://github.com/user-attachments/assets/ecdcfac1-4100-43ad-a374-a54fddc21d4d" />

保存，Action会重新部署

部署完成后你就可以打开[管理员页面](https://goosehost-example.pages.dev/admin/)啦
