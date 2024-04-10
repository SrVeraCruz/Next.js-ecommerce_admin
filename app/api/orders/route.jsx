import { NextResponse } from 'next/server'
import { mongooseConnect } from "../../../lib/mongoose"
import { Order } from '../../../models/Orders'

export async function GET(req) {
  await mongooseConnect()
  const OrdersInfos = await Order.find().sort({createdAt:-1})

  return NextResponse.json(OrdersInfos)
}