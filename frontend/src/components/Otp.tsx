import { FC, useEffect, useState } from 'react'
import '../static/css/otp.css'
import OTPInput from 'otp-input-react' 
import toast from 'react-hot-toast'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Otp: FC = () => {
    const [OTP, setOTP] = useState("")
    const navigate = useNavigate();
    const email = localStorage.getItem('user_email')

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(OTP.length != 5){
            toast.error("Enter valid OTP");
        }else{
            const userId = localStorage.getItem('user_id');
            const {data} = await axios.post(
                'http://localhost:5000/api/verifyOTP',
                {userId,otp: OTP}
            )
            if(data.hasOwnProperty('errors')){
                toast.error(data.errors)
            }
            else if(data.hasOwnProperty('userAuthToken')){
                toast.success("Verified Successfully");
                localStorage.setItem('user_token', data.userAuthToken);
                localStorage.setItem('user_id', data.data._id);
                localStorage.removeItem('user_email')
                navigate('/')
            }else{
                toast.error("Something went wrong!!")
            }
        }
    }
    return (
        <>
            <div className="container height-100 d-flex justify-content-center align-items-center">
                <div className="position-relative">
                    <div className="otp-card card px-2 text-center">
                        <h6 className='m-2' >Please enter the one time password <br/> to verify your account</h6>
                        <div className='m-2'> <span>A code has been sent to</span> <small>{email}</small> </div>
                        <form action="" onSubmit={handleSubmit}>
                            <div id="otp" className="otp-inputs d-flex flex-row justify-content-center mt-2">
                                <OTPInput
                                    value={OTP}
                                    onChange={setOTP}
                                    autoFocus
                                    OTPLength={5}
                                    otpType="number"
                                    disabled={false}
                                    inputStyles={{
                                        "marginInline": "5px",
                                        width: "40px",
                                        height: "40px",
                                    }}
                                    inputClassName = "otp-control form-control rounded"
                                />
                            </div>
                            <div className="mt-4"> <button type='submit' className="btn btn-danger px-4 otp-validate">Validate</button> </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Otp