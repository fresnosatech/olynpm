import PackageJson from "@npmcli/package-json";
import Range from "semver/classes/range";
import validRange from "semver/ranges/valid";
import { LOG_PREFIX, REPORT_URL } from "../lib/constants";
import { valid } from "semver";
import pino from "pino";

const log = pino({
  level: process.env.PINO_LOG_LEVEL || "info",
  formatters: {
    level: (label) => {
      return { severity: label.toUpperCase() };
    },
  },
});

/**
 * Given a SemVer Range. Resolves to the earliest one.
 *
 * @param range
 * @returns string
 */
export const resolveVersionFromRange = (range: string) => {
  const rangeSet = new Range(range).set;

  return rangeSet[0][0].semver.version;
};

/**
 * Generates the url for the report.
 */
export default async function reportUrl() {
  console.log("\nInspecting package.json for project dependencies.\n");

  // Check for package.json file
  const path = process.cwd();
  const { content: pkg } = await PackageJson.normalize(path).catch((err) => {
    if (err.code === "ENOENT") {
      log.warn({ log_prefix: LOG_PREFIX }, "package.json file not found.");
    }
    throw err;
  });

  // Check for package.json dependencies object.
  if (typeof pkg.dependencies === "undefined") {
    log.warn("olypnm", "No dependencies found in package.json.");

    throw new Error("No dependencies found in package.json.");
  }

  const list: string[] = [];

  const dependencies = pkg.dependencies;
  Object.keys(dependencies).forEach((packageName) => {
    const versionRange = dependencies[packageName];

    // Skip package if version is missing.
    if (!versionRange) {
      log.info(
        { log_prefix: LOG_PREFIX },
        `Skiped: ${packageName} version is missing`
      );

      return;
    }

    // version is latest
    if (/^latest$/.test(versionRange)) {
      list.push(packageName);

      log.info(
        { log_prefix: LOG_PREFIX },
        `Found: ${packageName}@${versionRange} -> ${versionRange}`
      );

      return;
    }

    // Skip package with invalid version range.
    if (!validRange(versionRange) && !valid(versionRange)) {
      log.info(
        { log_prefix: LOG_PREFIX },
        `Skiped: ${packageName}@${versionRange} version format not supported.`
      );

      return;
    }

    // Resolve range.
    const resolvedVersion = resolveVersionFromRange(versionRange);
    log.info(
      { log_prefix: LOG_PREFIX },
      `Found: ${packageName}@${versionRange} -> ${resolvedVersion}`
    );

    list.push(`${packageName}@${resolvedVersion}`);
  });

  console.log(`\nGenerating report url for: ${pkg.name}`, "\n");

  const pkgs = list.join(",");
  console.log(
    "\nNavigate to the following url to obtain the Fitness report: ",
    "\n"
  );

  console.log(`${REPORT_URL}?packages=${pkgs}`, "\n\n");
}
