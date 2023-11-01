const fs = require('fs');
const path = require('path');

async function jsonifyTextType(storagePath, JSONObj, projectName, jsonKey) {
  try {
    const filePath = path.join(storagePath, `${projectName}.json`);
    fs.mkdirSync(storagePath, { recursive: true });
    fs.chmod(storagePath, 0o770, () => {});

    /** check if file exists */
    if (fs.existsSync(filePath)) {
      const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      if (!existingData[jsonKey]) {
        existingData[jsonKey] = [];
      }

      existingData[jsonKey].push(JSONObj);
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');
    } else {
      const newData = {
        [jsonKey]: [JSONObj],
      };
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
    }

    return {
      code: 0,
      message: 'Success',
    };
  } catch (error) {
    console.error('Error in jsonifyTextType middleware', error);
    return {
      code: -1,
      message: error,
    };
  }
}

module.exports = jsonifyTextType;
