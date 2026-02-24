import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getClient } from "../../lib/client.js";
import { shouldOutputJson, outputJson, outputTable } from "../../lib/output.js";
import { handleError } from "../../lib/errors.js";

export const usageCommand = new Command("usage")
  .description("View API usage statistics")
  .option("--days <n>", "Number of days to look back", "7")
  .action(async (options: { days: string }) => {
    const days = Number(options.days);
    const spinner = ora("Fetching usage data...").start();
    try {
      const client = await getClient();

      const response = await client.usage.get({
        days: Math.min(days, 90),
      });

      spinner.stop();

      if (shouldOutputJson()) {
        outputJson(response);
        return;
      }

      const data = response.data;
      if (!data) {
        console.log("No usage data available.");
        return;
      }

      console.log(chalk.bold(`API Usage (last ${days} days)`));
      console.log();

      // Display daily app usage if available
      const dailyUsage = data.dailyClientAppUsage;
      if (dailyUsage && Array.isArray(dailyUsage) && dailyUsage.length > 0) {
        const rows: string[][] = [];
        for (const day of dailyUsage) {
          const date = (day as any).date ?? "N/A";
          const appUsages = (day as any).usage ?? [];
          for (const appUsage of appUsages) {
            rows.push([
              date,
              appUsage.app_id ?? "N/A",
              String(appUsage.usage?.[0]?.tweets ?? 0),
            ]);
          }
        }
        if (rows.length > 0) {
          outputTable(["Date", "App ID", "Posts"], rows);
        }
      } else {
        console.log(chalk.dim("No detailed usage data available."));
        console.log(chalk.dim("Usage data may take time to appear for new API keys."));
      }
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });
