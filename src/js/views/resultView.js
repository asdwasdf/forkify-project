import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;';

  _generatorMarkup() {
    return this._data
      .map(results => {
        return previewView.render(results, false);
      })
      .join('');
  }
}
export default new ResultView();
