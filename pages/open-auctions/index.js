import DashboardTemplate from "../../components/templates/DashboardTemplate";
import LiveEventsTable from "../../components/tables/LiveEventsTable";
import withPrivateRoute from "../../utils/withPrivateRoute";

function EventsCalendar() {
  return (
    <DashboardTemplate heading="Live Open auction">
      <LiveEventsTable
        showHeadings={false}
        allowDownload={true}
        eventCategory={"open"}
      />
    </DashboardTemplate>
  );
}

export default withPrivateRoute(EventsCalendar);
