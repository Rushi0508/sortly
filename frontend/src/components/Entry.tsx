import { Fragment, useEffect, useState } from 'react'
import { ChevronDownIcon } from "lucide-react";
import Layout from './layouts/Layout'
import {Menu, Transition } from "@headlessui/react";
import { CalendarIcon } from "@radix-ui/react-icons"
import {format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useStoreStore } from './zustand/useStoreStore';
import { toast } from 'react-hot-toast';
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
import { Calendar } from './ui/calendar';
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


export default function Entry({
  className
}: React.HTMLAttributes<HTMLDivElement>) {


  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })

  const [isLoading, setIsLoading] = useState(false);

  const [entries, setEntries] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Recent");
  const [type,setType] = useState("Sell")

  const [selectedEntry,setSelectedEntry] = useState(null);
  const [showEntryDialog, setEntryDialog] = useState(false);

  const [selectedParty, setSelectedParty] = useState(null);
  const [showPartyDialog, setPartyDialog] = useState(false);

  const currentStore = useStoreStore((state:any)=>state.currentStore);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const fetchEntries = async(sort,date,search,type)=>{    
    const storeId = currentStore?._id;
    const {data} = await axiosInstance.post(
      '/api/fetchEntries',
      {storeId,sort,date,search,type}
    );
    if(!data.hasOwnProperty('errors')){
        setEntries(data.entries);
    }
  }

  const sendInvoice = async(entry,store)=>{

    toast.loading("Sending Invoice")

    const {data} = await axiosInstance.post(
      '/api/sendinvoice',
      {entry,store}
    );

    if(data.hasOwnProperty('errors')){
      toast.error('Invoice not sent!!')
    }else{
      toast.success('Invoice sent successfully')
    }
  }

  const updateEntry = (entry)=>{
    setEntryDialog(true);
    setSelectedEntry(entry);
    if(entry.type==="Sell"){
      reset({value: entry.sellValue})
    }else{
      reset({value: entry.costValue})
    }
  }

  const onSubmit = async (body)=>{
    setIsLoading(true);
    body.entry = selectedEntry;
    const {data} = await axiosInstance.post(
      '/api/updateEntry',
      body
    );
    
    if(data.hasOwnProperty('errors')){
      toast.error("Something went wrong");
    }
    else{
      toast.success("Entry updated successfully");
    }
    fetchEntries(sort,date,search,type);
    setEntryDialog(false);
    setSelectedEntry(null);
    reset({value: ""})
    setIsLoading(false);
  }

  const openParty =async (entry) => {
      if(entry.hasOwnProperty('buyer')){
        if(entry.buyer!=""){
          const {data} = await axiosInstance.get(
            `/api/fetchParty?id=${entry.buyer}`
          );
          setSelectedParty(data.party);
        }
      }else{
        if(entry.supplier!=""){
          const {data} = await axiosInstance.get(
            `/api/fetchParty?id=${entry.supplier}`
          );
          setSelectedParty(data.party);
        }
      }
      setSelectedEntry(entry);
      setPartyDialog(true);
  }

  useEffect(()=>{
    fetchEntries(sort,date,search,type);
  }, [currentStore,sort,search,date,type])

  return (
    <Layout>
      {!entries ?
        <div className='bg-[#f3f4f6] flex flex-1 justify-center items-center'>
          <svg style={{ width: "2rem", height: "2rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        // null
        : (
          <>
            <div className='flex-1 whitespace-nowrap w-[100%] p-2 md:p-8'>
              <div className="relative overflow-x-auto no-scrollbar">
                <div className="p-4 flex-col flex gap-4 md:flex-row items-center bg-white dark:bg-gray-900">
                  <label htmlFor="table-search" className="sr-only">Search</label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg>
                    </div>
                    <input onClick={()=>console.log(date)} value={search} onChange={(e) => { setSearch(e.target.value) }} type="search" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search invoice" />
                  </div>
                  <div className='flex flex-wrap gap-4 justify-center items-center'>
                    {/* Date Range  */}
                    <div className={cn("grid gap-2", className)}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-[300px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, "LLL dd, y")} -{" "}
                                  {format(date.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(date.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={1}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                <div className='flex items-center mb-4'>
                  <Tabs defaultValue="Sell" className="px-4">
                    <TabsList>
                      <TabsTrigger value="Sell" onClick={()=>setType("Sell")}>Sell Entries</TabsTrigger>
                      <TabsTrigger value="Buy" onClick={()=>setType("Buy")}>Buy Entries</TabsTrigger>
                    </TabsList>
                  </Tabs>
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
                                    onClick={() => {
                                      setSort(option.name)
                                    }}
                                    className={classNames(
                                      option.name === sort ? 'font-medium text-gray-900' : 'text-gray-500',
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm', 'cursor-pointer'
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
                  {entries.length === 0 ? <p className='text-xl flex-1 text-center'>No Entries found</p> :
                  <>
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          {/* {type==="Sell"? "INVOICE" : "DATE"} */}
                          ENTRY
                        </th>
                        {/* <th scope="col" className="px-6 py-3">
                          Items
                        </th>
                        <th scope="col" className="px-6 py-3">
                        {type==="Sell"? "Sell Price" : "Cost Price"}
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Quantity
                        </th> */}
                        <th scope="col" className="px-6 py-3">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Balance($)
                        </th>
                        {type==="Sell"? (
                          <th scope="col" className="px-6 py-3">
                            P/L
                          </th>
                        ): null}
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry:any)=>{
                        return (
                          <tr key={entry._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <span onClick={()=>openParty(entry)} className={"underline cursor-pointer"}>E{entry.entryId}</span>
                                <br /><span className='text-xs'>{format(new Date(entry.createdAt), 'LLL dd, y')}</span>
                            </th>
                            {/* <td className="px-6 py-4">
                              {(entry.items).map(item => {
                                return <span key={item._id}>{item.name}</span>
                              })}
                            </td>
                            <td className="px-6 py-4">
                              ${type==="Sell"?entry.sellPrice?.toLocaleString('en-IN'):entry.costPrice?.toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-4">
                              {entry.quantity}
                            </td> */}
                            <td className="px-6 py-4">
                              ${type==="Sell"?entry.sellValue?.toLocaleString('en-IN'): entry.costValue?.toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-4">
                              {type==="Sell"? 
                                (entry.amountPaid > entry.sellValue ? "("+(entry.amountPaid-entry.sellValue)?.toLocaleString('en-IN')+")" : entry.sellValue-entry.amountPaid)?.toLocaleString('en-IN')
                                 :
                                 (entry.amountPaid >= entry.costValue ? entry.amountPaid-entry.costValue : "("+(entry.costValue-entry.amountPaid)?.toLocaleString('en-IN')+")")?.toLocaleString('en-IN')
                                }
                            </td>
                            {type==="Sell"?
                              <td className={entry.profit<0?'text-red-500': 'text-green-400' + ' px-6 py-4 font-semibold '}>
                              {entry.profit>0?"+"+(entry.profit)?.toLocaleString('en-IN'): (entry.profit)?.toLocaleString('en-IN')}
                              </td>: null  
                            }
                            <td className="px-6 py-4">
                              <span className={
                                (entry.paymentStatus==="COMPLETED"?
                                  "bg-green-100 text-green-800" : 
                                  (entry.paymentStatus==="PENDING"?
                                  "bg-red-100 text-red-800":
                                  "bg-blue-100 text-blue-800"
                                  )
                                )
                                  + " text-xs px-2.5 py-1 rounded"}
                              >
                                    {entry.paymentStatus}
                                  </span>
                            </td>
                            {type==="Sell"? 
                                <td className="px-6 py-4 space-x-3">
                                  {entry.buyer===""? <span>NA</span>:
                                    <div>
                                      {/* <p onClick={()=>sendInvoice(entry,currentStore)} className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">Send Invoice</p> */}
                                      <p onClick={()=>updateEntry(entry)} className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">Update Entry</p>
                                    </div>
                                  }  
                                </td>
                              : <td className="px-6 py-4 space-x-3"><p onClick={()=>updateEntry(entry)} className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">Update Entry</p></td>
                            }
                          </tr>
                        )
                      })}                        
                    </tbody>
                  </table>
                  <Dialog open={showEntryDialog} onOpenChange={()=>{setEntryDialog(false);setSelectedEntry(null); reset({value: ""})}}>
                      <form action="" onSubmit={handleSubmit(onSubmit)}>
                      <DialogContent className='overflow-auto no-scrollbar'>
                          <DialogHeader>
                              <DialogTitle className="tracking-normal">Update Entry - E{selectedEntry?.entryId}</DialogTitle>
                          </DialogHeader>
                          <div>
                          <div className="space-y-4 py-2 pb-4">
                              <div className="space-y-2">
                                  <Label htmlFor="value" className='text-md font-medium'>Total Amount</Label>
                                  <Input 
                                      type="number" id="value" 
                                      {...register("value", {
                                          required: true,
                                          valueAsNumber: true,
                                      })}
                                      disabled={isLoading}
                                  />
                                  {errors.value && errors.value.type === "required" && (
                                      <p className="mt-1 mb-0 text-red-600">
                                          Amount required
                                      </p>
                                  )}
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="amount" className='text-md font-medium'>Amount Paid</Label>
                                  <Input 
                                      type="number" id="amount" 
                                      placeholder='Amount Paid'
                                      {...register("amountPaid", {
                                          valueAsNumber: true,
                                          required: true
                                      })}
                                      disabled={isLoading}
                                  />
                                  {errors.amountPaid && errors.amountPaid.type === "required" && (
                                      <p className="mt-1 mb-0 text-red-600">
                                          Amount required
                                      </p>
                                  )}
                              </div>
                              
                          </div>
                          </div>
                          <DialogFooter>
                          <Button variant="outline" onClick={() => {setEntryDialog(false);setSelectedEntry(null);reset({value: ""})}}>
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
                          Update</Button>
                          </DialogFooter>
                      </DialogContent>
                      </form>
                  </Dialog>
                  {/* party dialog  */}
                  <Dialog open={showPartyDialog} onOpenChange={()=>{setPartyDialog(false);setSelectedParty(null);setSelectedEntry(null)}}>
                      <form action="" onSubmit={handleSubmit(onSubmit)}>
                      <DialogContent className='overflow-auto no-scrollbar'>
                          <DialogHeader>
                              <DialogTitle className="tracking-normal">E{selectedEntry?.entryId} - Details </DialogTitle>
                          </DialogHeader>
                          <div>
                          <div className="space-y-4 py-2 pb-4">
                            {
                              selectedParty? 
                              <div className="flex flex-wrap items-center gap-3">
                                  <div className='flex gap-2'>
                                    <p className='font-semibold'>Name: </p>
                                    <p>{selectedParty?.name}</p>
                                  </div>
                                  <div className='flex gap-2'>
                                    <p className='font-semibold'>Contact No: </p>
                                    <p>{selectedParty?.contact}</p>
                                  </div>
                                  <div className='flex gap-2'>
                                    <p className='font-semibold'>Email: </p>
                                    <p>{selectedParty?.email}</p>
                                  </div>
                                  {selectedParty.type==='Buyer'?<p onClick={()=>sendInvoice(selectedEntry,currentStore)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Send Invoice</p>
                                  : null}
                              </div>
                              :
                              <p>Party Details not available</p>
                            }
                            <p className='text-center font-semibold'>Order Details</p>
                            {selectedEntry?.items.map((i,index)=>{
                              return (
                                <>
                                <hr/>
                                <div className='flex items-center justify-center flex-wrap gap-3'>
                                  <p><span className='font-semibold'>Item</span>: {i?.name}</p>
                                  <p><span className='font-semibold'>Price</span>: ${selectedEntry?.type==="Buy"?selectedEntry?.costPrice[index].toLocaleString('en-IN'):selectedEntry?.sellPrice[index].toLocaleString('en-IN')}</p>
                                  <p><span className='font-semibold'>Quantity</span>: {selectedEntry?.quantity[index]}</p>
                                </div>
                                </>
                              )
                            })}
                          </div>
                          </div>
                          <DialogFooter>
                          <Button variant="outline" onClick={() => {setPartyDialog(false);setSelectedEntry(null);setSelectedParty(null)}}>
                              Cancel
                          </Button>
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
