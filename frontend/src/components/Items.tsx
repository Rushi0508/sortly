import { Fragment, useEffect, useState } from 'react'
import { ChevronDownIcon } from "lucide-react";
import Layout from "./layouts/Layout";
import {AiOutlinePlus} from 'react-icons/ai'
import {Menu, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import {useForm} from 'react-hook-form'
import Select from 'react-select'
import ItemCard from './ItemCard';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import toast from 'react-hot-toast';
import { useStoreStore } from './zustand/useStoreStore';
import { useTagStore } from './zustand/useTagStore';
import { Separator } from './ui/separator';
import axiosInstance from './Axios';

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

export default function Items() {

    const navigate = useNavigate()

    // States for Dialog
    const [showItemDialog, setItemDialog] = useState(false);
    const [showTagDialog, setTagDialog] = useState(false);
    // Loader state
    const [isLoading, setIsLoading] = useState(false);
    // items state
    const [items,setItems] = useState(null);
    // filtering states
    const [sort,setSort] = useState("Recent");
    const [filterTags, setFilterTags] = useState([])
    const [search,setSearch] = useState("");
    // Create New Category States
    const [newTags, setNewTags] = useState("");
    // Item tags during item creation 
    const [itemTags, setItemTags] = useState([]);
    // Delete States
    const [showDeleteDialog, setDeleteDialog] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    // Edit States
    const [editItem, setEditItem] = useState(null);
    
    const userId = localStorage.getItem('user_id');

    const currentStore = useStoreStore((state: any)=>state.currentStore);
    const fetchStore = useStoreStore((state: any)=>state.fetchStore);
    const fetchStores = useStoreStore((state: any)=>state.fetchStores);
    const tags = useTagStore((state: any)=>state.tags);
    const fetchTags = useTagStore((state: any)=>state.fetchTags);

    const options = tags.map((tag) => ({ value: tag._id, label: tag.name }));

    // filter Tags handling
    const handleTagChange = (tagId) => {
        if (filterTags.includes(tagId)) {
          setFilterTags(prevFilterTags => prevFilterTags.filter(id => id !== tagId));
        } else {
          setFilterTags(prevFilterTags => [...prevFilterTags, tagId]);
        }
    };
    // set tags while item creation
    const handleSelectChange = (selectedOptions) => {
        setItemTags(selectedOptions);
    };
    // new tag creation
    const submitNewTag = async ()=>{
        setIsLoading(true);
        const storeId = currentStore._id;

        const formattedString = newTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
        .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1))
        .join(", ");

        const tagsArray = formattedString.split(", ").filter((item) => item.trim() !== "");

        if(tagsArray.length==0){
            toast.error("Empty Category cannot be added")
        }
        const {data} = await axiosInstance.post(
            '/api/addTag',
            {storeId, tagsArray}
        )
        if(data.hasOwnProperty('status')){
            toast.success("Category added successfully");
        }
        setNewTags("");
        setIsLoading(false);
        setTagDialog(false);
        fetchTags(storeId);
    }
      
    // New OR Edit Item submit
    const onSubmit = async (body) => {
        setIsLoading(true);
        body.tags = itemTags.map((tag)=>(tag.value))
        body.storeId = currentStore._id;
        console.log(body);
        if(editItem){
            const {data} = await axiosInstance.put(
                '/api/editItem',
                body
            );
            if(data.hasOwnProperty('errors')){
                toast.error('Something went wrong! Try Again');
            }
            else if(data.hasOwnProperty('status')){
                toast.success('Item Edited');
            }
            setEditItem(null);
        }
        else{
            const {data} = await axiosInstance.post(
                '/api/addItem',
                body
            );
    
            if(data.hasOwnProperty("errors")){
                toast.error(data.errors)
            }
            else{
                toast.success("Item added successfully")
            }
        }
        reset(initialValues);
        setItemTags([])
        setIsLoading(false);
        setItemDialog(false);
        fetchItems(sort,filterTags,search);
    }
    // Item Deletion
    const onDelete = async ()=>{
        setIsLoading(true)
        const {data} = await axiosInstance.post(
            `/api/deleteItem`,
            {deleteItem}
        )

        if(data.hasOwnProperty('errors')){
            toast.error('Something went wrong! Try Again');
        }
        else if(data.hasOwnProperty('status')){
            toast.success('Item Deleted');
        }
        setIsLoading(false)
        setDeleteDialog(false);
        setDeleteItem(null);
        fetchItems(sort,filterTags,search);
        fetchStore(userId);
        fetchStores(userId);
    }
    // Fetch Items on request
    const fetchItems = async (sort, filterTags,search)=>{
        const storeId = currentStore?._id;
        console.log(storeId);
        
        let {data} = await axiosInstance.post(
            '/api/fetchItems',
            {storeId,filterTags,sort,search}
        )        
        if(data.login === false){
            localStorage.clear()
            navigate('/login')
        }
        setItems(data.items);
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(()=>{
        fetchItems(sort,filterTags,search);
        fetchTags(currentStore?._id);
    }, [currentStore,sort,filterTags,search])

    const initialValues = {
        name: "",
        quantity: "",
        costPrice: "",
        sellPrice: "",
        unit: ""
    }

    return (
        <Layout>
            {!items? 
            <div className='bg-[#f3f4f6] flex flex-1 justify-center items-center'>
                <svg style={{width: "2rem", height: "2rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> 
            </div>
            // null
            : (
            <>
                <div className='bg-[#f3f4f6] flex-1 w-full'>
                    <div className="flex justify-center items-center m-4">
                        <div className="relative max-[450px]:min-w-[300px] min-w-[350px]">
                            <input value={search} onChange={(e)=>{setSearch(e.target.value)}} type="search" id="search" className="block p-2.5 w-full z-20 text-base text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 rounded-md" placeholder="Search Items..." required/>
                            <button type="submit" className="absolute top-0 right-0 h-full p-2.5 text-sm font-medium text-white bg-gray-800 rounded-r-md border border-gray-700 hover:bg-gray-900">
                                <svg className="w-7 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                                <span className="sr-only">Search</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-4">
                        {/* <DialogTrigger> */}
                            <button 
                                type="button"  
                                className="flex justify-center items-center px-2 py-1.5 sm:mx-3 text-sm font-medium text-center text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:ring-2 focus:outline-none focus:ring-gray-300"
                                onClick={() => {
                                    setItemDialog(true)
                                    setEditItem(null)
                                }}
                            >
                                <AiOutlinePlus size={20} className="pr-1"/>
                                New Item
                            </button>
                        {/* </DialogTrigger> */}
                        {/* Sort filter  */}
                        <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                {sort}
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
                        {/* Category filter  */}
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
                                    <div className="flex items-center pt-2 px-3" onClick={()=>setTagDialog(true)}>
                                        <AiOutlinePlus/>
                                        <label
                                            className="ml-3 min-w-0 flex-1 text-gray-500"
                                            >
                                            New Tag
                                        </label>
                                    </div>
                                    <Separator className='mt-1'/>
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
                    {items.length===0? <p className='mt-5 text-xl flex-1 text-center'>No Items found</p>:
                    <div className='p-5 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 md:p-8 justify-center justify-items-center grid gap-4 sm:gap-3'>
                        {items.map((item,index)=>{
                            return <ItemCard 
                            key={index} 
                                item={item}
                                setDeleteDialog={setDeleteDialog}
                                setDeleteItem={setDeleteItem}
                                setItemDialog={setItemDialog}
                                setEditItem={setEditItem}
                                reset={reset}
                                setItemTags={setItemTags}
                            />
                        })}
                    </div> 
                    }
                </div>
                {/* NEW Item MODAL  */}

            <Dialog open={showItemDialog} onOpenChange={()=>{setItemDialog(false);setItemTags([]);setEditItem(null);reset(initialValues)}}>
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className='overflow-auto h-full no-scrollbar'>
                    <DialogHeader>
                        <DialogTitle className="tracking-normal">{editItem? "Edit": "Add"} Item</DialogTitle>
                    </DialogHeader>
                    <div>
                    <div className="space-y-4 py-2 pb-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Item name</Label>
                            <Input
                                id="name" placeholder="Item Name"
                                {...register("name", {
                                    required: true,
                                })}
                                disabled={isLoading}
                            />
                            {errors.name && errors.name.type === "required" && (
                                <p className="mt-1 mb-0 text-red-600">Item name is required.</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input 
                                type= "number" id="quantity" placeholder="Quantity"
                                {...register("quantity", {
                                    required: true,
                                })}
                                disabled={isLoading}
                            />
                            {errors.quantity && errors.quantity.type === "required" && (
                                <p className="mt-1 mb-0 text-red-600">Quantity is required.</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unit">Unit</Label>
                            <Input 
                                id="unit" placeholder="Unit" 
                                {...register("unit", {
                                    required: true,
                                })}
                                disabled={isLoading}
                            />
                            {errors.unit && errors.unit.type === "required" && (
                                <p className="mt-1 mb-0 text-red-600">Unit is required.</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="costPrice">Cost Price</Label>
                            <Input
                                type="number" id="costPrice" placeholder="Cost Price" 
                                {...register("costPrice", {
                                    required: true,
                                })}
                                disabled={isLoading}
                            />
                            {errors.costPrice && errors.costPrice.type === "required" && (
                                <p className="mt-1 mb-0 text-red-600">Cost Price is required.</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sellPrice">Sell Price</Label>
                            <Input
                                type="number" id="sellPrice" placeholder="Sell Price" 
                                {...register("sellPrice", {
                                    required: true,
                                })}
                                disabled={isLoading}
                            />
                            {errors.sellPrice && errors.sellPrice.type === "required" && (
                                <p className="mt-1 mb-0 text-red-600">Sell Price is required.</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Select
                                options={options} 
                                value={itemTags}
                                onChange={handleSelectChange}
                                isMulti
                            />
                        </div>
                        
                    </div>
                    </div>
                    <DialogFooter>
                    <Button variant="outline" onClick={() => {setItemDialog(false);setItemTags([]);setEditItem(null);reset(initialValues)}}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)}>
                    {isLoading ? (
                        <svg style={{width: "1.5rem", height: "1.5rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        ) : (
                        null
                    )}
                    {editItem? "Edit": "Create"}</Button>
                    </DialogFooter>
                </DialogContent>
                </form>
            </Dialog>
            {/* DELETE ITEM  */}
            <Dialog open={showDeleteDialog} onOpenChange={()=>{setDeleteDialog(false);setDeleteItem(null)}}>
                <form action="">
                <DialogContent className='overflow-auto no-scrollbar'>
                    <DialogHeader>
                        <DialogTitle className="tracking-normal">Delete Item</DialogTitle>
                    </DialogHeader>
                    <div>
                    <div className="py-2 pb-4">
                        <div className="space-y-2">
                           <p className='text-base'>Are you sure you want to delete <i>{deleteItem? deleteItem.name: "Hello"} </i>?</p>
                        </div>
                    </div>
                    </div>
                    <DialogFooter>
                    <Button variant="outline" onClick={() => {setDeleteDialog(false); setDeleteItem(null)}}>
                        Cancel
                    </Button>
                    <Button onClick={onDelete} className='bg-red-500 hover:bg-red-600'>
                    {isLoading ? (
                        <svg style={{width: "1.5rem", height: "1.5rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        ) : (
                        null
                    )}
                    Delete</Button>
                    </DialogFooter>
                </DialogContent>
                </form>
            </Dialog>
            {/* TAG DIALOG  */}
            <Dialog open={showTagDialog} onOpenChange={setTagDialog}>
                <form action="">
                <DialogContent className='overflow-auto no-scrollbar'>
                    <DialogHeader>
                        <DialogTitle className="tracking-normal">Add New Category</DialogTitle>
                    </DialogHeader>
                    <div>
                    <div className="py-2 pb-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Category name</Label>
                            <Input
                                value={newTags}
                                onChange={(e)=>setNewTags(e.target.value)}
                                id="name" placeholder="Category Name"
                                disabled={isLoading}
                            />
                            <span className='text-sm text-gray-500 italic'>Multiple Tags can be added separated by comma</span>
                        </div>
                    </div>
                    </div>
                    <DialogFooter>
                    <Button variant="outline" onClick={() => setTagDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={submitNewTag}>
                    {isLoading ? (
                        <svg style={{width: "1.5rem", height: "1.5rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        ) : (
                        null
                    )}
                    Continue</Button>
                    </DialogFooter>
                </DialogContent>
                </form>
            </Dialog>
            </>
            )}
        </Layout>
    )
}
