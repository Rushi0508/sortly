import {format} from 'date-fns'

export function RecentSales({recentSales}) {
  return (
    <div className="space-y-8">
      {recentSales?.map((entry,i)=>{
        return (
            <div key={i} className="flex items-center">
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">INV{entry.invoiceId}</p>
                    <p className="text-sm text-gray-500 text-muted-foreground">
                        {format(new Date(entry.createdAt),'LLL dd, y' )}
                    </p>
                </div>
                <div className="ml-auto font-medium">${entry.sellValue}</div>
            </div>
        )
      })}
    </div>
  )
}
  