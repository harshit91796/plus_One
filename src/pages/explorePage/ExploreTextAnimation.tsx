import React, { useEffect } from 'react';
import './animationExplore.css';

const ExploreTextAnimation: React.FC = () => {
  useEffect(() => {
    const spans = document.querySelectorAll('.segment');
    spans.forEach((span, index) => {
      setTimeout(() => {
        span.classList.add('lit');
      }, index * 300); // Delay each segment by 300ms
    });
  }, []);

  return (
    <div className="explore-container">
      <div className="letter">
        {/* The "E" with five segments */}
        <span className="segment top"></span>
        <span className="segment middle"></span>
        <span className="segment bottom"></span>
        <span className="segment left-top"></span>
        <span className="segment left-bottom"></span>
      </div>
    </div>
  );
};

export default ExploreTextAnimation;
