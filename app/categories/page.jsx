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
                className="btn-red"
                onClick={()=> handleDeleteProperty(index)}
              >
                Remove
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
                    className="btn-default"
                  >
                    Edite
                  </button>
                  <button 
                    onClick={() => deleteCategory(category)}
                    className="btn-red"
                  >
                    Delete
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