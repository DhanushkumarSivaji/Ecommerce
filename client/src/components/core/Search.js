import React,{useState,useEffect} from 'react'
import axios from 'axios'
import{API} from '../../config'
import {GetFilteredProducts,list} from './apiCore'
import Card from './Card'

const Search = () => {

    const [data,setData] = useState({
        categories:[],
        category:'All',
        search:"",
        results:[],
        searched:false
    })

    const {categories,category,search,results,searched} = data


    const init = () =>  {
        axios.get(`${API}/categories`)
            .then(res => {
                if(res.status === 200){
                    setData({...data,categories:res.data})
                }
            })
            .catch(error => {
                console.log(error.response.data.error)
            })
    }

    useEffect(()=>{   
        init()
    },[])


    const handleChange = (name)=> e => {
        setData({...data,[name]:e.target.value,searched:false})
    }

    const searchSubmit = (e) => {
        e.preventDefault()
        searchData()
        
    }

    const searchData = () => {
        if(search){
            list({search: search || undefined , category:category})
                .then(response => {
                    if(response.error){
                        console.log(response.error)
                    }else{
                        setData({...data,results:response,searched:true})
                    }
                })
        }
    }

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select className="btn mr-2" onChange={handleChange("category")}>
                            <option value="All">Pick Category</option>
                            {categories.map((c,i) =>(
                                <option key={i} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input type="search" className="form-control" onChange={handleChange("search")} placeholder="Search By Name"/>
                </div>
                <div className="btn input-group-append" style={{border:'none'}}>
                    <button className="input-group-text">Search</button>
                   
                </div>
            </span>
     
        </form>
         
    )

    const searchMessage = (searched,results) => {
        if(searched && results.length > 0){
            return `Found ${results.length} products`
        }
        if(searched && results.length < 1){
            return 'No Products Found'
        }
    }

    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="mt-4 mb-4">
                    {searchMessage(searched,results)}
                </h2>
            <div className="row">
                {results.map((product,i) => (
                    <Card key={i} product={product}/>
                ))}
            </div>
            </div>
        )
    }


    return (
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
            <div className="container-fluid mb-3">{searchedProducts(results)}</div>
        </div>
    )
}

export default Search;