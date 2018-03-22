const Conf = require('conf')
const fs = require('fs')
const config = new Conf()
const ghGot = require('gh-got')
const yarnModules = require('yarn-global-modules')

class Backup {
  setToken (token) {
    config.set('token', token)
  }

  getToken () {
    return config.get('token')
  }

  removeToken () {
    config.delete('token')
  }

  setGistId (id) {
    config.set('id', id)
  }

  getGistId () {
    return config.get('id')
  }

  removeGistId () {
    config.delete('id')
  }

  getContent () {
    const path = yarnModules() + '/package.json'
    const content = fs.readFileSync(path)
    return content
  }

  async sync () {
    const content = this.getContent().toString()
    const url = this.getGistId() ? `gists/${this.getGistId()}` : 'gists'
    const { body } = await ghGot(url, {
      token: this.getToken(),
      json: true,
      body: {
        description: 'backup yarn global packages',
        files: {
          'package.json': {
            content
          }
        }
      }
    })
    return body
  }
}

module.exports = Backup
