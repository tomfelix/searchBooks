const mainSection = document.getElementById('main');
const bookTitle = document.getElementById('bookTitle');
const button = document.getElementById('searchButton');
const content = document.querySelector('.content');
let query = '';
let library = [];
let startIndex = 0;

button.addEventListener('click', fetchBooks);
bookTitle.addEventListener('change', handleBookTitleChange);

function handleBookTitleChange() {
  if (query !== bookTitle.value) {
    startIndex = 0;
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

content.addEventListener('scroll', () => {
  if (startIndex <= 20) {
    if (content.scrollTop + content.clientHeight >= content.scrollHeight) {
      startIndex += 10;
      fetchBooks();
    }
  }
});

function resetResults() {
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  library = [];
  query = bookTitle.value;
  startIndex = 0;
}

function fetchBooks() {
  if (startIndex > 0) {
    button.disabled = true;
  } else {
    button.disabled = false;
  }
  if (startIndex > 30 || (startIndex === 0 && query === bookTitle.value)) {
    return;
  }
  if (startIndex === 0 || query !== bookTitle.value) {
    resetResults();
  }
  query = bookTitle.value;
  fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${query}&filter=partial&maxResults=10&startIndex=${startIndex}`)
    .then(res => res.json())
    .then(data => {
      const books = data.items ? data.items : [];
      books.map(book => library.push(book));
    })
    .then(() => displayBooks(library))
}

function displayBooks(library) {
  let slicedLibrary = library.slice(startIndex);
  return slicedLibrary.map(book => {
    let bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    let bookText = document.createElement('div');
    bookText.classList.add('book-text');
    let img = document.createElement('img');
    img.classList.add('book-card-img');
    let h3 = document.createElement('h3');
    h3.classList.add('book-card-title');
    let p = document.createElement('p');

    img.src = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';
    h3.innerHTML = book.volumeInfo.title ? book.volumeInfo.title : '';
    if (!book.volumeInfo.description) {
      p.innerHTML = ''
    } else if (book.volumeInfo.description && book.volumeInfo.description.length > 75) {
      p.innerHTML = `${book.volumeInfo.description.substring(0, 75)}...`;
    } else {
      p.innerHTML = book.volumeInfo.description;
    }
    bookCard.appendChild(img);
    bookCard.appendChild(bookText);
    bookText.appendChild(h3);
    bookText.appendChild(p);
    return content.appendChild(bookCard);
  })
}