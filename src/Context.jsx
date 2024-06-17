import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const url = "https://6666aa30a2f8516ff7a44b9d.mockapi.io/Products";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ProductsData, setProductsData] = useState([]);

  // Fetching the Products from mock API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setProductsData(response.data);
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

  useEffect(() => {
    fetchProducts();
  }, []);

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

  // Update Product to API
  const handleUpdateProduct = async (Product) => {
    setLoading(true);
    try {
      await axios.put(`${url}/${Product.id}`, Product);
      await fetchProducts();
      toast.success("Successfully updated!", {
        position: "top-center",
      });
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

  // Delete Product to API
  const handleDeleteProduct = async (Product) => {
    setLoading(true);
    try {
      await axios.delete(`${url}/${Product.id}`);
      await fetchProducts();
      toast.success("Successfully deleated Product!", {
        position: "top-center",
      });
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

  // Updating Product, need to check
  const updateProduct = (Product) => {
    updateProduct(Product);
  };

  // Remove Product
  const removeProduct = (Product) => {
    handleDeleteProduct(Product);
  };

  return (
    <AppContext.Provider
      value={{
        ProductsData,
        error,
        loading,
        addProduct,
        updateProduct,
        removeProduct,
        handleAddProduct,
        handleUpdateProduct,
        handleDeleteProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
