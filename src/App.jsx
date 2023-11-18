import React from 'react';
import Home from './Components/Home';
import Register from './Components/Register';
import Login from './Components/Login';
import MyCart from './Components/MyCart/MyCart';
import Logout from "./Components/Logout";
import AdvancedSearch from "./Components/AdvancedSearch/AdvancedSearch";
import { AuthProvider } from './Contexts/AuthContext';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { BooksProvider } from './Contexts/BooksContext';
import About from './navbar-pages/About/About';
import ResetPassword from './Components/ResetPassword/ResetPassword';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Home />} />
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />} />
      <Route path='logout' element={<Logout />} />
      <Route path='myBooks' element={<MyCart />} />
      <Route path='about' element={<About />} />
      <Route path='advancedSearch' element={<AdvancedSearch />} />
      <Route path='resetPassword/:token' element={<ResetPassword />} />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <BooksProvider>
        <RouterProvider router={router} />
      </BooksProvider>
    </AuthProvider>
  )
}

export default App;
