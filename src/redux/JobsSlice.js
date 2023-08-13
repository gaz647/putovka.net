import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { runTransaction, doc } from "firebase/firestore";
import { db } from "../firebase/config";

//  ADD JOB
//
export const addJobToDatabase = createAsyncThunk(
  "jobs/addJobToDatabase",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          const currentJobs = userDocSnapshot.data().currentJobs || [];
          currentJobs.unshift(payload.jobDetails);
          currentJobs.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
          });

          transaction.update(userDocRef, {
            currentJobs: currentJobs,
          });
        }
      });
    } catch (error) {
      // Chyba při přidávání práce do databáze
      throw error.message;
    }
  }
);

// DELETE JOB
//
export const deleteJobFromDatabase = createAsyncThunk(
  "jobs/deleteJobFromDatabase",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          const currentJobs = userDocSnapshot.data().currentJobs || [];
          const filteredCurrentJobs = currentJobs.filter(
            (oneJob) => oneJob.id !== payload.jobId
          );
          transaction.update(userDocRef, {
            currentJobs: filteredCurrentJobs,
          });
        }
      });
    } catch (error) {
      // Chyba při mazání práce z databáze
      throw error.message;
    }
  }
);

export const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobToAdd: {
      date: "",
      city: "",
      zipcode: "",
      weight: "",
      price: 0,
      terminal: "",
    },
  },
  reducers: {
    setJobToAdd: (state, action) => {
      state.jobToAdd.date = action.payload.date;
      state.jobToAdd.city = action.payload.city;
      state.jobToAdd.zipcode = action.payload.zipcode;
      state.jobToAdd.weight = action.payload.weight;
      state.jobToAdd.price = action.payload.price;
      state.jobToAdd.terminal = action.payload.terminal;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addJobToDatabase.pending, () => {
        console.log("addJobToDatabase PROBÍHÁ");
      })
      .addCase(addJobToDatabase.fulfilled, (state) => {
        console.log("addJobToDatabase ÚSPĚŠNĚ DOKONČEN");
        state.jobToAdd.city = "";
        state.jobToAdd.zipcode = "";
        state.jobToAdd.weight = 0;
        state.jobToAdd.price = 0;
      })
      .addCase(addJobToDatabase.rejected, (action) => {
        console.log("addJobToDatabase SELHAL", action.error.message);
      })
      .addCase(deleteJobFromDatabase.pending, () => {
        console.log("deleteJobFromDatabase PROBÍHÁ");
      })
      .addCase(deleteJobFromDatabase.fulfilled, () => {
        console.log("deleteJobFromDatabase ÚSPĚŠNĚ DOKONČEN");
      })
      .addCase(deleteJobFromDatabase.rejected, (action) => {
        console.log("deleteJobFromDatabase SELHAL", action.error.message);
      });
  },
});

export const { setJobToAdd } = jobsSlice.actions;

export default jobsSlice.reducer;
