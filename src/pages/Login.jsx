import { useContext, useState } from 'react';
import { authContext } from '../context/AuthContextProvider';
import { toast } from 'react-toastify';
import '../css/login.css';
import {
  AUTH_FAILED,
  INTERAKT_ERROR,
  MAX_RETRY_REACHED,
  NOT_FOUND,
  OTP_SUCCESS,
  SESSION_TIMED_OUT
} from '../constants';

export default function Login() {
  const { loginUser, phoneNumber, setPhoneNumber } = useContext(authContext);
  const [isValid, setIsValid] = useState(false);
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
    } else if (type === AUTH_FAILED) {
      toast.error('User not found!', {
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
    } else if (type === SESSION_TIMED_OUT) {
      toast.error('Session timed out! Please login again.', {
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
    const mobileNumber = e.target.value.trim();

    setPhoneNumber(mobileNumber);
    setIsValid(/^[6-9]\d{9}$/.test(mobileNumber));
  }
  async function submitLogin(e) {
    e.preventDefault();
    const response = await loginUser(phoneNumber);
    if (response === OTP_SUCCESS) {
      notify(e, response);
    } else if (response === NOT_FOUND) {
      notify(e, response);
      setPhoneNumber('');
    } else if (response === AUTH_FAILED) {
      notify(e, response);
    } else if (response === SESSION_TIMED_OUT) {
      notify(e, response);
      setPhoneNumber('');
    } else if (response === MAX_RETRY_REACHED) {
      notify(e, response);
      setPhoneNumber('');
    } else if (response === INTERAKT_ERROR) {
      notify(e, response);
      setPhoneNumber('');
    } else {
      notify(e, response);
      setPhoneNumber('');
    }
  }

  return (
    <div className="background">
      <div className="signup-parent">
        <p className="signup-heading">Login to your account</p>
        <form onSubmit={(e) => submitLogin(e)} className="form-parent">
          <label htmlFor="mobileNumber">Enter mobile number</label>
          <input
            type="text"
            name="mobileNumber"
            id="mobileNumber"
            value={phoneNumber}
            required
            placeholder="Enter your mobile number"
            maxLength="10"
            onChange={(e) => inputHandler(e)}
          />
          <button
            type="submit"
            className="signup-btn"
            style={{ backgroundColor: isValid ? '#007bff' : 'grey' }}
            disabled={!isValid}
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}
