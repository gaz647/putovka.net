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
  deleteUser,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
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

  const API_KEY = import.meta.env.VITE_REACT_APP_EXCHANGE_RATE_API_KEY;
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
        waitingBenefitEmployerCzk: 0,
        waitingBenefitEur: 0,
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
export const changeEmailRedux = createAsyncThunk(
  "auth/changeEmailRedux",
  async ({ currentPassword, newEmail }) => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, newEmail);
      await sendEmailVerification(auth.currentUser);
      // await signOut(auth);
      // localStorage.removeItem("emailVerified");
    } catch (error) {
      throw error.message;
    }
  }
);

//  CHANGE PASSWORD

export const changePasswordRedux = createAsyncThunk(
  "auth/changePasswordRedux",
  async ({ currentPassword, newPassword }) => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      // await signOut(auth);
      console.log(
        "reauthenticateWithCredential i updatePassword by mělo být hotovo"
      );
    } catch (error) {
      throw error.message;
    }
  }
);

// RESET PASSWORD
//
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
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

// DELETE ACCOUNT FROM DATABASE
//
export const deleteAccountFromDatabase = createAsyncThunk(
  "auth/deleteAccountFromDatabase",
  async ({ currentPassword, userUid }) => {
    // Vytvoření reference kolekce USERS
    const usersCollectionRef = collection(db, "users");
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser(auth.currentUser);
      await deleteDoc(doc(usersCollectionRef, userUid));
      localStorage.removeItem("emailVerified");
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
        waitingBenefitEmployerCzk:
          payload.userSettings.waitingBenefitEmployerCzk,
        waitingBenefitEur: payload.userSettings.waitingBenefitEur,
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
        waitingBenefitEmployerCzk:
          payload.userSettings.waitingBenefitEmployerCzk,
        waitingBenefitEur: payload.userSettings.waitingBenefitEur,
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

//  EDIT ARCHIVE MONTH SUMMARY SETTINGS
//
export const editArchiveMonthSummarySettingsInDatabase = createAsyncThunk(
  "auth/editArchiveMonthSummarySettingsInDatabase",
  async (payload) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "users", payload.userUid);
        const userDocSnapshot = await transaction.get(userDocRef);

        if (userDocSnapshot.exists()) {
          transaction.update(userDocRef, {
            archivedJobs: payload.updatedArchivedJobs,
          });
        }
      });
      return payload.updatedArchivedJobs;
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

    isLoggedIn: false,
    isLoading: false,
    loggedInUserEmail: null,
    loggedInUserUid: null,
    isRegisterSuccess: false,
    isEmailChangedSuccess: false,
    isPasswordChangedSuccess: false,
    isAccountDisabled: false,
    isAccountDeleted: false,
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
        waitingBenefitEmployerCzk: 0,
        waitingBenefitEur: 0,
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
    archiveMonthSummarySettingsToEdit: {
      date: "",
      baseMoney: 0,
      percentage: 0,
      secondJobBenefit: 0,
      waitingBenefitEmployerCzk: 0,
      waitingBenefitEur: 0,
      eurCzkRate: 0,
    },
  },
  reducers: {
    runToast(state, action) {
      console.log("toast SPUŠTĚN");
      state.toast.isVisible = true;
      state.toast.message = action.payload.message;
      state.toast.style = action.payload.style;
      state.toast.time = action.payload.time;
      state.toast.resetToast = true;
    },

    resetToast(state) {
      console.log("toast RESETOVÁN");
      state.toast.isVisible = false;
      state.toast.message = "";
      state.toast.style = "";
      state.toast.time = 0;
      state.toast.resetToast = false;
    },

    resetIsRegisterSuccess(state) {
      state.isRegisterSuccess = false;
    },

    resetIsEmailChangedSuccess(state) {
      state.isEmailChangedSuccess = false;
    },

    resetIsPasswordChangedSuccess(state) {
      state.isPasswordChangedSuccess = false;
    },

    resetIsAccountDisabled(state) {
      state.isAccountDisabled = false;
    },

    resetIsAccountDeleted(state) {
      state.isAccountDeleted = false;
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
      state.loggedInUserData.userSettings.waitingBenefitEmployerCzk = 0;
      state.loggedInUserData.userSettings.waitingBenefitEur = 0;
      // state.isLoading = false;
    },

    setLoadedUserData(state, action) {
      console.log("setLoadedUserData SPUŠTĚN");
      state.loggedInUserData.archivedJobs = action.payload.archivedJobs;
      state.loggedInUserData.currentJobs = action.payload.currentJobs;
      state.loggedInUserData.userSettings.baseMoney =
        action.payload.userSettings.baseMoney;
      state.loggedInUserData.userSettings.eurCzkRate =
        action.payload.userSettings.eurCzkRate;
      state.loggedInUserData.userSettings.email =
        action.payload.userSettings.email;
      state.loggedInUserData.userSettings.percentage =
        action.payload.userSettings.percentage;
      state.loggedInUserData.userSettings.secondJobBenefit =
        action.payload.userSettings.secondJobBenefit;
      state.loggedInUserData.userSettings.terminal =
        action.payload.userSettings.terminal;
      state.loggedInUserData.userSettings.waitingBenefitEmployerCzk =
        action.payload.userSettings.waitingBenefitEmployerCzk;
      state.loggedInUserData.userSettings.waitingBenefitEur =
        action.payload.userSettings.waitingBenefitEur;
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

    setArchiveMonthSummarySettingsToEdit: (state, action) => {
      state.archiveMonthSummarySettingsToEdit.date = action.payload.date;
      state.archiveMonthSummarySettingsToEdit.baseMoney =
        action.payload.baseMoney;
      state.archiveMonthSummarySettingsToEdit.eurCzkRate =
        action.payload.eurCzkRate;
      state.archiveMonthSummarySettingsToEdit.percentage =
        action.payload.percentage;
      state.archiveMonthSummarySettingsToEdit.secondJobBenefit =
        action.payload.secondJobBenefit;
      (state.archiveMonthSummarySettingsToEdit.waitingBenefitEmployerCzk =
        action.payload.waitingBenefitEmployerCzk),
        (state.archiveMonthSummarySettingsToEdit.waitingBenefitEur =
          action.payload.waitingBenefitEur);
    },

    resetArchiveMonthSummarySettingsToEdit: (state) => {
      state.archiveMonthSummarySettingsToEdit.date = "";
      state.archiveMonthSummarySettingsToEdit.baseMoney = 0;
      state.archiveMonthSummarySettingsToEdit.eurCzkRate = 0;
      state.archiveMonthSummarySettingsToEdit.percentage = 0;
      state.archiveMonthSummarySettingsToEdit.secondJobBenefit = 0;
      state.archiveMonthSummarySettingsToEdit.waitingBenefitEmployerCzk = 0;
      state.archiveMonthSummarySettingsToEdit.waitingBenefitEur = 0;
    },

    setEditing: (state, action) => {
      state.isEditing = action.payload;
    },

    resetJobToEditValuesRedux: (state) => {
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
        console.log("login ÚSPĚŠNĚ DOKONČEN", state.loggedInUserEmail);
        state.isLoggedIn = true;
        state.loggedInUserEmail = auth.currentUser.email;
        state.loggedInUserUid = auth.currentUser.uid;
        state.loggedInUserData.archivedJobs = action.payload.archivedJobs;
        state.loggedInUserData.currentJobs = action.payload.currentJobs;
        state.loggedInUserData.userSettings = action.payload.userSettings;
        state.isLoading = false;
        state.isAccountDisabled = false;
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
            ? "Zadali jste špatné heslo"
            : action.error.message === "Firebase: Error (auth/invalid-email)."
            ? "Neplatný email"
            : action.error.message ===
              "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
            ? "Účet byl dočasně zablokován z důvodu opakovaného zadání špatného hesla. Můžete ho obnovit resetováním hesla. Nebo opětovném přihlášením původním heslem za pár minut."
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
      .addCase(changeEmailRedux.pending, () => {
        console.log("changeEmailRedux SPUŠTĚN");
      })
      .addCase(changeEmailRedux.fulfilled, (state) => {
        console.log("changeEmailRedux ÚSPĚŠNĚ DOKONČEN");
        state.isEmailChangedSuccess = true;
      })
      .addCase(changeEmailRedux.rejected, (state, action) => {
        console.log("changeEmailRedux selhal", action.error.message);

        state.toast.isVisible = true;
        state.toast.message =
          action.error.message === "Firebase: Error (auth/wrong-password)."
            ? "Zadali jste špatné heslo"
            : action.error.message ===
              "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
            ? "Účet byl dočasně zablokován z důvodu opakovaného zadání špatného hesla. Můžete ho obnovit resetováním hesla. Nebo opětovném přihlášením původním heslem za pár minut."
            : action.error.message;
        state.toast.style = "error";
        state.toast.time = 3000;

        state.isAccountDisabled =
          action.error.message ===
          "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
            ? true
            : false;

        state.toast.resetToast = true;
      })
      .addCase(changePasswordRedux.pending, () => {
        console.log("changePasswordRedux SPUŠTĚN");
      })
      .addCase(changePasswordRedux.fulfilled, (state) => {
        console.log("changePasswordRedux ÚSPĚŠNĚ DOKONČEN");

        state.isPasswordChangedSuccess = true;

        state.toast.isVisible = true;
        state.toast.message = "Heslo změněno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(changePasswordRedux.rejected, (state, action) => {
        console.log("changePasswordRedux selhal", action.error.message);

        state.toast.isVisible = true;
        state.toast.message =
          action.error.message === "Firebase: Error (auth/wrong-password)."
            ? "Zadali jste špatné heslo"
            : "Něco se pokazilo";
        state.toast.style = "error";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(resetPassword.pending, () => {
        console.log("passwordReset SPUŠTĚN");
      })
      .addCase(resetPassword.fulfilled, () => {
        console.log("passwordReset ÚSPĚŠNĚ DOKONČEN");
      })
      .addCase(resetPassword.rejected, (action) => {
        console.log("passwordReset SELHAL");
        console.log(action.error.message);
      })
      .addCase(changeSettings.pending, () => {
        console.log("changeSettings SPUŠTĚN");
      })
      .addCase(changeSettings.fulfilled, (state, action) => {
        console.log("changeSettings ÚSPĚŠNĚ DOKONČEN");
        state.loggedInUserData.userSettings.email = action.payload.email;
        state.loggedInUserData.userSettings.baseMoney =
          action.payload.baseMoney;
        state.loggedInUserData.userSettings.eurCzkRate =
          action.payload.eurCzkRate;
        state.loggedInUserData.userSettings.percentage =
          action.payload.percentage;
        state.loggedInUserData.userSettings.secondJobBenefit =
          action.payload.secondJobBenefit;
        state.loggedInUserData.userSettings.terminal = action.payload.terminal;
        state.loggedInUserData.userSettings.waitingBenefitEmployerCzk =
          action.payload.waitingBenefitEmployerCzk;
        state.loggedInUserData.userSettings.waitingBenefitEur =
          action.payload.waitingBenefitEur;

        state.toast.isVisible = true;
        state.toast.message = "Změny uloženy";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(changeSettings.rejected, (state) => {
        console.log("changeSettings SELHAL");

        state.toast.isVisible = true;
        state.toast.message = "Něco se pokazilo";
        state.toast.style = "error";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(deleteAccountFromDatabase.pending, () => {
        console.log("deleteAccountFromDatabase SPUŠTĚN");
      })
      .addCase(deleteAccountFromDatabase.fulfilled, (state) => {
        console.log("deleteAccountFromDatabase ÚSPĚŠNĚ DOKONČEN");
        state.toast.isVisible = true;
        state.toast.message = "Účet smazán";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;

        state.isAccountDeleted = true;
      })
      .addCase(deleteAccountFromDatabase.rejected, (state) => {
        console.log("deleteAccountFromDatabase SELHAL");
        state.toast.isVisible = true;
        state.toast.message = "Něco se pokazilo, zkuste to znovu";
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
      })
      .addCase(editArchiveMonthSummarySettingsInDatabase.pending, () => {
        console.log("editArchiveMonthSummarySettingsInDatabase PROBÍHÁ");
      })
      .addCase(
        editArchiveMonthSummarySettingsInDatabase.fulfilled,
        (state, action) => {
          console.log(
            "editArchiveMonthSummarySettingsInDatabase ÚSPĚŠNĚ DOKONČEN"
          );
          state.loggedInUserData.archivedJobs = action.payload;

          state.archiveMonthSummarySettingsToEdit.date = "";
          state.archiveMonthSummarySettingsToEdit.baseMoney = 0;
          state.archiveMonthSummarySettingsToEdit.eurCzkRate = 0;
          state.archiveMonthSummarySettingsToEdit.percentage = 0;
          state.archiveMonthSummarySettingsToEdit.secondJobBenefit = 0;
          state.archiveMonthSummarySettingsToEdit.waitingBenefitEmployerCzk = 0;
          state.archiveMonthSummarySettingsToEdit.waitingBenefitEur = 0;

          state.toast.isVisible = true;
          state.toast.message = "Upraveno";
          state.toast.style = "success";
          state.toast.time = 3000;
          state.toast.resetToast = true;
        }
      )
      .addCase(editArchiveMonthSummarySettingsInDatabase.rejected, () => {
        console.log("editArchiveMonthSummarySettingsInDatabase SELHAL");
      });
  },
});

export const {
  runToast,
  resetToast,
  resetIsRegisterSuccess,
  resetIsEmailChangedSuccess,
  resetIsPasswordChangedSuccess,
  resetIsAccountDisabled,
  resetIsAccountDeleted,
  setLoadingTrue,
  setLoadingFalse,
  loginOnAuth,
  logoutOnAuth,
  setLoadedUserData,
  setJobToAdd,
  resetJobToAddValues,
  setJobToEdit,
  setIsEditingArchivedJob,
  setArchiveMonthSummarySettingsToEdit,
  resetArchiveMonthSummarySettingsToEdit,
  setEditing,
  resetJobToEditValuesRedux,
} = authSlice.actions;

export default authSlice.reducer;
