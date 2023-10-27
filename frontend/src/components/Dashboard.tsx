import { FC, useEffect, useState } from 'react'
import Layout from './layouts/Layout'
import { useNavigate } from 'react-router-dom'
import { useStoreStore } from './zustand/useStoreStore';
import {TbTriangleFilled, TbTriangleInvertedFilled} from 'react-icons/tb'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Overview } from './Overview';
import { RecentSales } from './RecentSales';
import axiosInstance from './Axios';

const Dashboard: FC= ({}) => {
  const navigate = useNavigate();
  const currentStore = useStoreStore((state:any)=>state.currentStore)

  const [isFetching, setIsFetching] = useState(false);
  const [monthlyData,setMonthlyData] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [profit, setProfit] = useState(null);
  const [sales, setSales] = useState(null);
  const [mSales, setMSales] = useState(null);
  const [parties, setParties] = useState(null);
  const [change, setChange] = useState(null)
  const [recentSales, setRecentSales] = useState(null);

 
  const fetchDashboardDetails = async()=>{
    setIsFetching(true);
    const storeId = currentStore?._id;
    const {data} = await axiosInstance.post(
      '/api/details/dashboard',
      {storeId}
    ) 
    setIsFetching(false);
    if(data.login === false){
      localStorage.clear()
      navigate('/login')
    }
    
    setMonthlyData(data.monthlyData);
    setRevenue(data.cardData.totalRevenue)
    setProfit(data.cardData.totalProfit)
    setSales(data.cardData.salesCount)
    setMSales(data.cardData.mSalesCount)
    setParties(data.cardData.partiesCount)
    setChange(data.perChange);
    setRecentSales(data.recentSales)
  };


  useEffect(()=>{
    fetchDashboardDetails();
  },[currentStore])

  return(
    <>
    <Layout>
      {
        isFetching? 
        <div className='bg-[#f3f4f6] flex flex-1 justify-center items-center'>
          <svg style={{ width: "2rem", height: "2rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>:
        <div className='bg-[#f3f4f6] flex-1 w-full overflow-auto py-5 px-4 sm:px-8'>
            {(!currentStore?<h1 className='text-center h-100'>Create or Select a Store</h1> : 
              // Sales Overview 
              <>
              <div className="grid gap-4 min-[550px]:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${revenue?.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-muted-foreground">
                    {
                      change?.revenueChange < 0 ? 
                      <div className='flex items-center gap-1'><TbTriangleInvertedFilled className='text-red-500'/>{-Math.round(change?.revenueChange).toFixed(2)}% from last month</div>
                      :
                      <div className='flex items-center gap-1'><TbTriangleFilled className='text-green-500'/>{Math.round(change?.revenueChange).toFixed(2)}% from last month</div>
                    }
                    
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Profit
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${profit?.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-muted-foreground">
                    {
                      change?.profitChange < 0 ? 
                      <div className='flex items-center gap-1'><TbTriangleInvertedFilled className='text-red-500'/>{-Math.round(change?.profitChange).toFixed(2)}% from last month</div>
                      :
                      <div className='flex items-center gap-1'><TbTriangleFilled className='text-green-500'/>{Math.round(change?.profitChange).toFixed(2)}% from last month</div>
                    }
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sales}</div>
                  <p className="text-xs text-muted-foreground">
                    {
                      change?.salesChange < 0 ? 
                      <div className='flex items-center gap-1'><TbTriangleInvertedFilled className='text-red-500'/>{-Math.round(change?.salesChange).toFixed(2)}% from last month</div>
                      :
                      <div className='flex items-center gap-1'><TbTriangleFilled className='text-green-500'/>{Math.round(change?.salesChange).toFixed(2)}% from last month</div>
                    }
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Connected Parties
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{parties}</div>
                  <p className="text-xs text-muted-foreground">
                    {
                      change?.partyChange < 0 ? 
                      <div className='flex items-center gap-1'><TbTriangleInvertedFilled className='text-red-500'/>{-Math.round(change?.partyChange).toFixed(2)}% from last month</div>
                      :
                      <div className='flex items-center gap-1'><TbTriangleFilled className='text-green-500'/>{Math.round(change?.partyChange).toFixed(2)}% from last month</div>
                    }
                  </p>
                </CardContent>
              </Card>
              </div>
              {/* Charts Overview  */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 my-5">
                <Card className="col-span-4 md:block hidden">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview monthlyData={monthlyData} />
                  </CardContent>
                </Card>
                <Card className="col-span-4 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made {mSales} sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales recentSales={recentSales} />
                  </CardContent>
                </Card>
              </div>
              </>
            )}
        </div>
      }
    </Layout>
    </>
  )
}

export default Dashboard