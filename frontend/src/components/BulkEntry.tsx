import { useEffect, useState } from 'react'
import {BiArrowBack} from 'react-icons/bi'
import { Input } from './ui/input';
import { PartyCombobox } from './PartyCombobox';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useStoreStore } from './zustand/useStoreStore';
import axiosInstance from './Axios';
import toast from 'react-hot-toast';

function BulkEntry({selectedItems,setBulkEntry,parties,setSelectedItems,fetchStock}) {

    const [operation, setOperation] = useState("Out");
    const zeroArray = Array(selectedItems.length).fill(1)
    const [quantity, setQuantity] = useState(zeroArray);
    const [sellPrice, setSellPrice] = useState([]);
    const [costPrice, setCostPrice] = useState([]);
    const [amountPaid, setAmountPaid] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const currentStore = useStoreStore((state: any)=>state.currentStore);
    // Party States
    const initial = {label: "", value: ""}
    const [party,setParty] = useState(initial);

    const handleQuantity = (e,index)=>{
        const updatedQuantity = [...quantity];
        updatedQuantity[index] = e.target.value;
        setQuantity(updatedQuantity)
    }

    const handlePrice = (e,index)=>{
        if(operation == 'In'){
            const updatedPrices = [...costPrice];
            updatedPrices[index] = e.target.value;
            setCostPrice(updatedPrices)
        }else{
            const updatedPrices = [...sellPrice];
            updatedPrices[index] = e.target.value;
            setSellPrice(updatedPrices)
        }
    }

    const submitBulkEntry = async()=>{
        const body:any = {}
        setIsLoading(true);
        body.storeId = currentStore?._id;
        if(operation==='In'){
            body.supplier = party.value;
            body.type = 'Buy'
            body.costPrice = costPrice
            body.sellPrice = sellPrice
            body.quantity = quantity
            let costValue = 0;
            for(let i=0; i<selectedItems.length;i++){
                costValue += costPrice[i]*quantity[i];
            }
            body.costValue = costValue
            body.amountPaid = parseInt(amountPaid);
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
            body.sellPrice = sellPrice
            body.costPrice = costPrice
            body.quantity = quantity
            let sellValue = 0;
            let profit = 0;
            for(let i=0; i<selectedItems.length;i++){
                sellValue += sellPrice[i]*quantity[i];
                profit += ((sellPrice[i]-costPrice[i])*quantity[i])
            }
            body.sellValue = sellValue
            body.profit = profit
            body.amountPaid = parseInt(amountPaid);
            if(body.amountPaid === body.sellValue){
                body.paymentStatus = "COMPLETED"
            }
            else if(body.amountPaid < body.sellValue){
                body.paymentStatus = "PENDING"
            }else{
                body.paymentStatus = "DEPOSIT"
            }
        }
        body.payDate = new Date();
        body.items = selectedItems
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
        setSelectedItems([]);
        setBulkEntry(false);
        setIsLoading(false);
        fetchStock("Recent",[],"");
        setOperation("Out");
        setParty(initial);
    }

    useEffect(() => {
        const sellPrices = [];
        const costPrices = [];

        selectedItems.forEach((item) => {
            sellPrices.push(item.sellPrice);
            costPrices.push(item.costPrice);
        });

        setSellPrice(sellPrices);
        setCostPrice(costPrices);
    }, [selectedItems]);

  return (
    <div className='flex-1 w-[100%] whitespace-nowrap px-2 py-8 sm:p-8'>
        <div className='flex justify-between items-center font-semibold sm:text-lg mb-2'>
            <span onClick={()=>setBulkEntry(false)} className='cursor-pointer flex items-center text-gray-400'><BiArrowBack className='ml-6'/>Back</span>
            <p className='mr-6'>Bulk Entry - {selectedItems.length} item{selectedItems.length > 1? "s" : ""}</p>
        </div>
        <div className='flex flex-wrap justify-center gap-4 items-center mb-3'>
            <div className='w-[300px]'>
                <PartyCombobox setParty={setParty} party={party} parties={parties}/>
            </div>
            <div className="flex gap-4 items-center">
                <Label>Type</Label>
                <RadioGroup className='flex gap-3' defaultValue='OUT'>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                            value="IN" 
                            id="option-one" 
                            onClick={()=>setOperation('In')}
                        />
                        <Label htmlFor="option-one">IN</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                            value="OUT" 
                            id="option-two" 
                            onClick={()=>setOperation('Out')}
                        />
                        <Label htmlFor="option-two">OUT</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
        <div className="relative overflow-x-scroll no-scrollbar">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Item name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Available Stock
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {operation} Quantity
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {operation === 'In'? 'Buy':'Sell'} Price($)
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {operation === 'In'? 'Buy':'Sell'} Amount
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        selectedItems.map((item,index)=>{
                            return (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {item.quantity} {(item.quantity > 0) ?`${item.unit}s`: item.unit}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Input onChange={(e)=>handleQuantity(e,index)} value={quantity[index]} type='text'  className='h-8 px-1 w-[50px]'/>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Input onChange={(e)=>handlePrice(e,index)} value={(operation==='In'?costPrice[index]:sellPrice[index])} type='text' className='h-8 w-[100px]'/>
                                    </td>
                                    <td className="px-6 py-4">
                                        $ {(operation==='In'?quantity[index]*costPrice[index]:quantity[index]*sellPrice[index]).toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <div className='flex justify-center my-4'>
                <Input value={amountPaid} onChange={(e)=>setAmountPaid(e.target.value)} type='number' className='w-[300px]' placeholder='Amount Paid'/>
                <button 
                    type="button"  
                    className="flex justify-center items-center px-3 py-2 sm:mx-3 text-sm font-medium text-center text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:ring-2 focus:outline-none focus:ring-gray-300"
                    onClick={submitBulkEntry}
                >
                    {isLoading ? (
                        <svg style={{width: "1.5rem", height: "1.5rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        ) : (
                        null
                    )}
                    Create
                </button>
            </div>
        </div>
    </div>
  )
}

export default BulkEntry
