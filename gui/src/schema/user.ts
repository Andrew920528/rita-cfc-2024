import {Schedule} from "./schedule";
import {Classroom} from "./classroom";

export class User {
  private _username: string;
  private _alias: string;
  private _school: string;
  private _occupation: string;
  private _schedule: Schedule;
  private _classrooms: Classroom[];

  constructor(
    username: string,
    alias: string,
    school: string,
    occupation: string,
    schedule: Schedule = new Schedule(),
    classrooms: Classroom[] = []
  ) {
    this._username = username;
    this._alias = alias;
    this._school = school;
    this._occupation = occupation;
    this._schedule = schedule;
    this._classrooms = classrooms;
  }
}
