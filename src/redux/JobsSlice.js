import { createSlice } from "@reduxjs/toolkit";

export const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobToAdd: {
      date: "",
      city: "",
      zipcode: "",
      cmr: "",
      weight: "",
      terminal: "",
      price: 0,
      isSecondJob: "",
      waiting: 0,
      note: "",
    },
  },
  reducers: {
    setJobToAdd: (state, action) => {
      state.jobToAdd.date = new Date().toLocaleDateString();
      console.log(state.jobToAdd.date);
      state.jobToAdd.city = action.payload.city;
      state.jobToAdd.zipcode = action.payload.zipcode;
      state.jobToAdd.terminal = action.payload.terminal;
    },
  },
});

export const { setJobToAdd } = jobsSlice.actions;

export default jobsSlice.reducer;
