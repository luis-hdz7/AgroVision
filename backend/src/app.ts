import express from "express";
import cors from "cors";

const app = express();

//middleware base
app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

export default app;