import * as express from "express";
import * as nunjucks from "nunjucks";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as Redis from "ioredis";
import {SessionStore, SessionMiddleware, CookieConfig} from "ch-node-session-handler";

import router from "./routers/routers";
import {ERROR_SUMMARY_TITLE} from "./model/error.messages";
import {ROOT} from "./model/page.urls";
import authMiddleware from "./middleware/auth.middleware";
import certifcateMiddleware from "./middleware/certificate.middleware";
import SaveSessionWrapper from "./session/save-session-wrapper";
import {PIWIK_SITE_ID, PIWIK_URL, COOKIE_SECRET, CACHE_SERVER} from "./session/config";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// where nunjucks templates should resolve to
const viewPath = path.join(__dirname, "views");

// set up the template engine
const env = nunjucks.configure([
  viewPath,
  "node_modules/govuk-frontend/",
  "node_modules/govuk-frontend/components",
], {
  autoescape: true,
  express: app,
});

const cookieConfig: CookieConfig = { cookieName: "__SID", cookieSecret: COOKIE_SECRET};
const sessionStore = new SessionStore(new Redis(`redis://${CACHE_SERVER}`));

app.use(SessionMiddleware(cookieConfig, sessionStore));
app.use(SaveSessionWrapper(cookieConfig, sessionStore));
app.use(ROOT, authMiddleware);
app.use(ROOT, certifcateMiddleware);

app.set("views", viewPath);
app.set("view engine", "html");

// add global variables to all templates
env.addGlobal("CDN_URL", process.env.CDN_HOST);
env.addGlobal("PIWIK_URL", PIWIK_URL);
env.addGlobal("PIWIK_SITE_ID", PIWIK_SITE_ID);
env.addGlobal("ERROR_SUMMARY_TITLE", ERROR_SUMMARY_TITLE);

// serve static assets in development.
// this will execute in production for now, but we will host these else where in the future.
if (process.env.NODE_ENV !== "production") {
  app.use("/orderable/certificates/static", express.static("dist/static"));
  env.addGlobal("CSS_URL", "/orderable/certificates/static/app.css");
  env.addGlobal("FOOTER", "/orderable/certificates/static/footer.css");
} else {
  app.use("/orderable/certificates/static", express.static("static"));
  env.addGlobal("CSS_URL", "/orderable/certificates/static/app.css");
  env.addGlobal("FOOTER", "/orderable/certificates/static/footer.css");
}

// apply our default router to /
app.use("/", router);

export default app;
