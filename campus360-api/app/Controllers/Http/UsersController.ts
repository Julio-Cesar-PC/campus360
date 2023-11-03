import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Roles from 'App/Enums/Roles'

export default class UsersController {

  public async index({request}: HttpContextContract) {
    let {page, perPage} = request.qs()
    if(!page) page = 1
    if(!perPage) perPage = 10
    try {
      const users = await User.query().paginate(page, perPage)
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

  public async destroy({params, response}: HttpContextContract) {
    const id = params.id
    try {
      const user = await User.find(id)
      if (!user) {
        throw new Error('Usuário não encontrado')
      }
      await user.delete()
      return {
        message: 'Usuário excluído com sucesso'
      }
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao excluir usuário',
        error: error.message
      })
    }
  }

  public async update({request, params, response}: HttpContextContract) {
    const {email, password} = request.all()
    const id = params.id
    try {
      const user = await User.find(id)
      if (!user) {
        throw new Error('Usuário não encontrado')
      }
      user.merge({
        email,
        password
      })
      await user.save()
      return user
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao atualizar usuário',
        error: error.message
      })
    }
  }

  public async promoteToModerator({params, response}: HttpContextContract) {
    const id = params.id
    try {
      const user = await User.find(id)
      if (!user) {
        throw new Error('Usuário não encontrado')
      }
      user.merge({
        roleId: Roles.MODERATOR
      })
      await user.save()
      return user
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao atualizar usuário',
        error: error.message
      })
    }
  }

  public async demoteToUser({params, response}: HttpContextContract) {
    const id = params.id
    try {
      const user = await User.find(id)
      if (!user) {
        throw new Error('Usuário não encontrado')
      }
      user.merge({
        roleId: Roles.USER
      })
      await user.save()
      return user
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao atualizar usuário',
        error: error.message
      })
    }
  }
}
