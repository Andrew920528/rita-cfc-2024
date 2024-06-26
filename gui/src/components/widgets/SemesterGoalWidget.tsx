import React from "react";
import IconButton from "../ui_components/IconButton";
import {Alarm} from "@carbon/icons-react";
import TextArea from "../ui_components/TextArea";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {WidgetType, Widget, SemesterGoalWidgetContent} from "../../schema/widget";

type Props = {
  wid: string;
};

// TODO
/**
 * Hi Ellen, I am here to guide you through implementing the semester goal widget.
 * Who am I? I am ANONYMOUS MONKEY. It is my duty to guide you through this project, and lead your way to become a React master.
 *
 * 1. You should be on you own branch with the latest updates from main.
 * 2. Checkout NoteWidget.tsx, I made a few minor changes.
 * - In the textarea component, I set value = {widget.content}
 * - widget.content is the global state that holds the content of the note widget that is being edited.
 * - You can get global states by doing const widget = useTypedSelector((state) => state.Widgets.dict[props.wid]) as NoteWidgetT;
 * 3. SemesterGoalWidget will have basically the same UI, which is just a textarea. So, add that to the component.
 * 4. Next, the placeholder should be changed to sth like "輸入本學期的學習重點，並用 enter 分隔不同項目"
 * 5. SemesterGoalWidget is stored as {id, type, content}, where content is a list of string! Checkout schema/widget.tsx for more details.
 * 6. The textbox should display the list of string as a string separated by new lines.
 * 7. Whenever the user created a newline in the textbox, a new string should be added to the list.
 * (Basically, update the content by getting the entire string, and split it by new lines.)
 * 8. To test whether the widget works, you can console.log the content of the widget and see if the list is correct.
 * 9. Remove this message once you're ready to make a pull request :)
 *
 * Yours truly,
 * Anonymous Monkey
 */

const SemesterGoalWidget = (props: Props) => {
    const dispatch = useAppDispatch();
    const widget = useTypedSelector((state) => state.Widgets.dict[props.wid]);
    function editSemesterGoal(newSemesterGoal: SemesterGoalWidgetContent) {
      const newWidget: Widget = {
        id: props.wid,
        type: WidgetType.SemesterGoal,
        content: newSemesterGoal,
      };
      dispatch(
        WidgetsServices.actions.updateWidget({
          newWidget: newWidget,
        })
      );
    }
    const handleListChange = (index: number, value: string) => {
      const newGoals = [...(widget.content as SemesterGoalWidgetContent).goals];
      newGoals[index] = value;
      const newSemesterGoal: SemesterGoalWidgetContent = { goals: newGoals };
      editSemesterGoal(newSemesterGoal);
    };
  
    return (
      <TextArea
        mode = "list"
        valuelist={(widget.content as SemesterGoalWidgetContent).goals}
        onChangeList={handleListChange}
      />
    );
  };

export default SemesterGoalWidget;
