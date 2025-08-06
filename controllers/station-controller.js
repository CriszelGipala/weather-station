import { stationStore } from "../models/station-store.js";

export const stationController = {
  async index(request, response) {
    const stationId = request.params.id;
    const station = await stationStore.getStationById(stationId);
    const viewData = {
      title: "Station Details",
      station: station,
      active: "dashboard"
    };
    response.render("station-view", viewData);
  }
};
