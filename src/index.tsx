import './stylesheets/styles.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import { exampleConfigs } from './swarmjs-core';

const { simConfig, benchmarkConfig } = exampleConfigs.simpleVoronoi;

ReactDOM.render(
  <App config={simConfig} benchSettings={benchmarkConfig}/>,
  document.getElementById('root')
);