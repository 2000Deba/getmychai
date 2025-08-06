import PaymentPage from '@/components/PaymentPage'
import React from 'react'
import { notFound } from 'next/navigation';
import connectDB from '@/db/connectDb';
import User from '@/models/User';

const Username = async ({ params }) => {
  const { username } = await params;
  // If the username is not present in the database, show a 404 page
  const checkUser = async () => {
    await connectDB()
    let u = await User.findOne({ username })
    if (!u) {
      return notFound()
    }
  }
  await checkUser()

  return (
    <>
      <PaymentPage username={username} />
    </>
  )
}

export default Username

export async function generateMetadata({ params }) {
  const { username } = await params;
  return {
    title: `Support ${username} - Get Me A Chai`,
  }
}