import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

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

  public async register({request, auth}: HttpContextContract) {
    const data = request.only(['email', 'password'])
    if (!data.email) {
      throw new Error('O campo email é obrigatório')
    }
    if (!data.password) {
      throw new Error('O campo senha é obrigatório')
    }
    if(data.password.length < 6 || data.password.length > 12) {
      throw new Error('A senha deve ter entre 6 e 12 caracteres')
    }

    try {
      if (await User.firstOrCreate(data)) {
        const token = await auth.use('api').attempt(data.email, data.password, {
          expiresIn: '7 days'
        })
        return token
      } else {
        return {
          message: 'Erro ao cadastrar usuário'
        }
      }
    } catch (error) {
      return error
    }
  }

  public async destroy({request}: HttpContextContract) {
    const {id} = request.all()
    try {
      const user = await User.findOrFail(id)
      await user.delete()
      return {
        message: 'Usuário excluído com sucesso'
      }
    } catch (error) {
      return error
    }
  }

  public async update({request}: HttpContextContract) {
    const {id, email, password} = request.all()
    try {
      const user = await User.findOrFail(id)
      user.merge({
        email,
        password
      })
      await user.save()
      return user
    } catch (error) {
      return error
    }
  }

}
