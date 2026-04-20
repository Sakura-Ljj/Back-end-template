declare namespace AppRouter {
  type RouterMethod = 'get' | 'post';

  interface RouteModule {
    method: RouterMethod;
    controller: (event: any, req: any, res: any) => Promise<any> | any;
    unCheckToken?: boolean;
    roles?: string[];
    permissions?: string[];
    renderType?: 'json' | 'sse';
  }

  type ScanRouteResult = Record<string, RouteModule>;
}

interface TokenPayload {
  uid: string;
  username: string;
  corp_id?: string | null;
  roles: string[];
  permissions?: string[];
  tokenType?: 'access';
  iat?: number;
  exp?: number;
}

interface AccountAuthorizationContext {
  accountUid: string;
  corpId: string | null;
  roles: string[];
  permissions: string[];
}

declare namespace Express {
  interface Request {
    requestId?: string;
    clientIp?: string;
    token?: string;
    tokenInfo?: TokenPayload | null;
    authorizationContext?: AccountAuthorizationContext;
    getRequestId?: () => string;
    getClientIp?: () => string;
    getTokenInfo?: () => TokenPayload | null;
    getAuthorizationContext?: () => Promise<AccountAuthorizationContext>;
    requireTokenInfo?: () => TokenPayload;
  }
}
