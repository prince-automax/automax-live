import AuthTemplate from '../components/templates/AuthTemplate'
import ResetPassword from '../components/auth/ResetPassword.tsx'
import withGuestRoutes from "../utils/withGuestRoutes.tsx";

function ForgotPassword() {
    return (
        <AuthTemplate heading="Reset Password">
            <ResetPassword />
        </AuthTemplate>
    )
}

export default withGuestRoutes(ForgotPassword)