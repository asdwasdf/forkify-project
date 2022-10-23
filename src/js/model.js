import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './configs';
import { AJAX } from './helper';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmark: [],
};
const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    img: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);
    if (state.bookmark.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log(state.recipe);
  } catch (err) {
    console.error(`${err}🧨🧨🧨`);
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      _errorMessage = 'No recipes found for your query! Please try again ;)';
      // console.log(rec);
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        img: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    // console.log(state.search);
  } catch (err) {
    // console.error(err);
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );
  state.recipe.servings = newServings;
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};
export const addBookmark = function (recipe) {
  state.bookmark.push(recipe);
  state.recipe.bookmarked = true;
  persistBookmarks();
};
export const removeBookmark = function (id) {
  const index = state.bookmark.findIndex(bookmark => bookmark.id === id);
  console.log(index);
  console.log(id);
  state.bookmark.splice(index, 1);
  state.recipe.bookmarked = false;
  persistBookmarks();
};
export const addNewRecipe = async function (newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter(ing => ing[0].startsWith('ingredient') && ing[1] !== '')
    .map(ing => {
      const ingArr = ing[1].split(',').map(el => el.trim());

      if (ingArr.length !== 3 || ingArr[2] === '')
        throw new Error(
          'Wrong ingredients format! Please use the correct format :D'
        );
      const [quantity, unit, description] = ingArr;
      return { quantity: +quantity ? +quantity : null, unit, description };
    });
  const recipe = {
    title: newRecipe.title,
    publisher: newRecipe.publisher,
    image_url: newRecipe.image,
    source_url: newRecipe.sourceUrl,
    servings: +newRecipe.servings,
    cooking_time: +newRecipe.cookingTime,
    ingredients,
  };
  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe = createRecipeObject(data);
  addBookmark(recipe);
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage);
};
init();
const remove = function () {
  localStorage.clear();
};
// remove();
