import DashboardHero from "./DashboardHero";
import DashboardMetrics from "./DashboardMetrics";
import RecentBookings from "./RecentBookings";
import useApi from "../../hooks/useApi";
import { dashboard } from "../../services/guesthouse";
import { ErrorBox, Loading } from "../../components/Feedback";

const Dashboard = () => {
  const { data, loading, error, reload } = useApi(() => dashboard.get(), []);

  return (
    <div className="p-6 space-y-6">
      <DashboardHero />

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && (
        <>
          <DashboardMetrics data={data} />
          <RecentBookings bookings={data.recent_bookings} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
