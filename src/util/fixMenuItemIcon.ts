//  路径
//  src/utils/fixMenuItemIcon.ts

import React from 'react';
import {MenuDataItem} from '@ant-design/pro-layout';
import * as allIcons from '@ant-design/icons';

// FIX从接口获取菜单时icon为string类型
const fixMenuItemIcon = (menus: MenuDataItem[], iconType = 'Outlined'): MenuDataItem[] => {
  menus.forEach((item) => {
    const {icon, children} = item
    if (typeof icon === 'string') {
      const fixIconName = icon.slice(0, 1).toLocaleUpperCase() + icon.slice(1) + iconType
      // eslint-disable-next-line no-param-reassign
      item.icon = React.createElement(allIcons[fixIconName] || allIcons[icon])
    }
    // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-unused-expressions
    children && children.length > 0 ? item.children = fixMenuItemIcon(children) : null
  });
  return menus
};

export default fixMenuItemIcon;

