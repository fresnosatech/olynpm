#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const reportUrl_1 = __importDefault(require("./commands/reportUrl"));
const createReport_1 = __importDefault(require("./commands/createReport"));
const program = new commander_1.Command();
program
    .name("olynpm")
    .description("Fitness App for your npm projects.")
    .version("0.1.7");
program
    .command("report-url")
    .description("Create url for one off project dependencies report")
    .action(reportUrl_1.default);
program
    .command("track")
    .description("Track project progress.")
    .action(createReport_1.default);
program.parse();
//# sourceMappingURL=index.js.map