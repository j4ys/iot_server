import * as yup from "yup";

export const registerschema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(3)
    .max(10),
  email: yup
    .string()
    .required()
    .email()
    .min(10)
    .max(255),
  password: yup
    .string()
    .required()
    .min(8)
    .max(50)
});

export const adddeviceschema = yup.object().shape({
  name: yup
    .string()
    .required()
    .min(3)
    .max(20),
  device_id: yup
    .string()
    .required()
    .min(3)
    .max(8),
  status: yup.boolean().required()
});
