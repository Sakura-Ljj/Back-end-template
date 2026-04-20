## 技术栈

- TypeScript
- Express
- TypeORM
- MySQL
- JWT
- log4js
- i18n
- ws

## 已包含的框架能力

- 自动扫描 `src/modules/*/controller` 并注册路由
- 统一请求响应结构与错误码返回
- JWT 鉴权中间件
- access token + refresh token 双 token 认证骨架
- RBAC 基础表、角色权限关联与权限校验中间件
- 前端路由/菜单配置模块与菜单树接口
- 可选启用的多租户 `corp` 模块与租户数据过滤逻辑
- 基于角色的权限校验中间件
- 请求日志、错误日志、耗时记录
- WebSocket 占位能力
- 定时任务入口
- i18n 国际化目录与示例语言包
- 示例模块：`auth`、`system`
- 管理员初始化脚本：`seedAdmin.ts`

## 目录结构

```text
src
|-- config
|-- i18n
|-- middleware
|-- modules
|   |-- auth
|   `-- system
|-- scripts
|-- utils
|-- timedTasks.ts
`-- main.ts
```

## 快速开始

```bash
npm install
copy .env.example .env
npm run seed:admin
npm run dev
```

默认 API 前缀：`/api`

默认认证时效配置：

- `ACCESS_TOKEN_EXPIRES_IN=2h`
- `REFRESH_TOKEN_EXPIRES_IN=30d`

## 默认管理员账号

- account: `admin`
- password: `123456`

首次使用后建议立即修改密码。

## 模块开发约定

- `entity`：数据库实体定义
- `service`：数据操作和业务逻辑
- `controller`：参数接收、流程编排、返回结果
- `interface`：请求参数类型定义

在 `src/modules/<module-name>/controller` 下新增控制器文件后，路由会自动注册。

## 这次抽离时顺手做的优化

### Token 鉴权

- 支持 `Authorization: Bearer <token>` 形式
- 保留 `token` 请求头兼容能力
- 将 token 校验和角色校验拆成独立中间件
- 控制器可通过 `req.getTokenInfo()` 取得当前登录信息
- 统一 401 和 403 返回结构
- 增加 refresh token 持久化、轮换刷新与主动注销能力

### RBAC 权限模型

- 增加 `role`、`permission`、`account_role`、`role_permission` 基础表
- 支持路由级 `roles` 与 `permissions` 双声明
- `checkRole` 与 `checkPermission` 会按当前账号实时解析角色与权限
- 登录、刷新、个人信息接口会返回当前角色和权限集合
- 初始化脚本内置 `admin`、`system_viewer` 角色和系统权限示例

### 路由模块

- 增加 `route`、`route_role` 前端路由配置表
- 支持菜单树构建、父子路由、排序、隐藏、缓存、图标、重定向
- 支持“角色可见性 + 权限细分”双重过滤
- 当前登录用户可获取按角色与权限裁剪后的菜单树
- 管理端可读取和保存路由配置

### 多租户模块

- 增加 `corp` 租户模块，作为模板里的可选多租户能力
- `account`、`route`、`app_config` 增加可空 `corp_id`
- 账号 `corp_id` 为空时视为全局账号，不做租户过滤
- 数据 `corp_id` 为空时视为全局数据，所有租户都可见
- 数据 `corp_id` 有值时，仅对应租户和全局账号可见

### 日志记录

- 为每次请求生成或透传 `requestId`
- 记录请求开始与结束日志
- 记录 `costMs`
- 记录 `path / method / ip / params`
- 记录错误信息与 stack
- WebSocket 统一使用 logger

## 对当前项目的进一步优化建议

### Token 相关

1. `getTokenInfo` 目前有直接解码 token payload 的用法，适合取展示信息，但不适合做安全判断。
2. `checkToken` 和 `checkRole` 仍然存在一部分职责重复。
3. 如果后续接口量更大，建议对角色查询做缓存。

### 日志相关

1. 当前项目还有不少字符串拼接日志，建议统一成结构化 JSON 日志。
2. 建议所有 HTTP 请求统一携带 `requestId`。
3. WebSocket、定时任务、脚本都应该统一使用 logger，不要再混用 `console.log`。

### 配置与工具层

1. `serverConfig.ts` 建议拆分为基础配置、第三方配置、业务枚举。
2. `commonUtils.ts` 目前职责过重，建议按能力拆分。
3. 路由自动扫描很适合模板，但控制器导出还可以继续补类型约束。

