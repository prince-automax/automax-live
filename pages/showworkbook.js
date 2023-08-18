import DashboardTemplate from "../components/templates/DashboardTemplate"
import WorkBookTable from "../components/tables/WorkBookTable"
import withPrivateRoute from "../utils/withPrivateRoute";

function WorkBookCalender() {

    return (
        <DashboardTemplate heading="Work Book">
            <WorkBookTable showHeadings={false} allowDownload={true} />
        </DashboardTemplate>
    )
}


export default withPrivateRoute(WorkBookCalender);


