import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function BookHero() {
  const books = [
    {
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://m.media-amazon.com/images/I/817HaeblezL._SY425_.jpg"
    },
    {
      title: "Ikigai",
      author: "Héctor García and Francesc Miralles",
      cover: "https://m.media-amazon.com/images/I/41k8aHbVSBL._SY445_SX342_FMwebp_.jpg"
    },
    {
      title: "The Almanack of Naval Ravikant",
      author: "Eric Jorgenson",
      cover: "https://m.media-amazon.com/images/I/31PP4h6lu4L._SY445_SX342_FMwebp_.jpg"
    }
  ];

  return (
    <div className="bg-light d-flex align-items-center" style={{height:"80vh", background:"#484f52" }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <h1
  className="fw-bold mb-4"
  style={{
    fontSize: "64px",
    fontFamily: "Playfair Display, serif",
    color: "#52575c",
    lineHeight: "1.1"
  }}
>
  Find Your <br /> Next Book
</h1>

<p
  style={{
    fontSize: "18px",
    color: "#6c757d",
    fontFamily: "Poppins, sans-serif"
  }}
>
  Discover a world where every page brings a new adventure.<br />
  At Paper Haven, we curate a diverse collection of books.
</p>
            <button className="btn px-4 py-2 fw-semibold"
style={{background:"#FEFF86",borderRadius:"8px"}}>
Explore Now →
</button>
          </div>
          
          <div className="col-lg-7">
            <div className="row g-4 justify-content-center">
              {books.map((book, index) => (
                <div key={index} className="col-md-4 text-center">
                  <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                       style={{width: '280px', height: '280px', padding: '40px'}}>
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      className="img-fluid"
                      style={{maxHeight: '200px', objectFit: 'contain'}}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="d-flex justify-content-center gap-2 mt-4">
              <span className="rounded-circle bg-warning" style={{width: '10px', height: '10px'}}></span>
              <span className="rounded-circle bg-secondary opacity-25" style={{width: '10px', height: '10px'}}></span>
              <span className="rounded-circle bg-secondary opacity-25" style={{width: '10px', height: '10px'}}></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}