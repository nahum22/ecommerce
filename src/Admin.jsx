import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";
import "firebase/compat/auth"; // Ensure auth is imported
import "./firebase_setup/firebase.js";
import { useGlobalContext } from "./Context";
import "./styles/admin.css";

const Admin = () => {
  const { handleDelete, handleUpdate } = useGlobalContext();
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const dbRef = firebase.database().ref("products");
    dbRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const dataArray = Object.entries(data || {}).map(([key, value]) => ({
        id: key,
        ...value,
      }));

      setProducts(dataArray);
    });

    // Cleanup function to disconnect listener when the component unmounts
    return () => dbRef.off("value");
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      alert("Please sign in to add or update products");
      return;
    }

    try {
      const dbRef = firebase.database().ref("products");
      let imageUrl = "";

      if (image) {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`images/${image.name}`);
        await imageRef.put(image);
        imageUrl = await imageRef.getDownloadURL();
      }

      if (isEditing) {
        await dbRef.child(editProductId).update({
          categoryId,
          categoryName,
          name,
          imageUrl,
        });
        alert("Product updated successfully");
      } else {
        const newProductRef = dbRef.push();
        await newProductRef.set({
          categoryId,
          categoryName,
          name,
          imageUrl,
        });
        alert("Product added successfully");
      }
      // Reset form fields and editing state
      setCategoryId("");
      setCategoryName("");
      setName("");
      setImage(null);
      setIsEditing(false);
      setEditProductId(null);
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Failed to submit product. Please try again later.");
    }
  };

  const handleEdit = (product) => {
    setCategoryId(product.categoryId);
    setCategoryName(product.categoryName);
    setName(product.name);
    setEditProductId(product.id);
    setIsEditing(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageDelete = async (product) => {
    if (product.imageUrl) {
      const storageRef = firebase.storage().refFromURL(product.imageUrl);
      await storageRef.delete();
      await firebase.database().ref(`products/${product.id}/imageUrl`).remove();
    }
  };

  return (
    <>
      <div className="adminInterface">
        <div>Admin</div>
        <div>
          {user ? (
            <>
              <p>Welcome, {user.displayName}</p>
              <button onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <button onClick={handleGoogleSignIn}>Sign In with Google</button>
          )}
        </div>
        <div>{isEditing ? "Edit Product" : "Add New Product"}</div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="categoryId">Category ID:</label>
          <input
            type="text"
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
          <br />
          <br />
          <label htmlFor="categoryName">Category Name:</label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <br />
          <br />
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
          />
          <br />
          <button type="submit">{isEditing ? "Update" : "Submit"}</button>
        </form>
        <div>
          <h2>Products List</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                Category ID: {product.categoryId}, Category Name:{" "}
                {product.categoryName}, Name: {product.name}
                {product.imageUrl && (
                  <div>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      width="100"
                    />
                    <button onClick={() => handleImageDelete(product)}>
                      Delete Image
                    </button>
                  </div>
                )}
                <button onClick={() => handleDelete(product.id)}>Delete</button>
                <button onClick={() => handleEdit(product)}>Edit</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Admin;
