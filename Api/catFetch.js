const { get } = require("superagent");

async function catFetch() {
  const { body } = await get(
    `https://api.thecatapi.com/v1/images/search`, {
    headers: {
      "x-api-key": client.config.cattoKey,
    },
  });
  console.log(body);
  return body.message;
}

module.exports = { catFetch };