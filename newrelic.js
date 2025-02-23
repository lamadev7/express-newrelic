
require("dotenv").config();

exports.config = {
    app_name: [process.env.NEW_RELIC_APP_NAME],
    license_key: process.env.NEW_RELIC_LICENSE_KEY,
    logging: {
      level: 'info' // 'trace' for debugging, 'info' for production
    },
    allow_all_headers: true,
    distributed_tracing: {
      enabled: true // Helps track requests across microservices
    }
  };
  