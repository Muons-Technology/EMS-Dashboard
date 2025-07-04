import React from 'react';

export default function PatientCard({ patient, onStatusChange, onLabRequestView }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Stable':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="patient-card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">{patient.name}</h4>
          <p className="text-sm text-gray-600">ID: {patient.id}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.condition)}`}>
          {patient.condition}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        <p className="text-sm text-gray-600">Age: {patient.age}</p>
        <p className="text-sm text-gray-600">Condition: {patient.diagnosis}</p>
        <p className="text-sm text-gray-600">Location: {patient.location}</p>
        <p className="text-sm text-gray-600">Last Updated: {patient.lastUpdated}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={patient.condition}
          onChange={(e) => onStatusChange(patient.id, e.target.value)}
        >
          <option value="Stable">Stable</option>
          <option value="Warning">Warning</option>
          <option value="Critical">Critical</option>
        </select>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          onClick={() => onLabRequestView(patient.id)}
        >
          View Lab Requests
        </button>
      </div>
    </div>
  );
}