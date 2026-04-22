import './App.css';
import { PrimerComponente } from './components/PrimerComponente';
import Map1 from './components/Map1';
import Map2 from './components/Map2';

function App() {
  return (
    <div className="App">
      <header className="App-header">  
        <PrimerComponente />
      </header>
      
      <main className="App-body">
        <div className="map-container">
          <Map1 />
          <Map2 /> 
        </div>
      </main>
    </div>
  );
}

export default App;