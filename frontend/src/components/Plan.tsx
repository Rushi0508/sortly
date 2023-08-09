import axios from "axios"
import Layout from "./layouts/Layout"
import { useEffect, useState } from "react"
import { useUserStore } from "./zustand/useUserStore"

const Plans = ({ }) => {
    const [isLoading_p, setIsLoading_p] = useState(false)
    const [isLoading_s, setIsLoading_s] = useState(false)

    const user = useUserStore((state:any)=>state.user);

    const handlePlan = async (plan,price)=>{
        plan === "PREMIUM" ? setIsLoading_p(true) : setIsLoading_s(true)
        localStorage.setItem('plan', plan);
        const {data} = await axios.post(
            'http://localhost:5000/create-checkout-session',
            {plan,price}
        );
        plan === "PREMIUM" ? setIsLoading_p(false) : setIsLoading_s(false)
        window.location.href= data.url;
    }

    useEffect(()=>{
        if(localStorage.getItem('plan')){
            localStorage.removeItem('plan')
        }
    }, [])
    
    return (
        <Layout>
            <div className="h-[100vh] py-4 bg-[#f3f4f6]  flex flex-wrap items-center  justify-center overflow-auto">
                <div className="flex flex-col sm:flex-col lg:flex-row xl:flex-row md:flex-row justify-center items center  container   ">
                    <div className="py-12 sm:py-12 md:py-6 lg:py-6 xl:py-6 px-8 w-full md:max-w-min sm:w-full bg-white z-30">
                        <h1 className="text-gray-500 font-semibold text-xl ">Free</h1>
                        <div className="text-center py-4 px-7">
                            <h1 className="text-gray-700 text-4xl px-5 font-black">$0.00</h1>
                            <p className="text-gray-500  mt-2">Lifetime</p>
                        </div>
                        <div className="h-px bg-gray-200"></div>
                        <div className="text-center mt-3">
                            <p className="text-sm text-gray-400">
                                Only 1 store can be created
                            </p>
                            <p className="text-sm text-gray-400">
                                Upto 5 items can be created per store
                            </p>
                        </div>
                        <button disabled className="w-full mt-6 mb-3 py-2 text-white font-semibold bg-gray-700 hover:shadow-xl duration-200 hover:bg-gray-800">Buy Now</button>
                    </div>
                    <div className="py-12 sm:py-12 md:py-6 lg:py-6 xl:py-6 px-8 w-full md:max-w-min sm:w-full bg-purple-500 transform scale-1 sm:scale-1 md:scale-105 lg:scale-105 xl:scale-105 z-40  shadow-none sm:shadow-none md:shadow-xl lg:shadow-xl xl:shadow-xl">
                        <h1 className="text-purple-200 font-semibold text-xl ">Premium</h1>
                        <div className="text-center py-4 px-7">
                            <h1 className="text-white text-4xl font-black">$200.00</h1>
                            <p className="text-white text-opacity-50 mt-2">Lifetime</p>

                        </div>
                        <div className="h-px bg-purple-400"></div>
                        <div className="text-center mt-3">
                            <p className="text-sm text-white text-opacity-80">
                                Unlimited stores can be created
                            </p>
                            <p className="text-sm text-white text-opacity-80">
                                Unlimited items can be created per store
                            </p>
                        </div>
                        <button disabled={user.plan == "PREMIUM"? true: false} className="flex justify-center w-full mt-6 mb-3 py-2 text-white font-semibold bg-purple-400 hover:shadow-xl duration-200 hover:bg-purple-800" onClick={()=>handlePlan('PREMIUM', 200)}>
                        {isLoading_p ? (
                            <svg style={{width: "1.5rem", height: "1.5rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            ) : (
                            null
                        )}
                        {user.plan == "PREMIUM"? "ACTIVATED": "Buy Now"}</button>
                    </div>
                    <div className="py-12 sm:py-12 md:py-6 lg:py-6 xl:py-6 px-8 w-full md:max-w-min sm:w-full bg-white z-30">
                        <h1 className="text-gray-500 font-semibold text-xl ">Super</h1>
                        <div className="text-center py-4 px-7">
                            <h1 className="text-gray-700 text-4xl px-3 font-black">$100.00</h1>
                            <p className="text-gray-500  mt-2">Lifetime</p>

                        </div>
                        <div className="h-px bg-gray-200"></div>
                        <div className="text-center mt-3">
                            <p className="text-sm text-gray-400">
                                5 stores can be created
                            </p>
                            <p className="text-sm text-gray-400">
                                25 items can be created per store
                            </p>
                        </div>
                        <button disabled={user.plan == "SUPER"? true: false} className="flex justify-center w-full mt-6 mb-3 py-2 text-white font-semibold bg-gray-700 hover:shadow-xl duration-200 hover:bg-gray-800" onClick={()=>handlePlan('SUPER', 100)}>
                        {isLoading_s ? (
                            <svg style={{width: "1.5rem", height: "1.5rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            ) : (
                            null
                        )}
                        
                        {user.plan == "SUPER"?"Activated" : "Buy Now"}</button>
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default Plans