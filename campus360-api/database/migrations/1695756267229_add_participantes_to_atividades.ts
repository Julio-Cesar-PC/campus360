import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddParticipantesToAtividades extends BaseSchema {
  protected tableName = "participacaos"
  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('atividade_id').unsigned().references('id').inTable('atividades').primary()
      table.integer('participante_id').unsigned().references('id').inTable('users').primary()
    })
  }

  public async down () {
    this.schema.dropTable("participacaos")
  }
}
