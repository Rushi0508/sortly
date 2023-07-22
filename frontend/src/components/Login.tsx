import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import Otp from './Otp'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (body) => {
    setIsLoading(true);
    console.log(body);
    const {data} = await axios.post(
      'http://localhost:5000/api/login',
      body
    );
    console.log(data);
    if(data.hasOwnProperty("errors")){
      toast.error(data.errors);
    }
    else if(data.hasOwnProperty("userAuthToken")){
      localStorage.setItem('user_token', data.userAuthToken);
      localStorage.setItem('user_id', data.data._id);
      navigate('/')
    }
    else if(data.hasOwnProperty("message")){
      toast.success(data.message);
      localStorage.setItem('user_id', data.data.userId);
      setShowModal(true)
    }
    else{
      toast.error('Something went wrong')
    }
    setIsLoading(false)
  }

  return (
    <>
      {(showModal) ? <Otp/> : (
      <div className="d-flex justify-content-center pt-5">
        <div className="col-10 col-sm-8 col-lg-5 shadow-sm rounded">
          <div className="card p-4">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <h1 className="fw-bold text-center mb-3">Login</h1>
              <div className="form-group">
                <label>Email address:</label>
                <input type="email" className="form-control" placeholder="Enter email"
                  id="email" name='email' {...register('email', {
                    required: true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
                  })} disabled={isLoading} />
                  {errors.email && errors.email.type === "required" && (
                    <p className="mt-1 mb-0 text-danger">Email is required.</p>
                  )}
                  {errors.email && errors.email.type === "pattern" && (
                    <p className="mt-1 mb-0 text-danger">Email is not valid.</p>
                  )}
              </div>
              <div className="form-group mt-3">
                <label>Password:</label>
                <input type="password" className="form-control" placeholder="Enter password"
                  id="pwd" name='password' {...register('password', {
                    required: true, minLength: 6, 
                  })} disabled={isLoading} />
                  {errors.password && errors.password.type === "required" && (
                    <p className="mt-1 mb-0 text-danger">Password is required.</p>
                  )}
                  {errors.password && errors.password.type === "minLength" && (
                    <p className="mt-1 mb-0 text-danger">Password should be at-least 6 characters.</p>
                  )}
              </div>
              <button type="submit" className="d-flex align-items-center justify-content-center btn btn-primary mt-4 w-100" disabled={isLoading}>
                {isLoading? <div style={{width: "1.5rem", height: "1.5rem"}} className='mx-2 spinner-border spinner-border-md text-light'/> : <span>Login</span>}
              </button>
              <p className='text-center p-2 m-0'>New Here? <Link to="/register">Register</Link></p>
            </form>
          </div>
        </div>
      </div>
      )}
    </>
  )
}

export default Login