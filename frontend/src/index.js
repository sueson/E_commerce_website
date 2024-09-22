import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from './Store';
import {Provider} from 'react-redux';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={Store}>  {/* store act as a parent for App using Provider... */}
      <App />
    </Provider>
  </React.StrictMode>
);


