/**
 * Just creating a dummy random ID generator which is not perfect
 * but will get the job done for a prototype
 */
const getUniqueRandomId = () =>
  `${(+new Date()).toString(16)}-${Math.round(Math.random() * 10000).toString(16)}`;

export {
  getUniqueRandomId
};