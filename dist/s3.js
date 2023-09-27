"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUploadURL = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const randombytes_1 = __importDefault(require("randombytes"));
dotenv_1.default.config();
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const s3 = new aws_sdk_1.default.S3({
    region: bucketRegion,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
});
async function generateUploadURL() {
    const rawBytes = await (0, randombytes_1.default)(16);
    const imageName = rawBytes.toString('hex');
    const key = `services/${imageName}`;
    const params = ({
        Bucket: bucketName,
        Key: key,
        Expires: 60
    });
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
}
exports.generateUploadURL = generateUploadURL;
//# sourceMappingURL=s3.js.map