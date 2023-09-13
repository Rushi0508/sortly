import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"


export function PartyCombobox({setParty,party,parties}) {
  const [open, setOpen] = useState(false)
  const partyOptions = parties.map((p)=>({value: p._id, label: p.name}))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100%] justify-between"
        >
          {party.label===""
            ? "Select Party (optional)"
            : party.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100%] p-0">
        <Command> 
          <CommandInput placeholder="Search Party..." />
          <CommandEmpty>No Party found</CommandEmpty>
          <CommandGroup>
            {partyOptions.map((p) => (
              <CommandItem
                key={p.value}
                onSelect={() => {                  
                  setParty(p)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    party.value === p.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {p.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
