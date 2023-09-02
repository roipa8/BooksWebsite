import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App.jsx';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import Register from './Components/Register.jsx';
import Login from './Components/Login.jsx';
import Welcome from './Components/Welcome.jsx';
import Logout from './Components/Logout.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<App />} />
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />} />
      <Route path='welcome' element={<Welcome />}/>
      <Route path='logout' element={<Logout />}/>
    </Route>
  )
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

