import { model, Schema, models } from "mongoose"
import { Category } from "./Categories"

const ProductSchema = new Schema({
  title: {type: String, required: true},
  description: String,
  price: {type: Number, required: true},
  images: [{type: String}],
  category: {type:Schema.Types.ObjectId, ref:"Category", default:null},
  properties: {type:Object},
}, {
  timestamps: true,
});

ProductSchema.path("category").set((value) => {
  if(typeof value === 'string' && value === '') {
    return null
  }
  return value
})

export const Product = models.Product || model("Product", ProductSchema);