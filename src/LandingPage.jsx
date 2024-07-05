import "./App.css";
import FirstNavbar from "./FirstNavbar";
import Footer from "./Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CarouselPage from "./CarouselPage";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "./Context";

const LandingPage = () => {
  const [data, setData] = useState([]);
  const { products, categories } = useGlobalContext();
  console.log(products);

  return (
    <>
      <FirstNavbar />
      <main className="content">
        <CarouselPage />
        <h2>Data from Firestore:</h2>

        <div className="productsContainer">
          {products.map((item) => (
            <div className="productCard" key={item.id}>
              {/* Display item properties here */}

              {item.name}
              <img src={item.imageUrl} />
              {/* Replace 'name' with actual property names */}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
