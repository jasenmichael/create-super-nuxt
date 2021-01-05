#!/usr/bin/env node
const fs = require('fs')
const execa = require('execa')
const initSuperNuxt = require('./superNuxt').install
const createSuperNuxtTheme = require('./superNuxt').createTheme
const chalk = require('chalk')

;(async () => {
  const { installPath, nuxtExist } = await setup()
  if (!nuxtExist) {
    await installNuxt(installPath)
  }
  await installSuperNuxt(installPath, nuxtExist)
})()

async function setup() {
  const args = process.argv.slice(2)
  const cwd = process.cwd()
  let dirEmpty = undefined
  let nuxtExist = undefined
  // console.log(cwd
  // console.log(args)

  const helpText = `Usage: create-super-nuxt [relative-path] || .
path must only contain _-. letters and numbers

use . for current directory(must be empty)

if already a nuxt project, will skip installing Nuxt 
and go straight to installing Super Nuxt

-h, --help           print this command line options.
-ct, --create-theme  creates a super-nuxt theme from current project,
`
  // check if help flag passed
  if (args.includes('--help') | args.includes('-h')) {
    console.log(helpText)
    process.exit()
  }

  if (args.includes('--create-theme') | args.includes('-ct')) {
    const themeCreated = await createSuperNuxtTheme(args)
    if (themeCreated.success) {
      console.log(
        chalk.green(`Theme "${themeCreated.name}" created in themes/`)
      )
      process.exit()
    } else {
      console.log(chalk.red('ERROR creating theme', themeCreated.error))
      process.exit()
    }
  }

  // no help flag passed, see if path specified is valid
  if (args.length && args[0]) {
    const valid = new RegExp('^[0-9A-Za-z_.-]+$')
    if (args[0] !== '.' && !valid.test(args[0])) {
      console.log(`name "${args[0]}" invalid, exiting installation
    `)
      console.log(helpText)
      process.exit()
    } // else console.log('name valid', args[0])
  }

  // no path or "." passed, checking if current directory is empty, set to cwd
  let installPath = cwd
  if ((!args.length || args[0] === '.') && fs.readdirSync(cwd).length !== 0) {
    // dir not empty
    dirEmpty = false
  } else {
    // path was passed(not .), set path
    installPath = cwd + '/' + args[0]
    // check of installPath exist and is empty
    if (
      !fs.existsSync(installPath) ||
      (fs.existsSync(installPath) && fs.readdirSync(installPath).length === 0)
    ) {
      dirEmpty = true
    } else {
      dirEmpty = false
    }
  }
  // installPath is set,

  // if installPath not empty and, nuxt exist
  if (
    !dirEmpty &&
    fs.existsSync(installPath + '/nuxt.config.js') &&
    fs.existsSync(installPath + '/package.json')
  ) {
    console.log('Nuxt already installed, installing Super Nuxt now.')
    nuxtExist = true
  } else {
    if (dirEmpty) {
      nuxtExist = false
    } else {
      console.log('Directory not empty, exiting')
      console.log(helpText)
      process.exit()
    }
  }
  // console.log(installPath)
  // console.log(dirEmpty)
  return { installPath, nuxtExist }
}

async function installNuxt(path) {
  console.log('installing Nuxt to ', path)
  if (!fs.existsSync(path)) {
    await execa('mkdir', [path])
  }
  const command = `npx create-nuxt-app ${path}`
  try {
    await execa.command(command, {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
  } catch (error) {
    if (error.signalDescription === 'User interruption with CTRL-C') {
      console.log(`
Canceled Nuxt installation, exiting now.
`)
      process.exit()
    } else console.log('Nuxt installation FAILED', error)
  }
  return
}

async function installSuperNuxt(path) {
  console.log('installing Super Nuxt to ', path)
  //  [x] 1: backup nuxt.config.js
  //  [ ] 2: Select Theme
  //  [x] 3: Setup nuxt.config.js
  //         pull in global supernuxt.config
  //  [x] 4: Install packages
  //         merge theme deps with global deps
  //  [x] 5: Merge global supernuxt scripts (add missing, replace existing)
  //         merge theme scripts with global scripts
  //  [ ] 6: Replace (remove and copy) folders
  //         remove and replace global folders
  //         merge theme folders
  //  [ ] 7: Merge folders (copy into, replace if exist)
  //         merge global folders
  //         merge theme folders
  try {
    await initSuperNuxt(path)
  } catch (error) {
    console.log('Error installing Super Nuxt', error)
  }
  return
}
