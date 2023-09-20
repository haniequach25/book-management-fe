import { Drawer, Layout, MenuProps } from 'antd';
import { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { TAB_SIZE } from '../../constants/ThemeSetting';
import { RootState } from '../../store';
import SidebarContent from '../SideBar/SidebarContent';
import Topbar from '../TopBar';

const { Content, Sider } = Layout;

interface IMainAppProp {
  menuItems?: MenuProps['items'];
  infoDropdownItems?: MenuProps['items'];
  extraTopbar?: ReactNode;
}

const MainApp = (props: IMainAppProp) => {
  const [collapsed, setCollapsed] = useState(false);
  const { width } = useSelector((state: RootState) => state.setting);

  return (
    <Layout style={{ minHeight: '100vh' }} hasSider={true}>
      <Sider className="shadow" trigger={null} collapsible collapsed={width < TAB_SIZE ? false : collapsed}>
        {width < TAB_SIZE ? (
          <Drawer open={collapsed} placement="left" closable={false} onClose={() => setCollapsed(!collapsed)}>
            <SidebarContent menuItems={props.menuItems} />
          </Drawer>
        ) : (
          <SidebarContent menuItems={props.menuItems} />
        )}
      </Sider>
      <Layout>
        <Layout>
          <Topbar
            collapsed={collapsed}
            onCollapsed={() => setCollapsed(!collapsed)}
            infoDropdownItems={props.infoDropdownItems}
          >
            {props.extraTopbar}
          </Topbar>
          <Content
            style={{
              padding: 24,
              margin: 0,
              height: '1vh',
              overflow: 'auto',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default MainApp;
