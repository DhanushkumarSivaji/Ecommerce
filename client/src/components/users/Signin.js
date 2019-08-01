import React,{useState} from 'react'
import Layout from '../core/Layout'
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import {isAuthenticated} from '../auth'
import setAuthToken from '../utils/SetAuthToken'
import {API} from '../../config'

const Signin = () => {
    const [values,setValues] = useState({
        email:"dhanushmech1995@gmail.com",
        password:"8508147321",
        error:"",
        loading:false,
        redirectToReferrer:false
    })
    
    const {email,password,error,loading,redirectToReferrer} = values
    const {user} = isAuthenticated()

    const handleChange = name => e => {
        setValues({...values,error:false,[name]:e.target.value})
    }

    const SignIn = (values) => {
      
       return axios.post(`${API}/signin`,values)
        .then(res => {
            if(res.status === 200){
                if(typeof window !== 'undefined'){
                    localStorage.setItem("token", res.data.token);
                    setAuthToken(localStorage.token);
                    localStorage.setItem('jwt',JSON.stringify(res.data))
                }
                setValues({
                    ...values,
                    redirectToReferrer:true,
                    loading:false 
                })
            }
        })
        .catch(error => {
        
            setValues({
                ...values,
                error:error.response.data.msg,
                loading:false
            })
        })
    }

    const Submit = (e) => {
        e.preventDefault()
        setValues({...values,error:false,loading:true})
        SignIn({email,password})
      
    }
    
    const SignUpForm = () => (
        <form onSubmit = {Submit}>

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
        <div className="alert alert-danger" style={{display:error ?'':'none'}}>
            {error}
        </div>
    )

    const showLoading = () => (
        loading && (
            <div className="alert alert-info">
                <h2>loading...</h2>
            </div>
        )
    )

    const redirectUser = () => {
        if(redirectToReferrer){
            if(user && user.role === 1){
                return <Redirect to='/admin/dashboard'/>
            }else{
                return <Redirect to='/user/dashboard'/>     
            }
        }

        if(isAuthenticated()){
            return <Redirect to='/'/>
        }
    }

    return (
        <div>
            <Layout title="SignIn" description ="SignIn Page for Ecommerce App" className="container">
                {ShowError()}
                {showLoading()}
                {SignUpForm()}
                {redirectUser()}
            </Layout>
        </div>
    )
}

export default Signin;