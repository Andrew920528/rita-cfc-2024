import {Information, Add} from "@carbon/icons-react";

import {ReactElement} from "react";
import {API} from "../../../global/constants";
import {WidgetType, initWidget} from "../../../schema/widget";
import {useCreateWidget} from "../../../store/globalActions";
import {useTypedSelector} from "../../../store/store";
import {useApiHandler, createWidgetService} from "../../../utils/service";
import {generateId} from "../../../utils/util";
import IconButton from "../../ui_components/IconButton/IconButton";
import classNames from "classnames/bind";
import styles from "./WidgetCard.module.scss";

const cx = classNames.bind(styles);
type WidgetCardProps = {
  icon: ReactElement;
  title: string;
  hint: string;
  widgetType: WidgetType;
};

const WidgetCard = ({icon, title, hint, widgetType}: WidgetCardProps) => {
  const lectures = useTypedSelector((state) => state.Lectures);
  const username = useTypedSelector((state) => state.User.username);
  const addWidget = useCreateWidget();
  const {apiHandler, loading} = useApiHandler();
  // TODO DELETE
  const widgets = useTypedSelector((state) => state.Widgets);
  async function createWidget() {
    const newWidgetId = username + "-wid-" + generateId();
    let r = await apiHandler({
      apiFunction: (s) =>
        createWidgetService(
          {
            widgetId: newWidgetId,
            type: widgetType,
            lectureId: lectures.current,
            content: JSON.stringify(
              initWidget(newWidgetId, widgetType).content
            ), // TODO Needs to save initial content
          },
          s
        ),
      debug: true,
      identifier: "createWidget",
    });
    if (r.status === API.ERROR || r.status === API.ABORTED) {
      return;
    }
    addWidget({
      widgetType: widgetType,
      lectureId: lectures.current,
      widgetId: newWidgetId,
    });
  }
  return (
    <div className={cx("widget-card")}>
      <div className={cx("widget-card-left")}>
        {icon}
        <p>
          <strong>{title}</strong>
        </p>
        <p className={cx("--label")}>{hint}</p>
      </div>
      <div className={cx("widget-card-right")}>
        <IconButton mode={"ghost"} icon={<Information />} />
        <IconButton
          mode={"primary"}
          icon={<Add />}
          onClick={async () => {
            await createWidget();
          }}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default WidgetCard;
