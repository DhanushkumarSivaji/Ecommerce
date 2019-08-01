import React, {useState } from 'react';
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {API} from '../../config'

const AddCategory = () => {
    const [name,setName] = useState('')
    const [error,setError] = useState('')
    const[success,setSuccess]=useState(false)
    
    const {user} = isAuthenticated()

    const handleChange = (e) => {
        console.log(e.target.value)
        setError('')
        setName(e.target.value)
    }

    const clickSubmit = (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

       axios.post(`${API}/category/create/${user._id}`,{name})
        .then(res => {
            if(res.status === 200){
                setError('')
                setSuccess(true)
            }
        })
        .catch(error => {
            console.log(error.response.data.msg)
            setError(error.response.data.msg)
            setSuccess(false)
        })

    }

    const ShowError = () => (
        <div className="alert alert-danger" style={{display:error?'':'none'}}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-info" style={{display:success?'':'none'}}>
            sucess
        </div>
    )
 
    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">Back to Dashboard</Link>

        </div>
    )



    const newCategoryForm = () => (
        <form onSubmit = {clickSubmit}>
        <div className="form-group">
            <label>Name</label>
            <input
              onChange = {handleChange}
              type="text"
              value={name}
              className="form-control"
              placeholder="Add Category"
            />
          </div>
          <button className="btn btn-outline-primary">Create Category</button>
          </form>
    )
    return(
            <Layout title="Add a new category" description ={`Good Day ${user.name} , ready to add a category ?`} className="container">
              <div className='row' >
                  <div className='col-md-8 offset-md-2'>
                      {showSuccess()}
                      {ShowError()}
                  {newCategoryForm()}
                  {goBack()}
                  </div>
              </div>
                
            </Layout>
    )

}

export default AddCategory;