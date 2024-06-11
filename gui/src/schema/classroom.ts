import {Session} from "./session";

export class Classroom {
  private _id: number;
  private _name: string;
  private _subject: string;
  private _grade: string;
  private _publisher: string;
  private _sessions: Session[];

  constructor(
    id: number,
    name: string,
    subject: string,
    grade: string,
    publisher: string,
    sessions: Session[] = []
  ) {
    this._id = id;
    this._name = name;
    this._subject = subject;
    this._grade = grade;
    this._publisher = publisher;
    this._sessions = sessions;
  }

  /**
   * Getter id
   * @return {number}
   */
  public get id(): number {
    return this._id;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter subject
   * @return {string}
   */
  public get subject(): string {
    return this._subject;
  }

  /**
   * Getter grade
   * @return {string}
   */
  public get grade(): string {
    return this._grade;
  }

  /**
   * Getter publisher
   * @return {string}
   */
  public get publisher(): string {
    return this._publisher;
  }

  /**
   * Getter sessions
   * @return {Session[]}
   */
  public get sessions(): Session[] {
    return this._sessions;
  }

  /**
   * Setter id
   * @param {number} value
   */
  public set id(value: number) {
    this._id = value;
  }

  /**
   * Setter name
   * @param {string} value
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Setter subject
   * @param {string} value
   */
  public set subject(value: string) {
    this._subject = value;
  }

  /**
   * Setter grade
   * @param {string} value
   */
  public set grade(value: string) {
    this._grade = value;
  }

  /**
   * Setter publisher
   * @param {string} value
   */
  public set publisher(value: string) {
    this._publisher = value;
  }

  /**
   * Setter sessions
   * @param {Session[]} value
   */
  public set sessions(value: Session[]) {
    this._sessions = value;
  }
}
