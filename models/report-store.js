import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("reports");

export const reportStore = {
  async getAllReports() {
    await db.read();
    return db.data.reports;
  },

  async getReportsByStationId(id) {
    await db.read();
    return db.data.reports.filter((report) => report.stationId === id);
  },

async addReport(stationId, report) {
    await db.read();
    report._id = uuid();
    report.stationId = stationId;
    // NEW: store created date/time
    report.date = new Date().toISOString();
    db.data.reports.push(report);
    await db.write();
    return report;
  },

  async getReportById(id) {
    await db.read();
    return db.data.reports.find((report) => report._id === id);
  },

  async deleteReportById(id) {
    await db.read();
    const i = db.data.reports.findIndex((r) => r._id === id);
    if (i >= 0) db.data.reports.splice(i, 1);
    await db.write();
  },

  async deleteAllReports() {
    db.data.reports = [];
    await db.write();
  },

  async deleteReportsByStationId(stationId) {
    await db.read();
    db.data.reports = db.data.reports.filter((r) => r.stationId !== stationId);
    await db.write();
  },

  // I don't think updatereport should be here, but it is needed for the demo
  // so I will leave it here for now
  async updateReport(report, updatedReport) {
    report.code = updatedReport.code;
    report.temperature = updatedReport.temperature;
    report.windSpeed = updatedReport.windSpeed;
    report.windDirection = updatedReport.windDirection;
    report.pressure = updatedReport.pressure;
    await db.write();
  },
};
