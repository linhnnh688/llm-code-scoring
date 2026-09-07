import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ArchitectureSection from './components/ArchitectureSection';
import ModuleSection from './components/ModuleSection';
import NotebookSection from './components/NotebookSection';
import DemoSection from './components/DemoSection';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === 'overview' && (
          <>
            <HeroSection />
            <ArchitectureSection />
          </>
        )}
        {activeTab === 'modules' && <ModuleSection />}
        {activeTab === 'notebook' && <NotebookSection />}
        {activeTab === 'demo' && <DemoSection />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
