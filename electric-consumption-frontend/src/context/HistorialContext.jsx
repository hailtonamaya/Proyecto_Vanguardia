import { createContext, useContext } from "react";

const HistorialContext = createContext([]);

export const HistorialProvider = ({ children, historial }) => {
  return (
    <HistorialContext.Provider value={historial}>
      {children}
    </HistorialContext.Provider>
  );
};

// Hook para usar el historial
export const useHistorial = () => useContext(HistorialContext);
