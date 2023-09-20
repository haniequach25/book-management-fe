import { BookOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarLogo from './SidebarLogo';

type MenuItem = Required<MenuProps>['items'][number];

export const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

const menuItems: MenuProps['items'] = [getItem('Book Manager', '', <BookOutlined />)];

interface ISideBarContentProp {
  menuItems?: MenuProps['items'];
}

const SidebarContent = (props: ISideBarContentProp) => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKeys = location.pathname.substring(1);
  const defaultOpenKeys = selectedKeys.split('/')[0];

  const [current, setCurrent] = useState<string>(defaultOpenKeys);

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  return (
    <>
      <SidebarLogo />
      <Menu
        style={{ height: 'calc(100% - 64px)' }}
        onClick={onClick}
        selectedKeys={[current || '']}
        defaultOpenKeys={[defaultOpenKeys]}
        mode="inline"
        items={menuItems}
      />
    </>
  );
};

export default SidebarContent;
