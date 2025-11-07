import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import SavedStoriesPage from '../pages/saved-stories-page';
import DetailPage from '../pages/detail-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/add-story': new AddStoryPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/saved-stories': SavedStoriesPage,
};

const main = document.querySelector('main');
main.classList.remove('show');
setTimeout(() => main.classList.add('show'), 50);


export default routes;
