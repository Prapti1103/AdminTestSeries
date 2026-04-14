import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Responsivediv,
} from "recharts";
import {
  Grid,
  Paper,
  Typography,
  MenuItem,
  Select,
  Switch,
  FormControlLabel,
} from "antd";
import { getMonthlyTestSeriesReport } from "./TestSeriesAPI"; 

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => currentYear - i);
};

const TestSeriesMonthlyReportGraph = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [showRevenue, setShowRevenue] = useState(false);

  useEffect(() => {
    getMonthlyTestSeriesReport(selectedYear)
      .then((res) => {
        const fetched = res.data;

        // Process the Object[] data from backend
        const fullData = Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const found = fetched.find((item) => item[0] === month); // Assuming [month, revenue, count]
          return {
            name: months[i],
            orders: found ? found[2] : 0, // count is at index 2
            revenue: found ? found[1] : 0, // revenue is at index 1
          };
        });

        setData(fullData);
      })
      .catch((err) => console.error("Error fetching monthly test series data:", err));
  }, [selectedYear]);

  return (
    <Grid item xs={12} md={12}>
      <Paper elevation={3} sx={{ padding: "20px" }}>
        <Typography variant="h6" align="center" gutterBottom>
          Monthly Test Series {showRevenue ? "Revenue" : "Orders"} Report
        </Typography>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            size="small"
            sx={{ marginRight: 2 }}
          >
            {generateYearOptions().map((year) => (
              <MenuItem key={year} value={year}>
                {year}
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
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Bar
              dataKey={showRevenue ? "revenue" : "orders"}
              fill={showRevenue ?"#36CFC9" : "#1890FF"}
              name={showRevenue ? "Revenue" : "Orders"}
            />
          </BarChart>
        </Responsivediv>
      </Paper>
    </Grid>
  );
};

export default TestSeriesMonthlyReportGraph;