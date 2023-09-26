import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddParticipantesToAtividades extends BaseSchema {
  protected tableName = 'atividades' // Alterei o nome da tabela para 'atividades'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.json('participantes')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('participantes')
    })
  }
}
