import React, {useEffect, useState} from "react";
import IconButton from "../ui_components/IconButton/IconButton";
import {FloatingMenuButton} from "../ui_components/FloatingMenu/FloatingMenu";
import {
  Close,
  User,
  Settings,
  Logout,
  Menu,
  UserAvatar,
  Save,
} from "@carbon/icons-react";
import {useAppDispatch, useTypedSelector} from "../../store/store";

import ManageAccountPU from "../PopUps/ManageAccountPU/ManageAccountPU";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {UserServices} from "../../features/UserSlice";
import {API, EMPTY_ID} from "../../global/constants";
import {
  updateUserService,
  updateWidgetBulkService,
  useApiHandler,
} from "../../utils/service";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import {LoginStatusServices} from "../../features/LoginStatusSlice";
import {CircularProgress} from "@mui/material";
import useAutosave from "../../utils/useAutosave";
import {toast} from "react-toastify";

const cx = classNames.bind(styles);
type HeaderProps = {
  openNav: boolean;
  setOpenNav: (set: boolean) => void;
};
const Header = ({openNav, setOpenNav = () => {}}: HeaderProps) => {
  const classrooms = useTypedSelector((state) => state.Classrooms);
  const unsavedWidgets = useTypedSelector((state) => state.Widgets.unsaved);
  const scheduleChanged = useTypedSelector(
    (state) => state.User.scheduleChanged
  );

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    // Add the event listener
    let shouldAlert =
      Object.keys(unsavedWidgets).length !== 0 || scheduleChanged;

    if (shouldAlert) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedWidgets, scheduleChanged]);

  return (
    <div className={cx("header")}>
      <div className={cx("header-left")}>
        <IconButton
          mode={"on-dark"}
          icon={openNav ? <Close size={20} /> : <Menu size={20} />}
          onClick={() => {
            setOpenNav(!openNav);
          }}
        />
        <div className={cx("title")}>
          <p className={cx("title-rita")}>Rita</p>
          <p className={cx("title-beta")}>
            <sup>beta</sup>
          </p>
        </div>
      </div>
      <div className={cx("header-right")}>
        {classrooms.current === EMPTY_ID ||
        Object.keys(classrooms.dict).length === 0 ? (
          <div className={cx("no-subject-hint")}>
            <i>新增教室以開始備課</i>
          </div>
        ) : (
          <div className={cx("subject-banner")}>
            <p className={cx("subject", "--heading")}>
              {classrooms.dict[classrooms.current].name}
            </p>
          </div>
        )}

        <div className={cx("header-right-end")}>
          <SaveGroup />
          <AccountButton />
        </div>
      </div>
    </div>
  );
};

const SaveGroup = () => {
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state) => state.User);
  const unsavedWidgets = useTypedSelector((state) => state.Widgets.unsaved);
  const scheduleChanged = useTypedSelector(
    (state) => state.User.scheduleChanged
  );
  const widgetDict = useTypedSelector((state) => state.Widgets.dict);
  const {apiHandler, loading} = useApiHandler();
  useAutosave(() => {
    saveAll();
  }, 30 * 1000);
  const saveAll = async () => {
    let r;
    if (scheduleChanged) {
      // update user here
      r = await apiHandler({
        apiFunction: (s) =>
          updateUserService(
            {
              schedule: JSON.stringify(user.schedule),
            },
            s
          ),
        debug: true,
        identifier: "updateUserService",
      });
      if (r.status === API.ERROR || r.status === API.ABORTED) {
        toast.error("存檔失敗，請重試");
        return;
      }
      dispatch(UserServices.actions.saveSchedule());
    }
    // save all widgets here
    if (Object.keys(unsavedWidgets).length !== 0) {
      r = await apiHandler({
        apiFunction: (s) =>
          updateWidgetBulkService(
            {
              widgetIds: Object.keys(unsavedWidgets),
              contents: Object.keys(unsavedWidgets).map((w: string) => {
                let content = widgetDict[w].content;
                return JSON.stringify(content);
              }),
            },
            s
          ),
        debug: true,
        identifier: "updateWidgetBulkService",
      });
      if (r.status === API.ERROR || r.status === API.ABORTED) {
        toast.error("存檔失敗，請重試");
        return;
      }
      dispatch(WidgetsServices.actions.saveAll());
    }
  };
  return (
    <div className={cx("save-group")}>
      <i
        className={cx({
          saved: Object.keys(unsavedWidgets).length === 0 && !scheduleChanged,
        })}
      >
        {Object.keys(unsavedWidgets).length === 0 && !scheduleChanged
          ? "All changes saved"
          : loading
          ? "Saving..."
          : "New changes unsaved"}
      </i>
      {loading ? (
        <CircularProgress color="inherit" size={12} />
      ) : (
        <IconButton
          mode={"on-dark"}
          icon={<Save size={20} />}
          onClick={async () => {
            await saveAll();
          }}
          disabled={
            (Object.keys(unsavedWidgets).length === 0 && !scheduleChanged) ||
            loading
          }
        />
      )}
    </div>
  );
};

const AccountButton = () => {
  const user = useTypedSelector((state) => state.User);
  const AccountContent = ({
    name = "廖偉良",
    occupation = "級任老師",
    school = "松山高中",
  }) => {
    const [openManageAccountPU, setOpenManageAccountPU] = useState(false);
    const dispatch = useAppDispatch();

    return (
      <div className={cx("account-content")}>
        <div className={cx("user-info")}>
          <div className={cx("user-info-col")}>
            <p>
              <strong>{name}</strong>
            </p>
            <p className={cx("user-detail")}>
              {occupation} {occupation !== "" && school !== "" && "@"} {school}
            </p>
          </div>
          <UserAvatar size={30} />
        </div>
        <IconButton
          flex={true}
          text={"管理帳號"}
          icon={<Settings />}
          mode={"on-dark-2"}
          onClick={() => {
            setOpenManageAccountPU(!openManageAccountPU);
          }}
        />

        <ManageAccountPU
          trigger={openManageAccountPU}
          setTrigger={setOpenManageAccountPU}
          title="管理帳號"
        />

        <IconButton
          flex={true}
          text={"登出"}
          icon={<Logout />}
          mode={"on-dark-2"}
          onClick={() => {
            sessionStorage.removeItem("sessionId");
            dispatch(LoginStatusServices.actions.setComplete(false));
          }}
        />
      </div>
    );
  };

  const menuProps = {
    mode: "dark",
    content: (
      <AccountContent
        name={user.alias}
        occupation={user.occupation}
        school={user.school}
      />
    ),
  };
  return (
    <FloatingMenuButton
      button={<IconButton mode="on-dark" icon={<User size={20} />} />}
      menuProps={menuProps}
      anchorOrigin={{horizontal: "right", vertical: "bottom"}}
      transformOrigin={{horizontal: "right", vertical: "top"}}
    />
  );
};

export default Header;
