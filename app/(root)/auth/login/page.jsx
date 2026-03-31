import { Card, CardContent, Form } from '@/components/ui/card'
import React from 'react'
import Logo from "@/public/assets/images/logo-black.png";
import Image from 'next/image'

const LoginPage = () => {
  return (
    <Card className='w-[450px]'>
      <CardContent>
        <div className='flex justify-center'>
          <Image src={Logo.src} width={Logo.width} height={Logo.height} alt="Logo" className='max-w-[150px]' />
        </div>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Login Into Account</h1>
          <p className='text-muted-foreground text-lg'>Enter your email address and password to login</p>
        </div>
        <Form></Form>
      </CardContent>
    </Card>
  )
}

export default LoginPage