import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from 'App/Enums/Roles'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nome', 255).notNullable()
    })

    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([
        { id: Roles.USER, nome: 'USER' },
        { id: Roles.ADMIN, nome: 'ADMIN' },
        { id: Roles.MODERATOR, nome: 'MODERATOR' }
      ])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
