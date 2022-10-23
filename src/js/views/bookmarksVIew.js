import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  addHandlerLoad(handler) {
    window.addEventListener('load', handler);
  }
  _generatorMarkup() {
    return this._data
      .map(bookmarks => {
        return previewView.render(bookmarks, false);
      })
      .join('');
  }
}
export default new BookmarksView();
