// controllers/report-controller.js
import { reportStore } from "../models/report-store.js";

export const reportController = {
  async addReport(request, response) {
    const stationId = request.params.id;
    const newReport = {
      date: new Date().toISOString(),
      code: request.body.code,
      temperature: request.body.temperature,
      windSpeed: request.body.windSpeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure
    };

    await reportStore.addReport(stationId, newReport);
    response.redirect("/station/" + stationId);
    },
  
   async deleteReport(request, response) {
    try {
      const { stationid, reportid } = request.params;
      await reportStore.deleteReport(reportid);
      response.redirect(`/station/${stationid}`);
    } catch (err) {
      response.status(500).send("Error deleting report");
    }
  },
};
