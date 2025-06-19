import React from 'react';

const BenefitsSection = () => {
  const benefits = [
    'Save on energy costs',
    'Switch to green energy',
    'Increase home value',
  ];

  return (
    <div className="mt-12 text-center">
      <h2 className="text-xl font-semibold mb-4">Why SolarPlanner?</h2>
      <ul className="space-y-2 text-gray-700">
        {benefits.map((benefit, index) => (
          <li key={index}>• {benefit}</li>
        ))}
      </ul>
    </div>
  );
};

export default BenefitsSection;
