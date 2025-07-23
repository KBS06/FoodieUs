// admin/src/App.jsx
import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import AddItems from './components/AddItems'
import List from './components/List'
import Order from './components/Order'
import Dashboard from './components/Dashboard'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/add-items' element={<AddItems />} />
        <Route path='/list' element={<List />} />
        <Route path='/orders' element={<Order />} />
      </Routes>
    </>
  )
}

export default App