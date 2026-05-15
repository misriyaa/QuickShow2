import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets"; 
import { MenuIcon, SearchIcon, XIcon, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContent";
import axiosInstance from "../library/axios"; // ✅ replaced axios import

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedin, userData, setIsLoggedin, setUserData } = useContext(AppContent);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout"); // ✅ axiosInstance, no backendUrl needed
      localStorage.removeItem("token");             // ✅ clear token
      setIsLoggedin(false);
      setUserData(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      // logout even if request fails
      localStorage.removeItem("token");
      setIsLoggedin(false);
      setUserData(null);
      navigate("/login");
    }
  };

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-transparent'>
      
      <Link to='/' className='max-md:flex-1'>
        <img src={assets.logo} alt="Logo" className='w-36 h-auto'/>
      </Link>

      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur-md bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${showMobileMenu ? 'max-md:w-full' : 'max-md:w-0'}`}>
        
        <XIcon 
          onClick={() => setShowMobileMenu(false)}
          className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer text-white' 
        />

        <Link onClick={() => setShowMobileMenu(false)} to='/' className="text-white hover:text-primary transition-colors">Home</Link>
        <Link onClick={() => setShowMobileMenu(false)} to='/movies' className="text-white hover:text-primary transition-colors">Movies</Link>
        <Link onClick={() => setShowMobileMenu(false)} to='/my-booking' className="text-white hover:text-primary transition-colors">My Bookings</Link>
        <Link onClick={() => setShowMobileMenu(false)} to='/favorite' className="text-white hover:text-primary transition-colors">Favorites</Link>
      </div>

      <div className='flex items-center gap-8'>
        <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer text-white' />
        
        {isLoggedin && userData ? (
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="bg-white/20 text-white px-5 py-2 rounded-full font-medium backdrop-blur-sm border border-white/10"
            >
              {userData.name.split(" ")[0]}
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-2">
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 flex items-center gap-2 hover:bg-white/5 transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to='/login'>
            <button className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull text-white transition rounded-full font-medium cursor-pointer'>
              Login
            </button>
          </Link>
        )}

        <MenuIcon 
          onClick={() => setShowMobileMenu(true)}
          className='md:hidden w-8 h-8 cursor-pointer text-white ml-4' 
        />
      </div>
    </div>
  );
};

export default Navbar;