import { patients } from '../Utils/mockData';
import AnalyticsCard from '../Components/AnalyticsCard';
import PatientCard from '../Components/PatientCard';
import { signOut } from 'firebase/auth';
import { auth } from '../Utils/firebase';

export default function Dashboard() {
  const today = '2025-07-01';
  const admittedToday = patients.filter(p => p.admittedAt === today).length;
  const labPending = patients.filter(p => p.labPending).length;

  return (
    <div className='p-4 space-y-4'>
      <div className="flex justify-between items-center">
        <h1 className='text-xl font-bold'>EMS Dashboard</h1>
        <button onClick={() => signOut(auth)} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <div className='flex flex-wrap gap-4'>
        <AnalyticsCard label="Admissions Today" value={admittedToday} />
        <AnalyticsCard label="Pending Labs" value={labPending} />
      </div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {patients.map(p => (
          <PatientCard key={p.id} patient={p} />
        ))}
      </div>
    </div>
  );
}
