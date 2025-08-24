export const welcomeController = {
  index(request, response) {
    response.render("welcome-view", { title: "Welcome" });
  }
};
