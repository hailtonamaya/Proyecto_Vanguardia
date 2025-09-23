import { useEffect, useState } from "react";
import { Typography, Table, Space, Tag, Spin, message, Button, Alert } from "antd";
import { RedoOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function Transacciones() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reloadAlert, setReloadAlert] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/contract/obtener-transacciones"); 
      const data = await res.json();

      const mapped = data.map((tx, index) => ({
        key: index,
        blockNumber: tx.blockNumber,
        from: tx.from,
        to: tx.to,
        value: tx.value, 
        gasUsed: tx.gasUsed,
        functionName: tx.functionName,
        hash: tx.hash,
        status: tx.isError === "0" ? "Success" : "Failed",
        date: new Date(tx.timeStamp * 1000).toLocaleString() 
      }));
      console.log(mapped);

      setDataSource(mapped);
    } catch (error) {
      console.error(error);
      message.error("Error al cargar las transacciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const reloadTransactions = () => {
    fetchTransactions();
    setReloadAlert(true);
    setTimeout(() => setReloadAlert(false), 3000);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
    };

  const columns = [
    {
      title: "Block",
      dataIndex: "blockNumber",
      key: "blockNumber",
      sorter: (a, b) => a.blockNumber - b.blockNumber,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      render: text => <span style={{ fontFamily: "monospace" }}>{text}</span>,
      sorter: (a, b) => a.blockNumber - b.blockNumber,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
      render: text => <span style={{ fontFamily: "monospace" }}>{text}</span>,
      sorter: (a, b) => a.blockNumber - b.blockNumber,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: "Function",
      dataIndex: "functionName",
      key: "functionName",
      render: text => <Tag color="blue">{text}</Tag>,
      sorter: (a, b) => a.blockNumber - b.blockNumber,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.blockNumber - b.blockNumber,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: status => {
        let color = status === "Success" ? "green" : "volcano";
        return <Tag color={color}>{status}</Tag>;
      },
      sorter: (a, b) => a.blockNumber - b.blockNumber,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            href={`https://amoy.polygonscan.com/tx/${record.hash}`} 
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver detalles
          </a>
        </Space>
      ),
      sorter: (a, b) => a.blockNumber - b.blockNumber,
      sortDirections: ['descend', 'ascend']
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Transacciones del Contrato</Title>
        <Button type="primary" shape="round" icon={<ReloadOutlined />} size="Large" onClick={reloadTransactions} />
      </div>
      {reloadAlert && <Alert
          type="success"
          showIcon
          message={"Transacciones recargadas"}
        />
      }
      <br />
      {loading ? <Spin /> : <Table columns={columns} dataSource={dataSource} onChange={onChange}/>}
    </div>
  );
}
