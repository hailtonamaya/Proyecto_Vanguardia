import { Line, Bar } from 'react-chartjs-2';
import { useMemo } from 'react';
import { useHistorial } from '../context/HistorialContext';
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
  const historial = useHistorial();

  // Última lectura
  const currentValue = historial.length > 0 
    ? historial[historial.length - 1].kwConvertidos 
    : 0;

  // Lectura anterior
  const lastValue = historial.length > 1
    ? historial[historial.length - 2].kwConvertidos
    : 0;

  // console.log('Lectura actual:', currentValue);
  // console.log('Lectura anterior:', lastValue);

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
    const last7 = historial.slice(-7);

    return {
      labels: last7.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
      datasets: [
        {
          label: 'Consumo',
          data: last7.map(entry => entry.kwConvertidos),
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

  return (
    <div>
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
    </div>
  );
}
