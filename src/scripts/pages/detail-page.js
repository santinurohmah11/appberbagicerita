import StoryDb from '../data/story-db'; 
import StoryApi from '../data/story-api'; // 💡 Asumsikan Anda punya StoryApi
import { format } from 'date-fns'; // Untuk memformat tanggal

const DetailPage = {
  async render() {
    return `
      <section class="container detail-page" aria-labelledby="detail-title">
        <h1 id="detail-title">Detail Cerita</h1>
        <div id="story-detail-content" class="story-detail-content">
          <p class="loading-state">Memuat detail cerita...</p>
        </div>
        <div id="favorite-button-container" class="favorite-button-container"></div>
      </section>
    `;
  },

  async afterRender(url) {
    const storyId = url.id; 
    const contentContainer = document.getElementById('story-detail-content');
    
    // 1. Ambil Data Cerita dari API
    const storyData = await this._getStoryDetail(storyId);

    if (!storyData) {
      contentContainer.innerHTML = '<p class="error-state">❌ Gagal memuat cerita atau cerita tidak ditemukan.</p>';
      return;
    }
    
    // 2. Render Detail Cerita
    contentContainer.innerHTML = this._createStoryDetailTemplate(storyData);

    // 3. Implementasi Tombol Favorit (IndexedDB CRUD)
    this._initFavoriteButton(storyData);
  },

  async _getStoryDetail(id) {
    // 💡 GANTI INI dengan logika fetch data dari StoryApi Anda
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Anda harus login untuk melihat detail!");
        window.location.hash = "#/login";
        return null;
    }
    
    try {
        const response = await fetch(`https://story-api.dicoding.dev/v1/stories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const responseJson = await response.json();
        
        if (response.ok && responseJson.error === false) {
            return responseJson.data.story;
        } else {
            throw new Error(responseJson.message || 'Gagal mengambil data detail.');
        }
    } catch (error) {
        console.error("Error fetching detail:", error);
        return null;
    }
  },

  _createStoryDetailTemplate(story) {
    // Memastikan tanggal diformat dengan benar
    const formattedDate = format(new Date(story.createdAt), 'dd MMMM yyyy, HH:mm');
    
    return `
      <img class="detail-image" src="${story.photoUrl}" alt="${story.name}">
      <h2 class="detail-title">${story.name}</h2>
      <p class="detail-date">Diposting pada: ${formattedDate}</p>
      ${story.lat && story.lon ? `<p class="detail-location">📍 Lokasi: ${story.lat.toFixed(5)}, ${story.lon.toFixed(5)}</p>` : ''}
      <p class="detail-description">${story.description}</p>
    `;
  },

  async _initFavoriteButton(storyData) {
    const storyId = storyData.id; 
    const favoriteButtonContainer = document.getElementById('favorite-button-container');
    
    const renderFavoriteButton = async () => {
        // Cek status di IndexedDB (READ)
        const isFavorited = await StoryDb.getStory(storyId);
        
        favoriteButtonContainer.innerHTML = `
          <button id="favorite-toggle" class="favorite-toggle ${isFavorited ? 'favorited' : ''}">
            ${isFavorited ? '❤️ Hapus dari Favorit' : '🤍 Simpan ke Favorit'}
          </button>
        `;
        
        document.getElementById('favorite-toggle').addEventListener('click', async () => {
            if (isFavorited) {
              // DELETE
              await StoryDb.deleteStory(storyId);
              alert('Cerita dihapus dari favorit lokal.');
            } else {
              // CREATE
              await StoryDb.putStory(storyData); // Simpan seluruh objek cerita
              alert('Cerita disimpan ke favorit lokal!');
            }
            // Refresh tampilan tombol
            renderFavoriteButton(); 
        });
    };

    renderFavoriteButton();
  }
};

export default DetailPage;