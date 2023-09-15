import {create} from 'zustand'
import axiosInstance from '../Axios'

export const useUserStore = create((set)=>({
    user : {},
    addUser: (newUser) => { set({ user: newUser }) },
    updateUserField: (field, value) =>{set((state) => ({ user: { ...state.user, [field]: value } }))},
    fetchUser : async (userId)=>{
        const {data} = await axiosInstance.post(
            '/api/fetchUser',
            {userId}
        )
        set({user : data.data})
    }
}))
