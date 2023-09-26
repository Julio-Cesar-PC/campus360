import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Roles from 'App/Enums/Roles'

export default class Admin {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    const user = await auth.authenticate()
    if (user.roleId === Roles.ADMIN) {
      await next()
    } else {
      throw new Error('Usuário não autorizado')
    }
  }
}
