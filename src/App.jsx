import "./App.css";
import FirstNavbar from "./FirstNavbar";
import Footer from "./Footer";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Correct imports for Firestore
import { db } from "./firebase_setup/firebase"; // Ensure this path is correct
import CarouselPage from "./CarouselPage";

function App() {
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

  // Log data after setting it to see the fetched data

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
}

export default App;
