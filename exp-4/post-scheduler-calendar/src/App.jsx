import CalendarView from './components/Calendar/CalendarView';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>Post Scheduler</h1>
        <p className="app__subtitle">Plan, drag, and reschedule your content calendar</p>
      </header>
      <CalendarView />
    </div>
  );
}

export default App;
