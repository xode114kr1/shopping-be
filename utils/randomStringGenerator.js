const randomStringGenerator = (length = 10) => {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
};

module.exports = { randomStringGenerator };
