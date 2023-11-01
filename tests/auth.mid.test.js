/**
 * These test are vague, consider categorising them into consitions that represent actual queries
 * clients will make.
 * Queries should include malformed queries
 */
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/auth.mid');
const dotenv = require('dotenv');

dotenv.config();

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('verifyToken function', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('should verify a valid token and call next', async () => {
    req.headers.authorization = 'Bearer validToken';
    jwt.verify.mockReturnValueOnce({ userId: '123' });

    await verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.KORRIA_TOKENIZER_SECRET);
    expect(req.user).toEqual({ userId: '123' });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should handle expired token and return 403', async () => {
    req.headers.authorization = 'Bearer expiredToken';
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('jwt expired');
    });

    await verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('expiredToken', process.env.KORRIA_TOKENIZER_SECRET);
    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ message: 'Token expired please login again' });
  });

  /** egde cases like errors commonly caused errors for me, in the future add more error cases */
  it('should handle invalid signature and return 403', async () => {
    req.headers.authorization = 'Bearer invalidSignatureToken';
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('invalid signature');
    });

    await verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('invalidSignatureToken', process.env.KORRIA_TOKENIZER_SECRET);
    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ status: 'Failed', message: 'invalid signature' });
  });

  it('should handle invalid token and return 403', async () => {
    req.headers.authorization = 'Bearer invalidToken';
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('invalid token');
    });

    await verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('invalidToken', process.env.KORRIA_TOKENIZER_SECRET);
    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ status: 'Failed', message: 'invalid token' });
  });

  it('should handle malformed token and return 403', async () => {
    req.headers.authorization = 'Bearer malformedToken';
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('jwt malformed');
    });

    await verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('malformedToken', process.env.KORRIA_TOKENIZER_SECRET);
    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ status: 'Failed', message: 'jwt malformed' });
  });

  it('should handle internal server error and return 500', async () => {
    req.headers.authorization = 'Bearer internalErrorToken';
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('Internal Server Error');
    });

    await verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('internalErrorToken', process.env.KORRIA_TOKENIZER_SECRET);
    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
