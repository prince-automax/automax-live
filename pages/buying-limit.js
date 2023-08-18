
import DashboardTemplate from "../components/templates/DashboardTemplate"
import withPrivateRoute from "../utils/withPrivateRoute";

function BuyingLimit() {

    return (
        <DashboardTemplate heading="My Buying Limit">
            <div>
                This is My Buying Limit Page
            </div>
        </DashboardTemplate>
    )
}

export default withPrivateRoute(BuyingLimit);
