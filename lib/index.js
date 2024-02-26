#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const reportUrl_1 = __importDefault(require("./commands/reportUrl"));
const program = new commander_1.Command();
program
    .name("olynpm")
    .description("Fitness App for your npm projects.")
    .version("0.1.3");
program
    .command("report-url")
    .description("Create a link to the report based on project dependencies.")
    .action(reportUrl_1.default);
program.parse();
//# sourceMappingURL=index.js.map