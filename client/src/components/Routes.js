import React from 'react'
import {Route} from 'react-router-dom'
import Home from './core/Home'
import Shop from './core/Shop'
import Signin from './users/Signin'
import Signup from './users/Signup'
import PrivateRoute from './auth/PrivateRoute'
import AdminRoute from './auth/AdminRoute'
import Dashboard from './users/UserDashboard'
import AdminDashboard from './users/AdminDashboard'
import AddCategory from './admin/AddCategory'
import AddProduct from './admin/AddProduct'
import Product from './core/Product'
const Routes = () => {
    return(
  
        <div>
        <main>
          <Route exact path="/" component={Home} />
          <Route exact path="/shop" component={Shop} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
          <PrivateRoute path="/user/dashboard" exact component={Dashboard}/>
          <AdminRoute path="/admin/dashboard" exact component={AdminDashboard}/>
          <AdminRoute path="/create/category" exact component={AddCategory}/>
          <AdminRoute path="/create/product" exact component={AddProduct}/>
          <Route  path="/product/:productId" component={Product} />
        </main>
      </div>

    )
}

export default Routes;