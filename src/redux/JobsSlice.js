import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { runTransaction, doc } from "firebase/firestore";
import { db } from "../firebase/config";

//  ADD JOB
//
export const addJobToDatabase = createAsyncThunk(
  "jobs/addJobToDatabase",
  async (payload) => {
    console.log(payload);
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

//  EDIT JOB
//
export const editJobInDatabase = createAsyncThunk(
  "jobs/editJobInDatabase",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          const currentJobs = userDocSnapshot.data().currentJobs || [];

          const indexOfJobToBeEdited = currentJobs.findIndex(
            (job) => job.id === payload.jobDetails.id
          );

          if (indexOfJobToBeEdited !== -1) {
            currentJobs[indexOfJobToBeEdited] = payload.jobDetails;

            const sortedCurrentJobs = currentJobs.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateB - dateA;
            });

            transaction.update(userDocRef, {
              currentJobs: sortedCurrentJobs,
            });
          }
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
      city: "",
      isCustomJob: true,
      terminal: "",
      weightTo27t: 0,
      weightTo34t: 0,
      zipcode: "",
    },
    isEditing: false,
    jobToEdit: {
      city: "",
      cmr: "",
      date: "",
      id: "",
      isCustomJob: "",
      isSecondJob: false,
      note: "",
      price: 0,
      terminal: "",
      waiting: 0,
      weight: 0,
      weightTo27t: 0,
      weightTo34t: 0,
      zipcode: "",
    },
  },
  reducers: {
    setJobToAdd: (state, action) => {
      console.log(action.payload);
      state.jobToAdd.city = action.payload.city;
      state.jobToAdd.isCustomJob = action.payload.isCustomJob;
      state.jobToAdd.terminal = action.payload.terminal;
      state.jobToAdd.weightTo27t = action.payload.weightTo27t;
      state.jobToAdd.weightTo34t = action.payload.weightTo34t;
      state.jobToAdd.zipcode = action.payload.zipcode;
    },
    setJobToEdit: (state, action) => {
      state.jobToEdit.city = action.payload.city;
      state.jobToEdit.cmr = action.payload.cmr;
      state.jobToEdit.date = action.payload.date;
      state.jobToEdit.id = action.payload.id;
      state.jobToEdit.isCustomJob = action.payload.isCustomJob;
      state.jobToEdit.isSecondJob = action.payload.isSecondJob;
      state.jobToEdit.note = action.payload.note;
      state.jobToEdit.price = action.payload.price;
      state.jobToEdit.terminal = action.payload.terminal;
      state.jobToEdit.waiting = action.payload.waiting;
      state.jobToEdit.weight = action.payload.weight;
      state.jobToEdit.weightTo27t = action.payload.weightTo27t;
      state.jobToEdit.weightTo34t = action.payload.weightTo34t;
      state.jobToEdit.zipcode = action.payload.zipcode;
    },
    setEditing: (state, action) => {
      state.isEditing = action.payload;
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
        state.jobToAdd.price = 0;
        state.jobToAdd.terminal = "";
        state.jobToAdd.weight = 0;
        state.jobToAdd.weightTo27t = 0;
        state.jobToAdd.weightTo34t = 0;
        state.jobToAdd.zipcode = "";
      })
      .addCase(addJobToDatabase.rejected, () => {
        console.log("addJobToDatabase SELHAL");
      })
      .addCase(editJobInDatabase.pending, () => {
        console.log("editJobInDatabase PROBÍHÁ");
      })
      .addCase(editJobInDatabase.fulfilled, (state) => {
        console.log("editJobInDatabase ÚSPĚŠNĚ DOKONČEN");
        state.jobToEdit.city = "";
        state.jobToEdit.cmr = "";
        state.jobToEdit.date = "";
        state.jobToEdit.day = "";
        state.jobToEdit.id = "";
        state.jobToEdit.isCustomJob = "";
        state.jobToEdit.isSecondJob = false;
        state.jobToEdit.note = "";
        state.jobToEdit.price = 0;
        state.jobToEdit.terminal = "";
        state.jobToEdit.waiting = 0;
        state.jobToEdit.weight = 0;
        state.jobToEdit.weightTo27t = 0;
        state.jobToEdit.weightTo34t = 0;
        state.jobToEdit.zipcode = "";
      })
      .addCase(editJobInDatabase.rejected, () => {
        console.log("editJobInDatabase SELHAL");
      })
      .addCase(deleteJobFromDatabase.pending, () => {
        console.log("deleteJobFromDatabase PROBÍHÁ");
      })
      .addCase(deleteJobFromDatabase.fulfilled, () => {
        console.log("deleteJobFromDatabase ÚSPĚŠNĚ DOKONČEN");
      })
      .addCase(deleteJobFromDatabase.rejected, () => {
        console.log("deleteJobFromDatabase SELHAL");
      });
  },
});

export const { setJobToAdd, setJobToEdit, setEditing } = jobsSlice.actions;

export default jobsSlice.reducer;
