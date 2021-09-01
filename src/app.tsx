import type { Settings as LayoutSettings,MenuDataItem  } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import errorHandler  from "@/util/errorHandle"
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import fixMenuItemIcon from '@/util/fixMenuItemIcon'
import _ from 'lodash'

// import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { currentUser as queryCurrentUser , getMenuData } from './services/api/api';



import { BookOutlined, LinkOutlined } from '@ant-design/icons';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  menuData?: API.MenuData// 动态路由添加
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const currentUser = await queryCurrentUser();
      console.log(currentUser)
      return currentUser;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    //add:获取到当前用户，请求菜单
    const menuData = await getMenuData();// 动态路由添加
    console.log(menuData,89080)
    const {data} = menuData || {}
    const route = data[0].subResources
    const handleTree = (data) => {
      return (data || []).map((item) => {
        return  [{ ...item, path: item.url, name: item.resourceName,routes: handleTree(item.subResources) }, ];
      });
    };
   
    const menuList = handleTree(route)
    return {
      fetchUserInfo,
      menuList,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    menuList: {},
    settings: {},
  };
}

/**
 * 异常处理程序
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    405: '请求方法不被允许。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
 //-----English
    200: The server successfully returned the requested data. ',
    201: New or modified data is successful. ',
    202: A request has entered the background queue (asynchronous task). ',
    204: Data deleted successfully. ',
    400: 'There was an error in the request sent, and the server did not create or modify data. ',
    401: The user does not have permission (token, username, password error). ',
    403: The user is authorized, but access is forbidden. ',
    404: The request sent was for a record that did not exist. ',
    405: The request method is not allowed. ',
    406: The requested format is not available. ',
    410':
        'The requested resource is permanently deleted and will no longer be available. ',
    422: When creating an object, a validation error occurred. ',
    500: An error occurred on the server, please check the server. ',
    502: Gateway error. ',
    503: The service is unavailable. ',
    504: The gateway timed out. ',
 * @see https://beta-pro.ant.design/docs/request-cn
 */
// export const request: RequestConfig = {
//   // errorHandler: (error: any) => {
//   //   const { response } = error;
//   //   console.log(response)
//   //   if (!response) {
//   //     notification.error({
//   //       description: '您的网络发生异常，无法连接服务器',
//   //       message: '网络异常',
//   //     });
//   //   }
//   //   throw error;
//   // },
//   errorConfig: {
//     adaptor: (resData) => {
//       return {
//         ...resData,
//         success: resData.success,
//         errorMessage: resData.msg,
//       };
//     },
//   },
// };

export const request: RequestConfig = {
  credentials: 'include',
  errorHandler,
  // 自定义端口规范
  errorConfig: {
    adaptor: res => {
      return {
        success: res.success,
        data:res.data,
        errorCode:res.code,
        errorMessage: res.msg,
      };
    },
  },
  middlewares: [],
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    // menuDataRender: (menuData) => initialState.menuData || menuData, //这样写图标展示不出来
    menuDataRender: () =>{
      return  fixMenuItemIcon(initialState.menuList)  //这样写可以显示图标
    },
    // menu: {
    //   // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
    //   params: {
    //     userId: initialState?.currentUser?.userid,
    //   },
    //   request: async (params, defaultMenuData) => {
    //     // initialState.currentUser 中包含了所有用户信息
    //     const menuData = await getMenuData();
    //     return menuData;
    //   },
    // },
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};