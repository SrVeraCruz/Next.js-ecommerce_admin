'use client'

import { useSession, signIn } from "next-auth/react"
import Nav from "../components/Nav.js"
import { useState } from "react"
import Logo from "./Logo.js"

export default function Layout({children}) {
  const [showNav,setShowNav] = useState(false)
  const { data: session } = useSession()

  if(!session) {
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center">
        <div className="text-center w-full text-primary">
          <button onClick={() => signIn("google")} className="bg-gray-300 p-1.5 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bgGray min-h-screen">
      <div className="md:hidden flex items-center p-4 pl-1">
        <button 
          onClick={() => setShowNav((prev) => !prev)}
          className="fixed z-50 bg-gray-300 rounded-full p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
          </svg>
        </button>  
        <div className="flex grow justify-center ml-6">
          <Logo/>
        </div>
      </div>
      <div className="flex">
        <Nav show={showNav}/>
        <div className="flex-grow p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
