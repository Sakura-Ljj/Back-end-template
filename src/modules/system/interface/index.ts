export interface UpdateConfigReq {
  config_key?: string;
  config_value?: string;
  remark?: string;
  corp_id?: string;
}

export interface SaveRouteReq {
  id?: string;
  path?: string;
  name?: string;
  title?: string;
  corp_id?: string;
  component_path?: string;
  is_keep_alive?: boolean;
  is_hide?: boolean;
  icon?: string;
  redirect?: string;
  parent_id?: string;
  weight?: number;
  permission_code?: string;
  route_type?: 'menu' | 'page';
  is_enabled?: boolean;
  remark?: string;
  role_ids?: string[];
}

export interface RouteTreeItem {
  id: string;
  path: string;
  name: string;
  title: string;
  component: string | null;
  redirect: string | null;
  meta: {
    title: string;
    icon: string | null;
    is_hide: boolean;
    is_keep_alive: boolean;
    permission_code: string | null;
    route_type: 'menu' | 'page';
  };
  weight: number;
  children: RouteTreeItem[];
}
