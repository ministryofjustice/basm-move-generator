/* eslint-disable consistent-return */

const production = process.env.NODE_ENV === "production";

const getEnv = (name, fallback, options = {}) => {
  if (process.env[name]) {
    return process.env[name];
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback;
  }
  throw new Error(`Missing env var ${name}`);
};


module.exports = {
  getEnv,
};
