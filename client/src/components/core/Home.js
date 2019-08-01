import React,{useState,useEffect} from 'react'
import Layout from './Layout'
import axios from 'axios'
import {API} from '../../config'
import Card from './Card'
import SearchBar from './Search'
const Home = () => {

  const [productsBySell , setProductsBySell] = useState([])
  const [productsByArraival , setProductsByArraival] = useState([])
  const [error,setError] = useState(false)

  const loadProductsBySell = (sortBy) => {
    axios.get(`${API}/products?sortBy=${sortBy}&order=desc&limit=6 `)
      .then(res => {
        if(res.status==200){
          setProductsBySell(res.data)
        }
      })
      .catch(error => {
        setError(error.response.data.msg)
      })
  }

  const loadProductsByArraival = (sortBy) => {
    axios.get(`${API}/products?sortBy=${sortBy}&order=desc&limit=6 `)
      .then(res => {
        if(res.status==200){
          setProductsByArraival(res.data)
        }
      })
      .catch(error => {
        console.log(error.response)
      })
  }

  useEffect(()=>{
    loadProductsBySell('sold')
    loadProductsByArraival('createdAt')
  },[])
  
    return (
        <div>
          <Layout title="Home Page" description ="Home" className="container-fluid">
          <SearchBar/>
            <h2 className="mb-4">New Arraivals</h2>
            
            <div className="row">
              {productsByArraival.map((product,i)=>(
                <div  key={i} className='col-4 mb-3'>
                <Card  product={product}/>
                </div>
              ))}
            </div>
            <h2 className="mb-4">Best Sellers</h2>
            <div className="row">
              {productsBySell.map((product,i)=>(
                <div  key={i} className='col-4 mb-3'>
                <Card  product={product}/>
                </div>
              ))}
            </div>
          </Layout>
        </div>
    )
}

export default Home;