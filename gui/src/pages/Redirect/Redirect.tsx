import React, {useEffect} from "react";
import Skeleton from "@mui/material/Skeleton";
import classNames from "classnames/bind";
import styles from "../Home/Home.module.scss";

const cx = classNames.bind(styles);

const Redirect = () => {
  return (
    <div className={cx("home")}>
      <Skeleton
        variant="rectangular"
        width={"100%"}
        height={"3rem"}
        sx={{bgcolor: "grey.500"}}
        animation="wave"
      />
      <div className={cx("home-content")}>
        <Skeleton
          variant="rectangular"
          width={"20rem"}
          height={"100%"}
          animation="wave"
        />
      </div>
    </div>
  );
};

export default Redirect;
