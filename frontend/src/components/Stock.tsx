import { Fragment, useEffect, useState } from 'react'
import { ChevronDownIcon } from "lucide-react";
import Layout from "./layouts/Layout";
import {Menu, Transition } from "@headlessui/react";
import { useTagStore } from './zustand/useTagStore';
import axios from 'axios';
import { useStoreStore } from './zustand/useStoreStore';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import {useForm} from 'react-hook-form'
import { PartyCombobox } from './PartyCombobox';
import { toast } from 'react-hot-toast';
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

const initialValues = {
    quantity: "",
    price: "",
    party: ""
}

export default function Stock() {
    //Stock States
    const [stock, setStock] = useState(null);

    // filtering states
    const [filterTags, setFilterTags] = useState([])
    const [sort,setSort] = useState("Recent");
    const [search,setSearch] = useState("");

    // Stock operation states
    const [operation, setOperation] = useState("");
    const [stockItem, setStockItem] = useState(null);

    // dialog state
    const [showStockDialog, setStockDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // party states
    const [parties, setParties] = useState(null);
    const initial = {label: "", value: ""}
    const [party,setParty] = useState(initial);

    const currentStore = useStoreStore((state: any)=>state.currentStore);
    const tags = useTagStore((state: any)=>state.tags);
    const fetchTags = useTagStore((state: any)=>state.fetchTags);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

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
        
        let {data} = await axiosInstance.post(
            '/api/fetchItems',
            {storeId,filterTags,sort,search}
        )        
        setStock(data.items);
    }

    const onSubmit = async (body)=>{
        console.log(body);
        
        setIsLoading(true)
        body.storeId = currentStore._id;
        if(operation==='In'){
            body.supplier = party.value;
            body.type = 'Buy'
            body.costPrice = body.price
            body.sellPrice = stockItem.sellPrice;
            body.costValue = body.costPrice * body.quantity
            if(body.amountPaid === body.costValue){
                body.paymentStatus = "COMPLETED"
            }
            else if(body.amountPaid > body.costValue){
                body.paymentStatus = "DEPOSIT"
            }else{
                body.paymentStatus = "PENDING"
            }
        }
        else if(operation==='Out'){
            body.buyer = party.value;
            body.type = 'Sell'
            body.sellPrice = body.price
            body.costPrice = stockItem.costPrice
            body.sellValue = body.sellPrice * body.quantity
            body.profit = (body.sellPrice - stockItem.costPrice) * body.quantity;
            if(body.amountPaid === body.sellValue){
                body.paymentStatus = "COMPLETED"
            }
            else if(body.amountPaid < body.sellValue){
                body.paymentStatus = "PENDING"
            }else{
                body.paymentStatus = "DEPOSIT"
            }
        }
        body.payDate = Date.now();
        body.items = [stockItem]
        delete body.price;
        const {data} = await axiosInstance.post(
            '/api/createEntry',
            body
        );
        if(data.hasOwnProperty('errors')){
            toast.error('Something went wrong! Try again');
        }
        else{
            toast.success(`Stock ${operation} successful`)
        }
        setIsLoading(false);
        fetchStock(sort,filterTags,search);
        setOperation("");
        setStockDialog(false);
        setParty(initial);
        setStockItem(null);
        reset(initialValues);
    }

    // on out click
    const handleOut = (i)=>{
        setOperation("Out");
        setStockItem(i)
        setStockDialog(true);
        reset({price: i.sellPrice})
    }

    // on in click
    const handleIn = (i)=>{
        setOperation("In");
        setStockItem(i)
        setStockDialog(true);
        reset({price: i.costPrice})
    }

    // fetch parties
    const fetchParties = async (sort,type,searchParty)=>{
        const storeId = currentStore._id;
        const {data} = await axiosInstance.post(
            '/api/fetchParties',
            {storeId,type,sort,searchParty}
        );
        
        if(data.hasOwnProperty('parties')){
            setParties(data.parties);
        }
        
    }

    useEffect(()=>{
        fetchStock(sort,filterTags,search);
        fetchTags(currentStore?._id);
        fetchParties("Recent", "All", "");
    }, [currentStore,sort,filterTags,search])

    return (
        <Layout>
            {!stock? 
            // <div className='h-[90vh] bg-[#f3f4f6] flex justify-center items-center'>
            //     <svg style={{width: "2rem", height: "2rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            //         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            //         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            //     </svg> 
            // </div>
            null
            : (
            <>
            <div className='min-h-[100vh] w-[100%] whitespace-nowrap p-2 sm:p-8'>
                <div className="relative overflow-x-scroll no-scrollbar">
                    <div className="p-4 flex-col flex gap-4 sm:flex-row items-center bg-white dark:bg-gray-900">
                        <label htmlFor="table-search" className="sr-only">Search</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input value={search} onChange={(e)=>{setSearch(e.target.value)}} type="search" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items"/>
                        </div>
                        <div className='flex gap-4 justify-center items-center'>
                            {/* Sort Filter  */}
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
                    </div>
                    {stock.length===0? <div className='text-xl h-screen text-center'><p>No stock found</p><p>Add items to see Stock</p></div>: 
                        <>
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
                                        Cost value
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Sell value
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
                                                ${item.sellPrice.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                ${Math.floor(item.costPrice * item.quantity).toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                ${Math.floor(item.sellPrice * item.quantity).toLocaleString('en-IN')}
                                            </td>
                                            <td className="flex items-center px-6 py-4 space-x-3">
                                                <a href="#" onClick={()=>handleIn(item)} className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">IN</a>
                                                <a href="#" onClick={()=>handleOut(item)} className="text-sm font-medium text-red-600 dark:text-red-500 hover:underline">OUT</a>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <Dialog open={showStockDialog} onOpenChange={()=>{setStockDialog(false);setStockItem(null);reset(initialValues); setParty(initial)}}>
                            <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <DialogContent className='overflow-auto no-scrollbar'>
                                <DialogHeader>
                                    <DialogTitle className="tracking-normal">Stock {operation} - {stockItem? stockItem.name: ""}</DialogTitle>
                                </DialogHeader>
                                <div>
                                <div className="space-y-4 py-2 pb-4">
                                    <div className="mb-2">
                                        <p className='text-md'>Available Stock: {stockItem? (stockItem.quantity > 0 ? stockItem.quantity + " " + stockItem.unit +"s": stockItem.quantity + " " + stockItem.unit) : ""}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity" className='text-md font-medium'>Enter Quantity to {operation==="In"? "Add": "Remove"}</Label>
                                        <Input 
                                            type="number" id="quantity" 
                                            {...register("quantity", {
                                                required: true,
                                                valueAsNumber: true,
                                                max: parseInt(`${operation==="Out"? stockItem?stockItem.quantity:0 : 1000 }`)
                                            })}
                                            disabled={isLoading}
                                        />
                                        {errors.quantity && errors.quantity.type === "max" && (
                                            <p className="mt-1 mb-0 text-red-600">
                                                Removable quantity is not more than {stockItem? stockItem.quantity: 0}
                                            </p>
                                        )}
                                        {errors.quantity && errors.quantity.type === "required" && (
                                            <p className="mt-1 mb-0 text-red-600">
                                                Enter qunatity
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className='text-md font-medium'>{operation==="In"? "Cost Price": "Sell Price"}/{stockItem? stockItem.unit: ""}</Label>
                                        <Input 
                                            type="number" id="price" 
                                            {...register("price", {
                                                required: true,
                                            })}
                                            disabled={isLoading}
                                        />
                                        {errors.price && errors.price.type === "required" && (
                                            <p className="mt-1 mb-0 text-red-600">
                                                Price is required
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <PartyCombobox key={party.value} parties={parties} party={party} setParty={setParty}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Input 
                                            type="number" id="amount" 
                                            placeholder='Amount Paid'
                                            {...register("amountPaid", {
                                                valueAsNumber: true
                                            })}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                </div>
                                </div>
                                <DialogFooter>
                                <Button variant="outline" onClick={() => {setStockDialog(false);setStockItem(null);reset(initialValues); setParty(initial)}}>
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
                                Submit</Button>
                                </DialogFooter>
                            </DialogContent>
                            </form>
                        </Dialog>
                        </>
                    }
                </div>
            </div>
            </>
        
            )}

        </Layout>
    )
}
