import React from 'react';

import FormeBuilder from './FormeBuilder';
import formSchema from './formSchema.json';
import './App.css';

const App = () => (
  <div className="App">
    <FormeBuilder formSchema={formSchema.formSchema} />
  </div>
);

export default App;
