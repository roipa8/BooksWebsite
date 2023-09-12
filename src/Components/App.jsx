import React from 'react';
import Home from './Home';
import Register from './Register';
import Login from './Login';
// import Welcome from './Welcome';
import Logout from "./Logout";
import { AuthProvider } from './AuthContext';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';

const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<Home />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
        {/* <Route path='welcome' element={<Welcome />}/> */}
        <Route path='logout' element={<Logout />}/>
      </Route>
    )
  );

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    )
}

export default App;
