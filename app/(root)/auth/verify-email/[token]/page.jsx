'use client'
import { use, useEffect, useState } from "react"
import { Card, CardContent } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import verifiedImg from "../../../../../public/assets/images/verified.gif"
import verificationFailedImg from "../../../../../public/assets/images/verification-failed.gif"
import Image from 'next/image'
import Link from "next/link"
import { WEBSITE_HOME } from "../../../../../routes/WebRoutes"

const EmailVerification = ({ params }) => {
    const { token } = use(params)
    const [isVerified, setIsVerified] = useState(null) // ✅ null = loading

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const res = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token })
                })
                const result = await res.json()
                setIsVerified(result.success === true)
            } catch (error) {
                console.error("Verification error:", error)
                setIsVerified(false) // ✅ API failed, show failed state
            }
        }
        verifyToken()
    }, [token])

    // ✅ Show loading until API responds — fixes hydration mismatch
    if (isVerified === null) {
        return (
            <Card className="w-[400px]">
                <CardContent>
                    <div className="text-center py-6">
                        <h1 className="text-2xl font-semibold">Verifying your email...</h1>
                        <p className="text-muted-foreground mt-2">Please wait</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-[400px]">
            <CardContent>
                {isVerified ? (
                    <div className="text-center py-6">
                        <div className="flex justify-center items-center">
                            <Image src={verifiedImg} alt="email-verified" height={100} width={100} />
                        </div>
                        <h1 className="text-2xl font-semibold text-green-500">Email Verification Success!</h1>
                        <Button asChild className="mt-5">
                            <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <div className="flex justify-center items-center">
                            <Image src={verificationFailedImg} alt="verification-failed" height={100} width={100} />
                        </div>
                        <h1 className="text-2xl font-semibold text-red-500">Email Verification Failed!</h1>
                        <Button asChild className="mt-5">
                            <Link href={WEBSITE_HOME}>Try Again</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default EmailVerification