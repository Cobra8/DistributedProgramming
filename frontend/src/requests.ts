import axios from "axios";
import { __backend__ } from "./constants";

/* do not crash for status codes outside of 200 - 300, instead allow the callback to handle these */
axios.defaults.validateStatus = null;

/* ================================ Routers ================================ */
export const routersStart = async (values: { identifier: string; name: string }) => {
  return await axios.post(__backend__ + "routers/start", values);
};

export const routersStop = async (values: { identifier: string }) => {
  return await axios.post(__backend__ + "routers/stop", { identifier: values.identifier });
};

export const routersBroadcast = async (values: { identifier: string }) => {
  return await axios.get(__backend__ + "routers/broadcast/" + values.identifier);
};

export const routersUpdate = async (values: { identifier: string }) => {
  return await axios.get(__backend__ + "routers/update/" + values.identifier);
};

export const routersStatus = async (values: { identifier: string }) => {
  return await axios.get(__backend__ + "routers/status/" + values.identifier);
};

/* ================================ Interfaces ================================ */
export const interfacesAdd = async (values: { src_identifier: string; dst_identifier: string; dst_name: string }) => {
  return await axios.post(__backend__ + "interfaces/add", values);
};

export const interfacesRemove = async (values: { src_identifier: string; dst_name: string }) => {
  return await axios.post(__backend__ + "interfaces/remove", {
    src_identifier: values.src_identifier,
    dst_name: values.dst_name,
  });
};

/* ================================ Messages ================================ */
export const sendMessage = async (values: { src_identifier: string; dst_name: string; message: string }) => {
  return await axios.post(__backend__ + "messages/send", values);
};

export const traceMessage = async (values: { src_identifier: string; dst_name: string; message: string }) => {
  return await axios.post(__backend__ + "messages/trace", values);
};
