import React, { useState } from 'react'
import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router'
import '../style/register.scss'
import { useAuth } from '../hooks/useAuth'
const Register = () => {
  const {loading,handlerRegister}=useAuth()
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate=useNavigate()
  async function SubmitHandler(e){
    e.preventDefault();
    await handlerRegister({username,email,password});
    navigate('/')
  }
  return (
    <main className='login-page'> 
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={SubmitHandler}>
                <FormGroup value={username} 
                onChange={(e)=>setUsername(e.target.value)}
                label='Name' placeholder='Enter your name' />

                <FormGroup value={email}
                onChange={(e)=>setEmail(e.target.value)}
                label='Email' placeholder='Enter your email' />

                <FormGroup value={password}
                onChange={(e)=>setPassword(e.target.value)}
                label='Password' placeholder='Enter your password' />
                <button className='button' type='submit'>Register</button>
            </form>
            <p>Alreday have an account? <Link className='toggle' to='/login'>Login</Link></p>
        </div>
    </main>
  )
}

export default Register