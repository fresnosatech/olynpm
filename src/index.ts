#!/usr/bin/env node

import { Command } from "commander";
import reportUrl from "./commands/reportUrl";

const program = new Command();

program
  .name("olynpm")
  .description("Fitness App for your npm projects.")
  .version("0.1.3");

program
  .command("report-url")
  .description("Create a link to the report based on project dependencies.")
  .action(reportUrl);

program.parse();
