export default function Dashboard() {
  return (
    <div className=' text-white p-8 h-full flex flex-col '>
      <div className='grid grid-cols-4 gap-4 mb-4'>
        <div className='col-span-1 bg-[#232323] h-20 rounded-lg'></div>
        <div className='col-span-1 bg-[#232323] h-20 rounded-lg'></div>
        <div className='col-span-1 bg-[#232323] h-20 rounded-lg'></div>
        <div className='col-span-1 bg-[#232323] h-20 rounded-lg'></div>
      </div>
      <div className='flex-grow grid grid-cols-2 gap-4'>
        <div className='bg-[#232323] rounded-lg'></div>
        <div className='bg-[#232323] rounded-lg'></div>
      </div>
    </div>
  );
}
