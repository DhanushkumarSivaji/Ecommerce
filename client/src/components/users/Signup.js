import React,{useState} from 'react'
import Layout from '../core/Layout'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {API} from '../../config'

const Signup = () => {

    const [values,setValues] = useState({
        name:"",
        email:"",
        password:"",
        error:"",
        success:false
    })
    
    const {name,email,password,error,success} = values

    const handleChange = name => e => {
        setValues({...values,error:false,[name]:e.target.value})
    }

    const SignUp = (values) => {
      
       

       return axios.post(`${API}/signup`,values)
        .then(res => {
            if(res.status === 200){
                setValues({
                    ...values,
                    name:'',
                    email:'',
                    password:'',
                    error:'',
                    success:true 
                })
            }
        })
        .catch(error => {
            console.log(error.response.data.msg)
            setValues({
                ...values,
                error:error.response.data.msg,
                success:false
            })
        })
    }

    const Submit = (e) => {
        e.preventDefault()
        SignUp({name,email,password})
      
    }
    
    const SignUpForm = () => (
        <form onSubmit = {Submit}>
        <div className="form-group">
            <label>Name</label>
            <input
              onChange = {handleChange("name")}
              type="text"
              value={name}
              className="form-control"
              placeholder="Enter name"
            />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input
              onChange = {handleChange("email")}
              type="email"
              value={email}
              className="form-control"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label >Password</label>
            <input
              onChange = {handleChange("password")}
              type="password"
              value={password}
              className="form-control"
              placeholder="Password"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
    )
    
    const ShowError = () => (
        <div className="alert alert-danger" style={{display:error?'':'none'}}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-info" style={{display:success?'':'none'}}>
            Account created successfully.Please <Link to='/signin'>Signin</Link>
        </div>
    )

    return (
        <div>
            <Layout title="SignUp" description ="SignUp Page for Ecommerce app" className="container">
                {ShowError()}
                {showSuccess()}
                {SignUpForm()}
                
            </Layout>
        </div>
    )
}

export default Signup;