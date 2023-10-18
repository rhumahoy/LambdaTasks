import { useLoaderData } from "react-router-dom";
import AuthService from "../../services/AuthService";

export const meLoader = async () => {
  return AuthService.getUser();
};

export const Me = () => {
  const data = useLoaderData();
  return <div style={{textTransform: 'uppercase'}}>{data as string}</div>;
};
