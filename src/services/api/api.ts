import { request } from 'umi';

/** 获取当前的用户 */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/auth/user/userinfo', {
    method: 'GET',
    ...(options || {}),
  });
 
}

// 获取菜单
export async function getMenuData(options?: { [key: string]: any }) {
  return request<API.MenuData>('/api/auth/user/resources', {
    method: 'GET',
    ...(options || {}),
  });
 
}


