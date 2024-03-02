"use client"

import Layout from "../../../components/Layout";
import { useState } from "react";
import axios from "axios";

export default function NewProducts() {
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [price,setPrice] = useState("");

  const createProduct = async(e) => {
    e.preventDefault();
    const data = {title,description,price};
    try{
      await axios.post('/api/products', data);
    } catch (error) {
      console.log(error.response.data)
    }
  }

  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>
          New product
        </h1>
        <label>Products name:</label>
        <input 
          type="text" 
          placeholder="products name"
          value={title}
          onChange={e=> setTitle(e.target.value)}
        />
        <label>Description:</label>
        <textarea 
          placeholder="description"
          value={description}
          onChange={e=> setDescription(e.target.value)}
        />
        <label>Price:</label>
        <input 
          type="number" 
          placeholder="price"
          value={price}
          onChange={e=> setPrice(e.target.value)}
        />
        <button type="submit" className="btn-primary">Save</button>
      </form>
    </Layout>
  )
}