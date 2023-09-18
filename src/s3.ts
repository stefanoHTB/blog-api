import aws from 'aws-sdk'
import dotenv from 'dotenv'
import randomBytes from 'randombytes'

dotenv.config();


const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKeyId = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY


const s3 = new aws.S3({
    region: bucketRegion,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'

});

export async function generateUploadURL() {
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    });

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL
}