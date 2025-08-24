import express from "express";
import { welcomeController } from "./controllers/welcome-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { reportController } from "./controllers/report-controller.js";
import { accountsController } from './controllers/accounts-controller.js';
import { requireAuth } from "./controllers/auth-middleware.js";

export const router = express.Router();

// landing & authentication routes
router.get("/", accountsController.index);
router.get("/login", accountsController.login);
router.get("/signup", accountsController.signup);
router.get("/logout", accountsController.logout);
router.post("/register", accountsController.register);
router.post("/authenticate", accountsController.authenticate);

// to update and edit user details
router.get("/settings", requireAuth, accountsController.editSettings);
router.post("/settings", requireAuth, accountsController.updateSettings);

router.get("/", welcomeController.index);
router.get("/", dashboardController.index);
router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addstation", dashboardController.addStation);
router.get("/station/:id", stationController.viewStation);
router.get("/about", aboutController.index);
router.post("/station/:id/addreport", reportController.addReport);

