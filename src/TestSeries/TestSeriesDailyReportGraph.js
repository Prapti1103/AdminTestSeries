import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Responsivediv
} from "recharts";
import {
  Grid, Paper, Typography, MenuItem, Select, Switch, FormControlLabel
} from "antd";
import { getTestSeriesDailyReport } from "./TestSeriesAPI"; 

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => currentYear - i);
};

const generateMonthOptions = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    label: new Date(0, i).toLocaleString("default", { month: "short" }),
    value: i + 1
  }));
};

const TestSeriesDailyReportGraph = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [data, setData] = useState([]);
  const [showRevenue, setShowRevenue] = useState(false);

  useEffect(() => {
    getTestSeriesDailyReport(selectedYear, selectedMonth)
      .then((res) => {
        const fetched = res.data;

        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        const fullData = Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          // Assuming the API returns Object[] with [day, revenue, count]
          const found = fetched.find((item) => item[0] === day);
          return {
            name: `${day}`,
            orders: found ? found[2] : 0, // count at index 2
            revenue: found ? found[1] : 0 // revenue at index 1
          };
        });

        setData(fullData);
      })
      .catch((err) => console.error("Error fetching daily test series report:", err));
  }, [selectedYear, selectedMonth]);

  return (
    <Grid item xs={12} md={12}>
      <Paper elevation={3} sx={{ padding: "20px" }}>
        <Typography variant="h6" align="center" gutterBottom>
          Daily Test Series {showRevenue ? "Revenue" : "Orders"} Report
        </Typography>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            size="small"
            sx={{ marginRight: 2 }}
          >
            {generateYearOptions().map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>

          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            size="small"
            sx={{ marginRight: 2 }}
          >
            {generateMonthOptions().map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>

          <FormControlLabel
            control={
              <Switch
                checked={showRevenue}
                onChange={() => setShowRevenue(!showRevenue)}
                color="primary"
              />
            }
            label={showRevenue ? "Revenue" : "Orders"}
          />
        </div>

        <Responsivediv width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{
                value: showRevenue ? "Revenue" : "Orders",
                angle: -90,
                position: "insideLeft"
              }}
            />
            <Tooltip />
            <Bar
              dataKey={showRevenue ? "revenue" : "orders"}
              fill={showRevenue ? "#1890FF" : "#36CFC9"}
              name={showRevenue ? "Revenue" : "Orders"}
            />
          </BarChart>
        </Responsivediv>
      </Paper>
    </Grid>
  );
};

export default TestSeriesDailyReportGraph;