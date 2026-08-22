import "dotenv/config";
import app from "./app";
import { startEscalationScheduler } from "./services/escalation.service";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Smart e-District Server running on port ${PORT}`);
  // Start background escalation daemon
  startEscalationScheduler();
});