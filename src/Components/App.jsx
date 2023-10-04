import React from 'react';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import MyCart from './MyCart';
import Logout from "./Logout";
import AdvancedSearch from "./AdvancedSearch";
import { AuthProvider } from './AuthContext';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { BooksProvider } from './BooksContext';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Home />} />
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />} />
      <Route path='logout' element={<Logout />} />
      <Route path='myBooks' element={<MyCart />} />
      <Route path='advancedSearch' element={<AdvancedSearch />} />
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
