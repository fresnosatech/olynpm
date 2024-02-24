#!/usr/bin/env node

import { Command } from 'commander';
import Conf from 'conf';

const program = new Command();
const config = new Conf({'projectName': 'olynpm'});

program
  .name("olynpm")
  .description("Fitness App for your npm projects.")
  .version("0.1.0");

program.parse();
