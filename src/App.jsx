import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ListaPontos from './pages/ListaPontos.jsx';
import FormularioPonto from './pages/FormularioPonto.jsx';
import DetalhePonto from './pages/DetalhePonto.jsx';
import NaoEncontrado from './pages/NaoEncontrado.jsx';

export default function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/pontos" replace />} />
          <Route path="/pontos" element={<ListaPontos />} />
          <Route path="/pontos/novo" element={<FormularioPonto />} />
          <Route path="/pontos/:id" element={<DetalhePonto />} />
          <Route path="/pontos/:id/editar" element={<FormularioPonto />} />
          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <span>GeoPoint · Gerenciamento de pontos geográficos</span>
          <span>Desenvolvimento Frontend · Trabalho G2</span>
        </div>
      </footer>
    </div>
  );
}
