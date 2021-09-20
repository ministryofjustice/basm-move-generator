/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require("drupal-jsonapi-params");

class MovesQuery {
  constructor(locationId, personId) {
    this.query = new Query()
      .addFilter("move_type", "prison_remand") // court_appearance, police_transfer, prison_recall, prison_transfer
      // .addFilter("to_location_id", locationId)
      // .addFilter('person_id', personId)
      .addFilter("date_from", "2021-09-15")
      .addFilter("date_to", "2021-09-15")
      // .addFilter("status", "completed") // proposed, requested, booked, in_transit, cancelled, completed
      // .addInclude(["profile.person", "from_location", "to_location"])
      // .addPageLimit(1)
      .getQueryString();
  }

  path() {
    return `/api/moves?${this.query}&per_page=1`;
  }

  transform(item) {
    console.log(JSON.stringify(item, null, 2));
    return {
      date_of_birth: item?.profile?.person?.dateOfBirth,
      first_names: item?.profile?.person?.firstNames,
      last_names: item?.profile?.person?.lastName,
      from_location: item.fromLocation?.title,
      to_location: item.toLocation?.title,
      offender_no: item.profile?.person?.prisonNumber,
      cro_no: item.profile?.person?.criminalRecordsOffice,
      pnc_no: item.profile?.person?.policeNationalComputer,
      date_from: item.dateFrom,
      date_to: item.dateTo,
      move_type: item.moveType,
      status: item.status,
    };
  }
}

module.exports = { MovesQuery };
