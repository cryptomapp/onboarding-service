import app from "./app";

console.log("Starting server...");
const PORT = process.env.PORT || 3000;

console.log("PORT: ", PORT);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
