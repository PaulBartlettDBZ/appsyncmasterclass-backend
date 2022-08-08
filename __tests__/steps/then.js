require('dotenv').config()
const AWS = require('aws-sdk')
const http = require('axios')
const fs = require('fs')

const user_exists_in_UsersTable = async (id) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient()

    console.log(`looking for user [${id}] in [${process.env.USERS_TABLE}]`)

    const resp = await DynamoDB.get({
        TableName: process.env.USERS_TABLE,
        Key: {
            id
        }
    }).promise()

    expect(resp.Item).toBeTruthy()
    return resp.Item
}

const user_can_upload_image_to_url = async (uploadUrl, filePath, contentType) =>{
    const data = fs.readFileSync(filePath)
    await http({
        method: 'put',
        url: uploadUrl,
        headers : {
            'Content-Type': contentType
        },
        data: data

    })
    console.log('uploaded image to ', uploadUrl)
}

const user_can_download_image_from = async (url) => {
    const resp = await http(url)
    console.log('downloaded image from ', url)
    return resp.data
}

module.exports = {
    user_exists_in_UsersTable,
    user_can_upload_image_to_url,
    user_can_download_image_from
}