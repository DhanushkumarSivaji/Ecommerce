import React,{Component} from 'react';
import Routes from './components/Routes'
import { connect } from 'react-redux';
import {fetchPosts,changePage} from './redux/actions/actions'
import './sass/App.scss'
import setAuthToken from './components/utils/SetAuthToken'

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

class App extends Component {

    constructor(props) {
      super(props);
      this.state = {  };
    }
    

    componentDidMount(){
      this.props.fetchPosts()
    }

  render(){
    return (
      <div className="App">
        <Routes/>
      </div>
    );
  }
 
}

const mapStateToProps = state => ({
  posts: state.datas.items, 
});

export default connect(mapStateToProps, {fetchPosts ,changePage })(App);
