import React, { useState } from 'react';
import { patients } from '../Utils/mockData';
import AnalyticsCard from '../Components/AnalyticsCard';
import PatientCard from '../Components/PatientCard';
import { logoutDoctor } from '../Utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(null);
  const [formData, setFormData] = useState({
    traumaCase: { patientId: '', name: '', injuryType: '', severity: 'Low', notes: '' },
    triage: { patientId: '', vitals: { bp: '', hr: '', rr: '', spo2: '' }, assessment: '' },
    schedule: { teamId: '', date: '', shift: 'Day', members: '' },
    protocols: { protocolId: '', name: '', description: '' },
    settings: { notificationLevel: 'All', theme: 'Light', alertThreshold: 'Normal' },
    labRequest: { patientId: '', testType: '', priority: 'Routine', notes: '' }
  });
  const [activePatients, setActivePatients] = useState(patients);
  const [criticalPatientsList, setCriticalPatientsList] = useState(patients.filter(p => p.condition === 'Critical'));

  const criticalPatients = criticalPatientsList.length;
  const availableBeds = 12;
  const ambulancesAvailable = 3;
  const activeCalls = 5;
  const labRequestsCount = activePatients.filter(p => p.labRequests && p.labRequests.length > 0).length;

  const handleLogout = async () => {
    try {
      await logoutDoctor();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed: ' + err.message);
    }
  };

  const handleEmergencyDetails = () => {
    alert('Emergency Details: Code Red in Trauma Unit - Immediate response required. Location: Trauma Bay 1. Responding Team: Dr. Smith, RN Johnson, Paramedic Team A.');
  };

  const handleFormChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleFormSubmit = (section) => {
    console.log(`Submitting ${section} form:`, formData[section]);
    if (section === 'labRequest') {
      setActivePatients(prev => prev.map(p => 
        p.id === formData.labRequest.patientId ? {
          ...p,
          labRequests: [...(p.labRequests || []), formData.labRequest]
        } : p
      ));
    }
    setModalOpen(null);
    alert(`${section.charAt(0).toUpperCase() + section.slice(1)} data saved successfully!`);
  };

  const handlePatientStatusChange = (patientId, newStatus) => {
    setActivePatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, condition: newStatus } : p
    ));
    setCriticalPatientsList(activePatients.filter(p => p.condition === 'Critical'));
  };

  const handleLabRequestView = (patientId) => {
    const patient = activePatients.find(p => p.id === patientId);
    const requests = patient.labRequests || [];
    alert(`Lab Requests for ${patient.name}:\n${requests.length > 0 ? requests.map(r => `- ${r.testType} (${r.priority})`).join('\n') : 'No lab requests'}`);
  };

  const renderModal = () => {
    if (!modalOpen) return null;

    const modals = {
      traumaCase: {
        title: 'New Trauma Case',
        fields: [
          { label: 'Patient ID', name: 'patientId', type: 'text' },
          { label: 'Patient Name', name: 'name', type: 'text' },
          { label: 'Injury Type', name: 'injuryType', type: 'text' },
          { label: 'Severity', name: 'severity', type: 'select', options: ['Low', 'Moderate', 'High', 'Critical'] },
          { label: 'Notes', name: 'notes', type: 'textarea' }
        ]
      },
      triage: {
        title: 'Triage Assessment',
        fields: [
          { label: 'Patient ID', name: 'patientId', type: 'text' },
          { label: 'Blood Pressure', name: 'vitals.bp', type: 'text' },
          { label: 'Heart Rate', name: 'vitals.hr', type: 'text' },
          { label: 'Respiratory Rate', name: 'vitals.rr', type: 'text' },
          { label: 'SpO2', name: 'vitals.spo2', type: 'text' },
          { label: 'Assessment Notes', name: 'assessment', type: 'textarea' }
        ]
      },
      schedule: {
        title: 'Team Schedule',
        fields: [
          { label: 'Team ID', name: 'teamId', type: 'text' },
          { label: 'Date', name: 'date', type: 'date' },
          { label: 'Shift', name: 'shift', type: 'select', options: ['Day', 'Night', 'Swing'] },
          { label: 'Team Members', name: 'members', type: 'textarea' }
        ]
      },
      protocols: {
        title: 'Protocols',
        fields: [
          { label: 'Protocol ID', name: 'protocolId', type: 'text' },
          { label: 'Protocol Name', name: 'name', type: 'text' },
          { label: 'Description', name: 'description', type: 'textarea' }
        ]
      },
      settings: {
        title: 'System Settings',
        fields: [
          { label: 'Notification Level', name: 'notificationLevel', type: 'select', options: ['All', 'Critical Only', 'None'] },
          { label: 'Theme', name: 'theme', type: 'select', options: ['Light', 'Dark', 'System'] },
          { label: 'Alert Threshold', name: 'alertThreshold', type: 'select', options: ['Normal', 'Elevated', 'Critical'] }
        ]
      },
      labRequest: {
        title: 'New Lab Request',
        fields: [
          { label: 'Patient ID', name: 'patientId', type: 'text' },
          { label: 'Test Type', name: 'testType', type: 'text' },
          { label: 'Priority', name: 'priority', type: 'select', options: ['Routine', 'Urgent', 'STAT'] },
          { label: 'Notes', name: 'notes', type: 'textarea' }
        ]
      }
    };

    const currentModal = modals[modalOpen];

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{currentModal.title}</h2>
            <button className="modal-close" onClick={() => setModalOpen(null)}>×</button>
          </div>
          <div className="modal-body">
            {currentModal.fields.map(field => (
              <div className="form-group" key={field.name}>
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={field.name.includes('.') ? 
                      field.name.split('.').reduce((o, i) => o[i], formData[modalOpen]) : 
                      formData[modalOpen][field.name]
                    }
                    onChange={(e) => {
                      if (field.name.includes('.')) {
                        const [parent, child] = field.name.split('.');
                        handleFormChange(modalOpen, parent, { ...formData[modalOpen][parent], [child]: e.target.value });
                      } else {
                        handleFormChange(modalOpen, field.name, e.target.value);
                      }
                    }}
                    rows="4"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[modalOpen][field.name]}
                    onChange={(e) => handleFormChange(modalOpen, field.name, e.target.value)}
                  >
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={field.name.includes('.') ? 
                      field.name.split('.').reduce((o, i) => o[i], formData[modalOpen]) : 
                      formData[modalOpen][field.name]
                    }
                    onChange={(e) => {
                      if (field.name.includes('.')) {
                        const [parent, child] = field.name.split('.');
                        handleFormChange(modalOpen, parent, { ...formData[modalOpen][parent], [child]: e.target.value });
                      } else {
                        handleFormChange(modalOpen, field.name, e.target.value);
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button className="cancel-button" onClick={() => setModalOpen(null)}>Cancel</button>
            <button className="submit-button" onClick={() => handleFormSubmit(modalOpen)}>Submit</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ems-dashboard-container">
      <div className="emergency-alert-bar">
        <div className="alert-content">
          <div className="alert-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L12 16l1.06-1.06L14 16l1.06-1.06-1.06-1.06 1.06-1.06-1.06-1.06L12 11l-1.06 1.06L10 11l-1.06 1.06 1.06 1.06L10 14l1.06 1.06z" />
            </svg>
          </div>
          <span className="alert-text">CRITICAL ALERT: MVA with multiple casualties en route (ETA: 8 mins) | Trauma Team to Bay 1-3</span>
          <button className="emergency-button" onClick={handleEmergencyDetails}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37mediatv-2.49 1c-.52.39-1.06.73-1.69.98l-.37-2.65c-.04-.24-.24-.42-.49-.42h-4c-.25 0-.46.18-.49.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z" />
            </svg>
            RESPOND
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
              </svg>
              EMS COMMAND CENTER
            </h1>
            <div className="status-indicators">
              <span className="status-item online">
                <span className="status-dot"></span>
                System: ONLINE
              </span>
              <span className="status-item">
                <span className="status-dot"></span>
                Last Sync: {new Date().toLocaleTimeString()}
              </span>
              <span className="status-item">
                <span className="status-dot"></span>
                Shift: DAY (07:00-19:00)
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            LOGOUT
          </button>
        </div>

        <div className="stats-grid">
          <AnalyticsCard 
            label="Active EMS Calls" 
            value={activeCalls} 
            status="warning"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.8 2.8C16 2.09 13.86 2 12 2s-4 .09-5.8.8C3.53 3.84 2 6.05 2 8.86V22h20V8.86c0-2.81-1.53-5.02-4.2-6.06zM9 17H7v-7h2v7zm4 0h-2v-7h2v7zm4 0h-2v-7h2v7z" />
              </svg>
            }
          />
          <AnalyticsCard 
            label="Critical Patients" 
            value={criticalPatients} 
            status="critical"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
              </svg>
            }
            onClick={() => document.querySelector('.critical-patients').scrollIntoView({ behavior: 'smooth' })}
          />
          <AnalyticsCard 
            label="Ambulances Available" 
            value={ambulancesAvailable} 
            status="success"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm1.5-9H17V12h4.46L19.5 9.5zM6 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM20 8l3 4v5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H9c0 1.66-1.34 3-3 3s-3-1.34-3-3H1V6c0-1.11.89-2 2-2h14v4h3zM8 6v3H5.5v3H3V9H.5V6H8z" />
              </svg>
            }
          />
          <AnalyticsCard 
            label="Trauma Beds Available" 
            value={availableBeds} 
            status="default"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 7h-3V5.5A2.5 2.5 0 0013.5 3h-3A2.5 2.5 0 008 5.5V7H5c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-9-1.5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5V7h-4V5.5zm8 11.5H6V9h4v1.5c0 .28.22.5.5.5h3c.28 0 .5-.22.5-.5V9h4v7z" />
              </svg>
            }
          />
          <AnalyticsCard 
            label="Lab Requests" 
            value={labRequestsCount} 
            status="warning"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
            onClick={() => setModalOpen('labRequest')}
          />
        </div>

        <div className="action-panels">
          <div className="action-panel quick-actions-panel">
            <div className="panel-header">
              <h2>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                RAPID RESPONSE
              </h2>
              <div className="panel-subtitle">Immediate action controls</div>
            </div>
            <div className="actions-grid">
              <button className="action-button red" onClick={() => alert('Initiating emergency protocol...')}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                MASS CASUALTY PROTOCOL
              </button>
              <button className="action-button orange" onClick={() => alert('Dispatching nearest available ambulance...')}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                DISPATCH AMBULANCE
              </button>
              <button className="action-button blue" onClick={() => setModalOpen('traumaCase')}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                NEW TRAUMA CASE
              </button>
              <button className="action-button purple" onClick={() => setModalOpen('triage')}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                TRIAGE ASSESSMENT
              </button>
            </div>
          </div>

          <div className="action-panel operational-panel">
            <div className="panel-header">
              <h2>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                OPERATIONS
              </h2>
              <div className="panel-subtitle">Routine management tools</div>
            </div>
            <div className="actions-grid">
              <button className="action-button teal" onClick={() => setModalOpen('labRequest')}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                LAB REQUESTS
              </button>
              <button className="action-button green" onClick={() => setModalOpen('schedule')}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-6 8h6M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                TEAM SCHEDULE
              </button>
              <button className="action-button gray" onClick={() => setModalOpen('protocols')}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                PROTOCOLS
              </button>
              <button className="action-button dark-blue" onClick={() => setModalOpen('settings')}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                SETTINGS
              </button>
            </div>
          </div>
        </div>

        <div className="patient-sections">
          <div className="section-panel critical-patients">
            <div className="section-header">
              <div className="header-content">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
                  </svg>
                  CRITICAL CASES (RED ZONE)
                </h3>
                <span className="badge">{criticalPatients} ACTIVE</span>
              </div>
              <div className="header-actions">
                <button className="mini-button" onClick={() => setModalOpen('triage')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
                <button className="mini-button" onClick={() => alert('More options: View history, Export data, Print report')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="patient-grid">
              {criticalPatientsList.map(p => (
                <PatientCard 
                  key={p.id} 
                  patient={p}
                  onStatusChange={handlePatientStatusChange}
                  onLabRequestView={handleLabRequestView}
                />
              ))}
            </div>
          </div>

          <div className="section-panel all-patients">
            <div className="section-header">
              <div className="header-content">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  ACTIVE PATIENTS
                </h3>
                <span className="badge">{activePatients.length} TOTAL</span>
              </div>
              <div className="header-actions">
                <button className="mini-button" onClick={() => setModalOpen('traumaCase')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </button>
                <button className="mini-button" onClick={() => alert('More options: Filter patients, Export data, Generate report')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="patient-grid">
              {activePatients.map(p => (
                <PatientCard 
                  key={p.id} 
                  patient={p}
                  onStatusChange={handlePatientStatusChange}
                  onLabRequestView={handleLabRequestView}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="status-bar">
        <div className="status-content">
          <span className="status-item">
            <span className="status-dot online"></span>
            EMS System: OPERATIONAL
          </span>
          <span className="status-item">
            <span className="status-dot"></span>
            Last Data Sync: {new Date().toLocaleString()}
          </span>
          <span className="status-item">
            <span className="status-dot"></span>
            Shift Commander: Dr. Sarah Johnson
          </span>
        </div>
        <div className="status-actions">
          <button className="status-button" onClick={() => alert('System status: All systems operational')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
            </svg>
          </button>
          <button className="status-button" onClick={() => alert('More options: System settings, User management')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      {renderModal()}
    </div>
  );
}