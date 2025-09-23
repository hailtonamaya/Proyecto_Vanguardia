import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Guardados from "./pages/Guardados";
import Transacciones from "./pages/Transacciones";
import MainLayout from "./components/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/guardados" element={<MainLayout><Guardados /></MainLayout>} />
        <Route path="/transacciones" element={<MainLayout><Transacciones /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
