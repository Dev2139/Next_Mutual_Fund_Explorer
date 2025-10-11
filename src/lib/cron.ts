import cron from "node-cron";
import fetch from "node-fetch";

let jobStarted = false;

export function startCronJob() {
  if (jobStarted) return; // Prevent duplicate jobs
  jobStarted = true;

  console.log("🕐 Cron scheduler initialized...");

  // Runs every day at 7:00 AM
  cron.schedule("0 7 * * *", async () => {
    console.log("🚀 Running daily mutual fund data update at 7:00 AM...");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/fetch-funds`);
      console.log("✅ Mutual fund data successfully updated.");
    } catch (error) {
      console.error("❌ Cron job failed:", error);
    }
  });
}
