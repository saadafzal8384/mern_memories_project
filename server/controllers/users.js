import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Users from "../models/users.js";
dotenv.config();
export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!existingUser) {
        return res.status(400).json({ message: "Invalid Credentials" });
      } else {
        const token = jwt.sign(
          { id: existingUser._id, email: existingUser.email },
          process.env.secret,
          { expiresIn: "1h" }
        );
        res.status(200).json({ result: existingUser, token });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  console.log("BBB");
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await Users.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await Users.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.secret,
      { expiresIn: "1h" }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    console.log("AAA");
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
