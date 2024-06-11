import {Widget} from "./widget";

export class Session {
  private _id: number;
  private _name: string;
  private _type: number;
  private _widgets: Widget[];

  constructor(id: number, name: string, type: number, widgets: Widget[]) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._widgets = widgets;
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
   * Getter type
   * @return {number}
   */
  public get type(): number {
    return this._type;
  }

  /**
   * Getter widgets
   * @return {Widget}
   */
  public get widgets(): Widget[] {
    return this._widgets;
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
   * Setter type
   * @param {number} value
   */
  public set type(value: number) {
    this._type = value;
  }

  /**
   * Setter widgets
   * @param {Widget} value
   */
  public set widgets(value: Widget[]) {
    this._widgets = value;
  }
}
