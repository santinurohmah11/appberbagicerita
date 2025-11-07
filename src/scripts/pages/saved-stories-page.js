// src/scripts/pages/saved-stories-page.js

import StoryDb from '../data/story-db'; // 💡 Import modul IndexedDB kita

const SavedStoriesPage = {
  async render() {
    return `
      <h2 class="page-title">Cerita Tersimpan Lokal</h2>
      <div id="saved-stories-list" class="story-list grid">
        </div>
    `;
  },

  async afterRender() {
    const stories = await StoryDb.getAllStories();
    const storiesListContainer = document.getElementById('saved-stories-list');

    if (stories.length === 0) {
      storiesListContainer.innerHTML = '<p class="empty-state">Belum ada cerita yang Anda simpan secara lokal.</p>';
      return;
    }

    stories.forEach(story => {
      // 💡 Anda perlu menyesuaikan ini dengan struktur card story Anda
      storiesListContainer.innerHTML += `
        <div class="story-card">
          <h3>${story.title || 'Tanpa Judul'}</h3>
          <p>${story.description.substring(0, 100)}...</p>
          <a href="#/detail/${story.id}" class="detail-link">Lihat Detail</a>
          <button class="delete-button" data-id="${story.id}">Hapus Lokal</button>
        </div>
      `;
    });

    // Handle tombol delete (DELETE - Kriteria 4 Basic)
    storiesListContainer.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', async (event) => {
        const id = event.target.dataset.id;
        await StoryDb.deleteStory(id);
        alert('Cerita berhasil dihapus secara lokal!');
        // Refresh halaman setelah dihapus
        this.afterRender(); 
      });
    });
  },
};

export default SavedStoriesPage;