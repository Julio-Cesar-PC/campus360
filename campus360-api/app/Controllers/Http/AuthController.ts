import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {

  public async login({request, auth}: HttpContextContract) {
    const {email, password} = request.all()
    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '7 days'
      })
      return token
    } catch (error) {
      return error
    }
  }

  public async logout({auth}: HttpContextContract) {
    await auth.use('api').revoke()
    return {
      revoked: true
    }
  }

}
