// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import Qs from 'qs'

/** 登录接口 */
export async function login(params: LOGINAPI.LoginParams, options?: { [key: string]: any }) {
    return request<LOGINAPI.LoginParams>('/api/authentication/loginSystem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data:Qs.stringify(params),
      ...(options || {}),
    });
  }
  