import React from 'react'
import '../createProducts/createProducts.css'
import {useFormik} from 'formik'

const CreateProducts = () => {

    const formik =useFormik({
        initialValues:{
            name:'',
            description:'',
            code:'',
            barcode:'',
            cost:'',
            netPrice:'',
            marginOfGain:'',
            IVA:'',
            finalPrice:'',
            img:'',
            initialInventory:'',
            storageType:'',
            packaging:'',
            unit:'',
            dueData:'',
            lot:'',
            weight:'',
            high:'',
            width:'',
            locationInWinery:'',
        },
        onsubmit:(values) =>{
            console.log(values)
        }
    })

    return (
        <div className="container--createProducts">
            <h1 className="title--crearProducts">Crear producto</h1>
            <div className="info-products">
             
                <div className="container--forms">

<form className="container--form--products" onSubmit={formik.handleSubmit}>
    <div className="container--partOne--info">
       
<div className="infoGeneral--products">
     <div className="header--infoGeneral"><h1>Informacion general</h1></div>   
<h2 className="title--inputs--products">*Nombre</h2>
<input 
className="style--inputs--products"
name="name"
type="text"
onChange={formik.handleChange}
/>
<h2 className="title--inputs--products">*Descripcion</h2>
<input 
className="style--inputs--products"
name="description"
type="text"
onChange={formik.handleChange}
/>
<h2 className="title--inputs--products">*Codigo</h2>
<input 
className="style--inputs--products"
name="code"
type="text"
onChange={formik.handleChange}
/>
<h2 className="title--inputs--products">*Codigo de barras</h2>
<input 
className="style--inputs--products"
name="barcode"
type="text"
onChange={formik.handleChange}
/>


<h2 className="title--inputs--products">*Estado</h2>
<input 
className="style--inputs--products"
name="barcode"
type="text"
onChange={formik.handleChange}
/>


<h2 className="title--inputs--products">*Categoria</h2>
<input 
className="style--inputs--products"
name="barcode"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Linea</h2>
<input 
className="style--inputs--products"
name="barcode"
type="text"
onChange={formik.handleChange}
/>


</div>
<div className="info--financiera"> 
<div className="header--infoFinanciera"><h1>Informacion financiera</h1></div>

<h2 className="title--inputs--products">*Costo</h2>
<input 
className="style--inputs--products"
name="cost"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Precio neto</h2>
<input 
className="style--inputs--products"
name="netPrice"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Margen de ganancia</h2>
<input 
className="style--inputs--products"
name="marginOfGain"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Impuesto de valor agregado</h2>
<input 
className="style--inputs--products"
name="IVA"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Precio final</h2>
<input 
className="style--inputs--products"
name="finalPrice"
type="text"
onChange={formik.handleChange}
/>

</div>
    </div>


<div className="partTwo--info">
<div className="info--visualizacion">
<div className="header--infoVisualizacion"><h1>Visualizacion</h1></div>

<h2 className="title--inputs--products">*imagen</h2>
<input 
className="style--inputs--products--img"
name="img"
type="text"
onChange={formik.handleChange}
/><br/>
<button className="button--img--products">subir imagen</button>
</div>

<div className="info--almacenamiento">
<div className="header--infoAlmacenamiento"><h1>Informacion de almacenamiento</h1></div>

<h2 className="title--inputs--products">*Inventario inicial</h2>
<input 
className="style--inputs--products"
name="initialInventory"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Metodo de inventario</h2>
<input 
className="style--inputs--products"
name="storageType"
type="text"
onChange={formik.handleChange}
/>


<h2 className="title--inputs--products">*Embalaje</h2>
<input 
className="style--inputs--products"
name="packaging"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Unidad</h2>
<input 
className="style--inputs--products"
name="unit"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Fecha de vencimiento</h2>
<input 
className="style--inputs--products"
name="dueData"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Lote</h2>
<input 
className="style--inputs--products"
name="lot"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Peso</h2>
<input 
className="style--inputs--products"
name="weight"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Alto</h2>
<input 
className="style--inputs--products"
name="high"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Ancho</h2>
<input 
className="style--inputs--products"
name="width"
type="text"
onChange={formik.handleChange}
/>


<h2 className="title--inputs--products">*Bodega</h2>
<input 
className="style--inputs--products"
name="locationInWinery"
type="text"
onChange={formik.handleChange}
/>

<h2 className="title--inputs--products">*Ubicacion en bodega</h2>
<input 
className="style--inputs--products"
name="locationInWinery"
type="text"
onChange={formik.handleChange}
/>


<h2 className="title--inputs--products">*Rotacion</h2>
<input 
className="style--inputs--products"
name="barcode"
type="text"
onChange={formik.handleChange}
/>
</div>

</div>

<button className="buttons--products--create" type="submit">CREAR PRODUCTO</button>


</form>
                </div>
            </div>
        </div>
    ) 
}

export default CreateProducts
