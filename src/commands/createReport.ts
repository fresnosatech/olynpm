import PackageJson from "@npmcli/package-json";
import validRange from "semver/ranges/valid";
import * as dotenv from "dotenv";
import {
  CREATE_REPORT_API_ENDPOINT,
  LOG_PREFIX,
  REPORT_URL,
} from "../lib/constants";
import { valid } from "semver";
import pino from "pino";
import reportUrl from "./reportUrl";

const log = pino({
  level: process.env.PINO_LOG_LEVEL || "error",
  formatters: {
    level: (label) => {
      return { severity: label.toUpperCase() };
    },
  },
});

dotenv.config();

/**
 * Request the creation of a report given dependencies.
 */
export default async function createReport() {
  if (!process.env.OLYNPM_ACCESS_TOKEN) {
    log.warn("olypnm", "Authorization Token not found");

    console.log("OLYNPM Token not found, creating a one time off report.");

    reportUrl();

    return;
  }

  log.debug(
    { log_prefix: LOG_PREFIX },
    "Inspecting package.json for project dependencies."
  );

  // Check for package.json file
  const path = process.cwd();
  const { content: pkg } = await PackageJson.normalize(path).catch((err) => {
    if (err.code === "ENOENT") {
      log.error({ log_prefix: LOG_PREFIX }, "package.json file not found.");
    }
    throw err;
  });

  // Check for package.json dependencies object.
  if (typeof pkg.dependencies === "undefined") {
    log.warn("olypnm", "No dependencies found in package.json.");

    throw new Error("No dependencies found in package.json.");
  }

  if (typeof pkg.name === "undefined") {
    log.warn("olypnm", "No package name found in package.json.");

    throw new Error("No package name found in package.json.");
  }
  const list: string[] = [];

  const dependencies = pkg.dependencies;
  log.debug({ log_prefix: LOG_PREFIX }, JSON.stringify(dependencies));
  Object.keys(dependencies).forEach((packageName) => {
    const versionRange = dependencies[packageName];

    // Skip package if version is missing.
    if (!versionRange) {
      log.debug(
        { log_prefix: LOG_PREFIX },
        `Skiped: ${packageName} version is missing`
      );

      return;
    }

    // version is latest
    if (/^latest$/.test(versionRange)) {
      list.push(`${packageName}@latest`);
      log.debug({ log_prefix: LOG_PREFIX }, `Found: ${packageName}@latest`);

      return;
    }

    // Skip package with invalid version range.
    if (!validRange(versionRange) && !valid(versionRange)) {
      log.warn(
        { log_prefix: LOG_PREFIX },
        `Skiped: ${packageName}@${versionRange} version format not supported.`
      );

      return;
    }

    log.debug(
      { log_prefix: LOG_PREFIX },
      `Found: ${packageName}@${versionRange}`
    );
    list.push(`${packageName}@${versionRange}`);
  });

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Authorization", `Bearer ${process.env.OLYNPM_ACCESS_TOKEN}`);

  const body = JSON.stringify({
    name: pkg.name,
    dependencies: list,
  });

  const response = await fetch(CREATE_REPORT_API_ENDPOINT, {
    method: "POST",
    headers: headers,
    body: body,
  });

  const responseBody = await response.json();
  if (response.status == 200) {
    console.log(`# Report created:\n`);
    console.log(`- project: ${pkg.name}`);
    console.log(`- url: ${REPORT_URL}?id=${responseBody.uuid}`, "\n\n");

    return;
  }

  console.log("Something went wrong", responseBody);
}
