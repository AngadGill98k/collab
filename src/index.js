import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import {store} from './redux/stores.js'
import {RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './components/login/login.js';
import Chat from './components/Chat/Chat.js';
import Friends from './components/Friends/Friends.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>,
  },
  {
    path: '/home',
    element: <App/>,
  },
])
root.render(
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
