import {configureStore} from "@reduxjs/toolkit";
import {useDispatch, useSelector, TypedUseSelectorHook} from "react-redux";
import {useReducer} from "react";
import UserReducer from "../features/UserSlice";
import ClassroomsReducer from "../features/ClassroomsSlice";
import LecturesReducer from "../features/LectureSlice";
import WidgetsReducer from "../features/WidgetsSlice";
import ChatroomsReducer from "../features/ChatroomsSlice";
const store = configureStore({
  reducer: {
    User: UserReducer, //convention is to to write the text preceding the word "Reducer"
    Classrooms: ClassroomsReducer,
    Lectures: LecturesReducer,
    Widgets: WidgetsReducer,
    Chatrooms: ChatroomsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//Writing these here to prevent defining the types in every file
export const useAppDispatch = () => useDispatch<AppDispatch>(); //This is used to perform action
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
