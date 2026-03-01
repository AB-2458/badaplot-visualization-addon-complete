import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicView from './pages/PublicView';
import AdminDigitize from './pages/AdminDigitize';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicView />} />
        <Route path="/plots" element={<PublicView />} />
        <Route path="/admin" element={<AdminDigitize />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
