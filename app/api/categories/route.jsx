import { NextResponse } from "next/server"
import { mongooseConnect } from "../../../lib/mongoose"
import { Category } from "../../../models/Categories"
import { isAdminRequest } from "../auth/[...nextauth]/route"

export async function POST(req) {
  const data = await req.json()
  const { name, parentCategory, properties } = data

  await mongooseConnect();
  // await isAdminRequest();

  const categoryDoc = await Category.create({
    name,
    parent:parentCategory,
    properties,
  })

  return NextResponse.json(categoryDoc)
}

export async function GET(req) {
  await mongooseConnect();
  // await isAdminRequest();

  const categoryDoc = await Category.find().populate("parent");

  return NextResponse.json(categoryDoc)
}

export async function PUT(req) {
  await mongooseConnect();
  // await isAdminRequest();

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
  await mongooseConnect();
  // await isAdminRequest();

  const url = new URL(req.url)
  const _id = url.searchParams.get("id")

  if(_id && _id != "") {
    await Category.deleteOne({_id})
  }
  
  return NextResponse.json(200)
}