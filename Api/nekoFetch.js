const { get } = require("superagent");

async function nekoFetch(action, member, text) {
  const { body } = await get(
    `https://nekobot.xyz/api/imagegen?type=${action}&username=${member}&text=${text}`
  );
  console.log(body);
  return body.message;
}

module.exports = { nekoFetch };