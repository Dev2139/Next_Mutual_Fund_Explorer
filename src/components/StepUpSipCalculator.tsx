// src/components/StepUpSipCalculator.tsx
"use client";

import { useState } from "react";
import {
    TextField, Button, Typography, Stack, Divider, Box, useTheme,
    Paper, InputAdornment, CircularProgress, alpha, Alert,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import CalculateIcon from '@mui/icons-material/Calculate';
import dayjs from "dayjs";

// Utility functions
const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const formatPercent = (val: number) => `${val.toFixed(2)}%`;

const CustomTooltip = ({ active, payload, label }: any) => {
    const theme = useTheme();
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Paper elevation={6} sx={{ p: 2, backgroundColor: alpha(theme.palette.background.paper, 0.95), border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Date: <Box component="span" fontWeight="700">{dayjs(label).format('DD MMM, YYYY')}</Box>
                </Typography>
                <Typography variant="body2" fontWeight={600} color="primary.main">
                    Total Invested: {formatCurrency(data.investment)}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} color="success.main">
                    Market Value: {formatCurrency(data.value)}
                </Typography>
            </Paper>
        );
    }
    return null;
};

export default function StepUpSipCalculator({ code }: { code: string }) {
    const [initialAmount, setInitialAmount] = useState<number>(5000);
    const [stepUpPercentage, setStepUpPercentage] = useState<number>(10);
    const [from, setFrom] = useState<string>(dayjs().subtract(5, 'year').format('YYYY-MM-DD'));
    const [to, setTo] = useState<string>(dayjs().format('YYYY-MM-DD'));
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    const handleCalculate = async () => {
        if (!initialAmount || !from || !to || stepUpPercentage === undefined) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch(`/api/scheme/${code}/step-up-sip`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initialAmount, from, to, stepUpPercentage }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to calculate.");
            }
            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ width: "100%", borderRadius: 4, p: { xs: 3, md: 5 }, backgroundColor: theme.palette.background.default }}>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4, textAlign: "center" }}>
                Step-up SIP Calculator
            </Typography>

            {/* Input Section */}
            <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, mb: 4, backgroundColor: alpha(theme.palette.background.paper, 0.9) }}>
                <Stack spacing={3}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                        <TextField
                            label="Initial Monthly SIP"
                            type="number"
                            fullWidth
                            value={initialAmount || ""}
                            onChange={(e) => setInitialAmount(Number(e.target.value))}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                        />
                        <TextField
                            label="Annual Step-up"
                            type="number"
                            fullWidth
                            value={stepUpPercentage || ""}
                            onChange={(e) => setStepUpPercentage(Number(e.target.value))}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        />
                    </Stack>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                        <TextField label="Start Date" type="date" fullWidth value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
                        <TextField label="End Date" type="date" fullWidth value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
                    </Stack>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleCalculate}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
                            color: "#fff",
                            py: 1.8,
                            fontWeight: 700,
                            "&:hover": { opacity: 0.9 },
                        }}
                    >
                        {loading ? "Calculating..." : "Calculate Step-up Returns"}
                    </Button>
                </Stack>
            </Paper>

            {/* Error */}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Result Section */}
            {result && (
                <Box>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3, mb: 4 }}>
                        <MetricItem label="Total Invested" value={formatCurrency(result.totalInvested)} color="info" theme={theme} />
                        <MetricItem label="Final Value" value={formatCurrency(result.currentValue)} color="success" theme={theme} />
                        <MetricItem label="Absolute Gain" value={formatPercent(result.absoluteReturn)} color="primary" theme={theme} />
                        <MetricItem label="Annualized (XIRR)" value={formatPercent(result.annualizedReturn)} color="warning" theme={theme} />
                    </Box>

                    {result.growthOverTime?.length > 0 && (
                        <Box sx={{ borderRadius: 3, overflow: "hidden", p: 2, backgroundColor: alpha(theme.palette.background.paper, 0.8) }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Investment Growth</Typography>
                            <Box sx={{ height: { xs: 300, md: 380 }, mt: 2 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={result.growthOverTime} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} tickMargin={10} angle={-35} textAnchor="end" height={60} tickFormatter={(tick) => dayjs(tick).format('MMM YY')} />
                                        <YAxis tickFormatter={(val) => val >= 1e5 ? `₹${(val / 1e5).toFixed(1)}L` : `₹${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: theme.palette.text.secondary }} width={70} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="stepAfter" dataKey="investment" name="Total Investment" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="value" name="Market Value" stroke={theme.palette.success.main} strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </Paper>
    );
}

function MetricItem({ label, value, color, theme }: { label: string; value: string; color: "primary" | "secondary" | "success" | "info" | "warning"; theme: any; }) {
    const returnColor = theme.palette[color].main;
    return (
        <Paper variant="outlined" sx={{ textAlign: "center", p: 3, borderRadius: 3, transition: "all 0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: theme.shadows[4] } }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ textTransform: 'uppercase', mb: 1 }}>
                {label}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color: returnColor }}>
                {value}
            </Typography>
        </Paper>
    );
}
