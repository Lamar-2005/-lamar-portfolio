import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Preloader from './components/Preloader';
import Home from './pages/Home';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* More pages (About, Projects, Categories, Contact, CV, FAQ, 404...) get added here next. */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
