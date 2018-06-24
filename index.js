'use strict'

var BaseAdapter = require('ghost-storage-base')
var COS = require('cos-nodejs-sdk-v5')
var assert = require('assert')
var Promise = require('bluebird')
var fs = require('fs')
var path = require('path')
var debug = require('debug')('tencentyun-storage')

class TencentyunCOSAdapter extends BaseAdapter {
    constructor(config) {
        super()
        debug('TencentyunCOSAdapter::constructor', 'config', config)
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
    exists(filename, targetDir) {
        var debug = debug.bind(debug, 'TencentyunCOSAdapter::exists')
        debug('filename is', filename)
        debug('targetDir is', targetDir)
        var config = this.config
        return new Promise((resolve, reject) => {
            var params = {
                Bucket: config.Bucket,
                Region: config.Region,
                Key: path.resolve(targetDir, filename),
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

    save(image, targetDir) {
        var debug = debug.bind(debug, 'TencentyunCOSAdapter::save')
        debug('image is', image)
        debug('targetDir is', targetDir)
        var config = this.config
        targetDir = targetDir || this.getTargetDir('/')

        return this.getUniqueFileName(image, targetDir).then(filename => {
            debug('getUniqueFileName result is', filename)
            return new Promise((resolve, reject) => {
                var state = fs.statSync(image.path)
                var params = {
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
                        reject(false)
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
    serve() {
        return function (req, res, next) {
            next()
        }
    }

    /**
     * Not implemented.
     * @returns {Promise.<*>}
     */
    delete() {
        return Promise.reject('not implemented');
    }

    /**
     * Not implemented.
     * @returns {Promise.<*>}
     */
    read() {
        return Promise.reject('not implemented');
    }
}

module.exports = TencentyunCOSAdapter
