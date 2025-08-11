import getConfig from 'next/config';

const { publicRuntimeConfig = {} } = getConfig() || {};

export default {
  get: (path: string, defaultValue?: any) => {
    const result = String.prototype.split
      .call(path, /[,[\].]+?/)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        publicRuntimeConfig,
      );
    return result === undefined || result === publicRuntimeConfig
      ? defaultValue
      : result;
  },
};
