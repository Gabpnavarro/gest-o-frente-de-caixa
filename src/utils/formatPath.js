const path = require('path');

const formatPathLink = (url) => {
  const fileName = path.basename(url);
  return fileName;
};

module.exports = { formatPathLink };
