// In-memory storage for demo purposes (no database required)
// Using globalThis to persist data across hot reloads in development

const globalStore = globalThis

if (!globalStore.__dbStore) {
  globalStore.__dbStore = {
    users: [],
    books: [],
    nextUserId: 1,
    nextBookId: 1
  }
}

const store = globalStore.__dbStore

// Helper to simulate SQL-like queries
const db = {
  // User operations
  findUserByEmail: (email) => {
    return store.users.find(u => u.email === email) || null
  },
  
  findUserByEmailOrUsername: (email, username) => {
    return store.users.find(u => u.email === email || u.username === username) || null
  },
  
  createUser: (username, email, password) => {
    const user = {
      id: store.nextUserId++,
      username,
      email,
      password,
      created_at: new Date().toISOString()
    }
    store.users.push(user)
    return user
  },
  
  updateUserPassword: (email, password) => {
    const user = store.users.find(u => u.email === email)
    if (user) {
      user.password = password
      return true
    }
    return false
  },
  
  // Book operations
  getBooksByUserId: (userId, search = '') => {
    let books = store.books.filter(b => b.user_id === userId)
    
    if (search) {
      const searchLower = search.toLowerCase()
      books = books.filter(b => 
        b.book_name.toLowerCase().includes(searchLower) ||
        (b.author && b.author.toLowerCase().includes(searchLower)) ||
        (b.genre && b.genre.toLowerCase().includes(searchLower))
      )
    }
    
    return books.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },
  
  createBook: (userId, bookData) => {
    const book = {
      id: store.nextBookId++,
      user_id: userId,
      book_name: bookData.book_name,
      author: bookData.author,
      genre: bookData.genre || null,
      description: bookData.description || null,
      cover_url: bookData.cover_url || null,
      created_at: new Date().toISOString()
    }
    store.books.push(book)
    return book
  },
  
  getBookById: (id, userId) => {
    return store.books.find(b => b.id === parseInt(id) && b.user_id === userId) || null
  },
  
  updateBook: (id, userId, bookData) => {
    const index = store.books.findIndex(b => b.id === parseInt(id) && b.user_id === userId)
    if (index === -1) return null
    
    store.books[index] = {
      ...store.books[index],
      book_name: bookData.book_name,
      author: bookData.author,
      genre: bookData.genre || null,
      description: bookData.description || null,
      cover_url: bookData.cover_url || null
    }
    return store.books[index]
  },
  
  deleteBook: (id, userId) => {
    const index = store.books.findIndex(b => b.id === parseInt(id) && b.user_id === userId)
    if (index === -1) return false
    
    store.books.splice(index, 1)
    return true
  }
}

export default db
