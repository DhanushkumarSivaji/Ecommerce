import React, {useState ,useEffect} from 'react';
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {API} from '../../config'


const AddCategory = () => { 
    const {user,token} = isAuthenticated()

    const [values,setValues] = useState({
        name:'',
        description:'',
        price:'',
        categories:[],
        category:'',
        shipping:'',
        quantity:'',
        photo:'',
        loading:false,
        error:'',
        createdProduct:'',
        redirectToProfile:false,
        formData:''
    })

    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        photo,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values

    const init = () =>  {
        axios.get(`${API}/categories`)
            .then(res => {
                if(res.status === 200){
                    setValues({...values,formData: new FormData,categories:res.data})
                }
            })
            .catch(error => {
                    setValues({...values,error:error.response.data.msg})
            })
    }

    useEffect(()=>{
       
        init()
    },[])

    const handleChange = name => event => {
        
        const value = name === 'photo' ? event.target.files[0] : event.target.value
        formData.set(name,value)
        setValues({...values,[name]:value,error:'',createdProduct:' '})

    }

    const ClickSubmit = (e) => {
        e.preventDefault()
        setValues({...values,error:"",loading:true})
        axios.post(`${API}/product/create/${user._id}`,formData)
            .then(res => {
                if(res.status == 200){
                    console.log(res)
                    setValues({
                        ...values,
                        name:"",
                        description:"",
                        photo:"",
                        price:"",
                        quantity:"",
                        loading:false,
                        createdProduct:name
                    })
                }
            })
            .catch(error => {
                 setValues({...values,error:error.response.data.msg})
            })
    }

    const newPostForm = () => (
        <form className='mb-3' onSubmit={ClickSubmit}>
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-outline-secondary">
                <input type="file" name="photo" accept="image/*" onChange={handleChange('photo')}/>
                </label>
            </div>
            <div className="form-group">
            <label>Name</label>
            <input
              onChange = {handleChange("name")}
              type="text"
              value={name}
              className="form-control"
            required
              
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              onChange = {handleChange("description")}
              value={description}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              onChange = {handleChange("price")}
              type="number"
              value={price}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              onChange = {handleChange("category")}
              className="form-control"
            >
                <option>Please Select</option>
                {categories && categories.map((k,i) => (
                    <option key={i} value={k._id}>{k.name}</option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label>Shipping</label>
            <select
              onChange = {handleChange("shipping")}
              className="form-control"
            >
                <option>Please Select</option>
                <option value='0'>No</option>
                <option value='1'>Yes</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              onChange = {handleChange("quantity")}
              type="number"
              value={quantity}
              className="form-control"
            />
          </div>
          <button className="btn btn-outline-primary">Create Product    </button>
        </form>
    )

    const ShowError = () => (
        <div className="alert alert-danger" style={{display:error ?'':'none'}}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-info" style={{display:createdProduct?'':'none'}}>
            <h2>{`${createdProduct}`} is created.</h2>
        </div>
    )

    const showLoading = () => (
        loading && (<div className="alert alert-success"><h2>Loading....</h2></div>)
    )

    return (
        <Layout title="Add a new product" description ={`Good Day ${user.name}  , ready to add a product ?`} className="container">
            <div className="col-md-8 offset-md-2">
                {ShowError()}
                {showSuccess()}
                {showLoading()}
                {newPostForm()}
            </div>
        </Layout>
    )
}

export default AddCategory;