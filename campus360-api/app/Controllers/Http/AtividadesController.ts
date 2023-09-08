import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Atividade from 'App/Models/Atividade'


export default class AtividadesController {
  public async index({}: HttpContextContract) {
    const list = await Atividade.all()

    return list
  }

  public async create({}: HttpContextContract) {

  }

  public async store({request}: HttpContextContract) {
    const data = request.only(["nome","descricao","data", "local", "tipo","livre" ])
    const ativi = await Atividade.create(data)
    return ativi


  }

  public async show({params}: HttpContextContract) {
    const atividadeId = Number(params.id)
    const atividade = await Atividade.findOrFail(atividadeId)
      return atividade
  }
  public async edit({}: HttpContextContract) {}

  public async update({request,params}: HttpContextContract) {
    const data = request.only(["nome","descricao","data", "local", "tipo","livre" ])
    const atividadeId = Number(params.id)
    const atividade = await Atividade.findOrFail(atividadeId)
    console.log(atividade,'Atividade nao encontrada')

    atividade.merge(data)
    await atividade.save()
    return atividade
  }

  public async destroy({params,response}: HttpContextContract) {
      const atividadeId = Number(params.id)
      const atividade = await Atividade.findOrFail(atividadeId)

       await atividade.delete()

        return response.status(200).json({message: 'Atividade deletada com sucesso'})
  }

  async filtrar({ request, response }) {
    try {
      const { tipo, data } = request.all()
      console.log('Parâmetros recebidos:', tipo, data)

      const atividadesFiltradas = await Atividade.query()
        .where('tipo', tipo)
        .where('data', data)
        .fetch()

      console.log('Atividades filtradas:', atividadesFiltradas.toJSON())

      return response.json(atividadesFiltradas)
    } catch (error) {
      return response.status(500).json({ message: 'DEU RUIM.' })
    }
  }
}

module.exports = AtividadesController
