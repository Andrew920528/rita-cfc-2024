import useLang from "../../lang/useLang";
// Translation Text
export const TText = ({children}: {children: string}) => {
  const l = useLang();
  return <>{l(children)}</>;
};
