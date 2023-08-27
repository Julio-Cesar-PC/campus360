import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { AtividadeFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run () {
    await AtividadeFactory.createMany(10)
  }
}
