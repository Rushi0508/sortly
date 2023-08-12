import axios from 'axios'
import {create} from 'zustand'

export const useTagStore = create((set)=>({
    tags : [],
    addTags: (tags) => { set({ tags: tags }) },
    fetchTags : async (storeId)=>{
        const {data} = await axios.post(
            'http://localhost:5000/api/fetchTags',
            {storeId}
        )
        set({tags : data.tags})
    }
}))
