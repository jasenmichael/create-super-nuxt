#!/usr/bin/env node

// const exec = require('child_process').exec
const fs = require('fs')
const writeJson = require('write-json-file')
const inquirer = require('inquirer')
const chalk = require('chalk')
const execa = require('execa')
const beautify = require('js-beautify').js

// init
//  [x] 1: Check for nuxt.config and package.json
//  [x] 1: backup nuxt.config ??add package??
//  [x] 2: Select Theme
//  [x] 3: Setup nuxt.config.js
//  [x] 4: Install packages
//  [x] 5: Merge scripts (add missing, replace existing)
//  [ ] 6: Replace folders
//  [ ] 7: Merge folders

const install = async function (path) {
  const nuxtConfigPath = path + '/nuxt.config.js'
  const pkgJsonPath = path + '/package.json'
  const confExist = fs.existsSync(nuxtConfigPath)
  const pkgExist = fs.existsSync(pkgJsonPath)

  // 1: Check for nuxt.config and package.json
  if (confExist && pkgExist) {
    // 2: backup nuxt.config.js
    fs.copyFileSync(
      nuxtConfigPath,
      nuxtConfigPath.replace('nuxt.config.js', 'backup-nuxt.config.js'),
      (err) => {
        if (err) {
          console.error('ERROR BACKING UP', err)
          process.exit()
        }
      }
    )
    console.log(
      `nuxt.config.js backed up to ${nuxtConfigPath.replace(
        'nuxt.config.js',
        'backup-nuxt.config.js'
      )}`
    )
    // 3: Select Theme
    const theme = await selectTheme(pkgJsonPath, path)

    // check theme config exist...
    const noThemeConfig = {
      dependencies: [],
      devDependencies: [],
      scripts: {},
      mergeNuxtConfig: {},
    }
    const themeConfig =
      theme !== 'no-theme'
        ? require(`${__dirname}/../themes/${theme}/theme.config.json`)
        : noThemeConfig

    console.log(
      theme !== 'no-theme' ? `Theme Selected: ${theme}` : 'No Theme Selected'
    )
    // 4: Setup nuxt.config.js
    const superNuxtConfigPath = __dirname + '/../supernuxt.config.js'
    let options = await setupNuxtConfig(
      superNuxtConfigPath,
      nuxtConfigPath,
      themeConfig
    )
    options = { ...options, themeConfig }
    // 5: Merge scripts
    await mergeScripts(pkgJsonPath, {
      ...options.scripts,
      ...options.themeConfig.scripts,
    })

    // 6: Install packages
    const { ...optionsDependencies } = options
    const pkgsInstalled = await installPackages(
      path,
      pkgJsonPath,
      optionsDependencies
    )

    if (pkgsInstalled) {
      // 7: Replace folders
      await addFolders(path, theme)
      // 8: Merge folders
      // await mergeFolders(options.mergeFolders)

      // poast scripts
      // remove tailwind
      // await bashCmd(
      //   path,
      //   'npm uninstall @nuxtjs/tailwindcss tailwindcss',
      //   'remove tailwind'
      // )
      // // upgrade tailwind
      // await bashCmd(
      //   path,
      //   'npm i -D tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9',
      //   'upgrade tailwind to 2.0'
      // )
      complete(theme)
    }
  }

  // nuxt.config and/or package.json NOT EXIST
  else {
    if (!confExist) {
      console.log(
        'nuxt.config.js file not found..\n',
        'Make sure you are inside your Nuxt project directory'
      )
    }
    if (!pkgExist) {
      console.log('package.json file not found..')
    }
    console.log('exiting')
    process.exit()
  }
}

const selectTheme = async (pkgJsonPath, path) => {
  const { dependencies, devDependencies } = require(pkgJsonPath)
  const cssFrameWorks = ['@nuxtjs/tailwindcss', '@nuxtjs/vuetify']
  const installedCssFrameworks = Object.keys({
    ...dependencies,
    ...devDependencies,
  })
    .filter((pkg) => cssFrameWorks.includes(pkg))
    .map((framework) => framework.replace('@nuxtjs/', ''))
  let availableThemes = fs
    .readdirSync(`${__dirname}/../themes/`)
    .filter((f) => f !== '_global')
    .filter((theme) =>
      fs.existsSync(`${__dirname}/../themes/${theme}/theme.config.json`)
    )
  availableThemes.unshift('no-theme')
  console.log(
    chalk.blue('Recommended to use one of the installed css framework(s)')
  )
  console.log(
    chalk.yellow('Installed css framework(s): '),
    chalk.green(installedCssFrameworks.join(', '))
  )
  console.log(chalk.underline.yellow('Select Theme'))

  return await inquirer
    .prompt([
      {
        type: 'list',
        name: 'theme',
        message: 'Select a theme',
        choices: availableThemes,
      },
    ])
    .then((answers) => {
      console.log(answers.theme)
      return answers.theme
    })
}

