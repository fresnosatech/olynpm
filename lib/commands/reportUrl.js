"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVersionFromRange = void 0;
const package_json_1 = __importDefault(require("@npmcli/package-json"));
const npmlog_1 = __importDefault(require("npmlog"));
const range_1 = __importDefault(require("semver/classes/range"));
const valid_1 = __importDefault(require("semver/ranges/valid"));
const OLYNPM_BASE_URL = "https://toolkit.fresnosa.tech";
const LOG_PREFIX = "olynpm";
/**
 * Given a SemVer Range. Resolves to the earliest one.
 *
 * @param range
 * @returns string
 */
const resolveVersionFromRange = (range) => {
    const rangeSet = new range_1.default(range).set;
    return rangeSet[0][0].semver.version;
};
exports.resolveVersionFromRange = resolveVersionFromRange;
/**
 * Generates the url for the report.
 */
function reportUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\nInspecting package.json for project dependencies.\n");
        // Check for package.json file
        const path = process.cwd();
        const { content: pkg } = yield package_json_1.default.normalize(path).catch((err) => {
            if (err.code === "ENOENT") {
                npmlog_1.default.warn(LOG_PREFIX, "package.json file not found.");
            }
            throw err;
        });
        // Check for package.json dependencies object.
        if (typeof pkg.dependencies === "undefined") {
            npmlog_1.default.warn("olypnm", "No dependencies found in package.json.");
            throw new Error("No dependencies found in package.json.");
        }
        const list = [];
        const dependencies = pkg.dependencies;
        Object.keys(dependencies).forEach((packageName) => {
            const versionRange = dependencies[packageName];
            // Skip package if version is missing.
            if (!versionRange) {
                npmlog_1.default.info(LOG_PREFIX, `Skiped: ${packageName}@${versionRange}`);
                return;
            }
            // version is latest
            if (/^latest$/.test(versionRange)) {
                list.push(packageName);
                npmlog_1.default.info(LOG_PREFIX, `Found: ${packageName}@${versionRange} -> ${versionRange}`);
                return;
            }
            // Skip package with invalid version range.
            if (!(0, valid_1.default)(versionRange)) {
                npmlog_1.default.info(LOG_PREFIX, `Skiped: ${packageName}@${versionRange}`);
                return;
            }
            // Resolve range.
            const resolvedVersion = (0, exports.resolveVersionFromRange)(versionRange);
            npmlog_1.default.info(LOG_PREFIX, `Found: ${packageName}@${versionRange} -> ${resolvedVersion}`);
            list.push(`${packageName}@${resolvedVersion}`);
        });
        console.log(`\nGenerating report url for: ${pkg.name}`, "\n");
        const pkgs = list.join(",");
        console.log("\nNavigate to the following url to obtain the Fitness report: ", "\n");
        console.log(`${OLYNPM_BASE_URL}/report?packages=${pkgs}`, "\n\n");
    });
}
exports.default = reportUrl;
//# sourceMappingURL=reportUrl.js.map