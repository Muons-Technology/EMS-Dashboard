export default function PatientCard({ patient }) {
  return (
    <div className='bg-white shadow-md p-4 rounded-lg w-full'>
      <h3 className='text-lg font-semibold'>{patient.name}</h3>
      <p>Admitted: {patient.admittedAt}</p>
      <p className={patient.labPending ? 'text-red-500' : 'text-green-600'}>
        Lab: {patient.labPending ? 'Pending' : 'Complete'}
      </p>
    </div>
  );
}
