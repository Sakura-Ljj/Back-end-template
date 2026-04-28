# 后端模板

这是一个可复用的 Node.js 后端项目母版，已经完成了基础认证、RBAC、可选多租户、前端路由配置、统一日志与请求处理等通用能力，适合作为中后台或管理系统类项目的起点。

当前仓库目标不是承载某个具体业务，而是提供一套已经整理过、可继续扩展的后端基础架构。

## 技术栈

- TypeScript
- Express
- TypeORM
- MySQL
- JWT
- log4js
- i18n
- ws

## 当前已具备的能力

- 自动扫描 `src/modules/*/controller` 并注册路由
- 统一响应结构、错误码和请求日志
- JWT access token + refresh token 认证
- RBAC 角色与权限模型
- 可选启用的多租户 `corp` 能力
- 前端菜单 / 路由配置模块
- WebSocket 占位能力
- 定时任务入口
- 初始化种子脚本

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

## 目录结构

```text
src
|-- config
|-- i18n
|-- middleware
|-- modules
|   |-- auth
|   |-- corp
|   `-- system
|-- scripts
|-- utils
|-- timedTasks.ts
`-- main.ts
```

各目录职责：

- `config`：环境变量与数据库配置
- `middleware`：认证、权限、请求上下文、动态路由等中间件
- `modules`：按业务域拆分的模块代码
- `scripts`：初始化与运维脚本
- `utils`：日志、JWT、错误处理、路由扫描等通用工具

## 项目架构

### 1. 入口层

- `src/main.ts`
  负责应用启动、数据库初始化、中间件挂载、自动路由注册、WebSocket 和定时任务接入。

启动链路大致是：

1. 加载 `express`、`cors`、`json/urlencoded`、静态目录
2. 注入语言包和请求上下文
3. 扫描 `src/modules/*/controller`
4. 对每个控制器按顺序挂载：
   `checkToken -> checkRole -> checkPermission -> checkMethod -> setRoute`
5. 初始化数据库并启动 HTTP 服务

### 2. 模块层

当前模块划分：

- `auth`
  认证、RBAC、菜单、refresh token
- `corp`
  可选启用的租户模块
- `system`
  系统配置、权限示例、前端路由配置

模块内约定：

- `entity`：数据库实体
- `service`：数据查询与业务逻辑
- `controller`：参数接收、流程编排、接口返回
- `interface`：请求参数与返回结构类型

### 3. 中间件层

关键中间件：

- `src/middleware/requestContext.ts`
  注入 `requestId`、`clientIp`
- `src/middleware/checkToken.ts`
  校验 access token，并把登录态挂到 `req`
- `src/middleware/checkRole.ts`
  粗粒度角色鉴权
- `src/middleware/checkPermission.ts`
  细粒度权限鉴权
- `src/middleware/setRouter.ts`
  统一请求处理、响应包装与日志输出

### 4. 数据层

当前数据访问以 TypeORM Repository 为主。

原则：

- 简单读写直接走 repository
- 跨多表一致性写操作使用事务
- 多租户过滤目前显式写在 service 层，避免过度隐式魔法

## 认证架构

### Token 设计

当前认证采用双 token：

- `accessToken`
  短时 JWT，用于接口鉴权
- `refreshToken`
  持久化随机字符串，用于刷新 access token

相关实现：

- `src/utils/jwt.ts`
- `src/middleware/checkToken.ts`
- `src/modules/auth/service/refreshToken.service.ts`

