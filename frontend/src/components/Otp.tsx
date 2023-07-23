import { FC, useState } from 'react'
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
            <div className="height-100 flex justify-center items-center">
                <div className="relative">
                    <div className="otp-card card px-2 text-center">
                        <h6 className='m-2' >Please enter the one time password <br/> to verify your account</h6>
                        <div className='m-2'> <span>A code has been sent to <i className='text-gray-500'>{email}</i></span></div>
                        <form action="" onSubmit={handleSubmit}>
                            <div id="otp" className="otp-inputs flex flex-row justify-center m-2">
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
                                    inputClassName = "appearance-none border rounded-md leading-tight focus:outline-none focus:border-2 focus:border-red-500"
                                />
                            </div>
                            <div className="mt-4"> <button type='submit' className="text-white bg-red-500 hover:bg-red-600 px-4 otp-validate">Validate</button> </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Otp