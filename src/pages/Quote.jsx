import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Quote = () => {
  const [form, setForm] = useState({
    panelBrand: '',
    deliveryTime: '',
    installer: ''
  });
  const [projectData, setProjectData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('projectData'));
    if (!saved) {
      navigate('/roi-calculator');
    } else {
      setProjectData(saved);
    }
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (type) => {
    const quote = {
      ...projectData,
      ...form,
      type,
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };

    const prev = JSON.parse(localStorage.getItem('projectHistory')) || [];
    localStorage.setItem('projectHistory', JSON.stringify([...prev, quote]));

    alert(`${type === 'order' ? 'Order' : 'Quote'} submitted!`);
    navigate('/account');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Customize Your Order</h1>

      <div className="space-y-4">
        {/* Panel Brand Selector */}
        <div>
          <label className="block font-medium mb-1">Panel Brand</label>
          <select name="panelBrand" onChange={handleChange} className="input">
            <option value="">Select a brand</option>
            <option value="SMA">SMA</option>
            <option value="LG">LG</option>
            <option value="Q.Cells">Q.Cells</option>
            <option value="JA Solar">JA Solar</option>
          </select>
        </div>

        {/* Delivery Timeline */}
        <div>
          <label className="block font-medium mb-1">Preferred Delivery Time</label>
          <select name="deliveryTime" onChange={handleChange} className="input">
            <option value="">Select</option>
            <option value="1-2 weeks">1–2 weeks</option>
            <option value="2-4 weeks">2–4 weeks</option>
            <option value="1-2 months">1–2 months</option>
          </select>
        </div>

        {/* Installer Options (Optional) */}
        <div>
          <label className="block font-medium mb-1">Installation Partner</label>
          <select name="installer" onChange={handleChange} className="input">
            <option value="">Select (optional)</option>
            <option value="Local Partner A">Local Partner A</option>
            <option value="Local Partner B">Local Partner B</option>
            <option value="Find Later">Find Later</option>
          </select>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => handleSubmit('order')}
            className="bg-green-600 text-white py-3 rounded-lg"
          >
            Order Now
          </button>

          <button
            onClick={() => handleSubmit('quote')}
            className="bg-blue-600 text-white py-3 rounded-lg"
          >
            Request a Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quote;
