import axios from 'axios'
import {create} from 'zustand'

export const useStoreStore = create((set)=>({
    stores: [],
    currentStore: null,
    addStore: (newStore) =>{
        set({
            stores: newStore
        })
    },
    setCurrentStore: (store)=>{
        set({
            currentStore: store
        })
    },
    fetchStore: async (userId)=>{
        const {data} = await axios.post(
            'http://localhost:5000/api/fetchStore',
            {userId}
        )
        set({currentStore : data.data})
    },
    // fetchStore: async (index)=>{
    //     set((state)=>({currentStore: state.stores[index]}))
    // },
    fetchStores: async (userId)=>{
        const {data} = await axios.post(
            'http://localhost:5000/api/fetchStores',
            {userId}
        )
        set({stores : data.data})
    }
}))