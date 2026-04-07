import React from 'react'

const FormGroup = ({label,placeholder,value,onChange}) => {
  return (
    <div className='form-group'>
        <label htmlFor="email">{label}</label>
        <input value={value} onChange={onChange}
         type="text" name={label} id={label} required placeholder={placeholder}  />
    </div>
  ) 
}

export default FormGroup