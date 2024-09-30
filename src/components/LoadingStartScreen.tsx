import React from 'react';
import blunt2 from '../assets/images/blunt2.jpg'
import './load.css'
const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <img src={blunt2} alt="Loading..." />
    </div>
  );
};

export default LoadingScreen;
