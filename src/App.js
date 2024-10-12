import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MapPage from './components/MapPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/map" component={MapPage} />
      </Switch>
    </Router>
  );
}

export default App;
