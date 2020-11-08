import { User } from "./user";

export class AddUser {
  static readonly type = "[user] add";
  constructor(public payload: User) {}
}