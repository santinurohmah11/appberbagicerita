const STORY_API_BASE_URL = "https://story-api.dicoding.dev/v1";

const StoryApi = {
  /**
   * Mengambil detail cerita berdasarkan ID. Membutuhkan token autentikasi.
   * @param {string} id - ID cerita.
   * @returns {Promise<object>} Data detail cerita.
   */
  async getDetailStory(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        // Ini akan ditangani di DetailPage, tapi baik untuk ada di sini
        throw new Error("Token tidak ditemukan. Silakan login.");
    }
    
    try {
        const response = await fetch(`${STORY_API_BASE_URL}/stories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const responseJson = await response.json();
        
        if (response.ok && responseJson.error === false) {
            return responseJson.story; // Mengembalikan objek story
        } else {
            throw new Error(responseJson.message || 'Gagal mengambil data detail.');
        }
    } catch (error) {
        console.error("Error fetching detail:", error);
        throw error;
    }
  },

  // Tambahkan fungsi API lain di sini (misalnya, getAllStories, login, dll.)
};

export default StoryApi;