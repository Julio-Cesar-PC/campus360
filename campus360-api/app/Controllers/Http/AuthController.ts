import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { randomBytes } from 'crypto'

export default class AuthController {

  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.all()
  
    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '7 days'
      })
      return token
    } catch (error) {
      return response.unauthorized({ message: 'Credenciais inválidas' })
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

  public async destroy({params}: HttpContextContract) {
    const id = params.id
    console.log(id)
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

  public async update({request, params}: HttpContextContract) {
    const {email, password} = request.all()
    const id = params.id
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
  public async forgotPassword({ request, response }: HttpContextContract) {
    const email = request.input('email')
  
    console.log('Email recebido:', email); 
  
    if (!email) {
      return response.badRequest({ message: 'O campo de e-mail é obrigatório.' })
    }
  
    try {
      const user = await User.findBy('email', email)
  
      console.log('Usuário encontrado:', user); 
  
      if (user) {
        const token = randomBytes(20).toString('hex')
        user.merge({ resetPasswordToken: token })
        await user.save()
  
        const resetLink = `https://campus360.com/reset-password?token=${token}`
        console.log(`Link para redefinir senha: ${resetLink}`)
  
        return response.ok({ message: 'Um e-mail com as instruções para redefinir sua senha foi enviado.' })
      } else {
        return response.badRequest({ message: 'E-mail não encontrado.' })
      }
    } catch (error) {
      console.error(error); // Log
      return response.badRequest({ message: 'Ocorreu um erro ao processar sua solicitação.' })
    }
  }
}