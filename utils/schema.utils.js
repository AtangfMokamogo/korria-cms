/**
 * This script defines utility functions that help validate the schema of the request body
 */

/**
 * This function validates the schema of the request body.
 * @param {Object} req - The request object
 * @param {Array} vKeys - A list of required keys in the request body
 */
async function validateReqSchema(req, validKeys) {
  try {
    const requestBodyKeys = Object.keys(req.body);
    const missingKeys = validKeys.filter((key) => !requestBodyKeys.includes(key));
    if (missingKeys.length === 0) {
      return {
        code: 0,
        message: 'valid',
      };
    }
    return {
      code: -1,
      message: [...missingKeys],
    };
  } catch (error) {
    console.error('Error in validateReqSchema: ', error);
  }
}

async function validateParcelTypeSchema(req) {
  try {
    const { fields } = req.body.schema;
    if (!fields || fields.length === 0) {
      return {
        code: -1,
        message: 'Invalid, content type data missing in the schema',
      };
    }
    console.log(fields);
    for (const field of fields) {
      if (!Object.prototype.hasOwnProperty.call(field, 'fieldtype') && !Object.prototype.hasOwnProperty.call(field, 'content')) {
        return {
          code: 1,
          message: 'Field has no name and/or data-type defined',
        };
      }
      if (field.type === 'image') {
        if (!Object.prototype.hasOwnProperty.call(field, 'alt') && !Object.hasOwnProperty.call(field, 'src')) {
          return {
            code: 1,
            message: `Missing image alt/src fields in ${field.type}`,
          };
        }
        return {
          code: 0,
          message: 'Valid',
        };
      }

      if (field.fieldtype === 'text') {
        console.log('here');
        if (!Object.prototype.hasOwnProperty.call(field.content, 'title') && !Object.hasOwnProperty.call(field.content, 'payload')) {
          return {
            code: 1,
            message: `Missing text title or payload fields in ${field.fieldtype}`,
          };
        }
        return {
          code: 0,
          message: 'Valid',
        };
      }
    }
  } catch (error) {
    console.error('Error in validateParcelTypeSchema', error);
  }
}

module.exports = {
  validateReqSchema,
  validateParcelTypeSchema,
};
