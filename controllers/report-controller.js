// controllers/report-controller.js
import { reportStore } from "../models/report-store.js";

export const reportController = {
  async addReport(request, response) {
    const stationId = request.params.id;
    const newReport = {
      code: request.body.code,
      temperature: request.body.temperature,
      windSpeed: request.body.windSpeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure,
      date: new Date().toISOString()
    };

    await reportStore.addReport(stationId, newReport);
    response.redirect("/station/" + stationId);
  }
};
