import React from 'react'

const  Favorites= () => {
  // Use the logic from Screenshot 2026-05-03 000918.jpg for data validation
  return (
  

    /* Fallback UI for empty data */
    <div className='min-h-[80vh] bg-[#050505] flex items-center justify-center text-gray-500'>
        <p>No movies found.</p>
    </div>
  )
}

export default Favorites