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

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
