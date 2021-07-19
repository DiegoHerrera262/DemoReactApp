import React from 'react'
import '../createSupplier/createSupplier.css'
import {useFormik} from 'formik'

const CreateSupplier = () => {

    const formik =useFormik({
        initialValues:{
            name:'',
            email:'',
            cellular:'',
            city:'',
            address:'',
        },
        onsubmit:(values) =>{
            console.log(values)
        }
    })


    return (
        <div className="container--create--supplier">
            <h1 className="title--create--supplier">Crear proveedor</h1>
            <div className="header--create--supplier"><h1>Informacion general</h1></div>

            <div className="container--form-suppliers">

<form className ="form--supplier"  onSubmit={formik.handleSubmit}>

<h2 className="title--inputs--products">*Nombre</h2>
<input 
className="style--inputs--products"
name="name"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Correo electronico</h2>
<input 
className="style--inputs--products"
name="email"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Celular</h2>
<input 
className="style--inputs--products"
name="cellular"
type="text"
onChange={formik.handleChange}
/>


<h2 className="title--inputs--products">*Ciudad</h2>
<input 
className="style--inputs--products"
name="city"
type="text"
onChange={formik.handleChange}
/>


<h2 className="title--inputs--products">*Direccion</h2>
<input 
className="style--inputs--products"
name="address"
type="text"
onChange={formik.handleChange}
/>
<br />

<button className="button--supplier" type="submit"> CREAR PROVEEDOR</button>
</form>
            </div>
        </div>
    )
}

export default CreateSupplier
