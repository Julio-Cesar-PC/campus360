import Factory from '@ioc:Adonis/Lucid/Factory'
import Atividade from 'App/Models/Atividade'

export const AtividadeFactory = Factory
  .define(Atividade, ({ faker }) => ({
    nome: faker.lorem.words(3),
    descricao: faker.lorem.words(10),
    data: faker.date.anytime(),
    local: faker.location.country(),
    tipo: faker.lorem.words(1),
    livre: true,
  }))
  .build()

