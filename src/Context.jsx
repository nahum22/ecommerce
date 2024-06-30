import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import firebase from "firebase/compat/app";
import "firebase/compat/database"; // Ensure the database is imported

const url = "https://6666aa30a2f8516ff7a44b9d.mockapi.io/Products";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ProductsData, setProductsData] = useState([]);

  // Fetching the Products from mock API

  // Adding Product to API
  const handleAddProduct = async (Product) => {
    setLoading(true);
    try {
      const response = await axios.post(url, Product);
      toast.success("Successfully created!", {
        position: "top-center",
      });
      //  setProductsData(response.data);
    } catch (error) {
      setError(error.message);
      toast.error(error.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (itemId, updatedValues) => {
    try {
      const dbRef = firebase.database().ref("products");
      const itemRef = dbRef.child(itemId);

      await itemRef.update(updatedValues);
      console.log("Item updated successfully");
      // Optionally, refresh the products list after updating
      fetchProducts();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Delete Product to API
  const handleDelete = async (itemId) => {
    try {
      const dbRef = firebase.database().ref("products");
      const itemRef = dbRef.child(itemId);

      await itemRef.remove();
      console.log("Item removed successfully");
      // Optionally, refresh the products list after deletion
      //  fetchProducts();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Create ID for Product based on last ID
  const createProductId = () => {
    const ProductIds = ProductsData.map((Product) => Product.id);
    ProductIds.sort((a, b) => a - b);
    const lastId = parseInt(ProductIds[ProductIds.length - 1]);
    return lastId + 1;
  };

  // Adding a new Product to the data
  const addProduct = (Product) => {
    const newProduct = {
      id: createProductId(),
      ...Product,
    };
    handleAddProduct(newProduct);
  };

  return (
    <AppContext.Provider
      value={{
        ProductsData,
        error,
        loading,
        addProduct,
        handleAddProduct,
        handleUpdate,
        handleDelete,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
