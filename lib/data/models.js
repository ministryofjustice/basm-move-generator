/* eslint-disable camelcase */
const { formatISO, format } = require('date-fns');
const faker = require('faker');
const data = require('./data');

const random = (array) => Object.values(array[(array.length * Math.random()) || 0])[0];

const person = ({
  firstName, lastName, dob, gender, ethnicity, prison_number, police_national_computer,
}) => ({
  data: {
    type: 'people',
    attributes: {
      first_names: firstName,
      last_name: lastName,
      date_of_birth: dob,
      gender_additional_information: null,
      prison_number,
      police_national_computer,
      criminal_records_office: null,
    },
    relationships: {
      gender: {
        data: {
          type: 'genders',
          id: gender,
        },
      },
      ethnicity: {
        data: {
          type: 'ethnicities',
          id: ethnicity,
        },
      },
    },
  },
});

module.exports = {
  data,
  random,
  syncProfile: () => ({ data: { type: 'profiles' } }),

  profile: () => ({
    data: {
      type: 'profiles',
      attributes: {
        assessment_answers: [
          {
            key: 'violent',
            category: 'risk',
            title: 'Violent',
            comments: 'does not like marmite',
            assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
            imported_from_nomis: false,
          },
          {
            key: 'escape',
            category: 'risk',
            title: 'Escape',
            comments: 'good at climbing fences',
            assessment_question_id: 'f2db9a8f-a5a9-40cf-875b-d1f5f62b2497',
            imported_from_nomis: false,
          },
          {
            key: 'hold_separately',
            category: 'risk',
            title: 'Must be held separately',
            comments: 'must be held separately',
            assessment_question_id: '8f38efb0-36c1-4a56-8c66-3b72c9525f92',
            imported_from_nomis: false,
          },
          {
            key: 'special_diet_or_allergy',
            category: 'health',
            title: 'Special diet or allergy',
            comments: 'peanut allergy',
            assessment_question_id: 'e6faaf20-3072-4a65-91f7-93d52b16260f',
            imported_from_nomis: false,
          },
        ],
      },
    },
  }),

  randomPerson: ({
    firstName, lastName, prison_number, police_national_computer,
  } = {}) => person({
    firstName: firstName || faker.name.firstName(),
    lastName: lastName || faker.name.lastName(),
    prison_number,
    police_national_computer,
    dob: format(
      faker.date.between(
        '1980-01-01T01:01:01.000Z',
        '2004-01-01T01:01:01.000Z',
      ),
      'yyyy-MM-dd',
    ),
    gender: random(data.gender),
    ethnicity: random(data.ethnicity),
  }),

  moves: {
    remand: ({
      profile, date, fromLocation, toLocation,
    }) => ({
      data: {
        type: 'moves',
        attributes: {
          date: format(date, 'yyyy-MM-dd'),
          time_due: formatISO(date),
          status: 'requested',
          additional_information:
            'example Court to Prison prison_remand: Huddersfield Youth Court to HMP Isle of Wight',
          move_type: 'prison_remand',
        },
        relationships: {
          profile: {
            data: {
              type: 'profiles',
              id: profile,
            },
          },
          from_location: {
            data: {
              type: 'locations',
              id: fromLocation,
            },
          },
          to_location: {
            data: {
              type: 'locations',
              id: toLocation,
            },
          },
        },
      },
    }),
    recall: ({
      profile, date, fromLocation, toLocation,
    }) => ({
      data: {
        type: 'moves',
        attributes: {
          date: format(date, 'yyyy-MM-dd'),
          time_due: formatISO(date),
          status: 'requested',
          additional_information: 'Prisoner recall',
          move_type: 'prison_recall',
        },
        relationships: {
          profile: {
            data: {
              type: 'profiles',
              id: profile,
            },
          },
          from_location: {
            data: {
              type: 'locations',
              id: fromLocation,
            },
          },
          to_location: {
            data: {
              type: 'locations',
              id: toLocation,
            },
          },
        },
      },
    }),
    transfer: ({
      profile, date, fromLocation, toLocation,
    }) => ({
      data: {
        type: 'moves',
        attributes: {
          date_from: format(date, 'yyyy-MM-dd'),
          date_to: undefined,
          move_agreed: true,
          move_agreed_by: 'Fred Bloggs',
          status: 'proposed',
          additional_information: 'example IPT singleton transfer',
          move_type: 'prison_transfer',
        },
        relationships: {
          profile: {
            data: {
              type: 'profiles',
              id: profile,
            },
          },
          from_location: {
            data: {
              type: 'locations',
              id: fromLocation,
            },
          },
          to_location: {
            data: {
              type: 'locations',
              id: toLocation,
            },
          },
          prison_transfer_reason: {
            data: {
              type: 'prison_transfer_reasons',
              id: '1de93692-461f-5355-9e4d-9a0b673daf15',
            },
          },
        },
      },
    }),

    accept: () => ({
      data: {
        type: 'accepts',
        attributes: {
          timestamp: formatISO(new Date()),
        },
      },
    }),

    approve: () => ({
      data: {
        type: 'approve',
        attributes: {
          timestamp: formatISO(new Date()),
          date: format(new Date(), 'yyyy-MM-dd'),
        },
      },
    }),

    start: () => ({
      data: {
        type: 'starts',
        attributes: {
          timestamp: formatISO(new Date()),
          date: format(new Date(), 'yyyy-MM-dd'),
        },
      },
    }),

    complete: () => ({
      data: {
        type: 'completes',
        attributes: {
          timestamp: formatISO(new Date()),
          date: format(new Date(), 'yyyy-MM-dd'),
        },
      },
    }),
  },
};
