import { Link, useLocation } from 'react-router-dom';
import { HistorialProvider } from '../context/HistorialContext';
import { Layout, Menu, Button, theme, Alert, Image,Typography, Flex, Radio} from 'antd';
import {
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SaveOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const contractAddress = "0x3C6aDb987EA8B44DeeEC17dDED4de4A87D46229E"; 
const plainOptions = [
  { label: "Leer desde Arduino", value: "arduino" },
  { label: "Leer desde Blockchain", value: "blockchain" },
];



const MainLayout = ({ children }) => {
  const [txhash, setTxhash] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [readingAlert, setReadingAlert ] = useState(false);
  const [selectedSource, setSelectedSource] = useState("blockchain");
  const [uploadAlertSuccess, setUploadAlertSuccess] = useState(false);
  const [uploadAlertError, setUploadAlertError] = useState(false);
  const [historial, setHistorial] = useState([]);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onChange = (e) => {
    const value = e.target.value;
    setSelectedSource(value);
    setReadingAlert(true);
    setTimeout(() => setReadingAlert(false), 3000);
    console.log("Fuente seleccionada: ", value);
  };

  // LLAMADA AL BACKEND cada 10 segundos y mostrar alerta
  useEffect(() => {
  const fetchHistorial = async () => {
    try {
      let endpoint = "";
      if(selectedSource === "blockchain"){
          endpoint = "http://localhost:3001/api/historial/obtener-historial-blockchain";
      }else {
          endpoint = "http://localhost:3001/api/historial/obtener-historial-local";
      }

      const res = await axios.get(endpoint);
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
  }, [selectedSource]); 

  const handleSubirHistorial = async () => {
    try {
      // Aquí mandas el historial al backend
      const res = await axios.post(
        "http://localhost:3001/api/cid/upload-historial" 
      );
      if(res.data.txHash){
        setTxhash(res.data.txHash);
        setUploadAlertSuccess(true);
      }
      console.log("Respuesta del servidor:", res.data);
    } catch (err) {
      setUploadAlertError(true);
      setTimeout(() => setUploadAlertError(false), 5000);
      console.error("Error al subir historial:", err);
    }
  };


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
              { key: '/', icon: <BarChartOutlined />, label: <Link to="/">Dashboard</Link> },
              { key: '/guardados', icon: <SaveOutlined />, label: <Link to="/guardados">Guardados</Link> },
            ]}
          />
          <div
            style={{
              padding: "12px",
              borderTop: "1px solid #303030",
              textAlign: "center",
            }}
          >
            <Text style={{ fontSize: "12px", color: "#bbb" }}>Contrato:</Text>
            <br />
            <Text
              style={{ fontSize: "12px", color: "#bbb" }}
              copyable={{ text: contractAddress }}
            >
              {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
            </Text>
          </div>
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
            {readingAlert && (
              <Alert
                message={`Leyendo desde ${selectedSource}`}
                type="info"
                showIcon
                style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}s
              />
            )}            
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <Radio.Group options={plainOptions} defaultValue={['Apple']} onChange={onChange} />
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
            <Flex vertical gap="small" style={{ width: '100%' }}>
              <br/>
              <Button type="primary" block onClick={handleSubirHistorial}>
                Subir Historial a Blockchain
              </Button>
              <br />
              {uploadAlertSuccess && (
                <Alert
                  type="success"
                  showIcon
                  closable
                  message={
                    <>
                      Historial subido a Blockchain, su Transaction Hash es:{" "}
                      <Text copyable={{ text: txhash }} style={{ fontWeight: 500 }}>
                        {txhash}
                      </Text>
                    </>
                  }
                  onClose={() => setUploadAlertSuccess(false)} 
                />
              )}
              {uploadAlertError && (<Alert message="Error subiendo historial" type="error" showIcon />)}
            </Flex>
          </Content>
          
        </Layout>
      </Layout>
    </HistorialProvider>
  );
};

export default MainLayout;
