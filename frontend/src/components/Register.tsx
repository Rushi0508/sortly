import { Link, useNavigate} from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import Otp from './Otp'
import axiosInstance from './Axios'

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate()
  const token = localStorage.getItem('user_token')
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (body) => {
    setIsLoading(true);
    console.log(body);
    const {data} = await axiosInstance.post(
      '/api/register',
      body
    );
    console.log(data);
    if(data.hasOwnProperty("errors")){
      toast.error(data.errors);
    }
    else if(data.hasOwnProperty("message")){
      toast.success(data.message);
      localStorage.setItem('user_id', data.data.userId);
      localStorage.setItem('user_email', data.data.email);
      setShowModal(true)
    }
    else{
      toast.error('Something went wrong')
    }
    setIsLoading(false)
  }

    useEffect(()=>{        
        if(token){
            navigate('/')
        }
    }, [])

  return (
    <>
      {showModal ? <Otp /> : (
      <div className="flex justify-center pt-12">
        <div className="w-11/12 sm:w-10/12 lg:w-8/12 xl:w-5/12 shadow-lg rounded">
          <div className="card p-8 border-2 rounded-md">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <h1 className="text-4xl font-extrabold text-center mb-3">Register</h1>
              <div className="form-group">
                <label className='text-lg block text-gray-700'>Name:</label>
                <input type="text" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" placeholder="Enter your name"
                  id="name" name='name' {...register('name', {
                    required: true, minLength: 3
                  })} disabled={isLoading} />
                  {errors.name && errors.name.type === "required" && (
                    <p className="mt-1 mb-0 text-red-600">Name is required.</p>
                  )}
                  {errors.name && errors.name.type === "minLength" && (
                    <p className="mt-1 mb-0 text-red-600">Name must contain atleast 3 characters</p>
                  )}
              </div>
              <div className="form-group mt-3">
                <label className='text-lg block text-gray-700'>Email address:</label>
                <input
                  type="email"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  placeholder="Enter email"
                  id="email"
                  name="email"
                  {...register("email", {
                    required: true,
                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                  })}
                  disabled={isLoading}
                />
                {errors.email && errors.email.type === "required" && (
                  <p className="mt-1 mb-0 text-red-600">Email is required.</p>
                )}
                {errors.email && errors.email.type === "pattern" && (
                  <p className="mt-1 mb-0 text-red-600">Email is not valid.</p>
                )}
              </div>
              <div className="form-group mt-3">
                <label className='text-lg block text-gray-700'>Password:</label>
                <input
                  type="password"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                  placeholder="Enter password"
                  id="pwd"
                  name="password"
                  {...register("password", {
                    required: true,
                    minLength: 6,
                  })}
                  disabled={isLoading}
                />
                {errors.password && errors.password.type === "required" && (
                  <p className="mt-1 mb-0 text-red-600">Password is required.</p>
                )}
                {errors.password && errors.password.type === "minLength" && (
                  <p className="mt-1 mb-0 text-red-600">
                    Password should be at least 6 characters.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="text-lg flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mt-4 w-full rounded"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg style={{width: "1.5rem", height: "1.5rem" }} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>Register</span>
                )}
              </button>
              <p className="text-base text-center p-2 m-0">
                Already have an account? <Link to="/login" className='text-blue-500'>Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      )}
    </>
  )
}

export default Register