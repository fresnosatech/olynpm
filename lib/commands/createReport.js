"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const package_json_1 = __importDefault(require("@npmcli/package-json"));
const npmlog_1 = __importDefault(require("npmlog"));
const valid_1 = __importDefault(require("semver/ranges/valid"));
const dotenv = __importStar(require("dotenv"));
const constants_1 = require("../lib/constants");
const semver_1 = require("semver");
dotenv.config();
/**
 * Request the creation of a report given dependencies.
 */
function createReport() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.OLYNPM_ACCESS_TOKEN) {
            npmlog_1.default.error("olypnm", "Missing Authorization Token");
            return;
        }
        console.log("\nInspecting package.json for project dependencies.\n");
        // Check for package.json file
        const path = process.cwd();
        const { content: pkg } = yield package_json_1.default.normalize(path).catch((err) => {
            if (err.code === "ENOENT") {
                npmlog_1.default.error(constants_1.LOG_PREFIX, "package.json file not found.");
            }
            throw err;
        });
        // Check for package.json dependencies object.
        if (typeof pkg.dependencies === "undefined") {
            npmlog_1.default.warn("olypnm", "No dependencies found in package.json.");
            throw new Error("No dependencies found in package.json.");
        }
        if (typeof pkg.name === "undefined") {
            npmlog_1.default.warn("olypnm", "No package name found in package.json.");
            throw new Error("No package name found in package.json.");
        }
        const list = [];
        const dependencies = pkg.dependencies;
        console.log(dependencies);
        Object.keys(dependencies).forEach((packageName) => {
            const versionRange = dependencies[packageName];
            // Skip package if version is missing.
            if (!versionRange) {
                npmlog_1.default.info(constants_1.LOG_PREFIX, `Skiped: ${packageName} version is missing`);
                return;
            }
            // version is latest
            if (/^latest$/.test(versionRange)) {
                list.push(`${packageName}@latest`);
                npmlog_1.default.info(constants_1.LOG_PREFIX, `Found: ${packageName}@latest`);
                return;
            }
            // Skip package with invalid version range.
            if (!(0, valid_1.default)(versionRange) && !(0, semver_1.valid)(versionRange)) {
                npmlog_1.default.info(constants_1.LOG_PREFIX, `Skiped: ${packageName}@${versionRange} version format not supported.`);
                return;
            }
            npmlog_1.default.info(constants_1.LOG_PREFIX, `Found: ${packageName}@${versionRange}`);
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
        console.log(body);
        const response = yield fetch(constants_1.CREATE_REPORT_API_ENDPOINT, {
            method: "POST",
            headers: headers,
            body: body,
        });
        const responseBody = yield response.json();
        if (response.status == 200) {
            console.log("\nNavigate to the following url to see the report: ", "\n");
            console.log(`${constants_1.REPORT_URL}?id=${responseBody.uuid}`, "\n\n");
            return;
        }
        console.log("Something went wrong", responseBody);
    });
}
exports.default = createReport;
//# sourceMappingURL=createReport.js.map