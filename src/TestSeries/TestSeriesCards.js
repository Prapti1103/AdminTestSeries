import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  
} from "antd";
import {
  CalendarMonth,
  BarChart,
  DateRange,
  EventAvailable,
  TrendingUp,
} from "@mui/icons-material";
import { getTestSeriesOrderStats } from "./TestSeriesAPI";

export const chartColors = {
  primaryBlue: "#42A5F5",
  lightBlue: "#E3F2FD",
  vibrantGreen: "#38CE3C",
  lightGreen: "#E8F5E9",
  richPurple: "#9C27B0",
  lightPurple: "#F3E5F5",
  brightCoral: "#F57C00",
  lightOrange: "#FFF3E0",
};

const TestSeriesCards = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const response = await getTestSeriesOrderStats();
      console.log("API Response:", response);
      setData(response);
    } catch (error) {
      console.error("Failed to load test series dashboard data.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const cardData = [
    {
      label: "TODAY",
      countKey: "todayCount",
      revenueKey: "todayRevenue",
      bg: chartColors.lightBlue,
      text: chartColors.primaryBlue,
      icon: <CalendarMonth sx={{ color: chartColors.primaryBlue, fontSize: 26 }} />,
    },
    {
      label: "LAST 7 DAYS",
      countKey: "last7DaysCount",
      revenueKey: "last7DaysRevenue",
      bg: chartColors.lightPurple,
      text: chartColors.richPurple,
      icon: <BarChart sx={{ color: chartColors.richPurple, fontSize: 26 }} />,
    },
    {
      label: "LAST 30 DAYS",
      countKey: "last30DaysCount",
      revenueKey: "last30DaysRevenue",
      bg: "#E0F7FA",
      text: chartColors.primaryBlue,
      icon: <DateRange sx={{ color: chartColors.primaryBlue, fontSize: 26 }} />,
    },
    {
      label: "LAST 365 DAYS",
      countKey: "last365DaysCount",
      revenueKey: "last365DaysRevenue",
      bg: chartColors.lightGreen,
      text: chartColors.vibrantGreen,
      icon: <EventAvailable sx={{ color: chartColors.vibrantGreen, fontSize: 26 }} />,
    },
    {
      label: "TOTAL",
      countKey: "totalCount",
      revenueKey: "totalRevenue",
      bg: chartColors.lightOrange,
      text: chartColors.brightCoral,
      icon: <TrendingUp sx={{ color: chartColors.brightCoral, fontSize: 26 }} />,
    },
  ];

  if (loading) {
    return (
      <div display="flex" justifyContent="center" mt={10}>
        <CircularProgress size={50} />
      </div>
    );
  }

  return (
    <div p={2}>
      <Grid div spacing={2} justifyContent="center">
        {cardData.map(({ label, countKey, revenueKey, bg, text, icon }) => {
          const count = data?.[countKey] ?? 0;
          const revenue = data?.[revenueKey] ?? 0;

          return (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={countKey}>
              <Card
                sx={{
                  backgroundColor: bg,
                  borderRadius: 3,
                  minHeight: 120,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <div display="flex" justifyContent="space-between" alignItems="center">
                    <div>
                      {/* Smaller Label */}
                      <Typography
                        variant="body2"
                        sx={{
                          textTransform: "uppercase",
                          fontWeight: 600,
                          color: text,
                          fontSize: 11,
                        }}
                      >
                        {label}
                      </Typography>

                      {/* Smaller Count */}
                      <Typography
                        variant="h5"
                        sx={{
                          color: text,
                          fontWeight: 700,
                          lineHeight: 1.1,
                          mt: 0.5,
                          fontSize: 20,
                        }}
                      >
                        {count}
                      </Typography>

                      {/* Revenue Text */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: text,
                          fontWeight: 400,
                          opacity: 0.6,
                          mt: 0.4,
                          fontSize: 16,
                        }}
                      >
                        ₹ {revenue.toLocaleString()}
                      </Typography>
                    </div>

                    {/* Icon Box */}
                    <div
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        width: 42,
                        height: 42,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      {icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default TestSeriesCards;
