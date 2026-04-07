import React, { useState } from 'react'
import '../style/login.scss'
import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
const Login = () => {
  const {loading,handlerLogin}=useAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate()
  async function SubmitHandler(e) {
    e.preventDefault();
    await handlerLogin({email,password});
    navigate('/')
  }
  return (
    <main className='login-page'>
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={SubmitHandler}>
                <FormGroup value={email}
                onChange={(e)=>setEmail(e.target.value)}
                 label='Email' placeholder='Enter your email' />

                <FormGroup value={password} 
                onChange={(e)=>setPassword(e.target.value)}
                label='Password' placeholder='Enter your password' />
                <button className='button' type='submit'>Login</button>
            </form>
            <p>Dont have an account? <Link className='toggle' to='/register'>Register</Link></p>
        </div>
    </main>
  )
}

export default Login