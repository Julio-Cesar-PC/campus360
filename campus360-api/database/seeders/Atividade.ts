import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Atividade from 'App/Models/Atividade'
import fs from 'fs'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        email: 'admin@email.com',
        roleId: 2,
        password: '123456'
      },

      {
        email: 'moderator@email.com',
        roleId: 3,
        password: '123456'
      },

      {
        email: 'test@test.com',
        password: '123456'
      }
    ])

    const atividades = fs.readFileSync('eventos.json', 'utf-8')
    const atividadesJson = JSON.parse(atividades)



    for (let i = 0; i < atividadesJson.length; i++) {
      const atividade = atividadesJson[i]
      const atividadeObj = {
        nome: atividade.acf.evento_nome,
        created_by: 2,
        descricao: atividade.acf.evento_descricao,
        data: atividade.date,
        local: atividade.acf.evento_local,
        tipo: atividade.type,
        livre: true,
        imagemUrl: atividade.acf.evento_banner.url,
      }
      await Atividade.create(atividadeObj)
    }
  }
}
