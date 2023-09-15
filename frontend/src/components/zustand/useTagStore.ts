import {create} from 'zustand'
import axiosInstance from '../Axios'

export const useTagStore = create((set)=>({
    tags : [],
    addTags: (tags) => { set({ tags: tags }) },
    fetchTags : async (storeId)=>{
        const {data} = await axiosInstance.post(
            '/api/fetchTags',
            {storeId}
        )
        set({tags : data.tags})
    }
}))
