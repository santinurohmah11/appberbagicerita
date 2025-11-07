import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this._setupDrawer();
  }

  _setupDrawer() {
    if (!this.#drawerButton || !this.#navigationDrawer) return;

    this.#drawerButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        this.#navigationDrawer &&
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }
    });

    this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        this.#navigationDrawer.classList.remove('open');
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url] || routes['/'];

    this.#content.innerHTML = '';

    const renderedHTML = await page.render();

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        this.#content.innerHTML = renderedHTML;
      }).finished.then(async () => {
        await page.afterRender();

        // 🔹 Pastikan map atau layout yang butuh reflow di-refresh
        const mapEl = document.getElementById('map');
        if (mapEl) {
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 400);
        }
      });
    } else {
      this.#content.innerHTML = renderedHTML;
      await page.afterRender();

      // 🔹 Fallback refresh map
      const mapEl = document.getElementById('map');
      if (mapEl) {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 400);
      }
    }
  }
}

export default App;
