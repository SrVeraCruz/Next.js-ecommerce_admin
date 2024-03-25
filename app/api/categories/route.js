import { NextResponse } from "next/server"
import { mongooseConnect } from "../../../lib/mongoose"
import { Category } from "../../../models/Categories"

export async function POST(req) {
  const data = await req.json()
  const { name, parentCategory, properties } = data

  mongooseConnect();

  const categoryDoc = await Category.create({
    name,
    parent:parentCategory,
    properties,
  })

  return NextResponse.json(categoryDoc)
}

export async function GET(req) {
  mongooseConnect();

  const categoryDoc = await Category.find().populate("parent");

  return NextResponse.json(categoryDoc)
}

export async function PUT(req) {
  mongooseConnect();

  const data = await req.json()
  const { name, parentCategory, properties, _id } = data

  await Category.updateOne(
    {_id}, 
    {
      name,
      parent:parentCategory,
      properties,
    }
  )
  
  return NextResponse.json(200)
}

export async function DELETE(req) {
  mongooseConnect();

  const url = new URL(req.url)
  const _id = url.searchParams.get("id")

  if(_id && _id != "") {
    await Category.deleteOne({_id})
  }
  
  return NextResponse.json(200)
}