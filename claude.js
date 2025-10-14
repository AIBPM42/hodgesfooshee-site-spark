import fs from 'fs'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

const task = process.argv[2] || 'claude: audit ClaudeGitHubApp'
const claudeMd = fs.readFileSync('./CLAUDE.md', 'utf8')
const claudeYml = fs.readFileSync('./claude.yml', 'utf8')

const prompt = `
You are Claude, Kelvin’s co-architect. Follow his standards from CLAUDE.md and schema from claude.yml.

Task: ${task}

CLAUDE.md:
${claudeMd}

claude.yml:
${claudeYml}
`

const body = {
  model: 'claude-3-opus-20240229',
  max_tokens: 1000,
  temperature: 0.4,
  messages: [{ role: 'user', content: prompt }]
}

fetch(CLAUDE_API_URL, {
  method: 'POST',
  headers: {
    'x-api-key': CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  },
  body: JSON.stringify(body)
})
  .then(res => res.json())
  .then(data => {
    console.log('\n🧠 Claude:\n')
    console.log(data?.content?.[0]?.text || 'No response')
  })
  .catch(err => console.error('Error:', err))
