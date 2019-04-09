const mainSection = document.getElementById('main');
const bookTitle = document.getElementById('bookTitle');
const button = document.getElementById('searchButton');
let query = '';

button.addEventListener('click', fetchBooks);

function fetchBooks() {
  if (mainSection.childElementCount > 0) {
    mainSection.removeChild(mainSection.childNodes[0]);
  }
  query = bookTitle.value;
  fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${query}&filter=partial`)
    .then(res => res.json())
    .then(data => {
      const books = data.items;
      const content = document.createElement('div');
      content.classList.add('content');
      mainSection.appendChild(content);
      return books.map(book => {
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
        content.appendChild(bookCard);
        bookCard.appendChild(img);
        bookCard.appendChild(bookText);
        bookText.appendChild(h3);
        bookText.appendChild(p);
      })
    });
}