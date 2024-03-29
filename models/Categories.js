import { models, Schema, model } from "mongoose"

const CategoryShema = new Schema({
  name: {type: String, required: true},
  parent: {type: Schema.Types.ObjectId, ref: "Category", default: null},
  properties: [{type: Object}],
},{
  timestamps: true,
})

CategoryShema.path('parent').set((value) => {
  if(typeof value === 'string' && value === '') {
    return null
  }

  return value
})

export const Category = models.Category || model("Category",CategoryShema);