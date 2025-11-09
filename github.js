const axios = require('axios');

async function postComment(repo, issueNumber, message) {
  await axios.post(`https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`, {
    body: message
  }, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
}

module.exports = { postComment };
