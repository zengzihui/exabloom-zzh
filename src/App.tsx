// import { ReactFlow } from '@xyflow/react';
 
// import '@xyflow/react/dist/style.css';
 
// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//   { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// ];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
// export default function App() {
//   return (
//     <div style={{ width: '100vw', height: '100vh' }}>
//       <h1>hello</h1>
//       <ReactFlow nodes={initialNodes} edges={initialEdges} />
//     </div>
//   );
// }

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css'
import Header from './components/Header';
import Level1Page from './pages/Level1Page';
import Level2Page from './pages/Level2Page';
import Level3Page from './pages/Level3Page';
import { ReactFlowProvider } from '@xyflow/react';


function App() {
  

  return (
    <>
      <Router>
        <div className='flex flex-col w-screen h-screen'>
          <div>
            <Header />
          </div>
          
          <div className='h-full'>
            <ReactFlowProvider>
              <Routes>
                <Route path="/level1" element={<Level1Page />} />
                <Route path="/level2" element={<Level2Page />} />
                <Route path="/level3" element={<Level3Page />} />
              </Routes>
            </ReactFlowProvider>
           
          </div>
        </div>
        
       
      </Router>
  
      
    </>
  )
}

export default App
