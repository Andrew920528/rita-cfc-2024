import React, {useEffect} from "react";

type Props = {};

const LoginBuffer = (props: Props) => {
  useEffect(() => {
    console.log("login buffer");
  }, []);
  return <div>Loading</div>;
};

export default LoginBuffer;
