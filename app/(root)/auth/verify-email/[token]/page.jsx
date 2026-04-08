import { use } from "react"
const EmailVerification = ({ params }) => {
    const { token } = use(params)
    console.log(token)
    return (
        <div> EmailVerification</ div>
    )
}

export default EmailVerification