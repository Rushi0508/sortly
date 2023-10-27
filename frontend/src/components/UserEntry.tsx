import { useEffect, useState } from 'react'
import Layout from './layouts/Layout'
import {format} from 'date-fns'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from './Axios';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { useStoreStore } from './zustand/useStoreStore';
import { Label } from './ui/label';
import { Input } from './ui/input';

export default function UserEntry() {

    const location = useLocation();
    const navigate = useNavigate();

    const [entries,setEntries] = useState(null);
    const [type, setType] = useState("");
    const [party,setParty] = useState(null)

    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showPartyDialog, setPartyDialog] = useState(false)
    const [showEntryDialog, setEntryDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const currentStore = useStoreStore((state:any)=>state.currentStore);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const fetchEntries = async (id,type)=>{
        const {data} = await axiosInstance.post(
            `/api/fetchPartyEntries`,
            {partyId: id, type: type}
        )
        if(data.login === false){
            localStorage.clear()
            navigate('/login')
        }
        if(data.hasOwnProperty('errors')){
            toast.error('Something went wrong');
            navigate(-1);
        }
        else{
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
        fetchEntries(party._id,party.type);
        setEntryDialog(false);
        setSelectedEntry(null);
        reset({value: ""})
        setIsLoading(false);
    }

    const openParty =async (entry) => {
        setSelectedEntry(entry);
        setPartyDialog(true);
    }

    useEffect(()=>{
        const party = location.state;
        setParty(party)
        if(party.type==="Buyer"){
            setType("Sell")
        }else{
            setType("Buy");
        }
        fetchEntries(party._id,party.type);
    }, [])
  return (
    <Layout>
        <div className='flex-1 p-8'>
        {!entries? 
        <div className='bg-[#f3f4f6] flex flex-1 justify-center items-center'>
            <svg style={{width: "2rem", height: "2rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg> 
        </div>
        :
        entries.length === 0 ? <p className='text-xl flex-1 text-center'>No Entries found for {party.name}</p> :
        <>
        <p className='text-center mb-5'>Showing {entries.length} entries for <b>{party.name}</b></p>
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
                                <p onClick={()=>updateEntry(entry)}  className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">Update Entry</p>
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
        {/* party dialog  */}
        <Dialog open={showPartyDialog} onOpenChange={()=>{setPartyDialog(false);setSelectedEntry(null)}}>
            <DialogContent className='overflow-auto no-scrollbar'>
                <DialogHeader>
                    <DialogTitle className="tracking-normal">E{selectedEntry?.entryId} - Details </DialogTitle>
                </DialogHeader>
                <div>
                <div className="space-y-4 py-2 pb-4">
                {
                    party? 
                    <div className="flex flex-wrap items-center gap-3">
                        <div className='flex gap-2'>
                        <p className='font-semibold'>Name: </p>
                        <p>{party?.name}</p>
                        </div>
                        <div className='flex gap-2'>
                        <p className='font-semibold'>Contact No: </p>
                        <p>{party?.contact}</p>
                        </div>
                        <div className='flex gap-2'>
                        <p className='font-semibold'>Email: </p>
                        <p>{party?.email}</p>
                        </div>
                        {party.type==='Buyer'?<p onClick={()=>sendInvoice(selectedEntry,currentStore)} className="cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Send Invoice</p>
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
                <Button variant="outline" onClick={() => {setPartyDialog(false);setSelectedEntry(null);}}>
                    Cancel
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
        </>
    }
    </div>
    </Layout>
  )
}
