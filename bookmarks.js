import $ from 'jquery';

import store from './store';
import api from './api';

$.fn.extend({
  serializeJson: function() {
    const formData = new FormData(this[0]);
    const inputObject = {};
    formData.forEach((val, name) => inputObject[name] = val);
    return JSON.stringify(inputObject);
  }
})

function generateBookmarkElement(bookmark) {
  
  if (bookmark.isExpanded) {
    return `
      <li class="bookmark" data-bookmark-id="${bookmark.id}">
      <div>
      <h3>${bookmark.title}</h3>
      <p>${bookmark.rating} Stars</p>
      </div>
    
      <div class="insideBookmark">
      <h4>Description</h4>
      <p>${bookmark.desc}</p>
    
      <a href='${bookmark.url}' class="aButton" onclick='return check()'>Go to Page</a>
    
      <button type="button" class="js-delete" >Delete</button>
      
      </div>
      </li>
    `;
    
  } else {
    return `<li class="bookmark" data-bookmark-id="${bookmark.id}">
      <h3>${bookmark.title}</h3>
      <p>${bookmark.rating} Stars</p>
    </li>`;
  } 
}


function generateBookmarks(bookmarkList) {
  
  let bookmarks = bookmarkList.map(bookmark => generateBookmarkElement(bookmark));
  
  return `<section class="my-bookmarks">
  <div class="bookmark-controls">
    <button type="button" class="add-bookmark-btn js-add-new-bookmark">Add Bookmark</button>
    <select class="filter">
      <option value="">Filter By</option>
      <option value="1">1 Star</option>
      <option value="2">2 Stars</option>
      <option value="3">3 Stars</option>
      <option value="4">4 Stars</option>
      <option value="5">5 Stars</option>
    </select>
  </div>
  
  <section>
    <ul class="bookmark-list">
      ${bookmarks.join('')}
    </ul>
  </section>
</section>`;
}

function generateNewBookmarkForm() {
  return `
  <h2 class="title">Add New Bookmark</h2>
  <section class="my-bookmarks addNewCenter">  
    <form action="" class="new-bookmark-form">
      <label for="bookmark-title">Title</label>
      <input id="bookmark-title" name="title" type="text" placeholder="e.g. Google" required>
      <label for="bookmark-url">URL</label>
      <input id="bookmark-url" name="url" type="url" placeholder="e.g www.google.com" required>
      <label for="bookmark-rating">Rating</label>
      <input id="bookmark-rating" name="rating" type="number" min="1" max="5" placeholder="1">
      <label for="bookmark-desc">Description</label>
      <br>
      <textarea id="bookmark-desc" name="desc" placeholder="Enter a description for your bookmark!"></textarea>
      <br>
      <button type="button" class="cancel-btn js-cancel-new-bookmark">Cancel</button>
      <button type="submit" class="submit-btn js-add-bookmark">Add Bookmark</button>
    </form>
  </section>`;
}

function handleAddNewBookmarkClicked() {
  $('main').on('click', '.js-add-new-bookmark', function(event) {
    store.adding = !store.adding;
    render();
  })
}

function handleCancelNewBookmarkClicked() {
  $('main').on('click', '.js-cancel-new-bookmark', (event) => {
    store.adding = !store.adding;
    render();
  })
}

function handleAddBookmarkClicked() {
  $('main').on('click', '.js-add-bookmark', (event) => {
    event.preventDefault();
    let newBookmark = $('.new-bookmark-form').serializeJson();
    api.addBookmark(newBookmark)
      .then((bookmark) => {
        store.createBookmark(bookmark);
        store.adding = !store.adding;
        render();
      });
  });
}

function handleBookmarkClicked() {
  $('main').on('click', '.bookmark', (event) => {
    let bookmarkId = $(event.currentTarget).data('bookmark-id');
    store.toggleIsExpanded(bookmarkId);
    render();
  })
}

function handleFilterSelected() {
  $('main').on('change', '.filter', (event) => {
    let filter = $('.filter').val();
    
    store.filter = filter;
    render();
  })
}

function handleDeleteClicked() {
  $('main').on('click', '.js-delete', (event) => {
    let bookmarkId = $(event.target).closest('.bookmark').data('bookmark-id');
    console.log(bookmarkId);
    api.deleteBookmark(bookmarkId)
      .then(() => {
        store.deleteBookmark(bookmarkId);
        render();
      })
      .catch(error => {
        renderError();
      });
  });
}

function eventHandlers() {
  handleAddNewBookmarkClicked();
  handleCancelNewBookmarkClicked();
  handleAddBookmarkClicked();
  handleBookmarkClicked();
  handleFilterSelected();
  handleDeleteClicked();
}

function render() {
  
  const bookmarks = [...store.bookmarks];
  let bookmarksPage = '';
  
  if (!store.adding) {
    bookmarksPage = generateBookmarks(bookmarks);
    $('main').html(bookmarksPage);
  } else {
    bookmarksPage = generateNewBookmarkForm();
    $('main').html(bookmarksPage);
  }   
}

export default {
  render,
  eventHandlers
};