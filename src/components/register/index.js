import React,  {useState} from 'react'
import '../register/register.css'
import { useFormik } from 'formik'
import logoSv from '../../components/assets/logosv.png'
import {Link} from 'react-router-dom'


const Register = () => {
  const [tipeUserState, setTipeUserState] =useState('')


    const onSubmit = async () =>{
        console.log('')
             }
             
             const formik = useFormik({
                initialValues: {
                  email: "",
                  password: "",
                },
            
                onSubmit,
            
              });

    return (
        <div className="container--register">
            
               <img src={logoSv} className="logo--login"/>
<h3 className="text--select--user">Selecciones el usuario que desea crear </h3>
<select
className="style--select--tipeUser"
value={tipeUserState}
onChange={(e) => {
    const selectUser=e.target.value;
    setTipeUserState(selectUser) 
}}>
    <option value='ventas'>Ventas</option>
    <option value='Contabilidad'>Contabilidad</option>
    <option value='operaciones'>Operaciones</option>
    <option value='comercial'>Comercial</option>
    <option value='marketing'>Marketing</option>
</select><br/>
<button className="button--registerUser" type="submit">CONTINUAR</button>

        </div>
    )
}

export default Register
