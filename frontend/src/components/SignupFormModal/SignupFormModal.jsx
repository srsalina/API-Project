import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className='mainSignup'>
            <h1 className='loginsignup'>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        placeholder='Email'
                        className='input'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {errors.email && <p className='inputError'>{errors.email}</p>}
                <label>
                    <input
                        type="text"
                        placeholder='Username'
                        className='input'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                {errors.username && <p className='inputError'>{errors.username}</p>}
                <label>
                    <input
                        type="text"
                        placeholder='First Name'
                        className='input'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                {errors.firstName && <p className='inputError'>{errors.firstName}</p>}
                <label>
                    <input
                        type="text"
                        placeholder='Last Name'
                        className='input'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                {errors.lastName && <p className='inputError'>{errors.lastName}</p>}
                <label>
                    <input
                        type="password"
                        placeholder='Password'
                        className='input'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.password && <p className='inputError'>{errors.password}</p>}
                <label>
                    <input
                        type="password"
                        placeholder='Confirm Password'
                        className='input'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.confirmPassword && (
                    <p className='inputError'>{errors.confirmPassword}</p>
                )}
                <button type="submit" className="signupbutton" disabled={!confirmPassword || !email || !username || !firstName || !lastName || !password || username.length < 4 || password.length < 6}>Sign Up</button>
            </form>
        </div>
  );
}

export default SignupFormModal;
