import app from "./app";
import mappingRoutes from "./modules/mapping/routes/mappingRoutes";

app.use("/api/mapping",mappingRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});