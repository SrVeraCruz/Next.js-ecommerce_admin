"use client"

import { useEffect, useState } from "react";
import Layout from "../../../../components/Layout"
import { redirect } from "next/navigation";
import axios from "axios";

export default function DeleteProductPage({params}) {
  const {productId} = params;
  const [productInfo,setProductInfo] = useState()
  const [cancelDelete,setCancelDelete] = useState(false)

  useEffect(()=> {
    if(!productId) {
      return
    }
    axios.get("/api/products?id="+productId)
      .then(res => {setProductInfo(res.data)})
      .catch(err => {console.error(err.message)})
  }, [])

  const deleteProduct = async () => {
    await axios.delete("/api/products?id="+productId)
      .then(res => {console.log(res.data)})
      .catch(err => {console.error(err.message)})
      setCancelDelete(true)
  }

  if(cancelDelete) {
    redirect("/products")
  }

  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to delete product: &nbsp;"{productInfo?.title}"
      </h1>
      <div className="flex gap-2 justify-center">
        <button 
          className="btn-primary" 
          onClick={()=>setCancelDelete(true)}>
          No
        </button>
        <button 
          className="btn-red" 
          onClick={deleteProduct}>
          Yes
        </button>
      </div>
    </Layout>
  )
}