import React, { useEffect, useState } from 'react'
import Layout from './layouts/Layout'
import {format} from 'date-fns'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import axiosInstance from './Axios';

export default function UserEntry() {

    const location = useLocation();
    const navigate = useNavigate();

    const [entries,setEntries] = useState(null);
    const [type, setType] = useState("");
    const [party,setParty] = useState(null)

    const fetchEntries = async (id,type)=>{
        const {data} = await axiosInstance.post(
            `/api/fetchPartyEntries`,
            {partyId: id, type: type}
        )

        if(data.hasOwnProperty('errors')){
            toast.error('Something went wrong');
            navigate(-1);
        }
        else{
            setEntries(data.entries);
        }
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
        <div className='p-8'>
        {!entries? null:
        entries.length === 0 ? <p className='text-xl h-screen text-center'>No Entries found for {party.name}</p> :
        <>
        <p className='text-center mb-5'>Showing {entries.length} entries for <b>{party.name}</b></p>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
            <th scope="col" className="px-6 py-3">
                {type==="Sell"? "INVOICE" : "DATE"}
            </th>
            <th scope="col" className="px-6 py-3">
                Items
            </th>
            <th scope="col" className="px-6 py-3">
            {type==="Sell"? "Sell Price" : "Cost Price"}
            </th>
            <th scope="col" className="px-6 py-3">
                Quantity
            </th>
            <th scope="col" className="px-6 py-3">
                Amount
            </th>
            <th scope="col" className="px-6 py-3">
                Balance
            </th>
            {type==="Sell"? (
                <th scope="col" className="px-6 py-3">
                P/L
                </th>
            ): null}
            <th scope="col" className="px-6 py-3">
                Status
            </th>
            {type==="Sell"? (
                <th scope="col" className="px-6 py-3">
                Action
                </th>
            ): null}
            </tr>
        </thead>
        <tbody>
            {entries.map((entry:any)=>{
            return (
                <tr key={entry._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {type==="Sell"? 
                    (
                        <>
                        INV{entry.invoiceId}
                        <br /><span className='text-xs'>{format(new Date(entry.createdAt), 'dd/MM/yyyy')}</span>
                        </>
                    ) : 
                    (
                        <span>{format(new Date(entry.createdAt), 'dd/MM/yyyy')}</span>
                    )
                    }
                </th>
                <td className="px-6 py-4">
                    {(entry.items).map(item => {
                    return <span key={item._id}>{item.name}</span>
                    })}
                </td>
                <td className="px-6 py-4">
                    {type==="Sell"?entry.sellPrice:entry.costPrice}
                </td>
                <td className="px-6 py-4">
                    {entry.quantity}
                </td>
                <td className="px-6 py-4">
                    {type==="Sell"?entry.sellValue: entry.costValue}
                </td>
                <td className="px-6 py-4">
                    {type==="Sell"? 
                    (entry.amountPaid > entry.sellValue ? "("+(entry.amountPaid-entry.sellValue)+")" : entry.sellValue-entry.amountPaid)
                        :
                        (entry.amountPaid >= entry.costValue ? entry.amountPaid-entry.costValue : "("+(entry.costValue-entry.amountPaid)+")")
                    }
                </td>
                {type==="Sell"?
                    <td className="px-6 py-4 font-semibold text-green-400">
                    {entry.profit>0?"+"+(entry.profit): (entry.profit)}
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
                    <a href="#"  className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">Send Invoice</a>
                    </td>: null  
                }
                </tr>
            )
            })}                        
        </tbody>
        </table>
        </>
    }
    </div>
    </Layout>
  )
}
