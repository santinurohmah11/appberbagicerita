// src/scripts/data/story-db.js

import { openDB } from 'idb';

const DATABASE_NAME = 'story-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'favorite-stories'; // Object store untuk menyimpan cerita favorit

const storyDb = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    // Membuat object store baru (seperti "tabel" di SQL)
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
  },
});

const StoryDb = {
  // 💡 READ (Satu Data)
  async getStory(id) {
    return (await storyDb).get(OBJECT_STORE_NAME, id);
  },
  
  // 💡 READ (Semua Data)
  async getAllStories() {
    return (await storyDb).getAll(OBJECT_STORE_NAME);
  },
  
  // 💡 CREATE/UPDATE (Menyimpan data baru atau memperbarui data lama)
  async putStory(story) {
    // Pastikan objek cerita memiliki properti 'id' yang unik
    if (!story.id) {
      throw new Error('Story object must have a unique "id" property.');
    }
    return (await storyDb).put(OBJECT_STORE_NAME, story);
  },
  
  // 💡 DELETE
  async deleteStory(id) {
    return (await storyDb).delete(OBJECT_STORE_NAME, id);
  },
};

export default StoryDb;