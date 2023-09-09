import React, { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { PlusCircledIcon, ExitIcon } from '@radix-ui/react-icons'
import {useForm} from 'react-hook-form'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import {LiaStoreAltSolid} from 'react-icons/lia'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import axios from "axios"
import toast from "react-hot-toast"
import { useStoreStore } from "./zustand/useStoreStore"
import { useUserStore } from "./zustand/useUserStore"
import axiosInstance from "./Axios"
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"


export function Combobox() {    
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false)
  const [showStoreDialog, setStoreDialog] = React.useState(false)
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('user_token');

  const addUser = useUserStore((state: any)=>state.addUser)
  const stores = useStoreStore((state: any)=>state.stores);
  const addStore = useStoreStore((state: any)=>state.addStore);
  const fetchStore = useStoreStore((state: any)=>state.fetchStore);
  const fetchStores = useStoreStore((state: any)=>state.fetchStores);
  const currentStore = useStoreStore((state: any)=>state.currentStore);
  const setCurrentStore = useStoreStore((state:any)=>state.setCurrentStore)  
  

  const onSubmit = async (body) => {
    setIsLoading(true);
    body.userId = userId    
    const {data} = await axiosInstance.post(
      '/api/addStore',
      body,
      {
        headers: {
            Authorization: `${token}`,
        }
    }
    );
    console.log(data);
    if(data.hasOwnProperty("errors")){
      toast.error(data.errors);
    }
    else if(data.hasOwnProperty("loginRequired")){
        navigate('/login')
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_token')
    }
    else{
      toast.success('Store created successfully');
      addStore([...stores, data.data.store])
      setCurrentStore(data.data.store)
      console.log(stores);
    }
    setStoreDialog(false)
    setIsLoading(false)
  }

  const handleStoreStatus = async (storeId)=>{
    await axiosInstance.get(
        `/api/activestore?user=${userId}&store=${storeId}`
    )
  }

  const handleLogout = async ()=>{
    setCurrentStore(null);
    addStore([]);
    addUser({});
    localStorage.clear();
    navigate('/login')
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(()=>{    
    const fetchData = async ()=>{
        await fetchStores(userId)
        await fetchStore(userId)
    }
    if(stores?.length === 0){
        fetchData()
    }
  },[])

  return (
    <Dialog open={showStoreDialog} onOpenChange={setStoreDialog}>
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[200px] justify-between"
            >
                <LiaStoreAltSolid className='w-5 h-5'/>
            <span className="pl-2">{currentStore? currentStore.name:"Select Store"}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" onSelect={()=>setCurrentStore(stores[0])}>
            <Command>
                <CommandList>
                    <CommandEmpty>No Store found.</CommandEmpty>
                    <CommandGroup>
                        {stores?.map((store,index) => (
                        <CommandItem
                            key={store._id}
                            onSelect={() => {                                
                                setCurrentStore(stores[index])
                                handleStoreStatus(store._id);
                                console.log(currentStore);
                                setOpen(false)
                            }}
                        >
                            <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                currentStore && store.name === currentStore.name ? "opacity-100" : "opacity-0"
                            )}
                            />
                            {store.name}
                        </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
                <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            {/* <DialogTrigger asChild> */}
                                <CommandItem
                                    key={userId}
                                    onSelect={() => {
                                        setOpen(false)
                                        setStoreDialog(true)
                                    }}
                                    className=" cursor-pointer"
                                >
                                    <PlusCircledIcon className="mr-2 h-5 w-5" /> Create Store
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => handleLogout()}
                                    className=" cursor-pointer"
                                >
                                    <ExitIcon className="mr-2 h-5 w-5"/> Logout
                                </CommandItem>
                            {/* </DialogTrigger> */}
                        </CommandGroup>
                    </CommandList>
            </Command>
        </PopoverContent>
        </Popover>

        {/* NEW STORE MODAL  */}

        <form action="" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="tracking-normal">Create Store</DialogTitle>
            </DialogHeader>
            <div>
            <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Store name</Label>
                    <Input
                        id="name" placeholder="General Store.."
                        {...register("name", {
                            required: true,
                        })}
                        disabled={isLoading}
                    />
                    {errors.name && errors.name.type === "required" && (
                        <p className="mt-1 mb-0 text-red-600">Store name is required.</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                        id="email" placeholder="example@gmail.com"
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
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                        id="address" placeholder="Street 123, Washington" 
                        {...register("city", {
                            required: true,
                        })}
                        disabled={isLoading}
                    />
                    {errors.city && errors.city.type === "required" && (
                        <p className="mt-1 mb-0 text-red-600">City is required.</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Contact No.</Label>
                    <Input
                        id="phone" placeholder="1298762343" 
                        {...register("phone", {
                            required: true,
                            maxLength: 10,
                            minLength: 10
                        })}
                        disabled={isLoading}
                    />
                    {errors.phone && errors.phone.type === "required" && (
                        <p className="mt-1 mb-0 text-red-600">Phone No. is required.</p>
                    )}
                    {errors.phone && (errors.phone.type === "minLength" || errors.phone.type === 'maxLength') && (
                        <p className="mt-1 mb-0 text-red-600">Phone No. should be of 10 digits.</p>
                    )}
                </div>
            </div>
            </div>
            <DialogFooter>
            <Button variant="outline" onClick={() => setStoreDialog(false)}>
                Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
            {isLoading ? (
                  <svg style={{width: "1.5rem", height: "1.5rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
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
  )
}
