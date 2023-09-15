import {create} from 'zustand'
import axiosInstance from '../Axios'

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
        const {data} = await axiosInstance.post(
            '/api/fetchStore',
            {userId}
        )
        set({currentStore : data.data})
    },
    // fetchStore: async (index)=>{
    //     set((state)=>({currentStore: state.stores[index]}))
    // },
    fetchStores: async (userId)=>{
        const {data} = await axiosInstance.post(
            '/api/fetchStores',
            {userId}
        )
        set({stores : data.data})
    }
}))