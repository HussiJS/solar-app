import React, { useEffect, useState } from 'react';

const Account = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedQuotes = JSON.parse(localStorage.getItem('projectHistory')) || [];
    setHistory(storedQuotes);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">My Projects & Quotes</h1>

      {history.length === 0 ? (
        <p className="text-center text-gray-600">No saved projects yet.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-sm bg-white space-y-2"
            >
              <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
              <p><strong>Type:</strong> {item.type === 'order' ? 'Order' : 'Quote'}</p>
              <p><strong>Panel Brand:</strong> {item.panelBrand}</p>
              <p><strong>ROI:</strong> {item.roi} years</p>
              <p><strong>Delivery:</strong> {item.deliveryTime}</p>
              <p><strong>Status:</strong> {item.status || 'Submitted'}</p>

              <button
                onClick={() => downloadPDF(item)}
                className="mt-2 px-4 py-2 bg-gray-100 text-sm rounded border hover:bg-gray-200"
              >
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const downloadPDF = (item) => {
  const pdfContent = `
    Solar Project Summary
    -----------------------
    Date: ${new Date(item.createdAt).toLocaleDateString()}
    Type: ${item.type}
    Panel Brand: ${item.panelBrand}
    Estimated ROI: ${item.roi} years
    System Cost: €${item.netCost}
    Delivery Time: ${item.deliveryTime}
  `;

  const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `solar_${item.type}_${item.createdAt}.txt`;
  a.click();
  window.URL.revokeObjectURL(url);
};



export default Account;
