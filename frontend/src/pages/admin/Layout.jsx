import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'

const Layout = () => {
  return (
    <div className='flex bg-[#050505] text-white'>
      <Sidebar/>
      <div className='flex-1 p-10'>
        <Outlet /> {/* CRITICAL: Without this, ListBookings is invisible */}
      </div>
    </div>
  )
}
export default Layout