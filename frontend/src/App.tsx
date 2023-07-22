import {Route, Routes} from 'react-router-dom'
import Login from './components/Login'
import {Toaster} from 'react-hot-toast'
import Register from './components/Register'
import Error from './components/Error'

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
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
