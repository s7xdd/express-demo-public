import express from "express";
import path from "path";

import { Server } from "socket.io";
import http from "http";
import morgan from "morgan";

import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import cors from "cors";

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_KEY!);

const app = express();

app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(cors());

//SOCKET IO
const server = http.createServer(app);
const io = new Server(server);

//Passport JS
app.use(cookieParser("Hello world"));
app.use(
  session({
    secret: process.env.PASSPORT_SECRET_KEY!,
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

let count = 1;
const showlogs = (req: any, res: any, next: any) => {
  console.log("\n==============================");
  console.log(`------------>  ${count++}`);

  console.log(`\n req.session.passport -------> `);
  console.log(req.session.passport);

  console.log(`\n req.user -------> `);
  console.log(req.user);

  console.log("\n Session and Cookie");
  console.log(`req.session.id -------> ${req.session.id}`);
  console.log(`req.session.cookie -------> `);
  console.log(req.session.cookie);

  console.log("===========================================\n");

  next();
};

// app.use(showlogs);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use("/api/v1/checkout", express.static(path.join(__dirname, "..", "..", "modules", "checkout", "views")));

export { app, io, server };
