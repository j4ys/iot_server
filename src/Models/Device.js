import mongoose from "mongoose";

const Device = mongoose.model("Device", {
  name: {
    type: String,
    required: true,
    unique: true
  },
  device_id: {
    type: String,
    required: true,
    unique: true
  },
  temp: {
    type: Number,
    default: 0
  },
  status: {
    type: Boolean,
    required: true
  }
});

export default Device;
