import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Alert } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // ⚡ aquí
  const location = useLocation(); // para saber la ruta activa
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); 
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" style={{ height: 64, margin: 16 }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]} // marca la ruta activa
          items={[
            { key: '/', icon: <UserOutlined />, label: <Link to="/">Dashboard</Link> },
            { key: '/guardados', icon: <VideoCameraOutlined />, label: <Link to="/guardados">Guardados</Link> },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
            {showAlert && (
            <Alert
              message="Nueva lectura registrada"
              type="info"
              showIcon
              style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}
            />
            )}
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '16px', width: 64, height: 64 }}
            />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            position: 'relative',
          }}
        >
            {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
