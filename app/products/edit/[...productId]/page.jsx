"use client"

import { useEffect, useState } from "react"
import Layout from "../../../../components/Layout"
import axios from "axios";
import ProductForm from "../../../../components/ProductForm"

export default function EditProductPage({ params }) {
  const { productId } = params;
  const [productInfo,setProductInfo] = useState();

  useEffect(() => {
    if (!productId) {
      return
    }

    axios.get("/api/products?id="+productId)
      .then(res => {setProductInfo(res.data)})
      .catch(err => {console.error(err.message)})
  }, [productId])

  return(
    <Layout>
      {productInfo && (
        <ProductForm {...productInfo} />
      )}
    </Layout>
  )
}