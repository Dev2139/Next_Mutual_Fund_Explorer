// src/components/FundListItem.tsx
"use client";

import {
  Typography,
  Box,
  useTheme,
  alpha,
  Avatar,
  TableRow,
  TableCell,
} from "@mui/material";
import Link from "next/link";
import { Scheme } from "@/types/scheme";

// Helper to get a color based on return value
const getReturnColor = (returnValue: string, theme: any) => {
  const num = parseFloat(returnValue);
  if (isNaN(num)) return theme.palette.text.secondary;
  return num > 0 ? theme.palette.success.main : theme.palette.error.main;
};

// Small component for displaying return values
const ReturnValue = ({ value }: { value: string }) => {
  const theme = useTheme();
  const color = getReturnColor(value, theme);
  return (
    <Typography variant="body2" fontWeight={600} sx={{ color }}>
      {value}%
    </Typography>
  );
};

// Fund row component
export default function FundListItem({ fund }: { fund: Scheme }) {
  const theme = useTheme();

  // Skip inactive funds
  if (!fund.isinGrowth) return null;

  // --- PLACEHOLDER DATA ---
  const latestNav = (Math.random() * 200 + 20).toFixed(2);
  const oneYearReturn = (Math.random() * 60 - 10).toFixed(2);
  const threeYearReturn = (Math.random() * 25 + 5).toFixed(2);
  const cagr = (parseFloat(threeYearReturn) - 2).toFixed(2);
  // --- END PLACEHOLDER ---

  // Determine category
  let category = "Equity";
  const lowerCaseName = fund.schemeName.toLowerCase();
  if (lowerCaseName.includes("debt") || lowerCaseName.includes("income")) category = "Debt";
  if (lowerCaseName.includes("hybrid")) category = "Hybrid";
  if (lowerCaseName.includes("index") || lowerCaseName.includes("nifty")) category = "Index";

  return (
    <TableRow
      hover
      sx={{
        "& > td": { borderBottom: `1px solid ${theme.palette.divider}` },
        "&:last-child > td": { borderBottom: 0 },
        "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
      }}
    >
      {/* Name and Category */}
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {fund.schemeName.charAt(0)}
          </Avatar>
          <Box>
            <Link href={`/scheme/${fund.schemeCode}`} passHref style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.primary"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                    textDecoration: "underline",
                  },
                }}
              >
                {fund.schemeName}
              </Typography>
            </Link>
            <Typography variant="caption" color="text.secondary">
              {category}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* NAV */}
      <TableCell align="right">₹{latestNav}</TableCell>

      {/* Returns */}
      <TableCell align="right">
        <ReturnValue value={oneYearReturn} />
      </TableCell>
      <TableCell align="right">
        <ReturnValue value={threeYearReturn} />
      </TableCell>
      <TableCell align="right">
        <ReturnValue value={cagr} />
      </TableCell>
    </TableRow>
  );
}
