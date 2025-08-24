
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

export const stationController = {
  async viewStation(request, response) {
    const stationId = request.params.id;
    const station   = await stationStore.getStationById(stationId);
    const reports   = await reportStore.getReportsByStationId(stationId);

    // Send station, reports, and summary to the view
    response.render("station-view", { station, reports});
  }
};
