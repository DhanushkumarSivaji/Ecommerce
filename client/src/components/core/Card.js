import React from 'react'
import {Link} from 'react-router-dom'
import ShowImage from './ShowImage'
import moment from 'moment'

const Card = ({product,showViewProductButton=true}) => {

    const showStock = (quantity) => {
        return quantity > 0 ? (
            <span className="badge badge-primary badge-pill">In Stock</span>
        ) : (
            <span className="badge badge-primary badge-pill">Out of Stock</span>         
        )
    }




    return(
     
            <div className="card">
                <div className="card-header">{product.name}</div>
                <div className="card-body">
                    <ShowImage item={product} url="product"/>
                    <p>{product.description.substring(0,100)}</p>
                    <p>${product.price}</p>
                    <p>Added on {moment(product.createdAt).fromNow()}</p>
                    {showStock(product.quantity)}
                    <br/>
                    {showViewProductButton && <Link to={`/product/${product._id}`}>
                    <button className="btn btn-outline-primary mt-2 mb-2">View Product</button>
                    </Link>}
                    <button className="btn btn-outline-warning mt-2 mb-2">Add to cart</button>
                </div>
            </div>
      
    )
}

export default Card;