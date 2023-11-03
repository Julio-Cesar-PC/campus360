import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { randomBytes } from 'crypto'

export default class AuthController {

  /*
  * @login
  * @summary Login de usuário
  * @description Login de usuário
  * @requestBody {"email": "test@test.com", "password": "123456"}
  * @response {
  "type": "bearer",
  "token": "token",
  "expires_at": "2023-09-20T17:03:27.484-03:00"
  }
  */
  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.all()
    try {
      if (!email) {
        throw new Error('O campo email é obrigatório')
      }
      if (!password) {
        throw new Error('O campo senha é obrigatório')
      }
      if (password.length < 6 || password.length > 12) {
        throw new Error('A senha deve ter entre 6 e 12 caracteres')
      }
      if (!await User.findBy('email', email)) {
        throw new Error('Email não cadastrado')
      }
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '7 days'
      }).catch(() => {
        throw new Error('Senha incorreta')
      })
      return token
    } catch (error) {
      return response.unauthorized({
        message: 'Erro ao realizar login',
        error: error.message
       })
    }
  }

  public async logout({auth}: HttpContextContract) {
    try {
      if (!auth.user) {
        throw new Error('Usuário não autenticado')
      }
      await auth.use('api').revoke()
      return {
        revoked: true
    }
    } catch (error) {
      return error
    }
  }

  /*
  * @register
  * @summary Registro de usuário
  * @description Registro de usuário
  * @requestBody {"email": "test@test.com", "password": "123456"}
  * @response {
  "type": "bearer",
  "token": "token",
  "expires_at": "2023-09-20T17:03:27.484-03:00"
  }
  */
  public async register({ request, auth, response }: HttpContextContract) {
    const data = request.only(['email', 'password'])

    if (!data.email) {
      throw new Error('O campo email é obrigatório')
    }

    //formato do e-mail usando regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      throw new Error('O email inserido não é válido')
    }

    if (!data.password) {
      throw new Error('O campo senha é obrigatório')
    }
    if (data.password.length < 6 || data.password.length > 12) {
      throw new Error('A senha deve ter entre 6 e 12 caracteres')
    }

    try {
      if (await User.findBy('email', data.email)) {
        throw new Error('Este email já está cadastrado')
      }

      const user = await User.firstOrCreate(data)

      const token = await auth.use('api').attempt(user.email, data.password, {
        expiresIn: '7 days'
      })

      return token
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao cadastrar usuário',
        error: error.message
      })
    }
  }

  /*
  * @destroy
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
  * @summary Registro de usuário
  * @description Registro de usuário
  * @requestBody {"email": "test@test.com", "password": "123456"}
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
  * @stillLogged
  * @summary Verifica se o usuário está logado
  * @description Verifica se o usuário está logado
  */
  public async stillLogged({auth, response}: HttpContextContract) {
    try {
      if (!auth.isLoggedIn) {
        throw new Error('Usuário não autenticado')
      }
      return response.ok({
        message: 'Usuário autenticado',
        user: auth.user
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao verificar usuário',
        error: error.message
      })
    }
  }
  public async resetPassword({ request, response }: HttpContextContract) {
    const token = request.input('token')
    const newPassword = request.input('newPassword')

    try {
      const user = await User.findBy('reset_password_token', token)

      if (!user) {
        throw new Error('Token inválido ou expirado')
      }

      user.merge({
        password: newPassword,
        resetPasswordToken: null, // Limpa o token após a redefinição
      })

      await user.save()

      return response.ok({
        message: 'Senha redefinida com sucesso'
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao redefinir senha',
        error: error.message
      })
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

