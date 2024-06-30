import "./App.css";
import FirstNavbar from "./FirstNavbar";
import Footer from "./Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CarouselPage from "./CarouselPage";
import React, { useEffect, useState } from "react";

const LandingPage = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "products")); // Replace "your_collection" with your actual collection name
  
        const dataList = [];
        querySnapshot.forEach((doc) => {
          dataList.push({ id: doc.id, ...doc.data() }); // Assuming you want to keep document IDs
        });
        console.log(dataList);
        setData(dataList);
      };
      fetchData();
    }, []);




  return (
    <>
      <FirstNavbar />
      <main className="content">
        <CarouselPage />
        <h2>Data from Firestore:</h2>
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {/* Display item properties here */}
              ID: {item.id}, Name: {item.name}{" "}
              {/* Replace 'name' with actual property names */}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
