import theGreatGatsbyFrontImage from '../Assets/The-Great-Gatsby-1.jpg';
import theGreatGatsbyBackImage from '../Assets/The-Great-Gatsby-2.jpg';

const booksData = [
  {
    id: 1,
    name: "The Great Gatsby",
    isbn: "9780743273565",
    author: "F. Scott Fitzgerald",
    publishDate: "1925-04-10",
    image: [theGreatGatsbyFrontImage, theGreatGatsbyBackImage],
    quantity: 333,
    price: 500
  },
  {
    id: 2,
    name: "To Kill a Mockingbird",
    isbn: "9780061120084",
    author: "Harper Lee",
    publishDate: "1960-07-11",
    image: "https://m.media-amazon.com/images/I/51f2QjC6Z+L.jpg",
    quantity: 999,
    price: 600
  },
  {
    id: 3,
    name: "1984",
    isbn: "9780451524935",
    author: "George Orwell",
    publishDate: "1949-06-08",
    image: "https://m.media-amazon.com/images/I/51y5I6PZWbL.jpg",
    quantity: 7,
    price: 550
  },
  {
    id: 4,
    name: "Pride and Prejudice",
    isbn: "9781503290563",
    author: "Jane Austen",
    publishDate: "1813-01-28",
    image: "https://m.media-amazon.com/images/I/51jNORv6nQL.jpg",
    quantity: 4,
    price: 400
  },
  {
    id: 5,
    name: "The Catcher in the Rye",
    isbn: "9780316769488",
    author: "J.D. Salinger",
    publishDate: "1951-07-16",
    image: "https://m.media-amazon.com/images/I/51FI2c1J9+L.jpg",
    quantity: 6,
    price: 650
  },
  {
    id: 6,
    name: "The Hobbit",
    isbn: "9780547928227",
    author: "J.R.R. Tolkien",
    publishDate: "1937-09-21",
    image: "https://m.media-amazon.com/images/I/41bWcT4qgLL.jpg",
    quantity: 8,
    price: 700
  },
  {
    id: 7,
    name: "Fahrenheit 451",
    isbn: "9781451673319",
    author: "Ray Bradbury",
    publishDate: "1953-10-19",
    image: "https://m.media-amazon.com/images/I/41W6N2Q+x+L.jpg",
    quantity: 2,
    price: 500
  },
  {
    id: 8,
    name: "Jane Eyre",
    isbn: "9780141441146",
    author: "Charlotte Brontë",
    publishDate: "1847-10-16",
    image: "https://m.media-amazon.com/images/I/41nlFA5ZnDL.jpg",
    quantity: 9,
    price: 450
  },
  {
    id: 9,
    name: "Moby-Dick",
    isbn: "9781503280786",
    author: "Herman Melville",
    publishDate: "1851-11-14",
    image: "https://m.media-amazon.com/images/I/51x1Sx0X4jL.jpg",
    quantity: 1,
    price: 600
  },
  {
    id: 10,
    name: "War and Peace",
    isbn: "9781420959715",
    author: "Leo Tolstoy",
    publishDate: "1869-01-01",
    image: "https://m.media-amazon.com/images/I/41+eK8zBwQL.jpg",
    quantity: 4,
    price: 900
  },
  {
    id: 11,
    name: "The Alchemist",
    isbn: "9780061122415",
    author: "Paulo Coelho",
    publishDate: "1988-04-01",
    image: "https://m.media-amazon.com/images/I/51Z0nLAfLmL.jpg",
    quantity: 10,
    price: 800
  },
  {
    id: 12,
    name: "The Book Thief",
    isbn: "9780375842207",
    author: "Markus Zusak",
    publishDate: "2005-03-14",
    image: "https://m.media-amazon.com/images/I/51gZrM9CypL.jpg",
    quantity: 6,
    price: 700
  },
  {
    id: 13,
    name: "Brave New World",
    isbn: "9780060850524",
    author: "Aldous Huxley",
    publishDate: "1932-08-01",
    image: "https://m.media-amazon.com/images/I/41A5Z8i6QnL.jpg",
    quantity: 5,
    price: 650
  },
  {
    id: 14,
    name: "The Road",
    isbn: "9780307387899",
    author: "Cormac McCarthy",
    publishDate: "2006-09-26",
    image: "https://m.media-amazon.com/images/I/51NUznb5diL.jpg",
    quantity: 7,
    price: 500
  },
  {
    id: 15,
    name: "The Kite Runner",
    isbn: "9781594631931",
    author: "Khaled Hosseini",
    publishDate: "2003-05-29",
    image: "https://m.media-amazon.com/images/I/51iZy-QZ+kL.jpg",
    quantity: 8,
    price: 600
  },
  {
    id: 16,
    name: "Life of Pi",
    isbn: "9780156027328",
    author: "Yann Martel",
    publishDate: "2001-09-11",
    image: "https://m.media-amazon.com/images/I/51vKI+9WnCL.jpg",
    quantity: 9,
    price: 550
  },
  {
    id: 17,
    name: "The Picture of Dorian Gray",
    isbn: "9780141442464",
    author: "Oscar Wilde",
    publishDate: "1890-06-20",
    image: "https://m.media-amazon.com/images/I/51T7k4FST4L.jpg",
    quantity: 4,
    price: 450
  },
  {
    id: 18,
    name: "The Da Vinci Code",
    isbn: "9780307474278",
    author: "Dan Brown",
    publishDate: "2003-03-18",
    image: "https://m.media-amazon.com/images/I/51-3ZKnVCwL.jpg",
    quantity: 6,
    price: 750
  },
  {
    id: 19,
    name: "The Shining",
    isbn: "9780307743657",
    author: "Stephen King",
    publishDate: "1977-01-28",
    image: "https://m.media-amazon.com/images/I/51qYsngMA5L.jpg",
    quantity: 5,
    price: 700
  },
  {
    id: 20,
    name: "The Hunger Games",
    isbn: "9780439023481",
    author: "Suzanne Collins",
    publishDate: "2008-09-14",
    image: "https://m.media-amazon.com/images/I/41-9myIbvLL.jpg",
    quantity: 8,
    price: 650
  }
];

export default booksData;