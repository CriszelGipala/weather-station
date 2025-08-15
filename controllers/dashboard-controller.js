// controllers/dashboard-controller.js
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";

// include helpers from above (or import)
function minMaxNumbers(nums) { /* as above */ }
function latestByDate(reports) { /* as above */ }
function iconForCode(code) { /* as above */ }

export const dashboardController = {
  async index(req, res) {
    const user = await accountsController.getLoggedInUser(req);
    let stations = await stationStore.getStationsByUserId(user._id);

    // alphabetical by name/title (support either key)
    stations.sort((a, b) => (a.title || a.name).localeCompare(b.title || b.name));

    // attach per-station summary for dashboard cards
    const withSummary = [];
    for (const s of stations) {
      const reports = await reportStore.getReportsByStationId(s._id);
      const temps = reports.map(r => Number(r.temperature));
      const winds = reports.map(r => Number(r.windSpeed));
      const press = reports.map(r => Number(r.pressure));
      const t = minMaxNumbers(temps);
      const w = minMaxNumbers(winds);
      const p = minMaxNumbers(press);
      const latest = latestByDate(reports);
      const iconId = latest ? iconForCode(latest.code) : "01d";

      withSummary.push({
        ...s,
        summary: {
          tempMin: t.min, tempMax: t.max,
          windMin: w.min, windMax: w.max,
          presMin: p.min, presMax: p.max,
          iconUrl: `https://openweathermap.org/img/wn/${iconId}@2x.png`,
        }
      });
    }

    res.render("dashboard-view", { title: "Weather Dashboard", stations: withSummary });
  },

  async addStation(req, res) {
    const user = await accountsController.getLoggedInUser(req);
    const { title, lat, lng } = req.body;
    await stationStore.addStation({ title, lat: Number(lat), lng: Number(lng), userid: user._id });
    res.redirect("/dashboard");
  },

  async deleteStation(req, res) {
    const { id } = req.params;
    await stationStore.deleteStationById(id); // cascades reports
    res.redirect("/dashboard");
  },
};
