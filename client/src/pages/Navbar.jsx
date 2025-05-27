// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Button } from "../components/ui/button";
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();

//   const loginHandler = () => navigate("/login");

//   return (
//     <div className="text-gray-600 w-full shadow-md">

//       <div className=" mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
//         <div className="text-xl font-bold mb-2 sm:mb-0">Coddor</div>
//         <Button
//           onClick={loginHandler}
//           variant="outline"
//           className="border-blue text-gray-600 hover:bg-white hover:text-red-500 transition duration-200">
//           Login
//         </Button>
//       </div>

//       <div className="w-full flex justify-between items-center   bg-cyan-200">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-4  sm:justify-start text-sm font-semibold text-gray-700">
//           <Popover>
//             <PopoverTrigger className="hover:text-blue-500 cursor-pointer">
//               Templates
//             </PopoverTrigger>
//             <PopoverContent className="bg-white rounded shadow-lg p-4">
//               HTML5
//             </PopoverContent>
//           </Popover>

//           <Popover>
//             <PopoverTrigger className="hover:text-blue-500 cursor-pointer">
//               UI/UX
//             </PopoverTrigger>
//             <PopoverContent className="bg-white rounded shadow-lg p-4">
//               <ul className="list-disc pl-4">
//                 <li>Figma</li>
//                 <li>Adobe</li>
//                 <li>PicsArt</li>
//               </ul>
//             </PopoverContent>
//           </Popover>

//           <Popover>
//             <PopoverTrigger className="hover:text-blue-500 cursor-pointer">
//               Web Scripts
//             </PopoverTrigger>
//             <PopoverContent className="bg-white rounded shadow-lg p-4">
//               <ul className="list-disc pl-4">
//                 <li>JavaScript</li>
//                 <li>Adobe</li>
//                 <li>PicsArt</li>
//               </ul>
//             </PopoverContent>
//           </Popover>

//           <Popover>
//             <PopoverTrigger className="hover:text-blue-500 cursor-pointer">
//               Android / iOS Scripts
//             </PopoverTrigger>
//             <PopoverContent className="bg-white rounded shadow-lg p-4">
//               <ul className="list-disc pl-4">
//                 <li>Figma</li>
//                 <li>Adobe</li>
//                 <li>PicsArt</li>
//               </ul>
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;


// {-------------}
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    category: "Artificial Intelligence",
    courses: [
      "Machine Learning Course",
      "ChatGPT Training Course",
      "AI Certification Course",
      "Introduction to Generative AI",
    ],
  },
  {
    category: "Cloud Computing",
    courses: [
      "AWS Solutions Architect",
      "Microsoft Azure AI-900",
      "Google Cloud Fundamentals",
      "DevOps on AWS",
    ],
  },
  {
    category: "Data Science",
    courses: [
      "Python for Data Science",
      "Big Data Hadoop Course",
      "Data Analytics Masterclass",
    ],
  },
  {
    category: "DevOps",
    courses: [
      "DevOps Engineer Program",
      "Kubernetes Certification",
      "Docker Essentials",
    ],
  },
];

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      alert(`Search for: ${query}`); // You can replace this with real search logic
    }
  };

  return (
    <nav className="w-full bg-blue-700 text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm">
        <div className="hidden sm:block font-bold">Coddor</div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white text-gray-800 shadow">
        <div className="container mx-auto flex flex-wrap items-center justify-between py-3 px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 font-bold text-lg text-blue-900">
            <img src="https://via.placeholder.com/100x30" alt="logo" />
            <span>Coddor</span>
          </div>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 max-w-md w-full">
            <input
              type="text"
              name="search"
              placeholder="Search courses"
              className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
            <Button type="submit" className="bg-blue-200 text-white px-4 py-2 rounded-full hover:bg-blue-700">
              Search
            </Button>
          </form>

          {/* Browse Courses (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setOpenMenu(menuItems[0].category)}
             
              className="px-2 py-2 bg-blue-200 text-white  rounded-xl hover:bg-blue-700"
            >
              Browse Templates ▼
            </button>

            {openMenu && (
              <div
                onMouseEnter={() => setOpenMenu(openMenu)}
                onMouseLeave={() => setOpenMenu(null)}
                className="absolute z-50 mt-2 bg-white shadow-lg rounded w-96 flex"
              >
                {/* Category List */}
                <ul className="w-1/2 border-r border-gray-300">
                  {menuItems.map((item, idx) => (
                    <li
                      key={idx}
                      onMouseEnter={() => setOpenMenu(item.category)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.category}
                    </li>
                  ))}
                </ul>

                {/* Course List */}
                <div className="w-1/2 p-4">
                  {menuItems
                    .filter((item) => item.category === openMenu)
                    .map((item, idx) => (
                      <ul key={idx}>
                        {item.courses.map((course, cidx) => (
                          <li key={cidx} className="py-1 hover:text-blue-600 cursor-pointer">
                            {course}
                          </li>
                        ))}
                      </ul>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-3  gap-2 items-center">
            <a href="#" className="hover:text-blue-600">HTML Templates</a>
            <a href="#" className="hover:text-blue-600">Scripts</a>
            <a href="#" className="hover:text-blue-600">Mobile App</a>
            <a href="#" className="hover:text-blue-600">Domain Auction</a>
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-200 text-white  ml-2 rounded px-2 py-1 hover:bg-blue-700"
            >
              Log in
            </Button>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setOpenMenu(openMenu === "mobile" ? null : "mobile")}>
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {openMenu === "mobile" && (
          <div className="md:hidden bg-white text-gray-800 px-4 py-4 space-y-4">
            <a href="#" className="block hover:text-blue-600">HTML Templates</a>
            <a href="#" className="block hover:text-blue-600">Scripts</a>
            <a href="#" className="block hover:text-blue-600">Mobile App</a>
             <a href="#" className="block hover:text-blue-600">Domain Auction</a>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-200 text-white rounded px-4 py-1 hover:bg-blue-700"
            >
              Log in
            </Button>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4 flex items-center space-x-2">
              <input
                type="text"
                name="search"
                placeholder="Search courses"
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
              <Button type="submit" className="bg-blue-200 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                Search
              </Button>
            </form>
          </div>
        )}

        {/* Sub Navigation */}
        <div className="bg-[#545050] text-white  text-m flex justify-around flex-wrap gap-4 py-2">
          {["lorem", "lorem", "lorem", "lorem", "lorem", "lorem"].map((item, index) => (
            <a key={index} href="#" className="hover:text-blue-300 ">
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;





 

  

 
