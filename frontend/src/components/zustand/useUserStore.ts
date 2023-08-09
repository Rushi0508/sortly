import axios from 'axios'
import {create} from 'zustand'

export const useUserStore = create((set)=>({
    user : {},
    addUser: (newUser) => { set({ user: newUser }) },
    updateUserField: (field, value) =>{set((state) => ({ user: { ...state.user, [field]: value } }))},
    fetchUser : async (userId)=>{
        const {data} = await axios.post(
            'http://localhost:5000/api/fetchUser',
            {userId}
        )
        set({user : data.data})
    }
}))
