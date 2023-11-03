import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'atividades'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.text('nome').notNullable()
      table.text('descricao')
      table.timestamp('data').notNullable()
      table.text('local').notNullable()
      table.text('tipo').notNullable()
      table.boolean('livre').notNullable()
      table.text('imagem_url')
      table.integer('participantes').defaultTo(0)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('imagem_url')  // Remove a coluna imagem_url se necessário
    })
    this.schema.dropTable(this.tableName)
  }
}
