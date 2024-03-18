import PackageJson from "@npmcli/package-json";
import log from "npmlog";
import validRange from "semver/ranges/valid";
import * as dotenv from "dotenv";
import {
  CREATE_REPORT_API_ENDPOINT,
  LOG_PREFIX,
  REPORT_URL,
} from "../lib/constants";
import { valid } from "semver";

dotenv.config();

/**
 * Request the creation of a report given dependencies.
 */
export default async function createReport() {
  if (!process.env.OLYNPM_ACCESS_TOKEN) {
    log.error("olypnm", "Missing Authorization Token");

    return;
  }

  console.log("\nInspecting package.json for project dependencies.\n");

  // Check for package.json file
  const path = process.cwd();
  const { content: pkg } = await PackageJson.normalize(path).catch((err) => {
    if (err.code === "ENOENT") {
      log.error(LOG_PREFIX, "package.json file not found.");
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
  console.log(dependencies);
  Object.keys(dependencies).forEach((packageName) => {
    const versionRange = dependencies[packageName];

    // Skip package if version is missing.
    if (!versionRange) {
      log.info(LOG_PREFIX, `Skiped: ${packageName} version is missing`);

      return;
    }

    // version is latest
    if (/^latest$/.test(versionRange)) {
      list.push(`${packageName}@latest`);
      log.info(LOG_PREFIX, `Found: ${packageName}@latest`);

      return;
    }

    // Skip package with invalid version range.
    if (!validRange(versionRange) && !valid(versionRange)) {
      log.info(
        LOG_PREFIX,
        `Skiped: ${packageName}@${versionRange} version format not supported.`
      );

      return;
    }

    log.info(LOG_PREFIX, `Found: ${packageName}@${versionRange}`);
    list.push(`${packageName}@${versionRange}`);
  });

  console.log(`\nCreating report: ${pkg.name}`);

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
    console.log("\nNavigate to the following url to see the report: ", "\n");
    console.log(`${REPORT_URL}?id=${responseBody.uuid}`, "\n\n");

    return;
  }

  console.log("Something went wrong", responseBody);
}
