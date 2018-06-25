const BaseAdapter = require('ghost-storage-base')
const COS = require('cos-nodejs-sdk-v5')
const assert = require('assert')
const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const _debug = require('debug')('tencentyun-storage')

class TencentyunCOSAdapter extends BaseAdapter {
  constructor (config) {
    super()
    const debug = _debug.bind(_debug, 'TencentyunCOSAdapter::constructor')
    debug('config', config)
    assert(config.SecretId)
    assert(config.SecretKey)
    assert(config.accessDomain)
    assert(config.Bucket)
    assert(config.Region)
    this.config = config
    this.cos = new COS(config)
  }

  /**
     *
     * @param {String} filename
     * @param {String} targetDir
     * @return {Promise.<Boolean>}
     */
  exists (filename, targetDir) {
    const debug = _debug.bind(_debug, 'TencentyunCOSAdapter::exists')
    debug('filename is', filename)
    debug('targetDir is', targetDir)
    const config = this.config
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: config.Bucket,
        Region: config.Region,
        Key: path.resolve(targetDir, filename)
      }

      this.cos.headObject(params, function (err, data) {
        debug('headObject err is', err)
        debug('headObject data is', data)
        if (err) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }

  save (image, targetDir) {
    const debug = _debug.bind(_debug, 'TencentyunCOSAdapter::save')
    debug('image is', image)
    debug('targetDir is', targetDir)
    const config = this.config
    targetDir = targetDir || this.getTargetDir('/')

    return this.getUniqueFileName(image, targetDir).then(filename => {
      debug('getUniqueFileName result is', filename)
      return new Promise((resolve, reject) => {
        const state = fs.statSync(image.path)
        const params = {
          Bucket: config.Bucket,
          Region: config.Region,
          Key: filename,
          ContentLength: state.size,
          ContentType: image.mimetype,
          Body: fs.createReadStream(image.path)
        }
        this.cos.putObject(params, function (err, data) {
          if (err) {
            debug('putObject err is', err)
            reject(err)
          } else {
            debug('putObject data is', data)
            resolve(config.accessDomain + filename)
          }
        })
      })
    }).catch(err => {
      debug('getUniqueFileName err is', err)
      return Promise.reject(err)
    })
  }

  /**
     * unnecessary to implement.
     * @returns {Function}
     */
  serve () {
    return function (req, res, next) {
      next()
    }
  }

  /**
     * Not implemented.
     * @returns {Promise.<*>}
     */
  delete () {
    return Promise.reject(new Error('not implemented'))
  }

  /**
     * Not implemented.
     * @returns {Promise.<*>}
     */
  read () {
    return Promise.reject(new Error('not implemented'))
  }
}

module.exports = TencentyunCOSAdapter
