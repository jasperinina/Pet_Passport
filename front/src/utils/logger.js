const isProduction = import.meta.env.PROD;

export const logger = {
  error: (...args) => {
    if (!isProduction) {
      console.error(...args);
    }
  },
};
