// src/components/FundTable.tsx
"use client";

import { Table, TableBody, TableHead, TableRow, TableCell, Typography } from "@mui/material";
import FundListItem from "./FundListItem";
import { Scheme } from "@/types/scheme";

export default function FundTable({ funds }: { funds: Scheme[] }) {
  // Filter out inactive funds here (optional if API already filters)
  const activeFunds = funds.filter(fund => fund.isinGrowth);

  return (
    <div>
      {/* Display total rendered funds */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Total Funds: {activeFunds.length}
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fund Name</TableCell>
            <TableCell align="right">NAV</TableCell>
            <TableCell align="right">1Y Return</TableCell>
            <TableCell align="right">3Y Return</TableCell>
            <TableCell align="right">CAGR</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activeFunds.map(fund => (
            <FundListItem key={fund.schemeCode} fund={fund} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
