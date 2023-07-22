import {Route, Routes} from 'react-router-dom'
import Login from './components/Login'
import {Toaster} from 'react-hot-toast'
import Otp from './components/Otp'

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/verify-otp' element={<Otp/>} />
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
