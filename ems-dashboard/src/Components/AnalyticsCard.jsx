export default function AnalyticsCard({ label, value }) {
  return (
    <div className='bg-blue-100 p-4 rounded-lg text-center shadow-md w-full sm:w-1/2 md:w-1/3'>
      <h2 className='text-sm font-medium text-gray-600'>{label}</h2>
      <p className='text-2xl font-bold'>{value}</p>
    </div>
  );
}
