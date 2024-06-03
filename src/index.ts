#!/usr/bin/env node

import { Command } from "commander";
import reportUrl from "./commands/reportUrl";
import createReport from "./commands/createReport";

const program = new Command();

program
  .name("olynpm")
  .description("Fitness App for your npm projects.")
  .version("0.1.7");

program
  .command("report-url")
  .description("Create url for one off project dependencies report")
  .action(reportUrl);

program
  .command("audit")
  .description("Create an audit report for your project dependencies.")
  .action(createReport);

program.parse();
