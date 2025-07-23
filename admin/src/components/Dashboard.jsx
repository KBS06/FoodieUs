// admin/src/components/Dashboard.jsx
import React from 'react';
import { GiChefToque } from 'react-icons/gi';
import { MdRestaurant, MdFastfood } from 'react-icons/md';
import { FiStar, FiHeart } from 'react-icons/fi';
import  FloatingParticle from './FloatingParticle';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 p-6">
      <FloatingParticle />
      <div className="max-w-6xl mx-auto">
        {/* Main Welcome Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            {/* Decorative background circle */}
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl transform scale-150"></div>

            {/* Main logo */}
            <div className="relative bg-gradient-to-br from-amber-800/80 to-orange-800/80 backdrop-blur-sm rounded-full p-8 mb-6 border border-amber-400/30 shadow-2xl">
              <GiChefToque className="text-8xl text-amber-300 mx-auto animate-pulse" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            Welcome to FoodieUs
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-amber-300 mb-4">
            Admin Panel
          </h2>
          <p className="text-xl text-amber-200/80 max-w-2xl mx-auto leading-relaxed">
            Manage your restaurant with ease and serve delicious experiences to your customers
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;