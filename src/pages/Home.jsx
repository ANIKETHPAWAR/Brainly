import img1 from '../assets/mesh-757.png'

import React from 'react'

const Home = () => {
  return (
    <div 
      className='h-screen w-screen bg-cover bg-center bg-no-repeat'
      style={{
        backgroundImage: `url(${img1})`
      }}
    >
     <div className='h-[70vh] flex flex-col items-center justify-center'>
        <h1 className='italic text-7xl text-white font-semibold py-4'>Brainly </h1>
        <h4 className='text-white text-2xl'>Never lose a great idea again.</h4>
        <p className='text-white'>Build your personal knowledge hub — save tutorials, articles, and resources that matter, and let Brainly remind you before you forget.</p>
     </div>
     
    </div>
  )
}

export default Home