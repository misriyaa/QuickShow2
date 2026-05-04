import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets'; // Ensure your badges and logo are here

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-gray-400 pt-20 pb-10 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-36">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          
          {/* Section 1: Branding & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-1">
              <span className="text-[#FF4D67] text-3xl font-bold">Q</span>
              <span className="text-white text-xl font-semibold tracking-tight">uickShow</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </p>
            {/* App Badges - Replicating Screenshot 2026-05-02 145527.png */}
            <div className="flex gap-4 pt-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Get it on Google Play" 
                className="h-10 cursor-pointer hover:opacity-80 transition-opacity" 
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                alt="Download on the App Store" 
                className="h-10 cursor-pointer hover:opacity-80 transition-opacity" 
              />
            </div>
          </div>

          {/* Section 2: Company Links */}
          <div className="md:pl-10">
            <h4 className="text-white font-bold text-lg mb-8">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy policy</Link></li>
            </ul>
          </div>

          {/* Section 3: Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8">Get in touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="hover:text-white transition-colors">+1-212-456-7890</li>
              <li className="hover:text-white transition-colors cursor-pointer">contact@example.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-xs tracking-wide">
          <p>Copyright {currentYear} © GreatStack. All Right Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;