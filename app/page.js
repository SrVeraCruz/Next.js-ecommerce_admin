"use client"
import { useSession } from "next-auth/react"
import Layout from "../components/Layout"

export default function Home() {
  const { data:session } = useSession();

  return(
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex text-black bg-gray-300 gap-1 items-center rounded-lg overflow-hidden" >
          <img src={session?.user?.image} alt={session?.user?.name} className="w-6 h-6" />
          <span className="px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>
    </Layout>  
  )
}
