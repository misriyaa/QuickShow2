import React, { useEffect, useState } from 'react'
import { 
  ChartLineIcon, 
  CircleDollarSignIcon, 
  PlayCircleIcon, 
  UsersIcon,
  StarIcon
} from 'lucide-react'
import { dateFormat } from '../../library/dateFormat'
import { dummyDashboardData } from '../../assets/assets'
import Title from '../../components/admin/Title'
import Loading from '../../components/Loading'

const Dashboard = () => {

  const currency = "$"

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  });

  const [loading, setLoading] = useState(true);

  // Configuration for top summary cards
  const dashboardCards = [
    { 
        title: "Total Bookings", 
        value: dashboardData.totalBookings || "0", 
        icon: ChartLineIcon 
    },
    { 
        title: "Total Revenue", 
        value: `${currency}${dashboardData.totalRevenue}` || "0", 
        icon: CircleDollarSignIcon 
    },
    { 
        title: "Active Shows", 
        value: dashboardData.activeShows.length || "0", 
        icon: PlayCircleIcon 
    },
    { 
        title: "Total Users", 
        value: dashboardData.totalUser || "0", 
        icon: UsersIcon 
    }
  ];

  const fetchDashboardData = async () => {
    // Simulating API call with dummy data
    setDashboardData(dummyDashboardData)
    setLoading(false)
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return !loading ? (
    <div className='flex flex-col gap-5'>
      <Title text1="Admin" text2="Dashboard" />

      {/* Summary Cards Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {dashboardCards.map((card, index) => (
          <div key={index} className='bg-primary/10 border border-primary/20 p-5 rounded-xl flex items-center gap-4'>
            <div className='p-3 bg-primary/20 rounded-lg text-primary'>
               <card.icon size={28} />
            </div>
            <div>
              <p className='text-gray-400 text-sm font-medium'>{card.title}</p>
              <p className='text-2xl font-bold text-white'>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Shows Section (Based on Screenshot 6) */}
      <div className='mt-8'>
        <Title text1="Active" text2="Shows" />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
          {dashboardData.activeShows.map((show, index) => (
            <div key={index} className='bg-[#120b0e] border border-white/5 rounded-2xl overflow-hidden'>
                <img src={show.movie.poster_path} alt="" className='aspect-video object-cover' />
                <div className='p-4'>
                    <p className='text-lg font-semibold truncate'>{show.movie.title}</p>
                    <div className='flex items-center justify-between px-2 mt-2'>
                        <p className='text-lg font-medium'>{currency}{show.showPrice}</p>
                        <p className='flex items-center gap-1 text-sm text-gray-400'>
                            <StarIcon className='w-4 h-4 text-primary fill-primary' />
                            {show.movie.vote_average.toFixed(1)}
                        </p>
                    </div>
                    <p className='px-2 pt-2 text-sm text-gray-500'>
                        {dateFormat(show.showDateTime)}
                    </p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <Loading/>
  )
}

export default Dashboard