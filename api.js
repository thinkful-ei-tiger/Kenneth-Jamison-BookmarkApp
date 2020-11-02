  
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Kenneth-Jamison/bookmarks';

const listApiFetch = function (...args) {
    return fetch(...args)
      .then (response => {
        return response.json();
      })
      .then (data => {
        return data;
      });
  };
  
  const getBookmarks = function () {
    return listApiFetch(`${BASE_URL}`);
  }
  
  const addBookmark = function (bookmarkData) {
    return listApiFetch(`${BASE_URL}`, 
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: bookmarkData
    })
  }
  
  const deleteBookmark = function (id) {
    return listApiFetch(`${BASE_URL}/${id}`, 
    {
      method: 'DELETE'
    });
  }
  
  export default {
    getBookmarks,
    addBookmark,
    deleteBookmark
  };
  