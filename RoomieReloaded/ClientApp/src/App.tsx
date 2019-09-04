import React from 'react';
import './App.css';
import Calendar from './components/calendarView';
import Navigation from './components/navigation';
import { initializeIcons } from '@uifabric/icons';

//load icon fonts from local directory. if new icons should be used, it may be required to copy the fonts from /node_modules/@uifabric/icons/fonts to /public/icons/fonts
// maybe add a build step to copy fonts automatically
initializeIcons('./icons/fonts/');

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-navigation">
          <Navigation />
        </div>
      </header>
      <div className="App-content">
        <Calendar />
      </div>
    </div>
  );
};

export default App;
