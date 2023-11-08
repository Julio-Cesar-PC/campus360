import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Roles from 'App/Enums/Roles'

export default class UsersController {

  /*
  * @index
  * @summary Lista os usuários
  * @description Lista os usuários
  * @paramQuery perPage
  * @paramQuery page
  */
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

  /*
  * @destroy
  * @summary Exclui um usuário
  * @description Exclui um usuário
  */
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

  /*
  * @update
  * @summary Atualiza um usuário
  * @description Atualiza um usuário
  * @requestBody {"email": "email@email.com", "password": "123456"}
  */
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

  /*
  * @promote
  * @summary Promove um usuário para moderador
  * @description Promove um usuário para moderador
  */
  public async promoteToModerator({params, response}: HttpContextContract) {
    const id = params.id
    try {
      const user = await User.find(id)
      if (!user) {
        throw new Error('Usuário não encontrado')
      }
      if (user.roleId === Roles.ADMIN) {
        throw new Error('Você não pode promover um administrador')
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

  /*
  * @demote
  * @summary Rebaixa um usuário para Usuário comum
  * @description Rebaixa um usuário para Usuário comum
  */
  public async demoteToUser({params, response}: HttpContextContract) {
    const id = params.id
    try {
      const user = await User.find(id)
      if (!user) {
        throw new Error('Usuário não encontrado')
      }
      if (user.roleId === Roles.ADMIN) {
        throw new Error('Você não pode rebaixar um administrador')
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