## RBAC 机制说明

当前模板已经内置一套最小可用的 RBAC 骨架，适合作为中后台项目的默认权限模型：

1. 用户与角色通过 `account_role` 关联。
2. 角色与权限通过 `role_permission` 关联。
3. 接口可以声明 `roles`，也可以声明更细粒度的 `permissions`。
4. 角色用于粗粒度边界控制，权限用于接口、菜单、按钮等细粒度授权。
5. 当前实现每次鉴权按账号实时解析权限，角色或权限变更后无需重新登录即可生效。

当前内置的基础表：

- `account`：账号表
- `role`：角色表
- `permission`：权限表
- `account_role`：账号角色关联表
- `role_permission`：角色权限关联表

主键命名约定：

- `account` 主键保留为 `uid`，作为账号唯一标识
- 其他 RBAC 与会话类表主键统一使用 `id`
- 关联字段使用 `account_uid`、`role_id`、`permission_id` 这类更清晰的命名

当前初始化脚本会自动写入：

- 租户：`demo-corp`
- 角色：`admin`、`system_viewer`
- 权限：`corp.read`、`corp.update`、`auth.menu.read`、`auth.profile.read`、`system.config.read`、`system.config.update`、`system.permission.read`、`system.route.read`、`system.route.update`
- 默认管理员：`admin / 123456`
- 默认租户示例账号：`demo_viewer / 123456`
- 示例路由：`/dashboard`、`/system`、`/system/config`、`/system/routes`、`/corp/list`

当前示例接口：

- `GET /api/corp/list`
  需要权限 `corp.read`
- `POST /api/corp/save`
  需要权限 `corp.update`
- `GET /api/auth/menu`
  需要权限 `auth.menu.read`
- `GET /api/auth/profile`
  需要权限 `auth.profile.read`
- `GET /api/system/config`
  需要权限 `system.config.read`
- `POST /api/system/configUpdate`
  需要权限 `system.config.update`
- `GET /api/system/permissionSummary`
  需要权限 `system.permission.read`
- `GET /api/system/routeList`
  需要权限 `system.route.read`
- `POST /api/system/routeSave`
  需要权限 `system.route.update`

## 路由模块说明

当前模板内置了一套前端路由配置模块，主要用于后台项目的菜单、页面路由和角色可见性控制。

相比参考项目里的单表实现，这一版做了几处优化：

1. 父子关系从 `parent path` 改成 `parent_id`，避免路径修改时子节点关系失效。
2. 路由角色关联从直接存角色字符串改成 `route_role -> role_id`，与现有 RBAC 模型保持一致。
3. 增加了 `title`、`permission_code`、`route_type`、`is_enabled`、`remark` 等字段，方便后续菜单管理和页面授权。
4. 菜单显示逻辑支持双条件：
   没绑角色时默认所有已登录用户可见；
   绑了角色则先校验角色；
   如果设置了 `permission_code`，还会继续校验细粒度权限。
5. `routeSave` 内置循环校验，禁止把节点挂到自己或自己的任意子孙节点下面。

当前相关数据表：

- `route`：前端路由配置表
- `route_role`：路由与角色关联表

当前相关接口：

- `GET /api/auth/menu`
  返回当前用户可见菜单树
- `GET /api/system/routeList`
  返回后台管理用的完整路由列表和角色绑定信息
- `POST /api/system/routeSave`
  创建或更新路由配置

`routeSave` 主要字段：

- `path`：路由路径，在同一租户作用域内唯一
- `name`：路由名称，在同一租户作用域内唯一
- `title`：菜单标题
- `component_path`：前端组件路径
- `parent_id`：父级路由 id
- `permission_code`：访问该路由需要的权限码
- `role_ids`：允许访问该路由的角色 id 列表
- `route_type`：`menu` 或 `page`

如果后续前端项目需要按钮权限、外链菜单或目录节点，还可以在这个模块上继续扩展，而不用推翻现有结构。

## 多租户机制说明

当前模板内置了一套可选启用的轻量多租户方案，参考了 `corp` 模块的思路，但做了更适合母版的简化：

