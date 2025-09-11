const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Archivo donde guardaremos el historial temporal
const dataFile = path.join(__dirname, '../uploads/historial.json');

// Función para obtener datos del Arduino
async function fetchArduinoData() {
  try {
    const res = await axios.get('http://localhost:1880/datos-arduino');
    const raw = res.data; 
    // Ejemplo: "Voltaje: 0.00 V | Corriente: 987.29 mA | Potencia: 0.00 mW | kW: 0.0000 kW"
    const parts = raw.split('|').map(p => p.trim());
    const voltaje_V = parseFloat(parts[0].split(':')[1]);
    const corriente_mA = parseFloat(parts[1].split(':')[1]);
    const potencia_mW = parseFloat(parts[2].split(':')[1]);
    const kw = parseFloat(parts[3].split(':')[1]);
    const kwConvertidos = ((voltaje_V * (corriente_mA / 1000)) / 1000)* 100000; // Factor de corrección

    const lectura = {
    timestamp: new Date().toISOString(),
    voltaje_V,
    corriente_mA,
    potencia_mW,
    kw,
    kwConvertidos
  };


    // Guardar en archivo JSON acumulando
    let historial = [];
    if (fs.existsSync(dataFile)) {
      historial = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }
    historial.push(lectura);
    fs.writeFileSync(dataFile, JSON.stringify(historial, null, 2));

    console.log("Lectura guardada:", lectura);
  } catch (err) {
    console.error("Error al leer datos del Arduino:", err.message);
  }
}

module.exports = { fetchArduinoData, dataFile };
