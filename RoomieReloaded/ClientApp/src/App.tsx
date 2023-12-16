import React from 'react';
import './App.css';
import Calendar from './components/calendarView';
import Navigation from './components/navigation';
import CalendarView from './components/calendarView/calendarView';

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
