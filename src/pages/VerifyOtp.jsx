import { useContext, useEffect, useState } from 'react';
import { authContext } from '../context/AuthContextProvider';
import { toast } from 'react-toastify';
import '../css/login.css';
import {
  AUTH_FAILED,
  INTERAKT_ERROR,
  MAX_RETRY_REACHED,
  NOT_FOUND,
  OTP_SUCCESS,
  SESSION_TIMED_OUT,
  SUCCESS
} from '../constants';
import { useNavigate } from 'react-router-dom';

export default function VerifyOtp() {
  const { verifyOtp, phoneNumber, loginUser, setPhoneNumber } = useContext(authContext);
  const [otp, setOtp] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [counter, setCounter] = useState(30); // Initial counter value
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const navigate = useNavigate();
  const mobileNumber = window.localStorage.getItem('mobileNumber');
  useEffect(() => {
    let intervalId;
    if (counter > 0) {
      // If "Send OTP" button is clicked and counter is greater than 0, decrement it every second
      intervalId = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    } else if (counter === 0) {
      // If counter reaches 0, enable resend button
      setIsResendEnabled(true);
    }
    // Cleanup function to clear interval
    return () => clearInterval(intervalId);
  }, [counter]);

  const handleResendClick = async (e) => {
    const response = await loginUser(phoneNumber.length ? phoneNumber : mobileNumber);
    if (response === OTP_SUCCESS) {
      notify(e, response);
    } else if (response === NOT_FOUND) {
      notify(e, response);
    } else if (response === AUTH_FAILED) {
      notify(e, response);
    } else if (response === SESSION_TIMED_OUT) {
      notify(e, response);
      navigate('/login');
      setPhoneNumber('');
    } else if (response === MAX_RETRY_REACHED) {
      notify(e, response);
      navigate('/login');
      setPhoneNumber('');
    } else if (response === INTERAKT_ERROR) {
      notify(e, response);
      navigate('/login');
      setPhoneNumber('');
    } else {
      notify(e, response);
    }
    setCounter(30);
    setIsResendEnabled(false);
  };

  function notify(event, type) {
    event.preventDefault();
    if (type === NOT_FOUND) {
      toast.error('User not found!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (type === AUTH_FAILED) {
      toast.error('Incorrect OTP!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (type === INTERAKT_ERROR) {
      toast.error('Interakt error! Please contact admin.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (type === SESSION_TIMED_OUT) {
      toast.error('Session Timed out! Login again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (type === MAX_RETRY_REACHED) {
      toast.error('Max retry reached. Please login again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (type === OTP_SUCCESS) {
      toast.success('OTP sent successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (type === SUCCESS) {
      toast.success('Login successful!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else {
      toast.error('Please try again after sometime!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  }

  function inputHandler(e) {
    const userOtp = e.target.value.trim();
    setOtp(userOtp);
    setIsValid(/^[0-9]\d{3}$/.test(userOtp));
  }
  async function submitLogin(e) {
    e.preventDefault();
    const response = await verifyOtp(phoneNumber.length ? phoneNumber : mobileNumber, otp);
    if (response === SUCCESS) {
      notify(e, response);
    } else if (response === NOT_FOUND) {
      notify(e, response);
      navigate('/login');
      setPhoneNumber('');
    } else if (response === AUTH_FAILED) {
      notify(e, response);
    } else if (response === SESSION_TIMED_OUT) {
      notify(e, response);
      navigate('/login');
      setPhoneNumber('');
    } else {
      notify(e, response);
    }
  }

  return (
    <div className="background">
      <div className="signup-parent">
        <p className="signup-heading">OTP Verification</p>
        <form onSubmit={(e) => submitLogin(e)} className="form-parent">
          <label htmlFor="mobileNumber">OTP sent to {`+91-${phoneNumber.length ? phoneNumber : mobileNumber}`}</label>
          <input
            type="text"
            name="mobileNumber"
            id="mobileNumber"
            value={otp}
            required
            placeholder="Enter your OTP"
            maxLength="4"
            onChange={(e) => inputHandler(e)}
          />
          <button
            type="submit"
            className="signup-btn"
            style={{ backgroundColor: isValid ? '#007bff' : 'grey' }}
            disabled={!isValid}
          >
            Verify OTP
          </button>
        </form>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={(e) => handleResendClick(e)} disabled={!isResendEnabled}>
            Resend
          </button>
          <p style={{ fontSize: '17px', padding: '5px' }}> OTP in: {counter} seconds</p>
        </div>
      </div>
    </div>
  );
}
