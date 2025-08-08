import express from "express";
import { welcomeController } from "./controllers/welcome-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { reportController } from "./controllers/report-controller.js";

export const router = express.Router();

router.get("/", welcomeController.index);
router.get("/", dashboardController.index);
router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addstation", dashboardController.addStation);
router.get("/station/:id", stationController.viewStation);
router.get("/about", aboutController.index);
router.post("/station/:id/addreport", reportController.addReport);