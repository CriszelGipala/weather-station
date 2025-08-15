// controllers/station-controller.js
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

// include helpers from above here (or import them)
function minMaxNumbers(nums) { /* as above */ }
function latestByDate(reports) { /* as above */ }
function iconForCode(code) { /* as above */ }

export const stationController = {
  async viewStation(request, response) {
    const stationId = request.params.id;
    const station = await stationStore.getStationById(stationId);
    const reports = await reportStore.getReportsByStationId(stationId);

    // compute summary
    let summary = {
      minTemp: null, maxTemp: null,
      minWind: null, maxWind: null,
      minPressure: null, maxPressure: null,
      iconUrl: null
    };

    if (reports.length > 0) {
      const temps = reports.map(r => Number(r.temperature));
      const winds = reports.map(r => Number(r.windSpeed));
      const press = reports.map(r => Number(r.pressure));
      const t = minMaxNumbers(temps);
      const w = minMaxNumbers(winds);
      const p = minMaxNumbers(press);
      summary.minTemp = t.min;  summary.maxTemp = t.max;
      summary.minWind = w.min;  summary.maxWind = w.max;
      summary.minPressure = p.min; summary.maxPressure = p.max;

      const latest = latestByDate(reports);
      const iconId = latest ? iconForCode(latest.code) : "01d";
      summary.iconUrl = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
    }

    response.render("station-view", { station, reports, summary });
  },

  async deleteReport(request, response) {
    const { id, reportid } = request.params; // /station/:id/deletereport/:reportid
    await reportStore.deleteReportById(reportid);
    response.redirect(`/station/${id}`);
  },
};
