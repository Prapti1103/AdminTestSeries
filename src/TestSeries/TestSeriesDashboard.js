import React from "react";
import TestSeriesCards from "./TestSeriesCards";
import TestSeriesMonthlyReportGraph from "./TestSeriesMonthlyReportGraph";
import TestSeriesPieChart from "./TestSeriesPieChart";
import TestSeriesDailyReportGraph from "./TestSeriesDailyReportGraph";

import { Grid } from "antd";

export default function TestSeriesDashboard() {
  return (
    <div>
      <TestSeriesCards />

      <Grid div spacing={2} mt={2}>
        <Grid item xs={12} md={6}>
          <TestSeriesPieChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <TestSeriesMonthlyReportGraph />
        </Grid>
        <Grid item xs={12} md={12}>
          <TestSeriesDailyReportGraph />
        </Grid>
      </Grid>
    </div>
  );
}