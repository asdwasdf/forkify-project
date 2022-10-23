import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './configs.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksVIew from './views/bookmarksVIew.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    resultView.update(model.getSearchResultsPage());
    bookmarksVIew.update(model.state.bookmark);
    recipeView.renderSpinner();
    //fetch data
    await model.loadRecipe(id);
    //render data
    // console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();
    await model.loadSearchResults(query);
    resultView.render(model.getSearchResultsPage());
    resultView.update(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
const controlPagination = function (gotoPage) {
  resultView.render(model.getSearchResultsPage(gotoPage));
  paginationView.render(model.state.search);
  console.log(model.state.search.page);
};
const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksVIew.render(model.state.bookmark);
};
const controlBookmark = function () {
  bookmarksVIew.render(model.state.bookmark);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.addNewRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderSuccess();

    bookmarksVIew.render(model.state.bookmark);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
};
const init = function () {
  bookmarksVIew.addHandlerLoad(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerClick(controlServings);
  recipeView.addHandlerAddBookmarked(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
