import React,{useEffect,useState} from 'react'
import axios from 'axios';
import Layout from './Layout'
import {API} from '../../config'
import Card from './Card'
import Checkbox from './Checkbox'
import {prices} from './FixedPrices'
import RadioBox from './RadioBox'
import {GetFilteredProducts,list} from './apiCore'

const Shop = () => {
    const [myFilters,setMyFilters] = useState({
        filters:{category:[],price:[]}
    })
    const [categories,setCategories] = useState([])
    const [error,setError] = useState(false)
    const [limit,setLimit] = useState(6)
    const [skip,setSkip]=useState(0)
    const [filteredResults,setFilteredResults] = useState(0)
    const [size,setSize] = useState(0)

    const init = () =>  {
        axios.get(`${API}/categories`)
            .then(res => {
                if(res.status === 200){
                    setCategories(res.data)
                }
            })
            .catch(error => {
                    // setValues({...values,error:error.response.data.msg})
                    setError(error.response.data.msg)
            })

        loadFilteredResults(skip,limit,myFilters.filters)
    }

    const loadFilteredResults = newFilters => {
    
        GetFilteredProducts(skip,limit,newFilters).then(data =>{
            if(data.error){
                setError(data.error)
            }else{
                setFilteredResults(data.data)
                setSize(data.size)
                setSkip(0)
            }
        })
    }

    const loadMore = () => {
        let toSkip = skip + limit
        
        GetFilteredProducts(toSkip,limit,myFilters.filters).then(data =>{
            if(data.error){
                setError(data.error)
            }else{
                setFilteredResults([...filteredResults,...data.data])
                setSize(data.size)
                setSkip(toSkip)
            }
        })
    }

    const loadMoreBtn = () => {
        return (
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5" >Load More</button>
            )
        )
    }

    useEffect(() => {
        init()
    },[])

    const handleFilters = (filters,filterBy) => {
        const newFilters = {...myFilters}
        newFilters.filters[filterBy] = filters

        if(filterBy == "price"){
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues
        }
        loadFilteredResults(myFilters.filters)
        setMyFilters(newFilters)
    }

    const handlePrice = (value) => {
        const data =prices;
        let array = []

        for(let key in data){
            if(data[key]._id === parseInt(value)){
                array = data[key].array
            }
        }
        return array;
    }



    return (
        
        <Layout title="Shop" description="shop description" className="container"> 
        <div className="row">
            <div className="col-4">
                <h4>Filter By Categories</h4>
                <ul>
                <Checkbox categories={categories} handleFilters = {filters => handleFilters(filters,'category')}/>
                </ul>
                <h4>Filter By Price Range</h4>
                <RadioBox prices={prices} handleFilters = {filters => handleFilters(filters,'price')}/>
                <div>
                    
                </div>
            </div>
            <div className="col-8">
                <h2 className="mb-4">Products</h2>
              {filteredResults ? (<div className="row">
                    {filteredResults.map((product,i) => (
                        <div  key={i} className='col-4 mb-3'>
                        <Card  product={product}/>
                        </div>
                    ))}
                </div>):'Loading...'}
                {console.log(size)}
               {loadMoreBtn()}
               
            </div>

        </div>
        </Layout>
    )
}


export default Shop;