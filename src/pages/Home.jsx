import React from 'react';
import Logo from '../components/Logo';
import HeroSection from '../components/HeroSection';
import BenefitsSection from '../components/BenefitsSection';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <Logo />

      <HeroSection />

      <Link to="/project-setup">
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
          Start Planning
        </button>
      </Link>

      <BenefitsSection />
    </div>
  );
};

export default Home;
