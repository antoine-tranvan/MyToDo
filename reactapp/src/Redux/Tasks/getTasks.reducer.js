export const GET_TASKS = "GET_TASKS";
export const SET_TASKS = "SET_TASKS";

export const getTasks = () => ({
  type: GET_TASKS,
});

export const setTasks = (tasks) => ({
  type: SET_TASKS,
  tasks,
});

const initialState = {
  tasks: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TASKS:
      const { tasks } = action;
      return { ...state, tasks };
    default:
      return state;
  }
};
