import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnergyEstimate = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("projectData")); // or use Context
    if (!storedData) {
      navigate("/project-setup");
      return;
    }

    const results = estimateEnergy(storedData);
    setData({ ...storedData, ...results });

  }, []);

  const estimateEnergy = ({ roofSize, energyUsage, location, orientation }) => {
    const irradiance = 1000; // kWh/m²/year (placeholder, real data via API)
    const panelEfficiency = 0.75; // 75% realistic
    const tiltAdjustment = ["N", "NW", "NE"].includes(orientation) ? 0.6 : 1;

    const annualProduction = roofSize * irradiance * panelEfficiency * tiltAdjustment;
    const annualUsage = energyUsage * 12;
    const coverage = Math.min((annualProduction / annualUsage) * 100, 100).toFixed(1);
    const co2Saved = (annualProduction * 0.42).toFixed(0);

    return {
      annualProduction: annualProduction.toFixed(0),
      coverage,
      co2Saved
    };
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Energy Estimate</h1>

      <div className="space-y-4 text-center">
        <p>
          <strong>Estimated Annual Energy:</strong> {data.annualProduction} kWh
        </p>
        <p>
          <strong>Coverage of Your Needs:</strong> {data.coverage}%
        </p>
        <p>
          <strong>CO₂ Saved Annually:</strong> {data.co2Saved} kg
        </p>
      </div>

      <button
        onClick={() => {
          localStorage.setItem("projectData", JSON.stringify(data));
          navigate('/roi-calculator');
        }}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Next: ROI & Cost
      </button>
    </div>
  );
};

export default EnergyEstimate;
