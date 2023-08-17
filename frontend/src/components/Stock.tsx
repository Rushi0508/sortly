import { Fragment, useEffect, useState } from 'react'
import { ChevronDownIcon } from "lucide-react";
import Layout from "./layouts/Layout";
import {Menu, Transition } from "@headlessui/react";
import { useTagStore } from './zustand/useTagStore';
import axios from 'axios';
import { useStoreStore } from './zustand/useStoreStore';

const sortOptions = [
    {
        name: "Recent",
    },
    {
        name: "Oldest",
    }
]
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Stock() {
    //Stock States
    const [stock, setStock] = useState(null);

    // filtering states
    const [filterTags, setFilterTags] = useState([])
    const [sort,setSort] = useState("Recent");
    const [search,setSearch] = useState("");

    const currentStore = useStoreStore((state: any)=>state.currentStore);
    const tags = useTagStore((state: any)=>state.tags);
    const fetchTags = useTagStore((state: any)=>state.fetchTags);

    // filter Tags handling
    const handleTagChange = (tagId) => {
        if (filterTags.includes(tagId)) {
          setFilterTags(prevFilterTags => prevFilterTags.filter(id => id !== tagId));
        } else {
          setFilterTags(prevFilterTags => [...prevFilterTags, tagId]);
        }
    };

    // Fetch Stock on request
    const fetchStock = async (sort, filterTags,search)=>{
        const storeId = currentStore?._id;
        console.log(storeId);
        
        let {data} = await axios.post(
            'http://localhost:5000/api/fetchItems',
            {storeId,filterTags,sort,search}
        )        
        setStock(data.items);
    }

    useEffect(()=>{
        fetchStock(sort,filterTags,search);
        fetchTags(currentStore?._id);
    }, [currentStore,sort,filterTags,search])

    return (
        <Layout>
            {!stock? 
            <div className='h-[90vh] bg-[#f3f4f6] flex justify-center items-center'>
                <svg style={{width: "2rem", height: "2rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> 
            </div>
            : (
            <>
            <div className='min-h-[100vh] w-full p-8'>
                <div className="relative overflow-x-auto no-scrollbar">
                    <div className="p-4 flex gap-4 items-center bg-white dark:bg-gray-900">
                        <label htmlFor="table-search" className="sr-only">Search</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input value={search} onChange={(e)=>{setSearch(e.target.value)}} type="search" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items"/>
                        </div>
                        {/* Sort Filter  */}
                        <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                Sort
                                <ChevronDownIcon
                                className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                                />
                            </Menu.Button>

                            <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                    {sortOptions.map((option) => (
                                        <Menu.Item key={option.name}>
                                        {({ active }) => (
                                            <a
                                            onClick={()=>{
                                                setSort(option.name)
                                            }}
                                            className={classNames(
                                                option.name===sort ? 'font-medium text-gray-900' : 'text-gray-500',
                                                active ? 'bg-gray-100' : '',
                                                'block px-4 py-2 text-sm','cursor-pointer'
                                            )}
                                            >
                                            {option.name}
                                            </a>
                                        )}
                                        </Menu.Item>
                                    ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                        {/* Category Filter  */}
                        <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                Category
                                <span className="bg-gray-200 text-gray-700 text-xs font-medium py-0.5 px-1.5 rounded dark:bg-blue-200 dark:text-blue-800 m-1">{filterTags.length}</span>
                                <ChevronDownIcon
                                className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                                />
                            </Menu.Button>

                            <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                    {tags.map((tag) => (
                                        <div key={tag._id} className="flex items-center p-1 px-3">
                                        <input
                                        id={tag.name}
                                        defaultValue={tag.name}
                                        type="checkbox"
                                        defaultChecked={(filterTags.includes(tag._id))?true: false}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        onChange={()=>handleTagChange(tag._id)}
                                        />
                                        <label
                                        htmlFor={tag.name}
                                        className="ml-3 min-w-0 flex-1 text-gray-500"
                                        >
                                        {tag.name}
                                        </label>
                                    </div>
                                    ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                    {stock.length===0? <p className='text-xl h-screen text-center'>No stock available</p>: 
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Item name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Available Stock
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {stock.map((item)=>{
                                return (
                                    <tr key={item._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                            </div>
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {item.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {(item.tags).map((tag,index) => {
                                                if(index===(item.tags).length-1)
                                                    return <span key={tag._id}>{tag.name}</span>
                                                else
                                                    return <span key={tag._id}>{tag.name} </span>
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.quantity} {(item.quantity > 0) ?`${item.unit}s`: item.unit}
                                        </td>
                                        <td className="px-6 py-4">
                                            ${item.sellPrice}
                                        </td>
                                        <td className="flex items-center px-6 py-4 space-x-3">
                                            <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">IN</a>
                                            <a href="#" className="text-sm font-medium text-red-600 dark:text-red-500 hover:underline">OUT</a>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    }
                </div>
            </div>
            </>
        
            )}

        </Layout>
    )
}
