const formatName = (name) => {
  const format = name.trim().split(' ');

  const nameFull = [];

  for (let word of format) {
    if (word.length === 2 && word.charAt(0) === 'd') {
      word = word.charAt(0).toLowerCase() + word.slice(1).toLowerCase();
    } else {
      word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    nameFull.push(word.trim());
  }

  const nameFormated = nameFull.filter((word) => {
    return word !== '';
  });

  return nameFormated.join(' ');
};

const formatEmail = (email) => {
  const format = email.trim();

  return format;
};

module.exports = { formatName, formatEmail };
