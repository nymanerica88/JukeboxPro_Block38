import express from "express";
import bcrypt from "bcrypt";
const userRouter = express.Router();

import { createUser, getUserByUsername } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

userRouter.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await createUser(username, password);
      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await getUserByUsername(username);
      if (!user) return res.status(401).send("Invalid username or password");

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(401).send("Invalid username or password");

      const token = createToken({ id: user.id });
      res.status(200).send(token);
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
