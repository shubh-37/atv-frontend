import { useContext, useEffect, useState } from 'react';
import { authContext } from '../context/AuthContextProvider';
import { toast } from 'react-toastify';
import '../css/login.css';
import { NOT_FOUND, SUCCESS } from '../constants';

export default function VerifyOtp() {
  const { verifyOtp, phoneNumber } = useContext(authContext);
  const [otp, setOtp] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [counter, setCounter] = useState(30); // Initial counter value
  const [isResendEnabled, setIsResendEnabled] = useState(false);

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

  const handleResendClick = () => {
    // Reset counter to initial value and disable resend button
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
    } else if (type === SUCCESS) {
      toast.success('Login successful!', {
        position: 'bottom-center',
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
    const userOtp = Number(e.target.value.trim());
    setOtp(userOtp);
    setIsValid(/^[0-9]\d{3}$/.test(userOtp));
  }
  async function submitLogin(e) {
    e.preventDefault();
    const response = await verifyOtp(phoneNumber, otp);
    if (response === SUCCESS) {
      notify(e, response);
    } else if (response === NOT_FOUND) {
      notify(e, response);
    } else {
      notify(e, response);
    }
  }

  return (
    <div className="background">
      <div className="signup-parent">
        <p className="signup-heading">OTP Verification</p>
        <form onSubmit={(e) => submitLogin(e)} className="form-parent">
          <label htmlFor="mobileNumber">OTP sent to {`+91-${phoneNumber}` ?? 'No phone Number'}</label>
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={handleResendClick} disabled={!isResendEnabled}>
              Resend
            </button>
            <p style={{ fontSize: '17px', padding: '5px' }}> OTP in: {counter} seconds</p>
          </div>
        </form>
      </div>
    </div>
  );
}
