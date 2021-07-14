import React from 'react'
import '../Login/login.css'
import { useFormik } from  'formik'
import logoSv from  '../../components/assets/logosv.png'
import  {Link}  from  'react-router-dom'

export const Login = () => {

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
        <div className="container--login">
        
            <img src={logoSv} className="logo--login"/>

            <form className="style--form--login"  onSubmit={formik.handleSubmit}>
            <input
          className="style--inputs"
          name="email"
          type="email"
          onChange={formik.handleChange}
          placeholder="Correo electronico"
        />

<input
          className="style--inputs"
          name="password"
          type="password"
          onChange={formik.handleChange}
placeholder="Contraseña"
        />
         <button className="button--login" type="submit">INICIAR SESION</button>
        <Link className="link--register">Registrar</Link>
            </form>
        </div>
    )
}
 export default Login