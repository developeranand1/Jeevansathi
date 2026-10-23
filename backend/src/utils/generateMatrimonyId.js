const generateMatrimonyId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `JS-${randomNum}`;
};

module.exports = generateMatrimonyId;
