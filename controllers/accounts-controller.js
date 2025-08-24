import { userStore } from "../models/user-store.js";

export const accountsController = {
  async index(request, response) {
    const user = await accountsController.getLoggedInUser(request);
    if (user) {
      return response.redirect("/dashboard");
    }
    return response.render("index", { title: "Login or Signup", isAuthPage: true });
  },

  login(request, response) {
    response.render("login-view", { title: "Login to the Service", isAuthPage: true });
  },

  logout(request, response) {
    response.cookie("station", "");
    response.redirect("/");
  },

  signup(request, response) {
    response.render("signup-view", { title: "Sign up to the Service", isAuthPage: true });
  },

  async register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    console.log(`registering ${user.email}`);
    response.redirect("/");
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("station", user.email);
      console.log(`logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  async getLoggedInUser(request) {
    const email = request.cookies.station; 
    if (!email) return null;
    return await userStore.getUserByEmail(email);
  },

  // to edit user details
  async editSettings(request, response) {
    const user = await accountsController.getLoggedInUser(request);
    if (!user) return response.redirect("/");
    response.render("settings-view", { title: "Edit Settings", user });
  },

  // to update user details
  async updateSettings(request, response) {
  try {
    const current = await accountsController.getLoggedInUser(request);
    if (!current) return response.redirect("/");

    console.log("Updating settings for:", current.email);

    const updates = {
      firstName: request.body.firstName,
      lastName:  request.body.lastName,
      email:     request.body.email,
      password:  request.body.password,
    };

    // ensure userStore.updateUser exists and writes to disk
    await userStore.updateUser(current._id, updates);

    // keep cookie in sync if email changed
    response.cookie("station", updates.email);

    // redirect to dashboard after saving:
    return response.redirect("/dashboard");
  } catch (err) {
    console.error("updateSettings error:", err);
    return response.status(500).render("settings-view", {
      title: "Edit Settings",
      user: request.body,
      error: "Could not save changes. Please try again.",
    });
  }
}
}
