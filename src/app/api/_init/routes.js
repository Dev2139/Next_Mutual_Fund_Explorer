import { NextResponse } from "next/server";
import { startCronJob } from "@/lib/cron";

startCronJob(); // Start cron when API is initialized

export async function GET() {
  return NextResponse.json({ message: "Cron initialized" });
}
