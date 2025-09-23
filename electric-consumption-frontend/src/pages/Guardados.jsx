import { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Radio, Tabs, Typography } from "antd";
import { useHistorial } from '../context/HistorialContext';
const { Title } = Typography;

export default function Guardados() {
  const historial = useHistorial();

  // Supongamos que esta es la info ya cargada del JSON
  const lecturasJSON = historial;
  console.log("Lecturas JSON:", lecturasJSON);

  // Agrupar lecturas por día
  const dias = useMemo(() => {
  if (!lecturasJSON) return {}; 
    const map = {};
    lecturasJSON.forEach((l) => {
      const fecha = new Date(l.timestamp).toISOString().slice(0, 10); // YYYY-MM-DD
      if (!map[fecha]) map[fecha] = [];
      map[fecha].push({
        hora: new Date(l.timestamp).toLocaleTimeString(),
        consumo: l.kwConvertidos,
      });
    });
    return map;
  }, [lecturasJSON]);


  const [tabPosition, setTabPosition] = useState("top");

  const handleModeChange = (e) => {
    setTabPosition(e.target.value);
  };

  // Generar los items de Tabs dinámicamente
  const tabItems = useMemo(
    () =>
      Object.keys(dias).map((fecha, idx) => {
        const datosDia = dias[fecha];
        const labels = datosDia.map((d) => d.hora);
        const valores = datosDia.map((d) => d.consumo);

        const data = {
          labels,
          datasets: [
            {
              label: "Consumo (kWh)",
              data: valores,
              borderColor: "blue",
              backgroundColor: "rgba(0,0,255,0.2)",
              fill: true,
              tension: 0.3,
            },
          ],
        };

        const options = {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } },
        };

        return {
          label: fecha,
          key: idx,
          children: <div style={{ flex: 1, padding: '0 20px' }}>
                      <Line data={data} options={{options, maintainAspectRatio: false}} style={{ width: '100%', height: '100%' }}/>
                    </div>,
        };
      }),
    [dias]
  );

  return (
    <div className="p-6">
      <Title>Guardados</Title>

      <Radio.Group
        onChange={handleModeChange}
        value={tabPosition}
        style={{ marginBottom: 8 }}
      >
        <Radio.Button value="top">Horizontal</Radio.Button>
        <Radio.Button value="left">Vertical</Radio.Button>
      </Radio.Group>

      <Tabs
        defaultActiveKey="0"
        tabPosition={tabPosition}
        items={tabItems}
        style={{
          margin: 'auto',
          padding: '10px',
          minHeight: 300,
          height: 'auto',
        }}
      />
    </div>
  );
}
