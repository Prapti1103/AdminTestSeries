import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Responsivediv,
} from "recharts";
import {
  Grid,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
} from "antd";
import { getTestSeriesRevenueAndCount } from "./TestSeriesAPI";

const COLORS = ["#1890FF", "#36CFC9"];

const TestSeriesPieChart = () => {
  const [data, setData] = useState([]);
  const [showRevenue, setShowRevenue] = useState(false);

  useEffect(() => {
    getTestSeriesRevenueAndCount()
      .then((res) => {
        const fetched = res.data;
        
        // Transform Object[] data from backend
        // Assuming format: [testSeriesName, revenue, count]
        const transformedData = fetched.map((item) => ({
          name: item[0], // Test series name
          revenue: item[1], // Revenue
          count: item[2], // Order count
        }));

        setData(transformedData);
      })
      .catch((err) => console.error("Error fetching test series data:", err));
  }, []);

  return (
    <Grid item xs={12} md={12}>
      <Paper elevation={3} sx={{ padding: "20px" }}>
        <Typography variant="h6" align="center" gutterBottom>
          Test Series {showRevenue ? "Revenue" : "Orders"} Distribution
        </Typography>

        {/* Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={showRevenue}
              onChange={() => setShowRevenue(!showRevenue)}
              color="primary"
            />
          }
          label={showRevenue ? "Revenue" : "Orders"}
          sx={{ display: "flex", justifyContent: "center", mb: 2 }}
        />

        <Responsivediv width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={125}
              label
              dataKey={showRevenue ? "revenue" : "count"}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [
                showRevenue ? `₹${value}` : value,
                showRevenue ? "Revenue" : "Orders"
              ]}
            />
            <Legend />
          </PieChart>
        </Responsivediv>
      </Paper>
    </Grid>
  );
};

export default TestSeriesPieChart;