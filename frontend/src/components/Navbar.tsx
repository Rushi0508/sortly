import {  useEffect } from 'react'
import { Disclosure, } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import {Link, useLocation, useNavigate } from 'react-router-dom'
import { Combobox } from './ComboBox'
import { useUserStore } from './zustand/useUserStore'

const navigation = [
  { name: 'Dashboard', href: '/', current: false },
  { name: 'Stock', href: '/stock', current: false },
  { name: 'Items', href: '/items', current: false },
  { name: 'Entries', href: '/entries', current: false },
  { name: 'Parties', href: '/parties', current: false },
  { name: 'Plans', href: '/plans', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('user_token');

  const user = useUserStore((state:any)=>state.user) || {}
  const fetchUser = useUserStore((state:any)=>state.fetchUser)

  useEffect(()=>{
    if(!token || !userId){
      navigate('/login')
    }
    if(Object.keys(user).length === 0){      
      fetchUser(userId)
    }
  }, [])

  return (
    <>
      <Disclosure as="nav" className="sticky top-0 z-10 bg-white shadow-md">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                  <div className="flex flex-shrink-0 items-center md:visible invisible">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden md:ml-6 md:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            location.pathname===item.href ? 'bg-[#f3f4f6] text-black-900' : 'text-black hover:bg-[#f3f4f6] hover:text-black',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static md:inset-auto md:ml-6 md:pr-0">
                  {/* Profile dropdown */}
                  <Combobox/>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 flex flex-wrap">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      location.pathname===item.href ? 'bg-[#f3f4f6] text-black-900' : 'text-black hover:bg-[#f3f4f6] hover:text-black',
                      'rounded-md w-full px-3 py-2 text-sm font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

    </>
  )
}

export default Navbar;
