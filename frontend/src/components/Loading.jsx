import React from 'react'

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-[80vh] w-full bg-[#050505]'>
      {/* 
          1. border-2: matches your thin circle style
          2. border-white/10: the static "track"
          3. border-t-primary: the colored part that moves
      */}
     <div 
  className='rounded-full h-12 w-12 border-2 border-white/10 border-t-primary'
  style={{ 
    animation: 'spin 1s linear infinite',
    borderTopColor: '#ff4d67' // Replace with your primary hex if variable fails
  }}
></div>
    </div>
  )
}

export default Loading