1. 租户实体统一放在 `corp` 模块下，保留 `corp_id` 作为租户业务标识。
2. 租户能力默认可不用，现有全局账号和全局数据仍可直接工作。
3. 当前账号如果 `corp_id` 为空，则视为全局账号，可看到所有数据。
4. 当前账号如果 `corp_id` 有值，则默认只能看到：
   `corp_id` 为空的全局数据；
   `corp_id` 等于当前账号租户 id 的租户数据。
5. 当前配置和路由模块已接入该规则，可作为后续业务表接入的参考实现。

当前已接入租户能力的表：

- `account`
- `app_config`
- `route`
- `corp`

当前相关接口：

- `GET /api/corp/list`
  返回租户列表
- `POST /api/corp/save`
  创建或更新租户

当前示例：

- `admin` 账号没有 `corp_id`，属于全局账号
- `demo_viewer` 账号绑定 `demo-corp`
- 全局配置对所有人可见
- `demo-corp` 专属配置只对 `demo-corp` 和全局账号可见

设计取舍：

- 没有引入复杂的租户中间件或 ORM 全局拦截器，避免模板过重。
- 使用 service 层显式过滤，后续业务接入时可读性更强。
- `corp_id` 为空的记录天然兼容单租户或无租户项目，不需要强制开启。

控制器声明方式示例：

```ts
module.exports = {
  method: 'get',
  permissions: ['system.config.read'],
  controller: async () => {
    return { ok: true };
  }
};
```

如果你只想做粗粒度角色控制，也仍然可以继续使用：

```ts
module.exports = {
  method: 'get',
  roles: ['admin'],
  controller: async () => {
    return { ok: true };
  }
};
```

模板当前的设计取舍：

- 账号角色唯一来源是 `account_role` 关联表。
- 新项目建议优先使用 `permission` 作为接口访问控制的主方式。
- 当前没有额外引入权限缓存，模板默认优先保证结构清晰与行为直观。
- 如果后续接口量更大，可以在 `resolveAccountAuthorization` 这一层增加缓存。

## Refresh Token 机制说明

当前模板已经内置一套基础 refresh token 方案，适合作为后续项目的默认认证骨架：

1. 登录成功后同时签发 `accessToken` 和 `refreshToken`。
2. `accessToken` 为 JWT，仅用于接口鉴权，默认有效期较短。
3. `refreshToken` 为随机字符串，不直接存明文，只在数据库中保存 hash。
4. 调用刷新接口时会执行 refresh token 轮换：旧 token 立即失效，新 token 重新下发。
5. 调用注销接口时会主动吊销当前 refresh token，对应会话失效。

当前新增的认证接口：

- `POST /api/auth/login`：登录并返回 `accessToken`、`refreshToken`
- `POST /api/auth/refresh`：使用 `refreshToken` 换取新的 token 对
- `POST /api/auth/logout`：吊销当前 `refreshToken`
- `GET /api/auth/profile`：使用 `accessToken` 获取当前登录信息

示例：

```bash
curl -X POST http://127.0.0.1:8787/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"account\":\"admin\",\"password\":\"123456\"}"
```

登录返回体中会包含：

- `accessToken`
- `accessTokenExpiresIn`
- `refreshToken`
- `refreshTokenExpiresIn`

刷新请求示例：

```bash
curl -X POST http://127.0.0.1:8787/api/auth/refresh ^
  -H "Content-Type: application/json" ^
  -d "{\"refreshToken\":\"<your-refresh-token>\"}"
```

这一版实现的设计取舍：

- access token 与 refresh token 生命周期分离，避免长效 JWT 直接暴露在业务请求中。
- refresh token 采用持久化表，后续可以继续扩展多端登录、设备管理、踢下线。
- 采用轮换刷新而不是重复复用同一个 refresh token，降低泄露后被长期利用的风险。
- 当前仍依赖 TypeORM `synchronize` 自动建表；如果后续进入生产环境，建议补 migration。

## 后续推荐演进方向

- 增加统一参数校验层
- 增加 migration 支持
- 增加测试目录和基础测试示例
- 增加 Docker / PM2 / 部署说明

## 这次没有直接带入模板的内容

- 视频生成、字幕处理、素材解析等强业务流程
- AI 调用、第三方接口封装、汇率、敏感内容检测等重业务工具方法
- 当前项目中的企业、报表、创作、视频等业务模块
- 所有真实环境配置和敏感信息

模板目录现在更适合作为“后续所有 Node 后端项目的基础母版”。

## 目前项目阅读进度 corp 模块
