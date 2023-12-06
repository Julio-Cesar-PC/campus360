import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Atividade from 'App/Models/Atividade'
import Participacao from 'App/Models/Participacao'

export default class ParticipacaosController {
  public async participar({ params, auth, response }: HttpContextContract) {
    try {
      const atividadeId = Number(params.id)
      const atividade = await Atividade.find(atividadeId)
      if (!atividade) {
        throw new Error('Atividade não encontrada')
      }

      const user = await auth.user
      if (!user) {
        throw new Error('Usuário não autenticado')
      }
      const participanteId = user.id

      const usuarioJaParticipa = await Participacao.query()
        .where('atividade_id', atividadeId)
        .andWhere('user_id', participanteId)
        .first()
      if (usuarioJaParticipa) {
        throw new Error('Já está participando da atividade')
      } else {
        await Participacao.create({
          atividadeId: atividadeId,
          userId: participanteId
        })
      }

      // incrementa o número de participantes da atividade
      atividade.participantes = atividade.participantes + 1
      await atividade.save()


      return response.status(200).json({ message: 'Você agora está participando desta atividade' })
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao participar da atividade',
        error: error.message
      })
    }
  }

  public async desistir({ params, auth, response }: HttpContextContract) {
    try {
      const atividadeId = Number(params.id)
      const atividade = await Atividade.find(atividadeId)
      if (!atividade) {
        throw new Error('Atividade não encontrada')
      }

      const user = await auth.user
      if (!user) {
        throw new Error('Usuário não autenticado')
      }
      const participanteId = user.id

      const participacao = await Participacao.query()
        .where('atividade_id', atividadeId)
        .andWhere('participante_id', participanteId)
        .first()
      if (!participacao) {
        throw new Error('Você não está participando desta atividade')
      }
      await participacao.delete()

      atividade.participantes = atividade.participantes - 1
      await atividade.save()

      return response.status(200).json({ message: 'Você não está mais participando desta atividade' })
    } catch (error) {
      // Log erro
      console.error('Erro ao desistir da atividade:', error.message)

      return response.status(400).json({
        message: 'Erro ao desistir da atividade',
        error: error.message
      })
    }
  }

  public async index({ params, response }: HttpContextContract) {
    try {
      const atividadeId = Number(params.id)
      const atividade = await Atividade.find(atividadeId)
      if (!atividade) {
        throw new Error('Atividade não encontrada')
      }

      const participantes = await Participacao.query()
        .where('atividade_id', atividadeId)
        .preload('participante')

      return response.status(200).json(participantes)
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao listar participantes da atividade',
        error: error.message
      })
    }
  }
}
