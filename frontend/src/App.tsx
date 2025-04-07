import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css'
import FlowPage from './pages/FlowPage';
import { ReactFlowProvider } from '@xyflow/react';

function App() {
  return (
    <>
      <Router>
        <div className='flex flex-col w-screen h-screen'>
          <div className='h-full'>
            <ReactFlowProvider>
              <Routes>
                <Route path="/" element={<FlowPage />} />
              </Routes>
            </ReactFlowProvider>
           
          </div>
        </div>
        
       
      </Router>
  
      
    </>
  )
}

export default App
