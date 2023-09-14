import { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import {RiDeleteBinLine,RiEditLine} from 'react-icons/ri'

export default function ItemCard({item,setDeleteDialog,setDeleteItem,setItemDialog,setEditItem,reset,setItemTags}) {
    const handleDelete = (i)=>{
        setDeleteDialog(true);
        setDeleteItem(i);
    }
    const handleEdit = (i)=>{
        const selectedTags = (i.tags).map((tag) => ({ value: tag._id, label: tag.name }));
        setEditItem(i);
        setItemDialog(true)
        setItemTags(selectedTags)
        reset(i);
    }
    const [hide, setHide] = useState("hidden");
    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="p-5 pb-5">
                <div className='flex items-center justify-between'>
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{item.name}</h5>
                    
                </div>
                <div className="flex flex-col items-start mb-3">
                    <div className="flex gap-2 mt-2">
                        {(item.tags).map(tag => {
                            return <span key={tag._id} className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded dark:bg-blue-200 dark:text-blue-800">#{tag.name}</span>
                        })}
                    </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <div className='flex gap-3'>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm'>Cost Price: </span>
                            <span className={hide==""? "hidden": "text-lg font-bold text-gray-900 dark:text-white"}>***</span>
                            <AiFillEye className={hide==""? "hidden": ""} onClick={()=>setHide("")}/>
                            <span className={`${hide} text-lg font-bold text-gray-900 dark:text-white`}>${(item.costPrice).toLocaleString('en-IN')}</span>
                            <AiFillEyeInvisible onClick={()=>setHide('hidden')} className={`${hide}`}/>
                        </div>
                        <div className='flex items-center gap-1'>
                            <span className='text-sm'>Sell Price: </span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">${(item.sellPrice).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="bg-blue-100 text-blue-800 text-sm px-2.5 py-1 rounded dark:bg-blue-200 dark:text-blue-800">{item.quantity} {item.unit}{item.quantity > 1? 's': null}</span>
                    <div>
                        <button type="button" onClick={()=>handleEdit(item)} className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-md text-sm px-2 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 mx-2">
                            <RiEditLine size={20}/>
                        </button>
                        <button type="button" onClick={()=>handleDelete(item)} className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-md text-sm px-2 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                            <RiDeleteBinLine size={20}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
