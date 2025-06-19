import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import MapSelector from '../components/MapSelector';

const ProjectSetup = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState(null);

  const onSubmit = (data) => {
    console.log(data);
    // Store form data (e.g. in context or localStorage)
    localStorage.setItem("projectData", JSON.stringify(data));
    navigate('/energy-estimate');
  };

  const handleAreaSelect = (area) => {
    const areaInSquareMeters = Math.round(area);
    setSelectedArea(areaInSquareMeters);
    setValue('roofSize', areaInSquareMeters);
  };

  const handleLocationSelect = (zipCode) => {
    setValue('location', zipCode);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Set Up Your Solar Project</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Map Selector */}
        <div>
          <label className="block mb-1 font-medium">Select Roof Area</label>
          <MapSelector 
            onAreaSelect={handleAreaSelect} 
            onLocationSelect={handleLocationSelect}
          />
          {selectedArea && (
            <p className="mt-2 text-sm text-gray-600">
              Selected area: {selectedArea} square meters
            </p>
          )}
        </div>

        {/* Location Input */}
        <div>
          <label className="block mb-1 font-medium">Location (ZIP or use GPS)</label>
          <input
            type="text"
            {...register("location", { required: true })}
            className="input"
            placeholder="e.g. 10115"
            readOnly
          />
          {errors.location && <p className="text-red-500 text-sm">Location is required</p>}
        </div>

        {/* Roof Type */}
        <div>
          <label className="block mb-1 font-medium">Roof Type</label>
          <select {...register("roofType", { required: true })} className="input">
            <option value="">Select</option>
            <option value="flat">Flat</option>
            <option value="sloped">Sloped</option>
          </select>
          {errors.roofType && <p className="text-red-500 text-sm">Roof type is required</p>}
        </div>

        {/* Roof Size (now hidden as it's set by the map) */}
        <input
          type="hidden"
          {...register("roofSize", { required: true, min: 1 })}
        />

        {/* Roof Orientation */}
        <div>
          <label className="block mb-1 font-medium">Roof Orientation</label>
          <select {...register("orientation", { required: true })} className="input">
            <option value="">Select direction</option>
            <option value="N">North</option>
            <option value="NE">North-East</option>
            <option value="E">East</option>
            <option value="SE">South-East</option>
            <option value="S">South</option>
            <option value="SW">South-West</option>
            <option value="W">West</option>
            <option value="NW">North-West</option>
          </select>
        </div>

        {/* Energy Usage */}
        <div>
          <label className="block mb-1 font-medium">Monthly Energy Usage</label>
          <input
            type="number"
            {...register("energyUsage", { required: true, min: 1 })}
            className="input"
            placeholder="kWh or €"
          />
          {errors.energyUsage && <p className="text-red-500 text-sm">Please enter a value</p>}
        </div>

        {/* Submit */}
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Continue
        </button>
      </form>
    </div>
  );
};

export default ProjectSetup;
