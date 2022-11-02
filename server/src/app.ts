import express from "express";
import history from "connect-history-api-fallback";

export const createApp = () => {
  const app = express();

  app.use(
    history({
      rewrites: [
        {
          // prevent socket request from been treated as Vue pages
          from: /^\/socket.io\/.*$/,
          to: function (context) {
            return context.parsedUrl.path || "";
          },
        },
        {
          // prevent request from been treated as Vue pages
          from: /^\/api\/.*$/,
          to: function (context) {
            return context.parsedUrl.path || "";
          },
        },
      ],
    })
  );

  return app;
};
