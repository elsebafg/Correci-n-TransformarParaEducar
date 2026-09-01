import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Levels from './pages/Levels';
import Wellbeing from './pages/Wellbeing';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Registration from './pages/Registration';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quienes-somos" element={<About />} />
          <Route path="niveles" element={<Levels />} />
          <Route path="bienestar" element={<Wellbeing />} />
          <Route path="noticias" element={<News />} />
          <Route path="noticias/:id" element={<NewsDetail />} />
          <Route path="inscripcion" element={<Registration />} />
          <Route path="empleo" element={<Jobs />} />
          <Route path="acceso" element={<Login />} />
          <Route path="registro" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
