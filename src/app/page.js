import React from 'react'
import Hero from '@/components/hero'
import LandingForm from '@/components/landingForm';

const page = () => {
  return (
    <div className='w-full flex flex-col'>
      <Hero/>
      <LandingForm />
    </div>
  )
}

export default page