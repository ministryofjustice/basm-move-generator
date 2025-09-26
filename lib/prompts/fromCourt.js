const { Form } = require('enquirer')
const { format } = require('date-fns')
const { faker } = require('@faker-js/faker')
const data = require('../data/data')

module.exports = async generator => {
  const prompt = new Form({
    name: 'user',
    message: 'Please provide the following information:',
    choices: [
      { name: 'prison_number', message: 'Prison number' },
      { name: 'police_national_computer', message: 'PNC number' },
      { name: 'firstName', message: 'First Name', initial: faker.name.firstName() },
      { name: 'lastName', message: 'Last Name', initial: faker.name.lastName() },
      {
        name: 'dob',
        message: 'Date of birth',
        initial: format(faker.date.between('1980-01-01T01:01:01.000Z', '2004-01-01T01:01:01.000Z'), 'yyyy-MM-dd'),
      },
      { name: 'gender', message: 'Gender (male | female | trans)', initial: 'male' },
    ],
  })

  const value = await prompt.run()

  const genderObj = Object.fromEntries(data.gender.flatMap(Object.entries))

  const gender = genderObj[value.gender]
  if (!gender) throw Error('Invalid gender')

  const person = { ...value, gender }

  const arrival = await generator.fromCourt(person)
  console.log('Answer:', arrival)
}
