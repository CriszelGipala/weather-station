// controllers/auth-middleware.js
import { accountsController } from "./accounts-controller.js";

export async function requireAuth(request, response, next) {
  const user = await accountsController.getLoggedInUser(request);
  if (!user) return response.redirect("/");
  request.user = user;
  next();
}
