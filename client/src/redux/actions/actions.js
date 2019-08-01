import { FETCH_POSTS } from './types';
import { push } from "connected-react-router";

export const fetchPosts = () => dispatch => {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json())
    .then(posts =>
      dispatch({
        type: FETCH_POSTS,
        payload: posts
      })
    );
};

export const changePage = () => dispatch => {
    dispatch(push("/"));
  };
  