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
    default: 18
  },
  ctemp: {
    type: Number,
    default: 0
  },
  status: {
    type: Boolean,
    required: true
  },
  location: {
    type: String,
    required: true,
    default: "Location1"
  },
  human: {
    type: Boolean,
    required: true,
    default: false
  }
});

export default Device;
