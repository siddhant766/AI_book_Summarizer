const axios = require('axios');

/**
 * Search books via Google Books API
 * @param {string} title - The book title or query search string
 * @returns {Promise<Array>} List of formatted book metadata objects
 */
const searchGoogleBooks = async (title) => {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes`;
    const params = {
      q: title,
      maxResults: 10,
    };
    
    if (apiKey) {
      params.key = apiKey;
    }

    const response = await axios.get(url, { params });
    
    if (!response.data.items) {
      return [];
    }

    return response.data.items.map(item => {
      const volumeInfo = item.volumeInfo || {};
      
      // Extract ISBN-13 or ISBN-10
      let isbn = '';
      if (volumeInfo.industryIdentifiers) {
        const isbn13 = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13');
        const isbn10 = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_10');
        isbn = isbn13 ? isbn13.identifier : (isbn10 ? isbn10.identifier : '');
      }

      // Format Cover Image URL to HTTPS
      let coverImage = '';
      if (volumeInfo.imageLinks) {
        coverImage = volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail || '';
        if (coverImage.startsWith('http:')) {
          coverImage = coverImage.replace('http:', 'https:');
        }
      }

      return {
        title: volumeInfo.title || 'Unknown Title',
        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
        coverImage: coverImage,
        genre: volumeInfo.categories || ['General'],
        publicationDate: volumeInfo.publishedDate || 'Unknown Date',
        publisher: volumeInfo.publisher || 'Unknown Publisher',
        description: volumeInfo.description || 'No description available.',
        isbn: isbn,
        language: volumeInfo.language || 'en'
      };
    });
  } catch (error) {
    console.error('Error fetching from Google Books API:', error.message);
    throw new Error('Google Books search failed.');
  }
};

module.exports = {
  searchGoogleBooks
};
