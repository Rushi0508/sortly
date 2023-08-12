import {RiDeleteBinLine,RiEditLine} from 'react-icons/ri'

export default function ItemCard({item}) {
  return (
    
<div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <div className="p-5 pb-5">
        <a href="#">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{item.name}</h5>
        </a>
        <div className="flex flex-col items-start mt-2.5 mb-5">
            <span className="bg-blue-100 text-blue-800 text-sm px-2.5 py-1 rounded dark:bg-blue-200 dark:text-blue-800">{item.quantity} {item.unit}{item.quantity > 1? 's': null}</span>
            <div className="flex gap-2 mt-2">
                {(item.tags).map(tag => {
                    return <span key={tag._id} className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded dark:bg-blue-200 dark:text-blue-800">#{tag.name}</span>
                })}
            </div>
        </div>
        <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">${(item.sellPrice).toLocaleString('en-IN')}</span>
            <div>
                <button type="button" className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-md text-sm px-2 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 mx-2">
                    <RiEditLine size={20}/>
                </button>
                <button type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-md text-sm px-2 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                    <RiDeleteBinLine size={20}/>
                </button>
            </div>
        </div>
    </div>
</div>
  )
}
