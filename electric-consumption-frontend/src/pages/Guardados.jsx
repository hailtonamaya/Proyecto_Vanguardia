import { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import MainLayout from "../components/MainLayout";

// Asegúrate de que chart.js esté configurado globalmente (igual que en Dashboard)
export default function Guardados() {
  const [labels, setLabels] = useState([]);
  const [valores, setValores] = useState([]);

  useEffect(() => {
    async function loadFromIPFS(cid) {
      try {
        const res = await fetch(`/api/ipfs/${cid}`);
        const data = await res.json();
        const lecturas = data.lecturas;

        // agrupar por fecha y mostrar la primera fecha por defecto
        const fechasUnicas = [...new Set(lecturas.map((l) => l.fecha))];
        if (fechasUnicas.length > 0) {
          const datos = lecturas.filter((l) => l.fecha === fechasUnicas[0]);
          setLabels(datos.map((d) => d.hora));
          setValores(datos.map((d) => d.consumo));
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    }

    loadFromIPFS("bafkreicpmix2pnjrbigiknnxwv6yqdxtufljxfktufnw45mhmnwqoe7dfq");
  }, []);

  const data = useMemo(
    () => ({
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
    }),
    [labels, valores]
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
      <div className="p-6">
        <h5 className="mb-4">Lecturas guardadas</h5>
        <Line data={data} options={options} />
      </div>
    </MainLayout>
  );
}
