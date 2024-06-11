/**
 * Contains the data stucture used in the frontend.
 * Includes parser from API response for each class.
 */

class User {
  constructor(
    id,
    username,
    password,
    alias,
    school,
    occupation,
    schedule,
    subjects
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.alias = alias;
    this.school = school;
    this.occupation = occupation;
    this.schedule = schedule;
    this.subjects = subjects;
  }
}

class Subject {
  constructor() {}
}
