const BaseAdapter = require('ghost-storage-base')
const COS = require('cos-nodejs-sdk-v5')
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const debug = require('debug')('tencentyun-storage')
const util = require('util')

class TencentyunCOSAdapter extends BaseAdapter {
  constructor ({
    SecretId,
    SecretKey,
    baseDir = '/',
    Bucket,
    Region
  }) {
    super()
    assert(SecretId)
    assert(SecretKey)
    assert(Bucket)
    assert(Region)
    this.cosParam = { Bucket, Region }
    this.cos = new COS({ SecretId, SecretKey })
    this.baseDir = baseDir
  }

  async exists (fileName, targetDir) {
    debug('exists', 'filename', fileName, 'targetDir', targetDir)
    const params = {
      ...this.cosParam,
      Key: path.join(targetDir, fileName).replace(/\\/g, '/')
    }
    debug('exists params is', params)
    try {
      await util.promisify(this.cos.headObject).call(this.cos, params)
      return true
    } catch (error) {
      debug('exists error', error)
      return false
    }
  }

  async save (image, targetDir) {
    debug('save image is', image, 'targetDir is', targetDir)
    targetDir = targetDir || this.getTargetDir(this.baseDir)
    const uniqueFileName = await this.getUniqueFileName(image, targetDir)
    debug('save getUniqueFileName result is ', uniqueFileName)
    const params = {
      ...this.cosParam,
      Key: uniqueFileName,
      ContentLength: image.size,
      ContentType: image.type,
      Body: fs.createReadStream(image.path)
    }
    const res = await util.promisify(this.cos.putObject).call(this.cos, params)
    debug('save', res)
    return uniqueFileName
  }

  /**
     * unnecessary to implement.
     * @returns {Function}
     */
  serve () {
    return (req, res, next) => {
      this.cos.getObject({
        ...this.cosParam,
        Key: path.join(this.baseDir, req.path).replace(/\\/g, '/'),
        Output: res
      }, function (err) {
        if (err) {
          debug('serve error', err)
          res.status(404)
          next()
        }
      })
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
