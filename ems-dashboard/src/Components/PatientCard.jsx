import React, { useState } from 'react';

export default function PatientCard({ patient, onStatusChange, onLabRequestView }) {
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);

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

  const getTriageColor = (triage) => {
    switch (triage) {
      case 'Immediate':
        return 'bg-red-500 text-white';
      case 'Delayed':
        return 'bg-yellow-500 text-white';
      case 'Minor':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const handleLabRequestView = () => {
    setIsLabModalOpen(true);
    onLabRequestView(patient.id);
  };

  const closeLabModal = () => {
    setIsLabModalOpen(false);
  };

  return (
    <>
      <div className="patient-card bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200">
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
          <p className="text-sm text-gray-600">Chief Complaint: {patient.chiefComplaint || 'Not specified'}</p>
          <p className="text-sm text-gray-600">
            Triage Level: <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTriageColor(patient.triageLevel)}`}>{patient.triageLevel || 'Not assigned'}</span>
          </p>
          <p className="text-sm text-gray-600">
            Vitals: BP {patient.vitals?.bp || 'N/A'}, HR {patient.vitals?.hr || 'N/A'}, RR {patient.vitals?.rr || 'N/A'}, SpO2 {patient.vitals?.spo2 || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">Location: {patient.location}</p>
          <p className="text-sm text-gray-600">Last Updated: {patient.lastUpdated}</p>
          <p className="text-sm text-gray-600">Assigned Team: {patient.assignedTeam || 'Not assigned'}</p>
          <p className="text-sm text-gray-600">Transport Status: {patient.transportStatus || 'Not transported'}</p>
        </div>
        <div className="mt-4 flex gap-2">
          <select
            className="border rounded px-2 py-1 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500"
            value={patient.condition}
            onChange={(e) => onStatusChange(patient.id, e.target.value)}
          >
            <option value="Stable">Stable</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
            onClick={handleLabRequestView}
          >
            View Lab Requests
          </button>
        </div>
      </div>

      {isLabModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Lab Requests for {patient.name}</h2>
              <button className="modal-close" onClick={closeLabModal}>×</button>
            </div>
            <div className="modal-body">
              {patient.labRequests && patient.labRequests.length > 0 ? (
                <div className="space-y-4">
                  {patient.labRequests.map((request, index) => (
                    <div key={index} className="border-b pb-4">
                      <p className="text-sm font-medium text-gray-800">Test Type: {request.testType}</p>
                      <p className="text-sm text-gray-600">Priority: {request.priority}</p>
                      <p className="text-sm text-gray-600">Notes: {request.notes || 'None'}</p>
                      <p className="text-sm text-gray-600">Requested: {request.requestedAt || 'N/A'}</p>
                      <p className="text-sm text-gray-600">
                        Status: <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            request.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {request.status || 'Pending'}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No lab requests found for this patient.</p>
              )}
            </div>
            <div className="form-actions">
              <button className="cancel-button" onClick={closeLabModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}