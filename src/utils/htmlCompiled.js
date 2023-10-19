const fs = require('fs/promises');
const handlebars = require('handlebars');

const htmlCompiled = async (file, context) => {
  const html = await fs.readFile(file);
  const compiled = handlebars.compile(html.toString());
  const htmlString = compiled(context);
  return htmlString;
};

module.exports = htmlCompiled;
