"use client"

import { useEffect, useState } from "react"
import Layout from "../../components/Layout"
import axios from "axios"
import Swal from "sweetalert2"

export default function Categories() {
  const [editedCategory,setEditedCategory] = useState(null)
  const [name,setName] = useState("")
  const [parentCategory,setParentCategory] =useState("")
  const [categoryInfo,setCategoryInfo] = useState()
  const [properties,setProperties] = useState([])

  useEffect(() => {
    fetchCategories();
  }, [])


  const fetchCategories = async () => {
    axios.get("/api/categories")
      .then((res) => {setCategoryInfo(res.data)})
      .catch((err) => {console.error(err.message)})
  }

  const saveCategory = async (e) => {
    e.preventDefault()
    const data = {
      name,
      parentCategory:parentCategory || '',
      properties:properties.map((property) => ({
        name:property.name, 
        values:property.values.split(",") || property.values
      }))
    }
    if(editedCategory) {
      //update category
      await axios.put("/api/categories", 
        {...data, _id:editedCategory._id})
          .then((res) => {/*console.log(res.data)*/})
          .catch((err) => console.error(err.data))
        setEditedCategory(null)
    } else {
      //create category
      await axios.post("/api/categories", data)
        .then((res) => {setCategoryInfo(
          (oldCategories) => [...oldCategories,res.data])
        })
        .catch((err) => {console.error(err.message)})
    }
    setName("")
    setParentCategory("")
    setProperties([])
    fetchCategories()
  }

  const editCategory = (category) => {
    setEditedCategory(category)

    setName(category?.name)
    if(category && category?.parent) {
      setParentCategory(category?.parent?._id)
    } else {
      setParentCategory('')
    }

    if(category && category?.properties) {
      setProperties(
        category?.properties.map(({name,values}) => ({
          name,
          values:values.join(",")
        }))
      )
    }
  }
  
  const deleteCategory = (category) => {
    console.log(category)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete("/api/categories?id="+category._id)
          .then((res) => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            fetchCategories();
          })
          .catch((err) => {console.error(err.message)})
      }
    });
  }

  const addProperty = () => {
    setProperties((prev) => {
      return [...prev, {name: '',values: ''}]
    })
  }

  const handlePropertyNewName = (index,newName) => {
    setProperties((prev) => {
      const properties = [...prev]
      properties[index].name = newName;
      return properties
    })
  }

  const handlePropertyNewValue = (index,newValue) => {
    setProperties((prev) => {
      const properties = [...prev]
      properties[index].values = newValue;
      return properties
    })
  }

  const handleDeleteProperty = (indexToRemove) => {
    setProperties((prev) => {
      return [...prev].filter((property,propIndex) => {
        return propIndex !== indexToRemove;
      })
    })
  }

  const handleCancelEditProperty = (category) => {
    setEditedCategory(category)
    setName('')
    setParentCategory('')
    setProperties([])
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory 
          ? `Edite category ${editedCategory.name}`
          : "New category name"
        }    
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1 mb-2">
          <input 
            className="mb-0"
            type="text" 
            placeholder="Category name"
            required
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
          <select 
            className="mb-0"
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value=''>No parent category</option>
            {categoryInfo && categoryInfo.map((category) => (
              <option 
                key={category._id} 
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label>Properties</label>
          <button 
            type="button"
            className="btn-default block text-sm mb-2"
            onClick={addProperty}
          >
            Add new property
          </button>
          {!!properties.length && properties.map((property,index) => (
            <div className="flex gap-1 mb-1.5" key={index}>
              <input 
                className="mb-0"
                type="text" 
                placeholder="new Property: Ex:(color)" 
                value={property.name}
                onChange={(e) => handlePropertyNewName(index,e.target.value)}
              />
              <input 
                className="mb-0"
                type="text" 
                placeholder="value: Ex:(silver)" 
                value={property.values} 
                onChange={(e) => handlePropertyNewValue(index,e.target.value)}
              />
              <button 
                type="button"
                className="btn-default"
                onClick={()=> handleDeleteProperty(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>
          {editedCategory && (
            <button
              type="button"
              className="btn-default mr-1"
              onClick={() => handleCancelEditProperty()}
            >
              Cancel
            </button>           
          )}
        <button type="submit" className="btn-primary py-0">Save</button>
      </form>
      {!editedCategory && (     
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>
                Category name
              </td>
              <td>
                Parent Category
              </td>
              <td>

              </td>
            </tr>
          </thead>
          <tbody>
            {categoryInfo && categoryInfo.map((category) => (
              <tr key={category._id}>
                <td>
                  {category?.name}
                </td>
                <td>
                  {category?.parent?.name}
                </td>
                <td className="flex flex-nowrap gap-1">
                  <button onClick={() => editCategory(category)} 
                    className="btn-primary"
                  >
                    Edite
                  </button>
                  <button 
                    onClick={() => deleteCategory(category)}
                    className="btn-red"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </td>
              </tr>  
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  )
}