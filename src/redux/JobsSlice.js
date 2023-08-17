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
    console.log("payload.jobDetails.id", payload.jobDetails.id);
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          const currentJobs = userDocSnapshot.data().currentJobs || [];
          console.log(currentJobs);
          console.log("currentJobs.lenght = ", currentJobs.length);
          const indexOfJobToBeEdited = currentJobs.findIndex(
            (job) => job.id === payload.jobDetails.id
          );
          console.log("indexOfJobToBeEdited", indexOfJobToBeEdited);

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
      date: "",
      city: "",
      zipcode: "",
      weight: 0,
      price: 0,
      terminal: "",
    },
    jobToEdit: {
      date: "",
      day: "",
      city: "",
      zipcode: "",
      weight: 0,
      price: 0,
      cmr: "",
      isSecondJob: false,
      waiting: 0,
      note: "",
      terminal: "",
      id: "",
    },
  },
  reducers: {
    setJobToAdd: (state, action) => {
      state.jobToAdd.date = action.payload.date;
      state.jobToAdd.city = action.payload.city;
      state.jobToAdd.zipcode = action.payload.zipcode;
      state.jobToAdd.weight = action.payload.weight;
      state.jobToAdd.price = action.payload.price;
    },
    setJobToEdit: (state, action) => {
      state.jobToEdit.date = action.payload.date;
      state.jobToEdit.city = action.payload.city;
      state.jobToEdit.zipcode = action.payload.zipcode;
      state.jobToEdit.weight = action.payload.weight;
      state.jobToEdit.price = action.payload.price;
      state.jobToEdit.cmr = action.payload.cmr;
      state.jobToEdit.isSecondJob = action.payload.isSecondJob;
      state.jobToEdit.waiting = action.payload.waiting;
      state.jobToEdit.note = action.payload.note;
      state.jobToEdit.terminal = action.payload.terminal;
      state.jobToEdit.id = action.payload.id;
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
      .addCase(addJobToDatabase.rejected, () => {
        console.log("addJobToDatabase SELHAL");
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

export const { setJobToAdd, setJobToEdit } = jobsSlice.actions;

export default jobsSlice.reducer;
