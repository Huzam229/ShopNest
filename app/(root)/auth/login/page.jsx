'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import React from 'react'
import Logo from "@/public/assets/images/logo-black.png";
import Image from 'next/image'
import { useForm } from 'react-hook-form';
import { zSchema } from '@/lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = zSchema.pick({
  email: true,
  password: true
})
const LoginPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const handleLoginSubmit = async (values) => {

  }

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