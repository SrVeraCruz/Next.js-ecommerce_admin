'use client'

import { useEffect, useState } from "react"
import Layout from "../../components/Layout"
import axios from "axios"


export default function Orders() {
  const [orders,setOrders] = useState([])

  const fetchOrders = async () => {
    await axios.get('/api/orders')
      .then(res => {setOrders(res.data)})
      .catch(err => {console.error(err.message)})
  }
  
  useEffect(() => {
    fetchOrders();
  }, [])

  console.log(orders)

  return (
    <div>
      <Layout>
        <table className="basic">
          <thead>
            <tr>
              <th>Date</th>
              <th>Paid</th>
              <th>Recepient</th>
              <th>Product</th>
            </tr>
          </thead>
          <tbody>
            {!orders.length && (
              <tr>
                <td>No orders</td>  
              </tr>
            )}
            {!!orders.length && orders.map(order => (
              <tr key={order._id}>
                <td>
                  {(new Date(order.createdAt)).toLocaleString()}
                </td>
                <td 
                  className={order.paid 
                  ? 'text-green-600' 
                  : 'text-red-600'}
                >
                  {order.paid ? 'YES' : 'NO'}
                </td>
                <td>
                  {order.name} <br /> 
                  {order.email} <br />
                  {order.city} {order.postalCode} {order.country} <br />
                  {order.streetAddress}
                </td>
                <td>
                  {order.line_items.map((item,key) => (
                    <div key={key}>
                      {item.price_data.product_data.name} X
                      {item.quantity}
                    </div>  
                  ))}
                </td>
              </tr>  
            ))}
          </tbody>
        </table>
      </Layout>
    </div>  
  )
}