import { Line, Bar } from 'react-chartjs-2';
import { useMemo, useState, useEffect } from 'react';
import { useHistorial } from '../context/HistorialContext';
import ConsumptionData from '../components/ConcumptionData';
import CustomSplitter from '../components/Splitter';
import { Typography, Button, Alert } from 'antd';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  LineController,
  BarController,
} from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Tooltip,
  Legend
);

const { Title, Text } = Typography;

export default function Dashboard() {
  const [txhash, setTxhash] = useState("");
  const [uploadAlertSuccess, setUploadAlertSuccess] = useState(false);
  const [uploadAlertError, setUploadAlertError] = useState(false);
  const historial = useHistorial();

  // Última lectura
  const currentValue = historial.length > 0 
    ? historial[historial.length - 1].kwConvertidos 
    : 0;

  // Lectura anterior
  const lastValue = historial.length > 1
    ? historial[historial.length - 2].kwConvertidos
    : 0;

  console.log('Últimas 7 lecturas:', historial.slice(-7));

  const dataLine = useMemo(() => {
    const last7 = historial.slice(-7);

    return {
      labels: last7.map(entry => new Date(entry.timestamp).toLocaleTimeString()), 
      datasets: [
        {
          label: 'Consumo',
          data: last7.map(entry => entry.kwConvertidos), 
          borderColor: 'limegreen',
          backgroundColor: 'rgba(0,255,0,0.2)',
          fill: true,
          tension: 0.3,
        },
      ],
    };
  }, [historial]);

  const dataBar = useMemo(() => {
    if (!historial || historial.length === 0) return { labels: [], datasets: [] };

    // Agrupar lecturas por día
    const mapDias = {};
    historial.forEach((entry) => {
      const fecha = new Date(entry.timestamp).toISOString().slice(0, 10); // YYYY-MM-DD
      if (!mapDias[fecha]) mapDias[fecha] = [];
      mapDias[fecha].push(entry.kwConvertidos);
    });

    // Calcular consumo real diario usando diferencias consecutivas
    const consumoDiario = {};
    Object.keys(mapDias).forEach((fecha) => {
      const lecturas = mapDias[fecha];
      let total = 0;
      for (let i = 1; i < lecturas.length; i++) {
        const diff = lecturas[i] - lecturas[i - 1];
        total += diff > 0 ? diff : 0; 
      }
      consumoDiario[fecha] = total;
    });

    // Ordenar fechas y tomar solo los últimos 7 días
    const fechasOrdenadas = Object.keys(consumoDiario).sort();
    const ultimos7 = fechasOrdenadas.slice(-7);

    return {
      labels: ultimos7,
      datasets: [
        {
          label: 'Consumo total diario (kWh)',
          data: ultimos7.map((fecha) => consumoDiario[fecha]),
          backgroundColor: '#ee8e34ff',
        },
      ],
    };
  }, [historial]);

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true } },
    }),
    []
  );

  const handleSubirHistorial = async () => {
    try {
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
    <div>
      <Title>Dashboard</Title>
      {/* Consumo actual arriba */}
      <ConsumptionData currentValue={currentValue} lastValue={lastValue} />

      {/* Gráficas lado a lado */}
      <CustomSplitter
        style={{
          margin: 'auto',
          padding: '10px',
          minHeight: 300,
          height: 'auto',
        }}
        firstPanelContent={
          <div style={{ flex: 1, padding: '0 20px' }}>
            <h5>Últimas 7 Lecturas</h5>
            <Line
              data={dataLine}
              options={{ ...options, maintainAspectRatio: true }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        }
        secondPanelContent={
          <div style={{ flex: 1, padding: '0 20px' }}>
            <h5>Historial (7 días)</h5>
            <Bar
              data={dataBar}
              options={{ ...options, maintainAspectRatio: true }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        }
      />
      <br />
      <Button type="primary" block onClick={handleSubirHistorial}>
        Subir Historial a Blockchain
      </Button>
      <br /><br />
        {uploadAlertSuccess && (
          <Alert
            type="success"
            showIcon
            closable
            message={
              <>
                Historial subido a Blockchain, su Transaction Hash es:{" "}
                <Link to={`https://amoy.polygonscan.com/tx/${txhash}`} target="_blank" rel="noopener noreferrer">
                  <Text style={{ fontWeight: 500, textDecoration: 'underline' }}>
                    {txhash}
                  </Text>
                </Link>
              </>
            }
            onClose={() => setUploadAlertSuccess(false)} 
          />
        )}
        {uploadAlertError && (<Alert message="Error subiendo historial" type="error" showIcon />)}
    </div>
  );
}
