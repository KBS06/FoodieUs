import React, { useEffect, useState } from 'react'
import { FaArrowRight, FaCheckCircle, FaEye, FaEyeSlash, FaUser, FaLock, FaUserPlus, FaExclamationCircle, FaUserShield } from 'react-icons/fa';
import { iconClass, inputBase } from '../../assets/dummydata';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const url = import.meta.env.VITE_BASE_URL

const Login = ({ onLoginSuccess, onClose }) => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState({ visible: false, message: '', isError: false });
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    loginAs: 'user' // user or admin
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('loginData');
    if (stored) setFormData(JSON.parse(stored));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    if (!formData.email || !formData.password) {
      setShowToast({ visible: true, message: 'Please fill in all fields.', isError: true });
      setTimeout(() => setShowToast({ visible: false, message: '', isError: false }), 2000);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${url}/api/user/login`, {
        email: formData.email,
        password: formData.password,
      })

      if (res.status === 200 && res.data.success && res.data.token) {
        const userRole = res.data.user.role;

        // Check if login role matches user's actual role
        if (formData.loginAs !== userRole) {
          setShowToast({
            visible: true,
            message: `Access denied. You cannot login as ${formData.loginAs} with ${userRole} credentials.`,
            isError: true
          });
          setTimeout(() => setShowToast({ visible: false, message: '', isError: false }), 3000);
          setLoading(false);
          return;
        }

        localStorage.setItem('authToken', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        // Remember me
        formData.rememberMe ? localStorage.setItem('loginData', JSON.stringify(formData))
          : localStorage.removeItem('loginData')

        setShowToast({ visible: true, message: 'Login Successful!', isError: false })

        setTimeout(() => {
          setShowToast(prev => ({ ...prev, visible: false }))

          // Redirect based on role
          if (userRole === 'admin') {
            // Redirect to admin dashboard
            window.location.href = `${import.meta.env.VITE_ADMIN_URL}`; // Admin panel URL
          } else {
            // Stay on frontend for users
            onLoginSuccess(res.data.token);
            navigate('/');
          }
          setLoading(false);
        }, 1500)
      } else {
        throw new Error(res.data.message || 'Login Failed')
      }
    }
    catch (err) {
      console.error('Login error', err);
      const msg = err.response?.data?.message || err.message || 'Login Failed'
      setShowToast({ visible: true, message: msg, isError: true })
      setLoading(false);
      setTimeout(() => {
        setShowToast(prev => ({ ...prev, visible: false }))
      }, 2000)
    }
  }

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <div className='space-y-6 relative'>
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300
        ${showToast.visible ? 'translate-y-0 opacity-100 ' : '-translate-y-10 opacity-0'}`}>
        <div className={` px-4 py-3 rounded-md shadow-lg flex 
          items-center gap-2 text-sm 
          ${showToast.isError ? 'bg-red-600' : 'bg-green-600'} text-white`}>
          {showToast.isError ? (
            <FaExclamationCircle className='flex-shrink-0' />
          ) : (
            <FaCheckCircle className='flex-shrink-0' />
          )}
          <span>{showToast.message}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Role Selection */}
        <div className='space-y-3'>
          <label className='block text-amber-100 font-medium'>Login as:</label>
          <div className='grid grid-cols-2 gap-3'>
            <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
              ${formData.loginAs === 'user'
                ? 'border-amber-400 bg-amber-400/10 text-amber-100'
                : 'border-amber-600/30 bg-amber-600/5 text-amber-200'}`}>
              <input
                type='radio'
                name='loginAs'
                value='user'
                checked={formData.loginAs === 'user'}
                onChange={handleChange}
                className='sr-only'
              />
              <FaUser className='mr-2' />
              User
            </label>
            <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
              ${formData.loginAs === 'admin'
                ? 'border-amber-400 bg-amber-400/10 text-amber-100'
                : 'border-amber-600/30 bg-amber-600/5 text-amber-200'}`}>
              <input
                type='radio'
                name='loginAs'
                value='admin'
                checked={formData.loginAs === 'admin'}
                onChange={handleChange}
                className='sr-only'
              />
              <FaUserShield className='mr-2' />
              Admin
            </label>
          </div>
        </div>

        <div className='relative'>
          <FaUser className={iconClass} />
          <input type='email' name='email' placeholder='Email' value={formData.email}
            onChange={handleChange} className={`${inputBase} pl-10 pr-4 py-3`} />
        </div>

        <div className='relative'>
          <FaLock className={iconClass} />
          <input type={showPassword ? 'text' : 'password'} name='password' placeholder='Password' value={formData.password}
            onChange={handleChange} className={`${inputBase} pl-10 pr-4 py-3`} />
          <button type='button' onClick={toggleShowPassword} className='absolute right-3
          top-1/2 transform -translate-y-1/2 text-amber-400 '>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className='flex items-center'>
          <label className='flex items-center'>
            <input type='checkbox'
              name='rememberMe'
              checked={formData.rememberMe}
              onChange={handleChange}
              className='form-checkbox h-5 w-5 text-shadow-amber-600 bg-[#2D1B0E] border-amber-400 rounded
            focus:ring-amber-600'/>
            <span className='ml-2 text-amber-100 '>Remember me</span>
          </label>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold
          rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform
          disabled:opacity-50 disabled:cursor-not-allowed' >
          {loading ? 'Signing In...' : 'Sign In'} <FaArrowRight />
        </button>
      </form>

      <div className='text-center'>
        <Link to='/signup'
          onClick={() => onClose && onClose()}
          className='inline-flex items-center gap-2 text-amber-400
        hover:text-amber-600 transition-colors' >
          <FaUserPlus />Create New Account
        </Link>
      </div>
    </div>
  )
}

export default Login