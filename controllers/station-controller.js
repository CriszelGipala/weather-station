// controllers/station-controller.js
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

export const stationController = {
  async viewStation(request, response) {
    const stationId = request.params.id;
    const station = await stationStore.getStationById(stationId);
    const reports = await reportStore.getReportsByStationId(stationId);

    // --- Calculate summary manually ---
    let summary = {
      minTemp: null,
      maxTemp: null,
      minWind: null,
      maxWind: null,
      minPressure: null,
      maxPressure: null,
      latestCode: null
    };

    if (reports.length > 0) {
      // Start with the first report's values
      summary.minTemp = reports[0].temperature;
      summary.maxTemp = reports[0].temperature;
      summary.minWind = reports[0].windSpeed;
      summary.maxWind = reports[0].windSpeed;
      summary.minPressure = reports[0].pressure;
      summary.maxPressure = reports[0].pressure;

      // Loop through remaining reports
      for (let i = 1; i < reports.length; i++) {
        const r = reports[i];

        if (r.temperature < summary.minTemp) summary.minTemp = r.temperature;
        if (r.temperature > summary.maxTemp) summary.maxTemp = r.temperature;

        if (r.windSpeed < summary.minWind) summary.minWind = r.windSpeed;
        if (r.windSpeed > summary.maxWind) summary.maxWind = r.windSpeed;

        if (r.pressure < summary.minPressure) summary.minPressure = r.pressure;
        if (r.pressure > summary.maxPressure) summary.maxPressure = r.pressure;
      }

      // Latest code = code from the last report in the array
      summary.latestCode = reports[reports.length - 1].code;
    }

    // Send station, reports, and summary to the view
    response.render("station-view", { station, reports, summary });
  }
};
