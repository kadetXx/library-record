
//get all selectors as variables
const bookForm = document.querySelector('#book-form');
const bookTitle = document.querySelector('.book-title');
const bookAuthor = document.querySelector('.book-author');
const bookIsbn = document.querySelector('.book-isbn');
const inputs = document.querySelectorAll('input[type = "text"]');
const submitButton = document.querySelector('.submit-button');
const tBody = document.querySelector('tbody');


//create book object 

class book {
  constructor(title, author, isbn) {
    this.title = title,
      this.author = author,
      this.isbn = isbn;
  };

  static create(x, y, z) {
    return new book(x, y, z);
  };
}

//create user interface object

class userInterface {

  //add book method
  static addBook() {

    //initialise new book
    const newBook = book.create(bookTitle.value, bookAuthor.value, bookIsbn.value);
    
    //create table row element
    const tr = document.createElement('tr');

    //create table data element
    const td = `<td>${newBook.title}</td>
                <td>${newBook.author}</td>
                <td>${newBook.isbn}</td>
                <td><a href = '#'>x</a></td>
    `
    //append td to tr
    tr.innerHTML = td;

    //append tr to table
    tBody.appendChild(tr);

    //call add to local storage method
    storage.addBookToStorage(newBook)

  };

  //clear input fields method
  static clearInput() {
    inputs.forEach(input => {
      input.value = '';
    });
  }

  //delete book method
  static deleteBook(target) {
    target.parentElement.parentElement.remove();
  };

  //show alert method
  static showAlert(textColor, bgColor, message) {
    //create the alert div
    const alertBox = document.createElement('div');
    //add class to div
    alertBox.className = 'alert-box'
    //set inner html of alert box
    alertBox.innerHTML = `<p class="alert-message">${message}</p>`
    //set value of background color
    alertBox.style.setProperty('--alert-background', bgColor);
    //set value of text color
    alertBox.style.setProperty('--alert-text-color', textColor);
    //append alertbox to alert container
    document.querySelector('.alert-container').appendChild(alertBox);
    //delete alert after 3secs
    setTimeout(() => {
      alertBox.remove();
    }, 2000);
  };

  //get all loacal storage items and append on reload

  static appendDataOnReload() {
    
    let dataToAppend = storage.getStorageData();

    dataToAppend.forEach(book => {

      //create table row element
      const tr = document.createElement('tr');

      //create table data element
      const td = `<td>${book.title}</td>
                 <td>${book.author}</td>
                 <td>${book.isbn}</td>
                 <td><a href = '#'>x</a></td>
     `
      //append td to tr
      tr.innerHTML = td;

      //append tr to table
      tBody.appendChild(tr);

    });
  };

};


//create local storage oject

class storage {

  //get books from local storage

  static getStorageData() {
    let storedBooks = JSON.parse(localStorage.getItem('storedBooks'));
    return storedBooks;
  };


  //add book to local storage method
  
  static addBookToStorage(whatToAdd) {
    
    //initialise new variable for storage data
    let newStoredBooks;

    //set variale values based on data gotten from ls
    if (storage.getStorageData() === null) {
      newStoredBooks = [];
    } else {
      newStoredBooks = storage.getStorageData();
    };

    newStoredBooks.push(whatToAdd);
    
    localStorage.setItem('storedBooks', JSON.stringify(newStoredBooks))

  };

  //delete from local storage method 

  static removeFromLs(isbnValue) {
    let booksAfterDelete = storage.getStorageData();

    booksAfterDelete.forEach( (book, index)=> {
      if (isbnValue === book.isbn) {
        booksAfterDelete.splice(index, 1);
      }
    });

    localStorage.setItem('storedBooks', JSON.stringify(booksAfterDelete));
  }

};


//event listener for add book

bookForm.addEventListener('submit', (e) => {

  if (inputs[0].value === '' || inputs[1].value === '' || inputs[2].value === '') {
    userInterface.showAlert('#A18533', '#FFF3CD', 'Please fill all fields correctly');

  } else if (isNaN(inputs[2].value)) {
    userInterface.showAlert('#A18533', '#FFF3CD', 'Incorrect ISBN, please check again');

  } else {
    //call the add book to UI method
    userInterface.addBook();

    //call the clear input method
    userInterface.clearInput();

    //call the show alert method
    userInterface.showAlert('#3E774B', '#D4EDDA', 'Book added');

  }

  e.preventDefault();

})


//event listener for delete book

tBody.addEventListener('click', (e) => {
  
  if (e.target.innerText === 'x') {
    
    //delete from UI
    userInterface.deleteBook(e.target);

    //delete from local storage
    storage.removeFromLs(e.target.parentElement.parentElement.children[2].innerText);

    //call the show alert method
    userInterface.showAlert('#A8686E', '#F8D7DA', 'Book Removed');

  };

  e.preventDefault();
})

//event listener for reload

document.addEventListener('DOMContentLoaded', () => {
  
  userInterface.appendDataOnReload();

})