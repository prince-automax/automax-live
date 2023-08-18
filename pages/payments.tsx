import { useEffect, useState } from "react";
import PaymentForm from "../components/payments/PaymentForm";
import PaymentsTable from "../components/payments/PaymentsTable";
import DashboardTemplate from "../components/templates/DashboardTemplate";
import withPrivateRoute from "../utils/withPrivateRoute";

function Payments() {
  return (
    <DashboardTemplate heading="Payments">
      <div className="divide-y divide-gray-200">
        <PaymentForm />
        <PaymentsTable />
      </div>
    </DashboardTemplate>
  );
}

export default withPrivateRoute(Payments);
