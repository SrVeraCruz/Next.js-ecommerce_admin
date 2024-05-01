import { NextResponse } from "next/server";
import { Product } from "../../../models/Products";
import { mongooseConnect } from "../../../lib/mongoose";
import { isAdminRequest } from "../auth/[...nextauth]/route";

export async function POST(req) {
  await mongooseConnect();
  // await isAdminRequest();
  
  const data = await req.json();
  const {
    title,
    description,
    price,
    images,
    category,
    properties,
  } = data;

  const productDoc = await Product.create({
    title,
    description,
    price,
    images,
    category,
    properties,
  })

  return NextResponse.json(productDoc)
}

export async function GET(req) {
  await mongooseConnect();
  // await isAdminRequest();

  const url = new URL(req.url);
  const id = url.searchParams.get("id")

  if(id && (id != "")) {
    const productDoc = await Product.findOne({_id:id}).populate("category")
    return NextResponse.json(productDoc)
  } else {
    const productDoc = await Product.find().populate("category");
    return NextResponse.json(productDoc)
  }
}

export async function PUT(req) {
  await mongooseConnect();
  // await isAdminRequest();

  const data = await req.json();
  const {
    title,
    description,
    price,
    images,
    category,
    properties,
    _id,
  } = data;
  
  await Product.updateOne(
    {_id}, 
    {
      title,
      description,
      price,
      images,
      category,
      properties,
    }
  )

  return NextResponse.json(true)
}

export async function DELETE(req) {
  
  const url = new URL(req.url);
  const id = url.searchParams.get("id")
  
  if(id && (id != "")){
    await mongooseConnect();
    // await isAdminRequest();
    await Product.deleteOne({_id:id})
  }
  return NextResponse.json(true)
}