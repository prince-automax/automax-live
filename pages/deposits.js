import DashboardTemplate from "../components/templates/DashboardTemplate"
import withPrivateRoute from "../utils/withPrivateRoute";

function Deposits() {

    return (
        <DashboardTemplate heading="My Deposits">
            <div>
                This is Deposits Page
            </div>
        </DashboardTemplate>
    )
}


export default withPrivateRoute(Deposits);
