// const loadJsonFile = require('load-json-file')
const fs = require('fs')

// takes tumblr handle, returns deserialized posts
const getJson = async (handle) => {
  const axios = require('axios')
  return await axios
    .get(`https://${handle}.tumblr.com/api/read/json?num=50`, {
      method: 'GET',
      redirect: 'follow',
      mode: 'no-cors',
      'Content-Type': 'text/plain',
    })
    .then((res) => res.data)
    .then(async (txt) => {
      const data = JSON.parse(
        txt.replace('var tumblr_api_read = ', '').replace('};', '}')
      )
      const posts = await deserializePosts(data.posts)
      //   console.log(posts)
      return posts
    })
    .catch((error) => console.log('error', error))
}

// const getType = async (posts, type) => {
//   const filteredPosts = posts.filter((post) => post.type === type)
//   return await deserializePosts(filteredPosts)
// }

// takes og tumblr posts, deseriallizes, and returns

const deserializePosts = (posts) => {
  const typeSwap = {
    regular: 'blog',
    photo: 'photos',
    link: 'articles',
    audio: 'music',
    video: 'videos',
  }
  return Promise.all(
    posts.map((post) => {
      // remove unneeded fields
      delete post.url
      delete post['url-with-slug']
      delete post.tumblelog
      delete post['is-submission']
      delete post['is-submission']
      delete post['like-button']
      delete post['reblog-button']
      delete post['note-count']
      delete post['note-count']
      delete post['note-count']
      delete post['note-count']
      delete post['note-count']
      delete post.bookmarklet
      delete post.mobile
      delete post['feed-item']
      delete post['from-feed-id']
      delete post['reblog-key']
      return {
        ...post,
        // reformat/add fields
        slug: post.slug || post.id,
        id: post.id,
        type: typeSwap[post.type],
        image: post['photo-url-1280'] || undefined,
        imageSmall: post['photo-url-500'] || undefined,
        localImage: post.localImage || undefined,
        localImageSmall: post.localImageSmall || undefined,
        source: 'tumblr',
      }
    })
  )
}

// takes posts, and dd dir, will construct filename [dir]/[post.id].[ext]
const downloadImages = async (posts, dir) => {
  const updatedPosts = await Promise.all(
    posts.map(async (post) => {
      if (post.type === 'photos') {
        const localImage = await downloadImage(
          post.image,
          `${dir}/${post.id}.${post.image.split('.').pop()}`
        )
        const localImageSmall = await downloadImage(
          post.imageSmall,
          `${dir}/${post.id}-thumb.${post.image.split('.').pop()}`
        )
        return {
          ...post,
          localImage,
          localImageSmall,
        }
      } else return post
    })
  )
  return updatedPosts
}

// takes url, local path (static/..jpg), returns public path(removes static)
const downloadImage = async (url, path) => {
  const axios = require('axios')
  if (fs.existsSync(path)) {
    console.log('NOT DOWNLOADING - Image found at\r\n', path)
  } else {
    console.log('Image not found saving to ', path)
    await axios
      .get(url, {
        responseType: 'stream',
      })
      .then((res) => {
        res.data.pipe(fs.createWriteStream(path))
      })
      .catch((error) => console.log('error', error))
  }
  const localPath = path.replace('static', '')
  return localPath
  /// /////////////////
}

const cacheTumblrDownloadImages = async (handle) => {
  const writeJsonFile = require('write-json-file')
  const readJsonFile = require('load-json-file')
  console.log('Checking tumblr cache......')
  const posts = await getJson(handle)
  const jsonFile = 'content/tumblr.json'
  if (!fs.existsSync(jsonFile)) {
    await writeJsonFile(jsonFile, [])
  }
  const cachedPosts = await readJsonFile(jsonFile)
  const updatedPosts = await downloadImages(posts, 'static/img')
  if (JSON.stringify(updatedPosts) !== JSON.stringify(cachedPosts)) {
    console.log('POSTS CHANGED - now updating ')
    await writeJsonFile(jsonFile, updatedPosts)
  } else {
    console.log('POSTS NOT CHANGED')
  }
}

module.exports = {
  // getJson,
  // getType,
  // deserializePosts,
  // downloadImages,
  // downloadImage,
  cacheTumblrDownloadImages,
}
