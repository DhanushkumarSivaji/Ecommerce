import React from 'react'
import Navbar from './Navbar'
 const Layout = ({title = "Title",description = "Description",className,children}) => {
    return (
        <div>
        <Navbar/>
        <div className="jumbotron jumbotron-fluid">
            <div className="container">
                <h1 className="display-4">{title}</h1>
                <p className="lead">{description}</p>
            </div>
        </div>
        <div className={className}>{children}</div>
        </div>
    )
}

export default Layout;