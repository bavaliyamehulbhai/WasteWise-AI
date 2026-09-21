import mongoose from "mongoose";
import os from "os";

export const getSystemHealth = async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    // In a real production app we would perform a real mock query against the AI provider.
    // For this deployment, we will return simulated healthy if process.env.GROQ_API_KEY exists.
    const aiProviderStatus = process.env.GROQ_API_KEY ? "healthy" : "unconfigured";

    const systemMemory = {
      total: Math.round(os.totalmem() / 1024 / 1024),
      free: Math.round(os.freemem() / 1024 / 1024),
      used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
    };

    const processMemory = {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024), // Resident Set Size
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    };

    const uptimeSeconds = Math.floor(process.uptime());
    
    const formatUptime = (seconds) => {
      const d = Math.floor(seconds / (3600*24));
      const h = Math.floor(seconds % (3600*24) / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      return `${d}d ${h}h ${m}m`;
    };

    res.json({
      success: true,
      health: {
        api: "healthy",
        database: dbStatus,
        aiProvider: aiProviderStatus,
        uptime: formatUptime(uptimeSeconds),
        systemMemory,
        processMemory,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
