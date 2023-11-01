/**
 * These test are vague. They assume normal functionality of the databse and database client
 * 
 * Error cases and other edge cases are missing. Consider adding them or creating an entirely
 * new set of cases.
 */
const mongoose = require('mongoose');
const { dbConnect } = require('../utils/db.mongo');

describe('dbConnect function', () => {
  beforeEach(() => {
    jest.spyOn(mongoose, 'connect').mockResolvedValueOnce();
  });

  afterEach(() => {
    mongoose.connect.mockRestore();
  });

  it('should connect to the database successfully', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await dbConnect();

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://localhost:27017/korriadb',
      expect.objectContaining({
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }),
    );

    expect(consoleSpy).toHaveBeenCalledWith('connected to db');

    consoleSpy.mockRestore();
  });
});
