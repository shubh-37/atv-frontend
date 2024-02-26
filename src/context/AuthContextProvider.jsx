import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export const authContext = createContext();
import axios from 'axios';
import {
  AUTH_FAILED,
  INTERAKT_ERROR,
  MAX_RETRY_REACHED,
  NOT_FOUND,
  OTP_SUCCESS,
  SESSION_TIMED_OUT,
  SUCCESS,
  UNKNOWN
} from '../constants';
const { VITE_API_URL } = import.meta.env;
// eslint-disable-next-line react/prop-types
export default function AuthContextProvider({ children }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  async function loginUser(mobileNumber) {
    try {
      window.localStorage.setItem('mobileNumber', mobileNumber);
      const response = await axios.post(`${VITE_API_URL}/sendOtp`, { mobileNumber });
      if (response.status === 200) {
        navigate('/verify-otp');
        return OTP_SUCCESS;
      }
    } catch (error) {
      if (error.response.status === 500) {
        return UNKNOWN;
      } else if (error.response.status === 404) {
        return NOT_FOUND;
      } else if (error.response.status === 400) {
        return INTERAKT_ERROR;
      } else if (error.response.status === 440) {
        return SESSION_TIMED_OUT;
      } else if (error.response.status === 429) {
        return MAX_RETRY_REACHED;
      } else {
        return AUTH_FAILED;
      }
    }
  }
  async function verifyOtp(mobileNumber, otp) {
    const data = { mobileNumber, otp: Number(otp) };
    try {
      const response = await axios.post(`${VITE_API_URL}/verifyOtp`, data);
      if (response.status === 200) {
        if (response.data.token) {
          window.localStorage.setItem('token', response.data.token);
          navigate('/');
          return SUCCESS;
        }
      }
    } catch (error) {
      if (error.response.status === 500) {
        return UNKNOWN;
      } else if (error.response.status === 404) {
        return NOT_FOUND;
      } else if (error.response.status === 401) {
        return AUTH_FAILED;
      } else if (error.response.status === 440) {
        return SESSION_TIMED_OUT;
      }
    }
  }

  function logoutUser() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('mobileNumber');
    navigate('/login');
  }
  return (
    <authContext.Provider value={{ loginUser, logoutUser, phoneNumber, setPhoneNumber, verifyOtp }}>
      {children}
    </authContext.Provider>
  );
}
