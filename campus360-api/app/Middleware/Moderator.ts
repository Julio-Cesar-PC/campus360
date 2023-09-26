import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Roles from 'App/Enums/Roles'

export default class Moderator {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    const user = await auth.authenticate()
    if (user.roleId === Roles.ADMIN || user.roleId === Roles.MODERATOR) {
      await next()
    } else {
      throw new Error('Usuário não autorizado')
    }
  }
}
