export const preventDefault = (handler) => (e) => {
  e.preventDefault();
  handler(e);
};

export const replaceAt = (arr, index, value) => {
  const _arr = [...arr];
  _arr[index] = value;
  return _arr;
};

export const createWordleLine = () => Array(5).fill({ letter: " ", state: "I" });
