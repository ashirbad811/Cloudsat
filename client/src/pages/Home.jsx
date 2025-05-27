import React from 'react'
import Navbar from './Navbar'
import ProductCard from './productCard'
import Footer from './Footer'
import HeroSection from './HeroSection'

const Home = () => {
  return (
    <div>
      <Navbar/>
     <HeroSection />
     <ProductCard />
     <Footer />
    </div>
  )
}

export default Home
