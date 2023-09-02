import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Atividade from 'App/Models/Atividade'
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

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({request,params}: HttpContextContract) {
    const data = request.only(["nome","descricao","data", "local", "tipo","livre" ])
    const atividadeId = Number(params.id)
    const Atividade = await Atividade.find(atividadeId)

    await Atividade.merge{data}.save
      return Atividade 



  }

  public async destroy({params,Response}: HttpContextContract) {
      const atividadeId = Number(params.id)
      const Atividade = await Atividade.find(atividadeId)

      return Response.status(200).json({MessageChannel:'Atividade excluida com sucesso'})
  }
}
