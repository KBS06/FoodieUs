import React from 'react';
import {Route,Routes} from 'react-router-dom'
import Home from './pages/Home/Home';
import ContactPage from './pages/ContactPage/ContactPage';
import AboutPage from './pages/AboutPage/AboutPage';
import Cart from './pages/Cart/Cart';
import Menu from './pages/Menu/Menu';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import SignUp from './components/SignUp/SignUp';
import Footer from './components/Footer/Footer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import VerifyPaymentPage from './pages/VerifyPaymentPage/VerifyPaymentPage';
import MyOrderPage from './pages/MyOrderPage/MyOrderPage';

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/contact' element={<ContactPage/>}/>
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/menu' element={<Menu/>}/>

        {/**PAYMENT VERIFICATION */}
        <Route path='/myorder/verify' element={<VerifyPaymentPage />}/>
        <Route path='/login' element={<Home/>} />
        <Route path='/signup' element={<SignUp/>}/>

        <Route path='/cart' element={
          <PrivateRoute>
            <Cart/>
          </PrivateRoute>
        }/>

        <Route path='/checkout' element={<PrivateRoute><CheckoutPage/></PrivateRoute>}/>
        <Route path='/myorder' element={<PrivateRoute><MyOrderPage/></PrivateRoute>}/>
      </Routes>
      <Footer />
    </div>
  )
}

export default App