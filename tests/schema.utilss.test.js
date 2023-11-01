const {
  validateReqSchema,
  validateParcelTypeSchema,
} = require('../utils/schema.utils');

describe('validateReqSchema function', () => {
  it('should return valid when all required keys are present', async () => {
    const req = { body: { key1: 'value1', key2: 'value2' } };
    const validKeys = ['key1', 'key2'];
    const result = await validateReqSchema(req, validKeys);
    expect(result).toMatchSnapshot();
  });

  it('should return missing keys when some required keys are not present', async () => {
    const req = { body: { key1: 'value1' } };
    const validKeys = ['key1', 'key2'];
    const result = await validateReqSchema(req, validKeys);
    expect(result).toMatchSnapshot();
  });

  it('should handle errors and return a code of -1', async () => {
    const req = { body: null };
    const validKeys = ['key1', 'key2'];
    const result = await validateReqSchema(req, validKeys);
    expect(result).toMatchSnapshot();
  });
});

describe('validateParcelTypeSchema function', () => {
  it('should return valid for a valid schema with image type', async () => {
    const req = {
      body: {
        schema: {
          fields: [
            { type: 'image', alt: 'Alt Text', src: 'image.jpg' },
          ],
        },
      },
    };
    const result = await validateParcelTypeSchema(req);
    expect(result).toMatchSnapshot();
  });

  it('should return valid for a valid schema with text type', async () => {
    const req = {
      body: {
        schema: {
          fields: [
            { fieldtype: 'text', content: { title: 'Title', payload: 'Text content' } },
          ],
        },
      },
    };
    const result = await validateParcelTypeSchema(req);
    expect(result).toMatchSnapshot();
  });

  it('should handle errors and return a code of -1', async () => {
    const req = { body: { schema: { fields: null } } };
    const result = await validateParcelTypeSchema(req);
    expect(result).toMatchSnapshot();
  });
});
