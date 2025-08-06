"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'

const Navbar = () => {
  const { data: session } = useSession()
  const [showdropdown, setShowdropdown] = useState(false)
  const dropdownRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowdropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className='bg-blue-950 text-white flex justify-between items-center px-4 md:h-16 flex-col md:flex-row'>
      <Link className="logo font-bold text-lg flex justify-center items-center" href={"/"}>
        <img className='invertImg' src="/tea.gif" width={44} alt="" />
        <span className='text-xl md:text-base my-3 md:my-0'>GetMeaChai!</span>
      </Link>

      <div className='relative flex justify-center items-center  md:block gap-4' ref={dropdownRef}>
        {session && (
          <>
            <button
              onClick={() => setShowdropdown(!showdropdown)}
              className="text-white mx-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center cursor-pointer"
              type="button">Welcome {session.user.email} <svg className="w-2.5 h-2.5 ms-3" viewBox="0 0 10 6" fill="none">
                <path d="m1 1 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={`z-10 ${showdropdown ? "" : "hidden"} absolute left-[125px] bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44`}>
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowdropdown(false)}> Dashboard</Link>
                </li>
                <li>
                  <Link href={`/${session.user.name}`} className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowdropdown(false)}> Your Page </Link>
                </li>
                <li>
                  <button onClick={() => { setShowdropdown(false); signOut(); }} className="block px-4 py-2 text-left w-full hover:bg-gray-100 cursor-pointer"> Sign out </button>
                </li>
              </ul>
            </div>
          </>
        )}

        {session ? (<button className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer" onClick={() => signOut()}>Logout</button>) : (
          <Link href="/login">
            <button className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer">Login</button></Link>)}
      </div>
    </nav>
  )
}

export default Navbar
