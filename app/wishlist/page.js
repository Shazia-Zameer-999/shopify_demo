import React from 'react'
import Link from 'next/link'
import WishlistPage from '@/components/Wishlist'
import { headers } from "next/headers";


const  page = async () => {
  return (
    <div>
      <WishlistPage />
    </div>
  )
}

export default page
