// src/components/DecrementButton.tsx
import {useAppDispatch} from "../store/store";
import {IncDecServices} from "../features/IncDecSlice";

export const DecrementButton = ({value}: {value: number | undefined}) => {
  const dispatch = useAppDispatch();

  const DecrementButtonClickHandler = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!value) {
      dispatch(IncDecServices.actions.decrementNumber());
    } else {
      dispatch(IncDecServices.actions.decrementUserValue(value));
    }
  };

  return <button onClick={DecrementButtonClickHandler}>Decrement</button>;
};
