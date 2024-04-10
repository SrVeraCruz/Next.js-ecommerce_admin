"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import Spinner from "./Spinner"
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title:existingTitle,
  description:existingDescription,
  price:existingPrice,
  images:existingImages,
  category:existingCategory,
  properties:existingProperties,
}){
  const [title,setTitle] = useState(existingTitle || "");
  const [description,setDescription] = useState(existingDescription || "");
  const [price,setPrice] = useState(existingPrice || "");
  const [images,setImages] = useState(existingImages || []);
  const [categoryInfo,setCategoryInfo] = useState(existingCategory || '');
  const [productProperties,setProductProperties] = useState(existingProperties || {});
  const [goToProducts,setGoToProducts] = useState(false);
  const [isUploading,setIsUploading] = useState(false);
  const [categories,setCategories] = useState([]);

  console.log(productProperties)

  useEffect(() => {
    axios.get("/api/categories")
    .then((res) => {
      setCategories(res.data)
    })
    .catch((err) => {console.error(err.message)})
  }, []);

  const saveProduct = async(e) => {
    e.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category:categoryInfo,
      properties:productProperties,
    };
    if(_id){
      //update product
      await axios.put("/api/products", {...data,_id})
        .then((res) => {/*console.log(res.data)*/})
        .catch((err) => {console.error(err.message)})
    } else {
      //create product
      await axios.post('/api/products', data)
        .then((res) => {/*console.log(res.data)*/})
        .catch((err) => {console.error(err.message)})
    }
    setGoToProducts(true);
  }
  
  if(goToProducts) {
    redirect("/products");
  }

  const uploadImages = async (e) => {
    setIsUploading(true);
    const files = e.target?.files
    if(files?.length > 0) {
      const data = new FormData()
      for(const file of files) {
        data.append("file", file)
      }
      data.append("upload_preset", "my-uploads")

      await axios.post("https://api.cloudinary.com/v1_1/dbfaih2du/image/upload", data)
        .then(res => {
          setImages((oldImages) => [...oldImages, res.data.secure_url])
        })
        .catch(err => {console.error(err.message)})
    }
    setIsUploading(false);
  }

  const updateImageOrders = (images) => {
    setImages(images)
  }

  const propertiesToFill = []
  if(categories.length && categoryInfo) {
    let catInfo = categories.find(
      ({_id}) => _id === categoryInfo)
    
    propertiesToFill.push(...catInfo?.properties || categoryInfo?.properties)
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({_id}) => _id === catInfo?.parent?._id
      )
      propertiesToFill.push(...parentCat?.properties)
      catInfo = parentCat
    }
  }

  const setProdProp = (propName,value) => {
    setProductProperties((prev) => {
      const newProductProps = {...prev}
      newProductProps[propName] = value
      return newProductProps
    })
  }

  return (
    <form onSubmit={saveProduct}>
      <h1>
        {existingTitle 
          ? "Edit product" 
          : "New product"
        }
      </h1>
      <label>Products name:</label>
      <input 
        type="text" 
        placeholder="products name"
        value={title}
        onChange={e=> setTitle(e.target.value)}
      />
      <label>Category</label>
      <select 
        value={categoryInfo?._id}
        onChange={(e) => setCategoryInfo(e.target.value)}
      >
        <option value="">Uncategorized</option>
        {categories && categories.map((category) => (
          <option 
            key={category._id}
            value={category._id}
          >
            {category.name}
          </option>  
        ))}
      </select>
      {!!propertiesToFill.length && 
        propertiesToFill.map((property,index) => (
          <div key={index} className="flex gap-1 mb-1.5">
            <div className="w-full">
              <label className="capitalize">
                {property.name}
              </label>
              <select 
                value={productProperties[property.name]}
                onChange={(e) => setProdProp(property.name,e.target.value)}
              >
                {property.values.map(value => (
                  <option 
                    key={value}
                    value={value}
                  >
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>  
        )
      )}
      <label>Photos:</label>
      <div className="flex flex-wrap gap-1 mb-2">
        <ReactSortable 
          className="flex flex-wrap gap-1" 
          list={images} setList={updateImageOrders}
        >
          {!!images.length && images.map((link) => (
            <div key={link} className="h-24 flex rounded-sm bg-white p-4 border border-gray-200 shadow-sm">
              <img className="object-cover rounded-lg" src={link} alt={title}/>
            </div>
          ))}
        </ReactSortable>
        {isUploading &&
          <div className="flex justify-center items-center w-20 h-24 rounded-sm bg-white p-4 border border-gray-200 shadow-sm">
            <Spinner/>
          </div>
        }
        <label className="w-24 h-24 text-center flex justify-center items-center text-sm gap-1 text-primary bg-white border border-primary shadow-sm rounded-sm cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            Upload
          </div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
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
  )
}