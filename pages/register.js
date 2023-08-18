import AuthTemplate from '../components/templates/AuthTemplate'
import LoginUsingOtp from '../components/auth/LoginUsingOtp'
import withGuestRoutes from "../utils/withGuestRoutes.tsx";


function Register() {
    return (
        <AuthTemplate heading="Become a dealer">
            <LoginUsingOtp />
        </AuthTemplate>
    )
}

export default withGuestRoutes(Register)