import DashboardTemplate from "../components/templates/DashboardTemplate"
import UpcomingEventsTable from "../components/tables/UpcomingEventsTable"
import withPrivateRoute from "../utils/withPrivateRoute";

function EventsCalendar() {

    return (
        <DashboardTemplate heading="Upcoming Events">
            <UpcomingEventsTable showHeadings={false} allowDownload={true} />
        </DashboardTemplate>
    )
}


export default withPrivateRoute(EventsCalendar);


