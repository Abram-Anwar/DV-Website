import PersonalInfo from "../components/Form/PersonalInfo";
import SpouseInfo from "../components/Form/SpouseInfo";
import ChildrenInfo from "../components/Form/ChildrenInfo";
import { useLocation } from "react-router-dom";

const Form = () => {
  const { state } = useLocation();
  const { status, hasChildren } = state;

  return (
    <>
      <PersonalInfo />

      {status === "married" && <SpouseInfo />}

      {status === "married" && hasChildren === "yes" && <ChildrenInfo />}
    </>
  );
};

export default Form;
