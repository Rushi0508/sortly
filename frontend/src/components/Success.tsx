import axios from "axios";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "./zustand/useUserStore";

export default function Success() {
    const navigate = useNavigate();

    const updatePlan = async (userId,plan)=>{
        await axios.get(
            `http://localhost:5000/api/updateplan?plan=${plan}&user=${userId}`
        )
    }

    useEffect(()=>{
        const plan = localStorage.getItem('plan');
        const userId = localStorage.getItem('user_id');
        if(plan && userId){
            updatePlan(userId,plan)
        }
        navigate('/plans')
    },[])
    return (
        <div>
        Payment Cancelled
        </div>
    )
}
