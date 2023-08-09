import { FC } from 'react'
import Layout from './layouts/Layout'
import { useNavigate } from 'react-router-dom'
import { useStoreStore } from './zustand/useStoreStore';

const Dashboard: FC= ({}) => {
  const navigate = useNavigate();
  const currentStore = useStoreStore((state:any)=>state.currentStore)
  return(
    <>
    <Layout>
        <div className='bg-[#f3f4f6] h-[100vh] w-full overflow-auto'>
            {(!currentStore?<h1>SELECT A STORE</h1> : 
              <h1></h1>
            
            )}
        </div>
    </Layout>
    </>
  )
}

export default Dashboard