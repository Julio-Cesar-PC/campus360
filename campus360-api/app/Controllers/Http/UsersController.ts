import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {

  public async index({request}: HttpContextContract) {
    const {page, limit} = request.all()
    try {
      const users = await User.query().paginate(page, limit)
      return users
    } catch (error) {
      return error
    }
  }

  public async me({auth}: HttpContextContract) {
    try {
      if (!auth.user) {
        throw new Error('Usuário não autenticado')
      }
      const user = await User.query().where('id', auth.user?.id).preload('role').firstOrFail()
      return user
    } catch (error) {
      return error
    }
  }

}
