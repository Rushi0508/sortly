import {Route, Routes} from 'react-router-dom'
import Login from './components/Login'
import {Toaster} from 'react-hot-toast'
import Register from './components/Register'
import Error from './components/Error'
import Dashboard from './components/Dashboard'
import Plan from './components/Plan'
import Success from './components/Success'
import Items from './components/Items'
import Stock from './components/Stock'
import Entry from './components/Entry'

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/' element={<Dashboard/>} />
        <Route path='/items' element={<Items/>} />
        <Route path='/stock' element={<Stock/>} />
        <Route path='/entries' element={<Entry/>} />
        <Route path='/plans' element={<Plan/>} />
        <Route path='/success' element={<Success/>} />
        <Route path='*' element={<Error/>} /> 
      </Routes>
      <Toaster
        position="top-center"
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          duration: 2000,
        }}
      />
    </>
  )
}

export default App
