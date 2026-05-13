import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { 
  LayoutDashboardIcon, 
  ListCheckIcon, 
  ListCollapseIcon, 
  ListIcon, 
  PlusSquareIcon 
} from 'lucide-react'

const Sidebar = () => {

    const user = {
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: assets.profile,
    }

    const adminNavlinks = [
        /* 'end: true' ensures the dashboard doesn't stay highlighted when you are on sub-routes */
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon, end: true },
        { name: 'Add Movies', path: '/admin/add-shows', icon: PlusSquareIcon },
        { name: 'Add Show', path: '/admin/add-movies', icon: ListCheckIcon },
        { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
        { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
    ]

    return (
        <div className='h-[calc(100vh-64px)] bg-[#050505] text-white flex flex-col pt-8 max-w-13 md:max-w-64 w-full border-r border-white/5 text-sm'>
            
            {/* User Profile Section */}
            <div className='flex flex-col items-center mb-10'>
                <img 
                    className='h-12 w-12 md:h-16 md:w-16 rounded-full object-cover border-2 border-primary/20' 
                    src={user.imageUrl} 
                    alt="profile" 
                />
                <p className='mt-3 text-sm font-medium max-md:hidden text-gray-300'>
                    {user.firstName} {user.lastName}
                </p>
            </div>

            {/* Navigation Links */}
            <div className='w-full'>
                {adminNavlinks.map((link, index) => (
                    <NavLink 
                        key={index} 
                        to={link.path}
                        end={link.end}
                        /* 
                           Theme logic:
                           - Active: bg-primary/20 (stronger red tint) + solid red right border
                           - Hover: bg-white/5 (faint gray)
                        */
                        className={({ isActive }) => `
                            relative flex items-center gap-3 w-full py-4 px-6 md:px-8 
                            transition-all duration-200 group
                            ${isActive 
                                ? 'bg-primary/20 text-primary border-r-[4px] border-primary' 
                                : 'text-gray-400 hover:bg-red-400 hover:text-gray-200'
                            }
                        `}
                    >
                        <link.icon className={`w-5 h-5 shrink-0 transition-colors ${index === 0 ? 'group-active:text-primary' : ''}`} />
                        <p className="font-bold tracking-wide max-md:hidden uppercase text-[12px]">
                            {link.name}
                        </p>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default Sidebar