import makeApp from "../app.ts";

makeApp().listen(8080, () => {
  console.log("Server running on port 8080");
});
