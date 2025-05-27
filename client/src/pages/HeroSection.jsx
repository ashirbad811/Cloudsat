import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div>
     <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">
          Professional Themes & Website Templates for any project
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, ratione. Voluptatibus sint quo adipisci asperiores obcaecati! Mollitia doloribus adipisci itaque.
        </p>
        <div className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="e.g. responsive templates"
            className="p-3 rounded-l-md border border-gray-300 w-64 sm:w-96"
          />
          <Button className="rounded-r-md h-20 bg-green-600 hover:bg-green-700 text-white px-6">
            Search
          </Button>
        </div>
      </div>
    </div>
    
      
      

      
    </div>
  );
};

export default HeroSection;
