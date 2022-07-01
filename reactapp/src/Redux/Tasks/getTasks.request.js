import axios from "axios";

export const requestGetTasks = (token, idList) => {
  console.log("idList request", idList);
  return axios.post("http://localhost:3000/tasks/get-tasks", {
    token: token,
    listId: idList,
  });
};
