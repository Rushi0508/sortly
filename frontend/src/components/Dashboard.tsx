import { FC, useMemo } from 'react'
import Layout from './layouts/Layout'
import { useNavigate } from 'react-router-dom'

const Dashboard: FC= ({}) => {
  const navigate = useNavigate();
  return(
    <>
    <Layout>
        <div className='bg-[#f3f4f6] h-[100vh] w-full'>
        
        </div>
    </Layout>
    </>
  )
}

export default Dashboard