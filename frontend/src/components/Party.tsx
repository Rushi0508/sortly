import { Fragment, useEffect, useState } from 'react'
import { ChevronDownIcon } from "lucide-react";
import Layout from "./layouts/Layout";
import {AiOutlinePlus} from 'react-icons/ai'
import {Menu, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'react-hot-toast';
import { useStoreStore } from './zustand/useStoreStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Link } from 'react-router-dom';
import axiosInstance from './Axios';

const sortOptions = [
    {
        name: "Recent",
    },
    {
        name: "Oldest",
    }
]
const typeOptions = [
    {
        name: "All"
    },
    {
        name: "Supplier",
    },
    {
        name: "Buyer",
    }
]
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const initialValues = {
    name: "",
    contact: "",
    type: "",
}

export default function Party() {

    const navigate = useNavigate()
    // Filter States
    const [searchParty, setSearchParty] = useState("");
    const [sort, setSort] = useState("Recent")
    const [type, setType] = useState("");

    // New Party Dialog
    const [showPartyDialog, setPartyDialog] = useState(false);

    // loading state
    const [isLoading, setIsLoading] = useState(false);

    // Party states
    const [parties, setParties] = useState(null);

    
    const currentStore = useStoreStore((state: any)=>state.currentStore);
    
    // Accordion states
    const [accordion, setAccordion] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm();

    const fetchParties = async (sort,type,searchParty)=>{
        const storeId = currentStore?._id;
        const {data} = await axiosInstance.post(
            '/api/fetchParties',
            {storeId,type,sort,searchParty}
        );
        if(data.login === false){
            localStorage.clear()
            navigate('/login')
        }
        if(data.hasOwnProperty('parties')){
            setParties(data.parties);
        }
        
    }

    const onSubmit = async (body)=>{
        setIsLoading(true);
        body.storeId = currentStore._id;
        const {data} = await axiosInstance.post(
            '/api/createParty',
            body
        )

        if(data.hasOwnProperty('errors')){
            toast.error('Something went wrong! Try again');
        }else{
            toast.success('Party added successfully');
        }
        setIsLoading(false);
        setPartyDialog(false);
        reset(initialValues);
        fetchParties(sort,type,searchParty);
    }

    useEffect(()=>{
        fetchParties(sort,type,searchParty);
    }, [sort,type,searchParty,currentStore])

  return (
    <Layout>
        {!parties? 
        <div className='bg-[#f3f4f6] flex flex-1 justify-center items-center'>
            <svg style={{ width: "2rem", height: "2rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        // null
         : (
        <div className='flex-1'>
            <div className="flex justify-center items-center m-4">
                <div className="relative max-[450px]:min-w-[300px] min-w-[350px]">
                    <input value={searchParty} onChange={(e)=>{setSearchParty(e.target.value)}} type="search" id="search" className="block p-2.5 w-full z-20 text-base text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 rounded-md" placeholder="Search Parties..." required/>
                    <button type="submit" className="absolute top-0 right-0 h-full p-2.5 text-sm font-medium text-white bg-gray-800 rounded-r-md border border-gray-700 hover:bg-gray-900">
                        <svg className="w-7 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </div>
            </div>
            <div className="flex justify-center items-center gap-5">
                {/* New Button  */}
                <button 
                    type="button"  
                    className="flex justify-center items-center px-2 py-1.5 sm:mx-3 text-sm font-medium text-center text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:ring-2 focus:outline-none focus:ring-gray-300"
                    onClick={() => {
                        setPartyDialog(true)
                        setValue("type", "Buyer")
                    }}
                >
                    <AiOutlinePlus size={20} className="pr-1"/>
                    New Party
                </button>
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
                {/* Type filter  */}
                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        {type===""? "All": type}
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
                            {typeOptions.map((option) => (
                                <Menu.Item key={option.name}>
                                {({ active }) => (
                                    <a
                                    onClick={()=>{
                                        setType(option.name)
                                    }}
                                    className={classNames(
                                        option.name===type ? 'font-medium text-gray-900' : 'text-gray-500',
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
            </div>
            <div className="p-5">
            {parties.length===0? <p className='text-xl flex-1 text-center'>No Parties found</p>:
                <Accordion className='m-auto w-[95%] sm:w-[80%] lg:w-[60%]' type="single" collapsible>
                    {parties.map((party)=>{
                        return (
                            <AccordionItem key={party._id} value={party._id}>
                                <AccordionTrigger className={accordion === party._id ? 'bg-[#f3f4f6] px-3 rounded-md' : 'px-3'} onClick={()=>setAccordion(party._id)}>{party.name}</AccordionTrigger>
                                <AccordionContent className='p-3'>
                                    <dl className="w-100 text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                                        <div className="flex flex-col pb-2">
                                            <dt className="mb-1 text-gray-500 md:text-sm dark:text-gray-400">Contact No.</dt>
                                            <dd className="text-md font-semibold">{party.contact}</dd>
                                        </div>
                                        <div className="flex flex-col py-2">
                                            <dt className="mb-1 text-gray-500 md:text-sm dark:text-gray-400">Email</dt>
                                            <dd className="text-md font-semibold">{party.email}</dd>
                                        </div>
                                        <div className="flex flex-col py-2">
                                            <dt className="mb-1 text-gray-500 md:text-sm dark:text-gray-400">Type</dt>
                                            <dd className="text-md font-semibold">{party.type}</dd>
                                        </div>
                                        <div className="flex flex-col pt-2">
                                            <dt className="mb-1 text-gray-500 text-md dark:text-gray-400">
                                                <Link to={'/entries/party/'+party._id} state={party} className='text-blue-500 hover:underline'>See History</Link>
                                            </dt>
                                        </div>
                                    </dl>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            }
            </div>

            <Dialog open={showPartyDialog} onOpenChange={()=>{setPartyDialog(false);reset(initialValues)}}>
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className='overflow-auto no-scrollbar'>
                    <DialogHeader>
                        <DialogTitle className="tracking-normal">Add Party</DialogTitle>
                    </DialogHeader>
                    <div>
                    <div className="space-y-4 py-2 pb-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Party name</Label>
                            <Input
                                id="name" placeholder="Party Name"
                                {...register("name", {
                                    required: true,
                                })}
                                disabled={isLoading}
                            />
                            {errors.name && errors.name.type === "required" && (
                                <p className="mt-1 mb-0 text-red-600">Party name is required.</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact No.</Label>
                            <Input 
                                type= "text" id="contact" placeholder="Contact No."
                                {...register("contact", {
                                    required: true,
                                    maxLength: 10,
                                    minLength: 10,
                                })}
                                disabled={isLoading}
                            />
                            {errors.contact && errors.contact.type === "required" && (
                                <p className="mt-1 mb-0 text-red-600">Contact no. is required.</p>
                            )}
                            {errors.contact && (errors.contact.type === "maxLength" || errors.contact.type === "minLength") && (
                                <p className="mt-1 mb-0 text-red-600">Contact no. is of 10 digits</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Email</Label>
                            <Input 
                                type= "email" id="email" placeholder="Email Address"
                                {...register("email", {
                                    required: true,
                                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                                })}
                                disabled={isLoading}
                            />
                            {errors.email && errors.email.type === "required" && (
                                <p className="mt-1 mb-0 text-red-600">Email is required.</p>
                            )}
                            {errors.email && errors.email.type === "pattern" && (
                                <p className="mt-1 mb-0 text-red-600">Email is not valid.</p>
                            )}
                        </div>
                        <div className="flex gap-4 items-center">
                            <Label>Type</Label>
                            <RadioGroup className='flex gap-3' defaultValue='Buyer'>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                        value="Buyer" 
                                        id="option-one" 
                                        onClick={()=>setValue('type', "Buyer")}
                                        {...register("type",{
                                            required: true
                                        })}
                                    />
                                    <Label htmlFor="option-one">Buyer</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                        value="Supplier" 
                                        id="option-two" 
                                        onClick={()=>setValue('type', "Supplier")}
                                        {...register("type",{
                                            required: true
                                        })}
                                    />
                                    <Label htmlFor="option-two">Supplier</Label>
                                </div>
                            </RadioGroup>
                            {errors.type && errors.type.type === "required" && (
                                <p className="mb-0 text-red-600">Select a type.</p>
                            )}
                        </div>
                    </div>
                    </div>
                    <DialogFooter>
                    <Button variant="outline" onClick={() => {setPartyDialog(false);reset(initialValues)}}>
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
                    Create</Button>
                    </DialogFooter>
                </DialogContent>
                </form>
            </Dialog>
        </div>
        )}
    </Layout>
  )
}
