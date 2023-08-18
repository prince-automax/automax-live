
import DashboardTemplate from "../components/templates/DashboardTemplate"
import withPrivateRoute from "../utils/withPrivateRoute";

function Settings() {

    return (
        <DashboardTemplate heading="Settings">
            <div>
                This is Settings Page
            </div>
        </DashboardTemplate>
    )
}


export default withPrivateRoute(Settings);
