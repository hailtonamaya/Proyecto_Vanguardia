import { Line, Bar } from 'react-chartjs-2';
import { useMemo } from 'react';
import { Flex } from 'antd';
import MainLayout from '../components/MainLayout';
import ConsumptionData from '../components/ConcumptionData';
import CustomSplitter from '../components/Splitter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const dataLine = useMemo(
    () => ({
      labels: ['Enero', 'Febrero', 'Marzo'],
      datasets: [
        {
          label: 'Consumo',
          data: [10, 20, 30],
          borderColor: 'limegreen',
          backgroundColor: 'rgba(0,255,0,0.2)',
          fill: true,
          tension: 0.3,
        },
      ],
    }),
    []
  );

  const dataBar = useMemo(
    () => ({
      labels: ['Lunes', 'Martes', 'Miércoles'],
      datasets: [
        {
          label: 'Consumo',
          data: [15, 47, 5],
          backgroundColor: 'cyan',
        },
      ],
    }),
    []
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true } },
    }),
    []
  );

  return (
    <MainLayout>
  {/* Consumo actual arriba */}
  <ConsumptionData currentValue={11.28} lastValue={9.5} />

  {/* Gráficas lado a lado, responsive con márgenes */}
  <CustomSplitter
    style={{ 
      margin: '20px 0',   // separación arriba y abajo
      padding: '10px',    // separación interna opcional
      minHeight: 300,     // altura mínima para que no se vea muy comprimido
      height: '400px',    // altura fija para consistencia
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
</MainLayout>


  );
}
