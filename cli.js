#!/usr/bin/env node
'use strict'
const cac = require('cac')
const Backup = require('./')
const cli = cac()

const backup = new Backup()

const defaultCommand = cli.command('*', 'My Default Command', (input, flags) => {
  if (flags.getToken) {
    console.log('🎉  Token: ' + backup.getToken())
  }

  if (flags.setToken) {
    backup.setToken(flags.setToken)
    console.log('✨ Done!')
  }

  if (flags.removeToken) {
    backup.removeToken()
    console.log('✨ Done!')
  }

  if (flags.getGistId) {
    console.log('🎉  Gist Id: ' + backup.getGistId())
  }

  if (flags.removeGistId) {
    backup.removeGistId()
    console.log('✨ Done!')
  }

  process.exit()
})

defaultCommand.option('set-token', {
  desc: 'Set github token'
})

defaultCommand.option('get-token', {
  desc: 'Get github token'
})

defaultCommand.option('remove-token', {
  desc: 'Remove github token'
})

defaultCommand.option('get-gist-id', {
  desc: 'Get gist id'
})

defaultCommand.option('remove-gist-id', {
  desc: 'Remove gist id'
})

cli.command('sync', {
  desc: 'Sync package.json to github gist'
}, async () => {
  try {
    const result = await backup.sync()
    backup.setGistId(result.id)
    console.log(`Sync successfully! html url: ${result.html_url}`)
    process.exit()
  } catch (err) {
    const code = err.statusCode

    if (code === 401) {
      console.log('Please use `backup-package --set-token your token` to set token first')
    } else {
      console.log(err.stack)
    }

    process.exit(1)
  }
})

cli.parse()
