import { AddUser } from "./user.action";
import { State, Action, StateContext, Selector } from "@ngxs/store";
import { User } from "./user";
import { Injectable } from "@angular/core";
import { patch, removeItem } from "@ngxs/store/operators";

export interface UserStateModel {
  user: User[];
}

@State<UserStateModel>({
  name: "user",
  defaults: { user: [] }
})
@Injectable()
export class UserState {
  @Selector()
  static getUser(state: UserStateModel) {
    return state.user;
  }

  @Action(AddUser)
  add(
    { getState, patchState }: StateContext<UserStateModel>,
    { payload }: AddUser
  ) {
    const state = getState();
    patchState({
      user: [...state.user, payload]
    });
  }
}
