"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_PREFIX = exports.CREATE_REPORT_API_ENDPOINT = exports.REPORT_URL = exports.OLYNPM_BASE_URL = void 0;
// Base URL
exports.OLYNPM_BASE_URL = "http://localhost:3000";
// export const OLYNPM_BASE_URL =
//   "https://olynpm-57iwjkmfa-martin-fresnosatech.vercel.app";
// Routes
exports.REPORT_URL = `${exports.OLYNPM_BASE_URL}/report`;
// API
exports.CREATE_REPORT_API_ENDPOINT = `${exports.OLYNPM_BASE_URL}/api/report`;
// Log prefix
exports.LOG_PREFIX = "olynpm";
//# sourceMappingURL=constants.js.map