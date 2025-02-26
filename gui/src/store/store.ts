import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {useDispatch, useSelector, TypedUseSelectorHook} from "react-redux";
import UserReducer from "../features/UserSlice";
import ClassroomsReducer from "../features/ClassroomsSlice";
import LecturesReducer from "../features/LectureSlice";
import WidgetsReducer from "../features/WidgetsSlice";
import ChatroomsReducer from "../features/ChatroomsSlice";
import LoginStatusReducer from "../features/LoginStatusSlice";
import UiReducer from "../features/UiSlice";
import RfReducer from "../features/RfSlice";
const rootReducer = combineReducers({
  User: UserReducer, //convention is to to write the text preceding the word "Reducer"
  Classrooms: ClassroomsReducer,
  Lectures: LecturesReducer,
  Widgets: WidgetsReducer,
  Chatrooms: ChatroomsReducer,
  LoginStatus: LoginStatusReducer,
  Rf: RfReducer,
  Ui: UiReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

// define types
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

// Utility hooks to prevent defining the types in every file
export const useAppDispatch = () => useDispatch<AppDispatch>(); //This is used to perform action
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
