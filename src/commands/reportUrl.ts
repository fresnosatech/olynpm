import PackageJson from "@npmcli/package-json";
import log from "npmlog";
import Range from "semver/classes/range";
import validRange from "semver/ranges/valid";

const OLYNPM_BASE_URL = "https://toolkit.fresnosa.tech";
const LOG_PREFIX = "olynpm";

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
      log.warn(LOG_PREFIX, "package.json file not found.");
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
      log.info(LOG_PREFIX, `Skiped: ${packageName}@${versionRange}`);

      return;
    }

    // version is latest
    if (/^latest$/.test(versionRange)) {
      list.push(packageName);

      log.info(
        LOG_PREFIX,
        `Found: ${packageName}@${versionRange} -> ${versionRange}`
      );

      return;
    }

    // Skip package with invalid version range.
    if (!validRange(versionRange)) {
      log.info(LOG_PREFIX, `Skiped: ${packageName}@${versionRange}`);

      return;
    }

    // Resolve range.
    const resolvedVersion = resolveVersionFromRange(versionRange);
    log.info(
      LOG_PREFIX,
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

  console.log(`${OLYNPM_BASE_URL}/report?packages=${pkgs}`, "\n\n");
}
