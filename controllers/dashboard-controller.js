import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";



function tempSummary(reports) {
  const out = { tempMin: null, tempMax: null };
  if (!reports || reports.length === 0) return out;

  let min = Number(reports[0].temperature);
  let max = Number(reports[0].temperature);

  for (let i = 1; i < reports.length; i++) {
    const t = Number(reports[i].temperature);
    if (t < min) min = t;
    if (t > max) max = t;
  }
  out.tempMin = min;
  out.tempMax = max;
  return out;
}

export const dashboardController = {
  async index(req, res) {
    const user = await accountsController.getLoggedInUser(req);
    let stations = await stationStore.getStationsByUserId(user._id);

    // (optional) sort A→Z
    stations.sort((a, b) => (a.title || a.name).localeCompare(b.title || b.name));

    // attach summary for each station
    const stationsWithSummary = [];
    for (const s of stations) {
      const reports = await reportStore.getReportsByStationId(s._id);
      stationsWithSummary.push({
        ...s,
        summary: tempSummary(reports),   // <- { tempMin, tempMax }
      });
    }

    res.render("dashboard-view", { title: "Weather Dashboard", stations: stationsWithSummary, active: "dashboard" });
  },

  

  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const newStation = {
      title: request.body.title,
      userid: loggedInUser._id,
    };
    console.log(`adding station ${newStation.title}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  }, 

  async deleteStation(request, response) {
    const stationId = request.params.id;
    console.log(`Deleting Station ${stationId}`);
    await stationStore.deleteStationById(stationId);
    response.redirect("/dashboard");
  },
};

