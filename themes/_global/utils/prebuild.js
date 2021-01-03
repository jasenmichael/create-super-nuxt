const fs = require('fs')
const tumblrCache = require('./tumblr')
const siteData = require(`${process.cwd()}/content/sitedata.json`)
// const createNavigationJson = require('./createNavigation')
// run these steps before build

// 1: create json file for list of dirs in content and .md files
// 2: content/navigation.json
// 3: if tumblr enabled - dld tumblr images and cache posts to content/tumblr.json

const init = async () => {
  console.log('Running utils/prebuild.js')
  const sourceDir = `${process.cwd()}/content` // dir to scan for dirs
  const navigationJsonPath = `${process.cwd()}/content/navigation.json` // save path to json
  await createNavigationJson(sourceDir, navigationJsonPath)
  const tumblrHandle = siteData.networks.filter((n) => n.name === 'Tumblr')[0]
    ? siteData.networks.filter((n) => n.name === 'Tumblr')[0].handle
    : null
  if (siteData.enableTumblrMerge && tumblrHandle) {
    console.log('Tumblr merge enabled for handle:', tumblrHandle)
    console.log('Now Updating tumblr.json')
    await cacheTumblrDownloadImages()
  }
}

const createNavigationJson = async (sourceDir, destJson) => {
  // console.log(sourceDir, destJson)
  // get files and dirs
  const files = fs
    .readdirSync(sourceDir, 'utf8')
    // filter non dirs, and non .md files
    .filter((fileOrDir) => {
      return (
        fileOrDir.includes('home') !== true &&
        fileOrDir.includes('index') !== true &&
        fileOrDir.includes('.json') !== true
      )
    })

    // //////////////////////////
    // construct posts and pages
    .map((fileOrDir) => {
      if (fileOrDir.includes('md')) {
        // page
        const slug = fileOrDir.split('.md')[0]
        return {
          slug,
          title: makeTitle(slug),
          description: '',
          path: '/' + slug,
          type: 'page',
          showInNav: true,
          // sortOrder: 0,
        }
      } else {
        // is a dir
        // posts
        return {
          slug: fileOrDir,
          title: makeTitle(fileOrDir),
          description: '',
          path: '/' + fileOrDir,
          type: fileOrDir,
          showInNav: true,
          // sortOrder: 0,
        }
      }
    })
  // construct posts and pages
  // //////////////////////////

  // create pages array
  let pages = files.filter((i) => i.type === 'page')
  pages.map((page) => {
    page.sortOrder = pages.findIndex((cp) => cp.title === page.title)
    return page
  })
  // create posts array
  let posts = files.filter((i) => i.type !== 'page')
  posts.map((post) => {
    post.sortOrder = posts.findIndex((cp) => cp.title === post.title)
    return post
  })
  // load(if exist) content/navigation.json
  const cachedNavigationJson = await loadNavigationJson(destJson)
  // console.log(cachedNavigationJson)
  pages = pages.map((page) => {
    let cachedPage = cachedNavigationJson.pages.filter(
      // retain cached version incase a title description provided; or sorted via cms
      (cachedPage) => page.slug === cachedPage.slug
    )[0]
    if (cachedPage) {
      cachedPage = {
        // set the sort order as it was in the cache
        sortOrder: cachedNavigationJson.pages.findIndex(
          (cp) => cp.title === page.title
        ),
      }
    }
    // if there is a cache return
    return cachedPage ? { ...page, ...cachedPage } : page
  })

  posts = posts.map((post) => {
    let cachedPost = cachedNavigationJson.posts.filter(
      (cachedPost) => post.slug === cachedPost.slug
    )[0]
    if (cachedPost) {
      cachedPost = {
        ...cachedPost,
        sortOrder: cachedNavigationJson.posts.findIndex(
          (cp) => cp.title === post.title
        ),
      }
    }
    return cachedPost ? { ...post, ...cachedPost } : post
  })
  // console.log(posts)
  // merge current posts and navigation with cached(in case extra fields were added, or fields changed)
  // let navigation = {
  //   posts: [...posts, ...cachedNavigationJson.posts],
  //   pages: [...pages, ...cachedNavigationJson.pages],
  // }
  pages.sort((a, b) => a.sortOrder - b.sortOrder)
  posts.sort((a, b) => a.sortOrder - b.sortOrder)
  let navigation = { pages, posts }
  navigation = JSON.stringify(navigation, null, 2)
  const cachedNavigation = JSON.stringify(cachedNavigationJson, null, 2)

  // write/re-write content/navigation.json
  if (cachedNavigation !== navigation) {
    fs.writeFile(destJson, navigation, function (err) {
      if (err) {
        console.error('WTF!', err)
      } else {
        console.log('Generated content/navigation.json')
      }
    })
  } else {
    console.log('Navigation unchanged...')
  }

  // console.log(files)
  // scan dir for dirs
  // load if exist
  return true
}

const loadNavigationJson = (navigationJsonPath) => {
  if (fs.existsSync(navigationJsonPath)) {
    console.log('Now updating navigation.json.')
    try {
      return require(navigationJsonPath)
    } catch (error) {
      console.log('Error loading file, it will be replaced..')
      return { posts: [], pages: [] }
    }
  } else {
    console.log('Now generating navigation.json')
    return { posts: [], pages: [] }
  }
}

const makeTitle = (slug) => {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const cacheTumblrDownloadImages = async () => {
  const siteData = require(`${process.cwd()}/content/sitedata.json`)
  const tumblrHandle = siteData.networks.filter((net) => {
    return net.name === 'Tumblr' && net.handle
  })[0].handle
  // console.log(tumblrHandle)
  if (siteData.enableTumblrMerge && tumblrHandle) {
    await tumblrCache.cacheTumblrDownloadImages(tumblrHandle)
  }
}

init()
