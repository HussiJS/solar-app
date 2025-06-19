import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROICalculator = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const project = JSON.parse(localStorage.getItem("projectData"));
    if (!project || !project.annualProduction) {
      navigate("/energy-estimate");
      return;
    }

    const results = calculateROI(project);
    setData({ ...project, ...results });
  }, []);

  const calculateROI = ({ annualProduction }) => {
    const panelOutput = 400; // Wp
    const panelPrice = 200;
    const installCost = 1000;
    const subsidyRate = 0.2;
    const electricityPrice = 0.35;

    const totalPanels = Math.ceil((annualProduction * 1000) / (panelOutput * 365));
    const hardwareCost = totalPanels * panelPrice;
    const grossCost = hardwareCost + installCost;
    const subsidy = grossCost * subsidyRate;
    const netCost = grossCost - subsidy;

    const annualSavings = annualProduction * electricityPrice;
    const roi = (netCost / annualSavings).toFixed(1);
    const totalSavings = (annualSavings * 20).toFixed(0);

    return {
      totalPanels,
      grossCost: grossCost.toFixed(0),
      subsidy: subsidy.toFixed(0),
      netCost: netCost.toFixed(0),
      roi,
      totalSavings
    };
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Cost & ROI Estimate</h1>

      <div className="space-y-4 text-center">
        <p><strong>Estimated Panel Count:</strong> {data.totalPanels}</p>
        <p><strong>System Cost:</strong> €{data.grossCost}</p>
        <p><strong>Government Subsidy:</strong> -€{data.subsidy}</p>
        <p><strong>Total After Subsidy:</strong> €{data.netCost}</p>
        <p><strong>ROI:</strong> {data.roi} years</p>
        <p><strong>Estimated Savings (20 yrs):</strong> €{data.totalSavings}</p>
      </div>

      <button
        onClick={() => navigate('/quote')}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Continue to Quote
      </button>
    </div>
  );
};

export default ROICalculator;
