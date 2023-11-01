const fs = require('fs');
const path = require('path');
const jsonifyTextType = require('../utils/json.utils');

describe('jsonifyTextType function', () => {
  const storagePath = './test-folder';
  const projectName = 'testProject';
  const jsonKey = 'testKey';
  const JSONObj = { data: 'testData' };

  afterEach(() => {
    // Clean up the test folder after each test
    if (fs.existsSync(storagePath)) {
      fs.rmdirSync(storagePath, { recursive: true });
    }
  });

  it('should create a new file and add data when the file does not exist', async () => {
    const result = await jsonifyTextType(storagePath, JSONObj, projectName, jsonKey);
    expect(result.code).toBe(0);
    expect(result.message).toBe('Success');

    const filePath = path.join(storagePath, `${projectName}.json`);
    expect(fs.existsSync(filePath)).toBe(true);

    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(fileContent[jsonKey]).toHaveLength(1);
    expect(fileContent[jsonKey][0]).toEqual(JSONObj);
  });

  it('should add data to an existing file when the file exists', async () => {
    // Create an initial file with some data
    const initialData = {
      [jsonKey]: [{ existingData: 'someValue' }],
    };
    fs.mkdirSync(storagePath, { recursive: true });
    fs.writeFileSync(path.join(storagePath, `${projectName}.json`), JSON.stringify(initialData));

    const result = await jsonifyTextType(storagePath, JSONObj, projectName, jsonKey);
    expect(result.code).toBe(0);
    expect(result.message).toBe('Success');

    const filePath = path.join(storagePath, `${projectName}.json`);
    expect(fs.existsSync(filePath)).toBe(true);

    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(fileContent[jsonKey]).toHaveLength(2);
    expect(fileContent[jsonKey][1]).toEqual(JSONObj);
  });
});
