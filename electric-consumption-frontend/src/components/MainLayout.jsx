import { Link, useLocation } from 'react-router-dom';
import { HistorialProvider } from '../context/HistorialContext';
import { Layout, Menu, Button, theme, Alert, Image } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [historial, setHistorial] = useState([]);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // LLAMADA AL BACKEND cada 10 segundos y mostrar alerta
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/cid/obtener-historial");
        setHistorial(res.data);

        // Mostrar alerta al actualizar
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } catch (err) {
        console.error("Error al cargar historial:", err);
      }
    };

    fetchHistorial();
    const interval = setInterval(fetchHistorial, 10000);
    return () => clearInterval(interval);
  }, []);


  return (
    <HistorialProvider historial={historial}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
            <Image
              src="/Logo_Electricidad.png"
              alt="Logo"
              preview={false}
              style={{ width: "40%", height: "auto", display: "block", margin: "0 auto" }}
            />
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
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
    </HistorialProvider>
  );
};

export default MainLayout;
