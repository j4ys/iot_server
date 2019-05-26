import mongoose from "mongoose";

const User = mongoose.model("User", {
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
});

export default User;
