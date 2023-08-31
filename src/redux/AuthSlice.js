import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/config";
import axios from "axios";

// Asynchronní funkce která po registraci vytvoří jeho collection ve Firestore databázi
//
const createUserData = async (userAuth) => {
  // Získání ID a EMAILU uživatele
  const { email, uid } = userAuth;

  // Vytvoření reference kolekce USERS
  const usersCollectionRef = collection(db, "users");

  const API_KEY = "82514d87dee3023eb8c649dc";
  const FROM_CURRENCY = "EUR";
  const TO_CURRENCY = "CZK";
  const AMOUNT = 1;

  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${FROM_CURRENCY}/${TO_CURRENCY}/${AMOUNT}`
    );
    console.log(response);
    await setDoc(doc(usersCollectionRef, uid), {
      currentJobs: [],
      archivedJobs: [],
      userSettings: {
        baseMoney: 0,
        email: email,
        eurCzkRate: response.data.conversion_rate,
        percentage: 0,
        secondJobBenefit: 0,
        terminal: "ceska_trebova",
        waitingBenefit: 0,
      },
    });
    console.log("stáhnut kurz");
  } catch (error) {
    console.log(error.message);
  }
};

// REGISTER
//
export const register = createAsyncThunk(
  "auth/register",
  async (registerCredentials) => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerCredentials.registerEmail,
        registerCredentials.registerPassword
      );
      console.log("aktuální user: ", user.user.email);

      await sendEmailVerification(auth.currentUser);

      await createUserData(user.user);
    } catch (error) {
      console.log("register TRY část NE-ÚSPĚŠNÁ");
      throw error.message;
    }
  }
);

// LOGIN
//
export const login = createAsyncThunk(
  "auth/login",
  async (loginCredentials) => {
    try {
      console.log("login TRY část signInWithEmailAndPassword SPUŠTĚNA");
      await signInWithEmailAndPassword(
        auth,
        loginCredentials.loginEmail,
        loginCredentials.loginPassword
      );
      console.log(
        "login TRY část signInWithEmailAndPassword ÚSPĚŠNĚ DOKONČENA"
      );
      const emailVerifiedTrue = auth.currentUser.emailVerified;
      if (emailVerifiedTrue) {
        console.log("login Uživatelův email je verified");
        console.log("login Ukládám tuto informaci do local storage");
        localStorage.setItem("emailVerified", "true");

        const uid = auth.currentUser.uid;
        const userRef = doc(db, "users", uid);

        try {
          const userData = await getDoc(userRef);

          if (userData.exists()) {
            return userData.data();
          }
        } catch (error) {
          console.log(error.message);
          throw error.message;
        }
      } else {
        console.log("login Uživatelův email nebyl verified");
        localStorage.removeItem("emailVerified");
        try {
          console.log("login signOut(auth) Odhlašuji...");
          await signOut(auth);
          console.log("login signOut(auth) Odhlášení ÚSPĚŠNĚ DOKONČENO...");
        } catch (error) {
          console.log("login signOut(auth) Odhlášení NE-ÚSPĚŠNÉ");
          throw error.message;
        }
      }
    } catch (error) {
      console.log("login TRY část NE-ÚSPĚŠNÁ");
      throw error.message;
    }
  }
);

// LOAD USER DATA
//
export const loadUserData = createAsyncThunk(
  "auth/loadUserData",
  async (userUid) => {
    const userRef = doc(db, "users", userUid);
    try {
      const userData = await getDoc(userRef);

      if (userData.exists()) {
        return userData.data();
      }
    } catch (error) {
      throw error.message;
    }
  }
);

// LOGOUT
//
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("emailVerified");
  } catch (error) {
    throw error.message;
  }
});

//  CHANGE EMAIL
//
export const changeEmail = createAsyncThunk(
  "auth/changeEmail",
  async ({ currentPassword, newEmail }) => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, newEmail);
      await sendEmailVerification(auth.currentUser);
      await signOut(auth);
      localStorage.removeItem("emailVerified");
    } catch (error) {
      throw error.message;
    }
  }
);

//  CHANGE PASSWORD

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }) => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      await signOut(auth);
      console.log(
        "reauthenticateWithCredential i updatePassword by mělo být hotovo"
      );
    } catch (error) {
      throw error.message;
    }
  }
);

// PASSWORD RESET
//
export const passwordReset = createAsyncThunk(
  "auth/passwordReset",
  async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error.message;
    }
  }
);

//  CHANGE SETTINGS
//
export const changeSettings = createAsyncThunk(
  "auth/changeSettings",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          transaction.update(userDocRef, {
            userSettings: payload.userSettings,
          });
        }
      });
      return payload.userSettings;
    } catch (error) {
      throw error.message;
    }
  }
);

//  ADD JOB
//
export const addJobToDatabase = createAsyncThunk(
  "auth/addJobToDatabase",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          transaction.update(userDocRef, {
            currentJobs: payload.sortedCurrentJobs,
          });
        }
      });
      return payload.sortedCurrentJobs;
    } catch (error) {
      throw error.message;
    }
  }
);

//  EDIT JOB
//
export const editJobInDatabase = createAsyncThunk(
  "auth/editJobInDatabase",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          transaction.update(userDocRef, {
            currentJobs: payload.sortedCurrentJobsEdit,
          });
        }
      });
      return payload.sortedCurrentJobsEdit;
    } catch (error) {
      throw error.message;
    }
  }
);

// DELETE JOB
//
export const deleteJobFromDatabase = createAsyncThunk(
  "auth/deleteJobFromDatabase",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          transaction.update(userDocRef, {
            currentJobs: payload.filteredCurrentJobs,
          });
        }
      });
      return payload.filteredCurrentJobs;
    } catch (error) {
      throw error.message;
    }
  }
);

//  ARCHIVE DONE JOBS - FIRST TIME
//
export const archiveDoneJobsFirstTime = createAsyncThunk(
  "auth/archiveDoneJobsFirstTime",
  async (payload) => {
    try {
      const userSetingsNewCurrencyRate = {
        baseMoney: payload.userSettings.baseMoney,
        email: payload.userSettings.email,
        eurCzkRate: payload.newEurCzkRate,
        percentage: payload.userSettings.percentage,
        secondJobBenefit: payload.userSettings.secondJobBenefit,
        terminal: payload.userSettings.terminal,
        waitingBenefit: payload.userSettings.waitingBenefit,
      };

      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          transaction.update(userDocRef, {
            archivedJobs: payload.monthToArchive,
            currentJobs: payload.filteredCurrentJobs,
            userSettings: userSetingsNewCurrencyRate,
          });
        }
      });

      return payload;
    } catch (error) {
      console.log(error.message);
      throw error.message;
    }
  }
);

//  ARCHIVE DONE JOBS - NEW MONTH
//
export const archiveDoneJobsNewMonth = createAsyncThunk(
  "auth/archiveDoneJobsNewMonth",
  async (payload) => {
    try {
      const userSetingsNewCurrencyRate = {
        baseMoney: payload.userSettings.baseMoney,
        email: payload.userSettings.email,
        eurCzkRate: payload.newEurCzkRate,
        percentage: payload.userSettings.percentage,
        secondJobBenefit: payload.userSettings.secondJobBenefit,
        terminal: payload.userSettings.terminal,
        waitingBenefit: payload.userSettings.waitingBenefit,
      };

      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          transaction.update(userDocRef, {
            archivedJobs: payload.newMonthToArchive,
            currentJobs: payload.filteredCurrentJobs,
            userSettings: userSetingsNewCurrencyRate,
          });
        }
      });
      return payload;
    } catch (error) {
      throw error.message;
    }
  }
);

//  ARCHIVE DONE JOBS - EXISTING MONTH
//
export const archiveDoneJobsExistingMonth = createAsyncThunk(
  "auth/archiveDoneJobsExistingMonth",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          transaction.update(userDocRef, {
            archivedJobs: payload.updatedArchivedJobs,
            currentJobs: payload.filteredCurrentJobs,
          });
        }
      });
      return payload;
    } catch (error) {
      throw error.message;
    }
  }
);

//  DELETE ARCHIVE MONTH
//
export const deleteArchiveMonthFromDatabase = createAsyncThunk(
  "auth/deleteArchiveMonthFromDatabase",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          transaction.update(userDocRef, {
            archivedJobs: payload.filteredArchivedJobs,
          });
        }
      });
      return payload.filteredArchivedJobs;
    } catch (error) {
      throw error.message;
    }
  }
);

//  DELETE ARCHIVE MONTH JOB
//
export const deleteArchiveMonthJobFromDatabase = createAsyncThunk(
  "auth/deleteArchiveMonthJobFromDatabase",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          transaction.update(userDocRef, {
            archivedJobs: payload.filteredArchivedJobs,
          });
        }
      });
      return payload.filteredArchivedJobs;
    } catch (error) {
      throw error.message;
    }
  }
);

//  EDIT ARCHIVE MONTH JOB
//
export const editArchiveJobInDatabase = createAsyncThunk(
  "auth/editArchiveJobInDatabase",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          transaction.update(userDocRef, {
            archivedJobs: payload.sortedUpdatedArchivedJobs,
          });
        }
      });
      return payload.sortedUpdatedArchivedJobs;
    } catch (error) {
      throw error.message;
    }
  }
);

// -------------------------------------------------------------------------------------

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    toast: {
      isVisible: false,
      message: "",
      style: "",
      time: 0,
      resetToast: false,
    },
    isRegisterSuccess: false,
    isLoggedIn: false,
    isLoading: false,
    loggedInUserEmail: null,
    loggedInUserUid: null,
    emailChangedSuccess: false,
    loggedInUserData: {
      archivedJobs: [],
      currentJobs: [],
      userSettings: {
        baseMoney: 0,
        email: "",
        eurCzkRate: 0,
        percentage: 0,
        secondJobBenefit: 0,
        terminal: "",
        waitingBenefit: 0,
      },
    },
    jobToAdd: {
      city: "",
      isCustomJob: true,
      terminal: "",
      weightTo27t: 0,
      weightTo34t: 0,
      zipcode: "",
    },
    isEditing: false,
    isEditingArchivedJob: false,
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
      timestamp: "",
      waiting: 0,
      weight: 0,
      weightTo27t: 0,
      weightTo34t: 0,
      zipcode: "",
    },
  },
  reducers: {
    runToast(state, action) {
      state.toast.isVisible = true;
      state.toast.message = action.payload.message;
      state.toast.style = action.payload.style;
      state.toast.time = action.payload.time;
      state.toast.resetToast = true;
    },

    resetToast(state) {
      state.toast.isVisible = false;
      state.toast.message = "";
      state.toast.style = "";
      state.toast.time = 0;
      state.toast.resetToast = false;
      console.log("toast RESETOVÁN");
    },

    setLoadingTrue(state) {
      console.log("setLoadingTrue SPUŠTĚN");
      state.isLoading = true;
    },

    setLoadingFalse(state) {
      console.log("setLoadingFalse SPUŠTĚN");
      state.isLoading = false;
    },

    loginOnAuth(state, action) {
      console.log("loginOnAuth SPUŠTĚN");
      state.isLoggedIn = true;
      state.loggedInUserEmail = action.payload.email;
      state.loggedInUserUid = action.payload.uid;
    },

    logoutOnAuth(state) {
      console.log("logoutOnAuth SPUŠTĚN");
      state.isLoggedIn = false;
      state.loggedInUserEmail = null;
      state.loggedInUserUid = null;
      state.loggedInUserData.archivedJobs = [];
      state.loggedInUserData.currentJobs = [];
      state.loggedInUserData.userSettings.baseMoney = 0;
      state.loggedInUserData.userSettings.email = "";
      state.loggedInUserData.userSettings.eurCzkRate = 0;
      state.loggedInUserData.userSettings.percentage = 0;
      state.loggedInUserData.userSettings.secondJobBenefit = 0;
      state.loggedInUserData.userSettings.terminal = "";
      state.loggedInUserData.userSettings.waitingBenefit = 0;
      // state.isLoading = false;
    },

    setLoadedUserData(state, action) {
      console.log("setLoadedUserData SPUŠTĚN");
      state.loggedInUserData.archivedJobs = action.payload.archivedJobs;
      state.loggedInUserData.currentJobs = action.payload.currentJobs;
      state.loggedInUserData.userSettings.baseMoney =
        action.payload.userSettings.baseMoney;
      state.loggedInUserData.userSettings.email =
        action.payload.userSettings.email;
      state.loggedInUserData.userSettings.percentage =
        action.payload.userSettings.percentage;
      state.loggedInUserData.userSettings.secondJobBenefit =
        action.payload.userSettings.secondJobBenefit;
      state.loggedInUserData.userSettings.terminal =
        action.payload.userSettings.terminal;
      state.loggedInUserData.userSettings.waitingBenefit =
        action.payload.userSettings.waitingBenefit;
    },

    setJobToAdd: (state, action) => {
      state.jobToAdd.city = action.payload.city;
      state.jobToAdd.isCustomJob = action.payload.isCustomJob;
      state.jobToAdd.terminal = action.payload.terminal;
      state.jobToAdd.weightTo27t = action.payload.weightTo27t;
      state.jobToAdd.weightTo34t = action.payload.weightTo34t;
      state.jobToAdd.zipcode = action.payload.zipcode;
    },

    resetJobToAddValues: (state) => {
      state.jobToAdd.city = "";
      state.jobToAdd.isCustomJob = true;
      state.jobToAdd.terminal = "";
      state.jobToAdd.weightTo27t = 0;
      state.jobToAdd.weightTo34t = 0;
      state.jobToAdd.zipcode = "";
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
      state.jobToEdit.timestamp = action.payload.timestamp;
      state.jobToEdit.waiting = action.payload.waiting;
      state.jobToEdit.weight = action.payload.weight;
      state.jobToEdit.weightTo27t = action.payload.weightTo27t;
      state.jobToEdit.weightTo34t = action.payload.weightTo34t;
      state.jobToEdit.zipcode = action.payload.zipcode;
    },
    setIsEditingArchivedJob: (state, action) => {
      state.isEditingArchivedJob = action.payload;
    },

    setEditing: (state, action) => {
      state.isEditing = action.payload;
    },

    resetJobToEditValues: (state) => {
      console.log("jobToEdit hodnoty RESETOVÁNY");
      state.isEditingArchivedJob = true;

      state.jobToEdit.city = "";
      state.jobToEdit.cmr = "";
      state.jobToEdit.date = "";
      state.jobToEdit.id = "";
      state.jobToEdit.isCustomJob = false;
      state.jobToEdit.isSecondJob = false;
      state.jobToEdit.note = "";
      state.jobToEdit.price = 0;
      state.jobToEdit.terminal = "";
      state.jobToEdit.timestamp = "";
      state.jobToEdit.waiting = 0;
      state.jobToEdit.weight = 0;
      state.jobToEdit.weightTo27t = 0;
      state.jobToEdit.weightTo34t = 0;
      state.jobToEdit.zipcode = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, () => {
        console.log("register PROBÍHÁ");
      })
      .addCase(register.fulfilled, (state) => {
        console.log("register ÚSPĚŠNĚ DOKONČEN");
        state.isRegisterSuccess = true;
        // state.toast.isVisible = true;
        // state.toast.message =
        //   "Registrace proběhla úspěšně! Nyní běžte na Váš email a regisraci potvrďte!";
        // state.toast.style = "success";
        // state.toast.time = 20000;
        // state.toast.resetToast = true;
      })
      .addCase(register.rejected, (state, action) => {
        console.log("registr SELHAL", action.error.message);

        state.toast.isVisible = true;
        state.toast.message =
          action.error.message ===
          "Firebase: Error (auth/email-already-in-use)."
            ? "Email je již registrován"
            : action.error.message ===
              "Firebase: Password should be at least 6 characters (auth/weak-password)."
            ? "Heslo musí mít alespoň 6 znaků"
            : action.error.message;
        state.toast.style = "error";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(login.pending, (state) => {
        console.log("login PROBÍHÁ");
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loggedInUserEmail = auth.currentUser.email;
        state.loggedInUserUid = auth.currentUser.uid;
        state.loggedInUserData.archivedJobs = action.payload.archivedJobs;
        state.loggedInUserData.currentJobs = action.payload.currentJobs;
        state.loggedInUserData.userSettings = action.payload.userSettings;
        state.isLoading = false;
        console.log("login ÚSPĚŠNĚ DOKONČEN", state.loggedInUserEmail);
      })
      .addCase(login.rejected, (state, action) => {
        console.log("login SELHAL", action.error.message);
        state.isLoggedIn = false;
        state.loggedInUserEmail = null;
        state.isLoading = false;

        state.toast.isVisible = true;
        state.toast.message =
          action.error.message === "Firebase: Error (auth/user-not-found)."
            ? "Email není registrován!"
            : action.error.message === "Firebase: Error (auth/wrong-password)."
            ? "Špatné heslo"
            : action.error.message;
        state.toast.style = "error";
        state.toast.resetToast = true;
      })
      .addCase(logout.pending, (state) => {
        console.log("logout PROBÍHÁ");
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        console.log("logout ÚSPĚŠNĚ DOKONČEN");
        state.isLoggedIn = false;
        state.loggedInUserEmail = null;
        state.isLoading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        console.log("logout SELHAL", action.error.message);
        state.isLoading = false;
      })
      .addCase(loadUserData.pending, () => {
        console.log("loadUserData PROBÍHÁ");
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        console.log("loadUserData ÚSPĚŠNĚ DOKONČEN");
        state.loggedInUserData.archivedJobs = action.payload.archivedJobs;
        state.loggedInUserData.currentJobs = action.payload.currentJobs;
        state.loggedInUserData.userSettings = action.payload.userSettings;
      })
      .addCase(loadUserData.rejected, (action) => {
        console.log("loadUserData SELHAL", action.error.message);
      })
      .addCase(changeEmail.pending, () => {
        console.log("changeEmail SPUŠTĚN");
      })
      .addCase(changeEmail.fulfilled, () => {
        console.log("changeEmail ÚSPĚŠNĚ DOKONČEN");
      })
      .addCase(changeEmail.rejected, (action) => {
        console.log("changeEmail selhal", action.error.message);
      })
      .addCase(changePassword.pending, () => {
        console.log("changePassword SPUŠTĚN");
      })
      .addCase(changePassword.fulfilled, () => {
        console.log("changePassword ÚSPĚŠNĚ DOKONČEN");
      })
      .addCase(changePassword.rejected, (action) => {
        console.log("changePassword selhal", action.error.message);
      })
      .addCase(changeSettings.pending, () => {
        console.log("changeSettings SPUŠTĚN");
      })
      .addCase(changeSettings.fulfilled, (state, action) => {
        state.loggedInUserData.userSettings.baseMoney =
          action.payload.baseMoney;
        state.loggedInUserData.userSettings.percentage =
          action.payload.percentage;
        state.loggedInUserData.userSettings.secondJobBenefit =
          action.payload.secondJobBenefit;
        state.loggedInUserData.userSettings.terminal = action.payload.terminal;
        state.loggedInUserData.userSettings.waitingBenefit =
          action.payload.waitingBenefit;
        console.log("changeSettings ÚSPĚŠNĚ DOKONČEN");

        state.toast.isVisible = true;
        state.toast.message = "Změny uloženy";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(changeSettings.rejected, (state) => {
        console.log("changeSettings SELHAL");

        state.toast.isVisible = true;
        state.toast.message = "Něco se nepovedlo";
        state.toast.style = "error";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(addJobToDatabase.pending, () => {
        console.log("addJobToDatabase PROBÍHÁ");
      })
      .addCase(addJobToDatabase.fulfilled, (state, action) => {
        console.log("addJobToDatabase ÚSPĚŠNĚ DOKONČEN");
        state.jobToAdd.city = "";
        state.jobToAdd.price = 0;
        state.jobToAdd.terminal = "";
        state.jobToAdd.weight = 0;
        state.jobToAdd.weightTo27t = 0;
        state.jobToAdd.weightTo34t = 0;
        state.jobToAdd.zipcode = "";
        state.loggedInUserData.currentJobs = action.payload;

        state.toast.isVisible = true;
        state.toast.message = "Práce přidána";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(addJobToDatabase.rejected, () => {
        console.log("addJobToDatabase SELHAL");
      })
      .addCase(editJobInDatabase.pending, () => {
        console.log("editJobInDatabase PROBÍHÁ");
      })
      .addCase(editJobInDatabase.fulfilled, (state, action) => {
        console.log("editJobInDatabase ÚSPĚŠNĚ DOKONČEN");
        state.jobToEdit.city = "";
        state.jobToEdit.cmr = "";
        state.jobToEdit.date = "";
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
        state.loggedInUserData.currentJobs = action.payload;

        state.toast.isVisible = true;
        state.toast.message = "Práce upravena";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(editJobInDatabase.rejected, () => {
        console.log("editJobInDatabase SELHAL");
      })
      .addCase(deleteJobFromDatabase.pending, () => {
        console.log("deleteJobFromDatabase PROBÍHÁ");
      })
      .addCase(deleteJobFromDatabase.fulfilled, (state, action) => {
        state.loggedInUserData.currentJobs = action.payload;
        console.log("deleteJobFromDatabase ÚSPĚŠNĚ DOKONČEN");

        state.toast.isVisible = true;
        state.toast.message = "Práce smazána";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(deleteJobFromDatabase.rejected, () => {
        console.log("deleteJobFromDatabase SELHAL");
      })
      .addCase(archiveDoneJobsFirstTime.pending, () => {
        console.log("archiveDoneJobsFirstTime PROBÍHÁ");
      })
      .addCase(archiveDoneJobsFirstTime.fulfilled, (state, action) => {
        console.log("archiveDoneJobsFirstTime ÚSPĚŠNĚ DOKONČEN");
        console.log(action.payload);
        state.loggedInUserData.archivedJobs = action.payload.monthToArchive;
        state.loggedInUserData.currentJobs = action.payload.filteredCurrentJobs;
        state.loggedInUserData.userSettings.eurCzkRate =
          action.payload.newEurCzkRate;

        state.toast.isVisible = true;
        state.toast.message = "Archivováno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(archiveDoneJobsFirstTime.rejected, () => {
        console.log("archiveDoneJobsFirstTime SELHAL");
      })
      .addCase(archiveDoneJobsNewMonth.pending, () => {
        console.log("archiveDoneJobsNewMonth PROBÍHÁ");
      })
      .addCase(archiveDoneJobsNewMonth.fulfilled, (state, action) => {
        console.log("archiveDoneJobsNewMonth ÚSPĚŠNĚ DOKONČEN");
        console.log(action.payload);
        state.loggedInUserData.archivedJobs = action.payload.newMonthToArchive;
        state.loggedInUserData.currentJobs = action.payload.filteredCurrentJobs;
        state.loggedInUserData.userSettings.eurCzkRate =
          action.payload.newEurCzkRate;

        state.toast.isVisible = true;
        state.toast.message = "Archivováno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(archiveDoneJobsNewMonth.rejected, () => {
        console.log("archiveDoneJobsNewMonth SELHAL");
      })
      .addCase(archiveDoneJobsExistingMonth.pending, () => {
        console.log("archiveDoneJobsExistingMonth PROBÍHÁ");
      })
      .addCase(archiveDoneJobsExistingMonth.fulfilled, (state, action) => {
        console.log("archiveDoneJobsExistingMonth ÚSPĚŠNĚ DOKONČEN");
        console.log(action.payload);
        state.loggedInUserData.archivedJobs =
          action.payload.updatedArchivedJobs;
        state.loggedInUserData.currentJobs = action.payload.filteredCurrentJobs;

        state.toast.isVisible = true;
        state.toast.message = "Archivováno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(archiveDoneJobsExistingMonth.rejected, () => {
        console.log("archiveDoneJobsExistingMonth SELHAL");
      })
      .addCase(deleteArchiveMonthFromDatabase.pending, () => {
        console.log("deleteArchiveMonth PROBÍHÁ");
      })
      .addCase(deleteArchiveMonthFromDatabase.fulfilled, (state, action) => {
        console.log("deleteArchiveMonth ÚSPĚŠNĚ DOKONČEN");
        state.loggedInUserData.archivedJobs = action.payload;

        state.toast.isVisible = true;
        state.toast.message = "Smazáno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(deleteArchiveMonthFromDatabase.rejected, () => {
        console.log("deleteArchiveMonth SELHAL");
      })
      .addCase(deleteArchiveMonthJobFromDatabase.pending, () => {
        console.log("deleteArchiveMonthJob PROBÍHÁ");
      })
      .addCase(deleteArchiveMonthJobFromDatabase.fulfilled, (state, action) => {
        console.log("deleteArchiveMonthJob ÚSPĚŠNĚ DOKONČEN");
        state.loggedInUserData.archivedJobs = action.payload;

        state.toast.isVisible = true;
        state.toast.message = "Smazáno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(deleteArchiveMonthJobFromDatabase.rejected, () => {
        console.log("deleteArchiveMonthJob SELHAL");
      })
      .addCase(editArchiveJobInDatabase.pending, () => {
        console.log("editArchiveJobInDatabase PROBÍHÁ");
      })
      .addCase(editArchiveJobInDatabase.fulfilled, (state, action) => {
        console.log("editArchiveJobInDatabase ÚSPĚŠNĚ DOKONČEN");
        state.loggedInUserData.archivedJobs = action.payload;

        state.toast.isVisible = true;
        state.toast.message = "Upraveno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(editArchiveJobInDatabase.rejected, () => {
        console.log("editArchiveJobInDatabase SELHAL");
      });
  },
});

export const {
  runToast,
  resetToast,
  setLoadingTrue,
  setLoadingFalse,
  loginOnAuth,
  logoutOnAuth,
  setLoadedUserData,
  setJobToAdd,
  resetJobToAddValues,
  setJobToEdit,
  setIsEditingArchivedJob,
  setArchivedJobToEdit,
  setEditing,
  resetJobToEditValues,
} = authSlice.actions;

export default authSlice.reducer;