const setupNuxtConfig = async (
  superNuxtConfigPath,
  nuxtConfigPath,
  themeConfig
) => {
  // first read config as string
  const config = fs.readFileSync(superNuxtConfigPath).toString()

  const global = config.split('module.exports =')[0]

  // write it without globals
  fs.writeFileSync(superNuxtConfigPath, config.replace(global, ''))

  // load supernuxtConfig as js without globals
  const options = require(superNuxtConfigPath)

  // resave supernuxt.config to original
  fs.writeFileSync(superNuxtConfigPath, config, 'utf-8')

  // get nuxt.config.js as text
  const nuxtConfigText = fs.readFileSync(nuxtConfigPath).toString()
  // change "export default" to "module.exports =", and load as Object ;)
  fs.writeFileSync(
    nuxtConfigPath,
    'module.exports = ' + nuxtConfigText.split('export default ')[1]
  )
  const nuxtExportDefault = require(nuxtConfigPath)
  // merge addReplaceNuxtConfig into nuxt config, adding or replacing
  const updated = {
    ...nuxtExportDefault,
    ...options.addReplaceNuxtConfig,
  }
  Object.keys(options.mergeNuxtConfig).map((option) => {
    // get each mergeNuxtConfig, and concat with
    const updatedOption = nuxtExportDefault[option]
      .concat(options.mergeNuxtConfig[option])
      .concat(themeConfig.mergeNuxtConfig[option])
    // remove duplicates
    updated[option] = updatedOption.filter(
      (item, pos) => updatedOption.indexOf(item) === pos
    )
  })

  let text = await convertToText(updated)

  // get template for spreaders
  let spreaders = []
  await Promise.all(
    text.split(': "...').filter((line, i) => {
      let res = line.split('",')[0]
      if (i != 0) {
        // console.log('---', res)
        // return res
        spreaders.push(res)
      }
    })
  )
  // replace spreaders
  await Promise.all(
    spreaders.map((spreader, i) => {
      // console.log(`${spreader}: "${spreader}"`)
      text = text.replace(`${spreader}: "...${spreader}"`, `...${spreader}`)
    })
  )

  // replace all other template strings
  const final =
    // global +
    '\n' +
    'export default' +
    text
      .replace(/: "''''''"/g, '')
      .replace(/"'''/g, '')
      .replace(/'''"/g, '')
      .replace()

  // beutify and save nuxt.config.js
  fs.writeFileSync(
    nuxtConfigPath,
    beautify(final, { indent_size: 2, space_in_empty_paren: true }),
    'utf-8'
  )

  console.log('nuxt.config.js updated')
  // reload nuxt.config.js as text
  const appendedFinal = await fs.readFileSync(nuxtConfigPath).toString()
  // append global variable above export default
  fs.writeFileSync(
    nuxtConfigPath,
    appendedFinal.replace('export default', global + 'export default'),
    'utf-8'
  )
  return options
}

const mergeScripts = async (pkgJsonPath, scripts) => {
  let pkg = require(pkgJsonPath)
  pkg.scripts = {
    ...pkg.scripts,
    ...scripts,
  }
  await writeJson(pkgJsonPath, pkg)
}

const installPackages = async (path, pkgJsonPath, options) => {
  // console.log('options', options)
  const pkg = require(pkgJsonPath)
  const dependencies = [
    ...options.dependencies,
    ...options.themeConfig.dependencies,
    ...options.mergeNuxtConfig.modules,
  ].filter((dep) => !pkg.dependencies[dep])
  // .filter((c, i) => dependencies.indexOf(c) === i)

  const devDependencies = [
    ...options.devDependencies,
    ...options.themeConfig.devDependencies,
    ...options.mergeNuxtConfig.buildModules,
  ].filter((dep) => !pkg.devDependencies[dep])
  // .filter((c, i) => devDependencies.indexOf(c) === i)

  if (dependencies.length) {
    const installDependenciesCmd =
      'npm install ' + [...new Set(dependencies)].join(' ')
    console.log(
      `Installing Additional Dependencies:\r\n  ${installDependenciesCmd}`
    )
    await bashCmd(path, installDependenciesCmd, 'installing dev dependencies')
  }

  if (devDependencies.length) {
    const installDevDependenciesCmd =
      'npm install -D ' + [...new Set(devDependencies)].join(' ')
    console.log(
      `Installing Additional Dev Dependencies:\r\n  ${installDevDependenciesCmd}`
    )
    await bashCmd(
      path,
      installDevDependenciesCmd,
      'installing dev dependencies'
    )
  }
  return true
}

const addFolders = async (path, theme) => {
  const globalThemeDir = `${__dirname}/../themes/_global`
  const themeDir = `${__dirname}/../themes/${theme}`
  const folders = theme !== 'no-theme' ? fs.readdirSync(themeDir) : []
  const globalFolders = fs.readdirSync(globalThemeDir)

  console.log('Copying global dirs ', globalFolders.join(', '))
  await Promise.resolve(
    globalFolders.forEach(async (folder) => {
      // delete folder, then
      try {
        await bashCmd(
          '' + __dirname + /../,
          `cp -r ${globalThemeDir}/${folder} ${path}`,
          `copy ${folder} ${path}`
        )
      } catch (error) {
        console.log(`Error Copying global ${folder}`, error)
      }
    })
  )

  if (theme !== 'no-theme') {
    console.log('Copying theme dirs ', folders.join(', '))
    await Promise.resolve(
      folders.forEach(async (folder) => {
        // delete folder, then
        const exclude = ['theme.config.json', '.git']
        if (!exclude.includes(folder)) {
          try {
            await bashCmd(
              __dirname + /../,
              `cp -r ${themeDir}/${folder} ${path}`,
              `copy ${folder} ${path}`
            )
          } catch (error) {
            console.log(`Error Copying theme ${folder}`, error)
          }
        }
      })
    )
    return
  }
}

const complete = () => {
  console.log(`
                   (@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                   
              *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(                
            @@@@@@@&/             ///                  ,%@@@@@@@.             
         #@@@@@@@(              /// //,                   /@@@@@@@&           
      *@@@@@@@#.               //.   .// .####              .(@@@@@@@#        
   ,@@@@@@@&,                */*       /%#/  (#*               .%@@@@@@@/     
 &@@@@@@@/                 .//        *%%%%   .##                 *&@@@@@@@,  
@@@@@@@&                  ///        %%*  %%#   ##/                 #@@@@@@@. 
  .@@@@@@@,              //        /%#     ,%%   .##             .@@@@@@@(    
     (@@@@@@@,         /(*        %%,        (%(   /#/         &@@@@@@&       
        &@@@@@@@     .//        (%#           .%%,   ##.    %@@@@@@@          
           @@@@@@@# *//********%%#((((((((((((((%%#///##.*@@@@@@@*            
             *@@@@@@@,                                 &@@@@@@%               
                %@@@@@@&                            &@@@@@@&                  
                   &@@@@@@(                      /@@@@@@@.                    
                     ,@@@@@@@/                .@@@@@@@/                       
                        /@@@@@@@.           @@@@@@@%                          
                           &@@@@@@&      #@@@@@@@                             
                              @@@@@@@#*@@@@@@@,                               
                                ,@@@@@@@@@@(                                  
                                   #@@@@&                                     
                                     '@'
              ___ __  __ ____ ____ ____    _  _ __  __ _  _ ____ 
             / __(  )(  (  _ ( ___(  _ \  ( \( (  )(  ( \/ (_  _)
             \__ \)(__)( )___/)__) )   /   )  ( )(__)( )  (  )(  
             (___(______(__) (____(_)\_)  (_)\_(______(_/\_)(__)
             
                       ✨ INSTALATION COMPLETE ✨
  `)
}

const createTheme = async () => {
  console.log('creating theme....')
}

module.exports = { install, createTheme }

// helper functions //
async function bashCmd(cwd, cmd, description = '', stdio = 'inherit') {
  // console.log('working dir: ', cwd)
  // console.log('command: ', cmd)
  // console.log('description: ', description)
  try {
    await execa.command(cmd, {
      stdio,
      cwd,
    })
    return true
  } catch (error) {
    console.log(`ERROR ${description}`, error)
    process.exit()
  }
}

function convertToText(obj) {
  // this magic converts javascript objects to text
  const string = []
  if (typeof obj === 'object' && obj.join == undefined) {
    string.push('{')
    for (prop in obj) {
      string.push(prop, ': ', convertToText(obj[prop]), ',')
    }
    string.push('}')
  } else if (typeof obj === 'object' && !(obj.join == undefined)) {
    string.push('[')
    for (prop in obj) {
      string.push(convertToText(obj[prop]), ',')
    }
    string.push(']')
  } else if (typeof obj === 'function') {
    string.push(obj.toString())
  } else {
    string.push(JSON.stringify(obj))
  }

  return string.join('')
}
