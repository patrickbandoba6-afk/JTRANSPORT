import { createApp } from "./app.js";
import { env } from "./env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`JTransport API listening on http://localhost:${env.PORT}`);
});
