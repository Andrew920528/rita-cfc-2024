import React, {ReactElement} from "react";
import {Catalog, Close} from "@carbon/icons-react";
import IconButton from "../ui_components/IconButton";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {SessionsServices} from "../../features/SessionsSlice";

type WidgetFrameProps = {
  selected?: boolean;
  icon?: ReactElement;
  title?: string;
  children?: ReactElement | null;
  widgetId: string;
};
const WidgetFrame = ({
  selected,
  icon = <Catalog size={20} />,
  title = "Widget",
  children,
  widgetId,
}: WidgetFrameProps) => {
  const dispatch = useAppDispatch();
  const sessions = useTypedSelector((state) => state.Sessions);
  const widgets = useTypedSelector((state) => state.Widgets);
  function deleteWidget() {
    dispatch(WidgetsServices.actions.deleteWidget(widgetId));
    dispatch(WidgetsServices.actions.setCurrent("NONE"));
    dispatch(
      SessionsServices.actions.deleteWidget({
        sessionId: sessions.current,
        widgetId: widgetId,
      })
    );
  }
  return (
    <div
      className={`widget-frame ${selected ? "selected" : "idle"}`}
      onClick={() => {
        if (widgets.current === widgetId) {
          dispatch(WidgetsServices.actions.setCurrent("NONE"));
        } else {
          dispatch(WidgetsServices.actions.setCurrent(widgetId));
        }
      }}
    >
      <div className="wf-heading">
        {icon}
        <p className="--heading">{title}</p>
        <IconButton
          icon={<Close />}
          mode="ghost"
          onClick={() => {
            deleteWidget();
          }}
        />
      </div>
      <div className="wf-content">{children}</div>
    </div>
  );
};

export default WidgetFrame;
