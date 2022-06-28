import authenticationMiddleware from '../src/authMiddleware.js'
import * as axios from 'axios'
import { JwksClient } from 'jwks-rsa'
import jwt from 'jsonwebtoken'

jest.mock('axios')
jest.mock('jwks-rsa')
jest.mock('jsonwebtoken')

describe('Authentication middleware tests', () => {
  test('calls next when the user is successfully authenticated', async () => {
    axios.get.mockResolvedValue({ data: { jwks_uri: 'https://someurl.com' } })

    jwt.decode.mockReturnValue({
      header: {
        kid: 'keyId123'
      }
    })

    const mockGetSigningKey = jest.fn()
    mockGetSigningKey.mockResolvedValue({ publicKey: 'somekey' })

    JwksClient.mockReturnValue({
      getSigningKey: mockGetSigningKey
    })

    jwt.verify.mockReturnValue({ sub: 'someSubject' })

    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    }
    const res = {}
    const next = jest.fn()
    await authenticationMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.user).toBeDefined()
  })

  test('should return a 401 when the auth header is missing', async () => {
    const req = {
      headers: {}
    }
    const res = {
      sendStatus: jest.fn()
    }
    const next = jest.fn()
    await authenticationMiddleware(req, res, next)

    expect(res.sendStatus.mock.calls[0][0]).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('should return a 401 when the token is malformed', async () => {
    const req = {
      headers: {
        authorization: 'somebadtoken'
      }
    }
    const res = {
      sendStatus: jest.fn()
    }
    const next = jest.fn()
    await authenticationMiddleware(req, res, next)

    expect(res.sendStatus.mock.calls[0][0]).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('should return 401 if the signing key cannot be found', async () => {
    axios.get.mockResolvedValue({ data: { jwks_uri: 'https://someurl.com' } })

    jwt.decode.mockReturnValue({
      header: {
        kid: 'keyId123'
      }
    })

    const mockGetSigningKey = jest.fn()
    mockGetSigningKey.mockImplementation(() => {
      throw new Error('Key not found!')
    })

    JwksClient.mockReturnValue({
      getSigningKey: mockGetSigningKey
    })

    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    }
    const res = {
      sendStatus: jest.fn()
    }
    const next = jest.fn()
    await authenticationMiddleware(req, res, next)

    expect(res.sendStatus.mock.calls[0][0]).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('should return 401 if token validation fails', async () => {
    axios.get.mockResolvedValue({ data: { jwks_uri: 'https://someurl.com' } })

    jwt.decode.mockReturnValue({
      header: {
        kid: 'keyId123'
      }
    })

    const mockGetSigningKey = jest.fn()
    mockGetSigningKey.mockResolvedValue({ publicKey: 'somekey' })

    JwksClient.mockReturnValue({
      getSigningKey: mockGetSigningKey
    })

    jwt.verify.mockImplementation(() => {
      throw new Error('Token invalid!')
    })

    const req = {
      headers: {
        authorization: 'Bearer token'
      }
    }
    const res = {
      sendStatus: jest.fn()
    }
    const next = jest.fn()
    await authenticationMiddleware(req, res, next)

    expect(res.sendStatus.mock.calls[0][0]).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })
})
