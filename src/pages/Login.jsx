import { useContext, useState } from 'react';
import { authContext } from '../context/AuthContextProvider';
import { toast } from 'react-toastify';
import '../css/login.css';
import { NOT_FOUND, SUCCESS } from '../constants';

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
    const mobileNumber = e.target.value.trim();

    setPhoneNumber(mobileNumber);
    setIsValid(/^[6-9]\d{9}$/.test(mobileNumber));
  }
  async function submitLogin(e) {
    e.preventDefault();
    const response = await loginUser(phoneNumber);
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
