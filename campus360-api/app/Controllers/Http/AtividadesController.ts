import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Atividade from 'App/Models/Atividade'
import Participacao from 'App/Models/Participacao';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: 'drp8hmbhs',
  api_key: '856231962654632',
  api_secret: 'zVCDhuiUfNEDP1e0EVFCupFEchQ'
});


export default class AtividadesController {
 public async index({}: HttpContextContract) {
    const list = (await Atividade.query().orderBy('data', 'desc'))
    return list
  }

  public async create({}: HttpContextContract) {

  }

  /*
  * @store
  * @summary Cria uma nova atividade
  * @description Cria uma nova atividade
  * @requestBody {"nome": "Atividade 1", "descricao": "Atividade 1", "data": "2021-09-20T17:03:27.484-03:00", "local": "Local 1", "tipo": "Tipo 1", "livre": true}
  */
  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const data = request.only(["nome", "descricao", "data", "local", "tipo", "livre", "createdBy"])
      console.log('Dados recebidos:', data);

      if (!data.nome || !data.data || !data.local || !data.tipo || !data.livre) {
        throw new Error('Todos os campos (nome, data, local, tipo, livre) são obrigatórios')
      }

      const user = await auth.user

      data.createdBy = user?.id

      const ativi = await Atividade.create(data)

      console.log('Atividade criada:', ativi.toJSON());

      const imagem = request.files('imagem') // Recebe uma imagem
      // Converte a imagem para base64
      if (imagem && imagem.length > 0) {
        if (imagem && imagem.length > 0 && imagem[0].tmpPath) {
          await cloudinary.uploader.upload(imagem[0].tmpPath, {
            folder: 'atividades',
            public_id: `atividade-${ativi.id}`
            }, (error, result) => {
              if (error) {
                console.error('Erro ao salvar imagem:', error.message);
              } else {
                console.log('Imagem salva:', result);
                ativi.imagemUrl = result?.secure_url ?? ''; // add null check here
              }
            }
          )
        }
      }


      await ativi.save()

      console.log('Atividade salva URL D imagem:', ativi.toJSON());

      return response.status(201).json({
        message: 'Atividade criada com sucesso',
        atividade: ativi
      })
    } catch (error) {
      console.error('Erro ao criar atividade:', error.message);
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

      console.log('Atividade encontrada:', atividade.toJSON()); // Log da atividade encontrada

      return atividade
    } catch (error) {
      console.error('Erro ao buscar atividade:', error.message); // Log de erro
      return response.status(400).json({
        message: 'Erro ao buscar atividade',
        error: error.message
      })
    }
  }

  public async edit({}: HttpContextContract) {}

  /*
  * @update
  * @summary Atualiza uma atividade
  * @description Atualiza uma atividade
  * @requestBody {"nome": "Atividade 1", "descricao": "Atividade 1", "data": "2021-09-20T17:03:27.484-03:00", "local": "Local 1", "tipo": "Tipo 1", "livre": true}
  */
  public async update({request, params, response, auth}: HttpContextContract) {
    try {
      const data = request.only(["nome","descricao","data", "local", "tipo","livre"])
      const atividadeId = Number(params.id)
      const atividade = await Atividade.findOrFail(atividadeId)
      .catch(() => {
        throw new Error('Atividade não encontrada')
      })
      if (atividade.createdBy !== auth.user?.id) {
        throw new Error('Você não tem permissão para atualizar esta atividade')
      }
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

  public async destroy({params, response, auth}: HttpContextContract) {
    try {
      const atividadeId = Number(params.id)
      const atividade = await Atividade.findOrFail(atividadeId)
      .catch(() => {
        throw new Error('Atividade não encontrada')
      })
      console.log(auth.user?.isAdmin)
      if (atividade.createdBy !== auth.user?.id && !auth.user?.isAdmin) {
        throw new Error('Você não tem permissão para deletar esta atividade')
      }
      await Participacao.query().where('atividade_id', atividadeId).delete()
      await atividade.delete()
      return response.status(200).json({message: 'Atividade deletada com sucesso'})
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao deletar atividade',
        error: error.message
      })
    }
  }

  /*
  * @filtrar
  * @summary Filtra atividades
  * @description Filtra atividades
  * @paramQuery tipo
  * @paramQuery data
  * @paramQuery page
  */
  public async filtrar({ request, response }: HttpContextContract) {
    let {tipo, data, page, perPage} = request.qs()
    if (!perPage) perPage = 10
    if (!page) page = 1
    try {
      const query = Atividade.query()
      if (tipo) query.where('tipo', 'LIKE', `%${tipo}%`)
      if (data) query.where('data', 'LIKE', `%${data}%`)
      if (page) return query.paginate(page, perPage)
      return query.exec()
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao filtrar atividades',
        error: error.message,
      })
    }
  }

  public async getAtividadesByAuth({ request, auth, response}: HttpContextContract) {
    try {
      let { perPage, page } = request.qs()
      if (!perPage) perPage = 10
      if (!page) page = 1
      const user = await auth.user
      if (!user) {
        throw new Error('Usuário não autenticado')
      }
      const atividades = await Atividade.query()
      .where('created_by', user.id)
      .paginate(page, perPage)
      return atividades
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao buscar atividades',
        error: error.message
      })
    }
  }
}

module.exports = AtividadesController
