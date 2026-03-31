'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from "@/components/ui/input";
import React, { useState } from 'react'
import Logo from "@/public/assets/images/logo-black.png";
import Image from 'next/image'
import { useForm } from 'react-hook-form';
import { zSchema } from '@/lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadedButton from '@/components/Application/LoadedButton';
import { z } from 'zod';
import { FaRegEyeSlash } from 'react-icons/fa';
import { FaRegEye } from 'react-icons/fa6';

const formSchema = zSchema.pick({
  email: true
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters")
})
const LoginPage = () => {

  const [loading, setloading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const handleLoginSubmit = async (values) => {
    console.log(values)
  }

  return (
    <Card className='w-[440px]'>
      <CardContent>
        <div className='flex justify-center'>
          <Image src={Logo.src} width={Logo.width} height={Logo.height} alt="Logo" className='max-w-[150px]' />
        </div>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Login Into Account</h1>
          <p className='text-muted-foreground text-lg'>Enter your email address and password to login</p>
        </div>
        <div className='mt-5'>
          <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-4">
            < div className='mb-5'>
              <label>Email</label>
              <Input placeholder="example@gmail.com" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className='relative'>
              <label>Password</label>
              <Input type={isTypePassword ? 'password' : 'text'} placeholder="********" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
              <span onClick={() => setIsTypePassword(!isTypePassword)} className='absolute right-3 top-7 cursor-pointer'>
                {isTypePassword ? <FaRegEyeSlash className='h-4 w-4' /> : <FaRegEye className='h-4 w-4' />}
              </span>
            </div>
            <div>
              <LoadedButton
                type="submit"
                text="Login"
                loading={loading}
                onClick={handleLoginSubmit}
                className="cursor-pointer p-5 w-full mt-2 text-[17px] hover:opacity-80" />
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

export default LoginPage