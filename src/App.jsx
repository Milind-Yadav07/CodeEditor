import React from 'react';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import { EditorProvider } from './context/EditorContext';

function App() {
  return (
    <EditorProvider>
      <div className="App">
        <Navbar />
        <Layout />
      </div>
    </EditorProvider>
  )
}

export default App;
