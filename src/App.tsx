import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css'
import Header from './components/Header';
import Level1Page from './pages/Level1Page';
import Level2Page from './pages/Level2Page';
import Level3Page from './pages/Level3Page';


function App() {
  

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/level1" element={<Level1Page />} />
          <Route path="/level2" element={<Level2Page />} />
          <Route path="/level3" element={<Level3Page />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
