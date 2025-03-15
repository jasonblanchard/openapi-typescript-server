import makeApp from "../app.ts";

makeApp().listen(3000, () => {
  console.log("Server running on port 3000");
});