当前支持接口：

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/profile`

### 请求中的登录态

`checkToken` 会在请求对象上挂载：

- `req.getTokenInfo()`
  宽松获取当前 token 信息
- `req.requireTokenInfo()`
  语义上表示这里必须存在登录态

注意：

- 当前 `requireTokenInfo()` 和 `getTokenInfo()` 返回的是同一份数据
- 它们的区别主要在语义，不在实现行为

## RBAC 架构

当前 RBAC 为标准的“账号 -> 角色 -> 权限”模型。

相关表：

- `account`
- `role`
- `permission`
- `account_role`
- `role_permission`

核心实现：

- `src/modules/auth/service/rbac.service.ts`
- `src/middleware/checkRole.ts`
- `src/middleware/checkPermission.ts`

路由声明支持两种方式：

```ts
module.exports = {
  method: 'get',
  roles: ['admin'],
  controller: async () => ({ ok: true })
};
```

```ts
module.exports = {
  method: 'get',
  permissions: ['system.config.read'],
  controller: async () => ({ ok: true })
};
```

使用建议：

- `roles` 适合做粗粒度身份边界
- `permissions` 适合做细粒度能力控制
- 新项目建议优先使用 `permissions`

## 多租户架构

### 设计目标

多租户能力是可选的，不强制所有项目都开启。

核心规则：

- 账号 `corp_id` 为空：视为全局账号
- 数据 `corp_id` 为空：视为全局数据
- 账号 `corp_id` 有值：只能看到全局数据和自己租户的数据

### 当前已接入租户过滤的表

- `account`
- `corp`
- `app_config`
- `route`

### 相关实现

- `src/modules/corp/entity/corp.entity.ts`
- `src/modules/corp/service/corp.service.ts`
- `src/modules/corp/service/tenant.service.ts`

关键 helper：

- `getRequestCorpId`
  获取当前请求所属租户
- `resolveWritableCorpId`
  决定当前写入最终落到哪个租户
- `appendTenantVisibilityCondition`
  为查询拼接“全局可见 + 当前租户可见”的过滤条件

注意：

- 当前多租户过滤是显式写在 service 层的
- 这样可读性更强，但每个接入租户能力的 service 都需要主动处理 `corp_id`

## 前端路由 / 菜单模块

这是一个面向中后台项目的前端菜单配置模块，不是后端接口路由本身。

相关表：

- `route`
- `route_role`

相关实现：

- `src/modules/system/entity/route.entity.ts`
- `src/modules/system/service/route.service.ts`
- `src/modules/auth/controller/menu.ts`

当前支持：

- 菜单树构建
- 父子节点
- 权重排序
- 隐藏菜单
- keep-alive 标记
- 角色可见性过滤
- 权限细分过滤
- 租户维度可见性过滤

注意点：

- `routeSave` 内置了循环校验
- 禁止把节点挂到自己或自己的后代节点下面

## 系统模块

`system` 模块当前承担两个示例职责：

1. `app_config` 配置读写
2. `route` 前端菜单配置

示例接口：

- `GET /api/system/config`
- `POST /api/system/configUpdate`
- `GET /api/system/permissionSummary`
- `GET /api/system/routeList`
- `POST /api/system/routeSave`

这些接口一方面是模板功能，另一方面也是后续业务项目接入 RBAC、多租户、菜单配置时的参考实现。

## 初始化数据

`src/scripts/seedAdmin.ts` 会初始化：

- 默认全局管理员：`admin / 123456`
- 默认租户示例账号：`demo_viewer / 123456`
- 默认租户：`demo-corp`
- 基础角色：`admin`、`system_viewer`
- 基础权限
- 示例路由
- 示例配置

建议：

- 首次使用后及时修改默认密码
- 如果项目不使用多租户，可以忽略 `demo-corp` 和 `demo_viewer`

## 配置文件

环境变量示例见 `.env.example`。

关键项：

- `APP_PORT`
- `APP_CONTEXT`
- `DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME`
- `DB_SYNCHRONIZE`
- `JWT_SECRET`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_IN`
- `ENABLE_WS`
- `DEFAULT_LOCALE`

注意：

- 当前仍默认依赖 `DB_SYNCHRONIZE=true`
- 开发阶段方便，生产环境不建议长期依赖

## 日志与观测

日志统一走 `src/utils/log.ts`。

当前日志特点：

- 结构化 JSON 输出
- 自动携带 `timestamp`
- HTTP 请求携带 `requestId`
- 记录开始、结束、耗时和错误堆栈
- WebSocket、脚本、启动流程统一使用同一套 logger

## 实体命名约定

- `account` 主键保留为 `uid`
- 其他 RBAC、租户、路由、配置类实体主键统一使用 `id`
- 关联字段优先使用：
  - `account_uid`
  - `role_id`
  - `permission_id`
  - `corp_id`

所有实体字段的 `comment` 已整理为中文，便于直接生成中文数据库注释。

## 当前需要注意的点

- 项目里仍有部分地方以 service 层显式拼装租户条件，这是当前设计选择，不是遗漏
- `getTokenInfo()` 和 `requireTokenInfo()` 现在行为一致，区别主要体现在语义
- 多租户写入归属当前主要通过 `resolveWritableCorpId` 控制
- 全局管理员如果需要跨租户写数据，推荐使用无 `corp_id` 的账号
- 当前未引入 migration，数据库结构变更仍主要依赖 `synchronize`

## 适合继续扩展的方向

- 新业务模块直接复用 `entity / service / controller / interface` 分层
- 需要租户能力的表可直接加 `corp_id`
- 需要菜单与页面权限的项目可直接复用 `route` 模块
- 需要后台权限体系的项目可直接复用当前 RBAC

这个仓库现在更适合作为“中后台 Node.js 后端项目母版”，而不是某个具体业务项目的裁剪残留。  
后续新项目建议以这里为基线继续开发。 
