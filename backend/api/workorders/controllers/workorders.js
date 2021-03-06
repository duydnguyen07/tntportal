'use strict';
const { sanitizeEntity } = require('strapi-utils');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const ERROR_CODES = {
    ID_INVALID: 'ID_INVALID',
    PASSCODE_INVALID: 'PASSCODE_INVALID',
    DOWNLOAD_URL_GENERATION_FAILED: 'DOWNLOAD_URL_GENERATION_FAILED',
    CERTIFICATE_NOT_FOUND: 'CERTIFICATE_NOT_FOUND',
    UNABLE_TO_SEND_NOTIFICATION_INVALID_EMAIL: 'UNABLE_TO_SEND_NOTIFICATION_INVALID_EMAIL'
}

function getErrorObj(code) {
    return { ERROR_CODE: code}
}

async function getSignedCertificateUrl(fileHash, ext) {
    const client = new S3Client({ 
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ACCESS_SECRET,
        }
    });
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME, Key: `${fileHash}${ext}`
    });
    const expireInSeconds = 3600;

    return await getSignedUrl(client, command, { expiresIn: expireInSeconds });
}


/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
module.exports = {
    //TODO: validate phone number when user type in
    //TODO: allow manual trigger of sms
    //TODO: allow for upload of pdf to workorder


    async create(ctx) {
      let entity;
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);
        entity = await strapi.services.workorders.create(data, { files });
      } else {
        entity = await strapi.services.workorders.create(ctx.request.body);
      }

      if(entity.CustomerInformation.PreferredContactMethod === 'TextMessage') {
          //TODO: send text message
          console.log('sending text')
      } else {
          if(entity.CustomerInformation.Email) {
              
          } else {
            return getErrorObj(ERROR_CODES.PASSCODE_INVALID)
          }
          //TODO: check if user has an email and send an email notification instead.
          //TDOO: create a manual way for technician to send notification in case contact info was wrong the first time.
          console.log('sending email')

      }

      return sanitizeEntity(entity, { model: strapi.models.workorders });
    },

    /**
     * Retrieve a record.
     *
     * @return {Object}
     */

    async findOneWithPasscode(ctx) {
        const { id } = ctx.params;
        const { passcode } = ctx.request.body;
        const entity = await strapi.services.workorders.findOne({ id });


        if(!entity) {
            ctx.response.status = 400;

            return getErrorObj(ERROR_CODES.ID_INVALID)
        } else if(entity.CertificatePasscode === passcode) {
            return sanitizeEntity(entity, { model: strapi.models.workorders });
        } else {
            ctx.response.status = 400;

            return getErrorObj(ERROR_CODES.PASSCODE_INVALID)
        }
    },

    async downloadCertificateFile(ctx) {
        const { fileHash, ext } = ctx.params;

        const client = new S3Client({ 
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_ACCESS_SECRET,
            }
        });
        const Key = `${fileHash}${ext}`

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME, Key
        });
        let output = await client.send(command);

        ctx.status = output.$metadata.httpStatusCode;

        ctx.response.set({
            'Content-Disposition': 'attachment; filename=' + Key,
            "Content-Type": output.ContentType,
            'Content-Length': output.ContentLength
        })

        ctx.body = output.Body;

        //TODO: use this to retrieve back a file in the frontend
    },

    async downloadCertificate(ctx) {
        const { fileHash, ext } = ctx.params;

        try {
            return {
                signed_url: await getSignedCertificateUrl(fileHash, ext)
            }
        } catch (e) {
            console.error(e)
            ctx.response.status = 500;

            return getErrorObj(ERROR_CODES.DOWNLOAD_URL_GENERATION_FAILED)
        }
    },

    async downloadCertificateWithPasscode(ctx) {
        const { workorderID } = ctx.params;
        const { passcode } = ctx.request.body;

        const entity = await strapi.services.workorders.findOne({ id: workorderID });
        const isCertificateExist = !!entity.Certificate && !!entity.Certificate[0];

        if(!entity) {
            ctx.response.status = 400;

            return getErrorObj(ERROR_CODES.ID_INVALID)
        } else if(entity.CertificatePasscode === passcode) {
            if(isCertificateExist) {
                try {
                    return { 
                        signed_url: await getSignedCertificateUrl(entity.Certificate[0].hash, entity.Certificate[0].ext) 
                    }
                } catch (e) {
                    ctx.response.status = 500;
        
                    return getErrorObj(ERROR_CODES.DOWNLOAD_URL_GENERATION_FAILED)
                }
            } else {
                ctx.response.status = 400;
                return getErrorObj(ERROR_CODES.CERTIFICATE_NOT_FOUND)
            }
        } else {
            ctx.response.status = 400;

            return getErrorObj(ERROR_CODES.PASSCODE_INVALID)
        }
    }
};
