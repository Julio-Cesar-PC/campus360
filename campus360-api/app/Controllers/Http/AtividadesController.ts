import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Atividade from 'App/Models/Atividade'


export default class AtividadesController {
  public async index({}: HttpContextContract) {
    const list = await Atividade.all()
    return list
  }

  public async create({}: HttpContextContract) {

  }

  public async store({request, response}: HttpContextContract) {
    try {
      const data = request.only(["nome","descricao","data", "local", "tipo","livre" ])
      if (!data.nome) {
        throw new Error('O campo nome é obrigatório')
      }
      if (!data.data) {
        throw new Error('O campo data é obrigatório')
      }
      if (!data.local) {
        throw new Error('O campo local é obrigatório')
      }
      if (!data.tipo) {
        throw new Error('O campo tipo é obrigatório')
      }
      if (!data.livre) {
        throw new Error('O campo livre é obrigatório')
      }
      const ativi = await Atividade.create(data)
      return ativi
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao criar atividade',
        error: error.message
      })
    }
  }

  public async show({params, response}: HttpContextContract) {
    try {
      const atividadeId = Number(params.id)
      const atividade = await Atividade.findOrFail(atividadeId)
      .catch(() => {
        throw new Error('Atividade não encontrada')
      })
      return atividade
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao buscar atividade',
        error: error.message
      })
    }
  }
  public async edit({}: HttpContextContract) {}

  public async update({request, params, response}: HttpContextContract) {
    try {
      const data = request.only(["nome","descricao","data", "local", "tipo","livre"])
      const atividadeId = Number(params.id)
      const atividade = await Atividade.findOrFail(atividadeId)
      .catch(() => {
        throw new Error('Atividade não encontrada')
      })
      atividade.merge(data)
      await atividade.save()
      return atividade
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao atualizar atividade',
        error: error.message
      })
    }
  }

  public async destroy({params, response}: HttpContextContract) {
    try {
      const atividadeId = Number(params.id)
      const atividade = await Atividade.findOrFail(atividadeId)
      .catch(() => {
        throw new Error('Atividade não encontrada')
      })
      await atividade.delete()
      return response.status(200).json({message: 'Atividade deletada com sucesso'})
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao deletar atividade',
        error: error.message
      })
    }
  }

  public async filtrar({ request, response }: HttpContextContract) {
    let {tipo, data, page} = request.qs()
    try {
      const query = Atividade.query()
      if (tipo) query.where('tipo', 'LIKE', `%${tipo}%`)
      if (data) query.where('data', 'LIKE', `%${data}%`)
      if (page) return query.paginate(page, 10)
      return query.exec()
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao filtrar atividades',
        error: error.message,
      })
    }
  }
}

module.exports = AtividadesController
