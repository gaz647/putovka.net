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

// GET INFO MESSAGE
//
export const getInfoMessageRedux = createAsyncThunk(
  "auth/getInfoMessageRedux",
  async () => {
    try {
      const docRef = doc(db, "infoMessage", "message");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().messageText;
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("registerRedux TRY část NE-ÚSPĚŠNÁ");
      throw error.message;
    }
  }
);

// Asynchronní funkce která po registraci vytvoří jeho collection ve Firestore databázi
//
const createUserData = async (userAuth) => {
  const { email, uid } = userAuth;

  const usersCollectionRef = collection(db, "users");

  const API_KEY = import.meta.env.VITE_REACT_APP_EXCHANGE_RATE_API_KEY;
  const FROM_CURRENCY = "EUR";
  const TO_CURRENCY = "CZK";
  const AMOUNT = 1;

  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${FROM_CURRENCY}/${TO_CURRENCY}/${AMOUNT}`
    );

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
export const registerRedux = createAsyncThunk(
  "auth/registerRedux",
  async (registerCredentials) => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerCredentials.registerEmail,
        registerCredentials.registerPassword1
      );
      console.log("aktuální user: ", user.user.email);

      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      console.log("registerRedux TRY část NE-ÚSPĚŠNÁ");
      throw error.message;
    }
  }
);

// LOGIN
//
export const loginRedux = createAsyncThunk(
  "auth/loginRedux",
  async (loginCredentials) => {
    try {
      console.log("loginRedux TRY část signInWithEmailAndPassword SPUŠTĚNA");
      await signInWithEmailAndPassword(
        auth,
        loginCredentials.loginEmail,
        loginCredentials.loginPassword
      );
    } catch (error) {
      console.log("loginRedux TRY část NE-ÚSPĚŠNÁ");
      throw error.message;
    }
  }
);

// LOAD USER DATA
//
export const loadUserDataRedux = createAsyncThunk(
  "auth/loadUserDataRedux",
  async (userAuth) => {
    // Získání ID a EMAILU uživatele
    const { email, uid } = userAuth;
    const userRef = doc(db, "users", uid);
    try {
      const userData = await getDoc(userRef);
      let createdUserData;

      if (userData.exists()) {
        console.log("userData existují, vracím je pro načtení do addCase");
        return userData.data();
      } else {
        console.log("userData neexistují, vytvářím je");
        const userAuth = { email, uid };
        await createUserData(userAuth);
        console.log("userData vytvořeny, načítám je");
        createdUserData = await getDoc(userRef);
        return createdUserData.data();
      }
    } catch (error) {
      throw error.message;
    }
  }
);

// LOGOUT
//
export const logoutRedux = createAsyncThunk("auth/logoutRedux", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error.message;
  }
});

// LOGOUT in settings
//
export const logoutInSettingsRedux = createAsyncThunk(
  "auth/logoutInSettingsRedux",
  async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error.message;
    }
  }
);

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
    } catch (error) {
      throw error.message;
    }
  }
);

// RESET PASSWORD
//
export const resetPasswordRedux = createAsyncThunk(
  "auth/resetPasswordRedux",
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
export const changeSettingsRedux = createAsyncThunk(
  "auth/changeSettingsRedux",
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
export const deleteAccountRedux = createAsyncThunk(
  "auth/deleteAccountRedux",
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
      await signOut(auth);
    } catch (error) {
      throw error.message;
    }
  }
);

//  ADD JOB
//
export const addJobRedux = createAsyncThunk(
  "auth/addJobRedux",
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
export const editJobRedux = createAsyncThunk(
  "auth/editJobRedux",
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
export const deleteJobRedux = createAsyncThunk(
  "auth/deleteJobRedux",
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
export const archiveDoneJobsFirstTimeRedux = createAsyncThunk(
  "auth/archiveDoneJobsFirstTimeRedux",
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
export const archiveDoneJobsNewMonthRedux = createAsyncThunk(
  "auth/archiveDoneJobsNewMonthRedux",
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
export const archiveDoneJobsExistingMonthRedux = createAsyncThunk(
  "auth/archiveDoneJobsExistingMonthRedux",
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
export const deleteArchiveMonthRedux = createAsyncThunk(
  "auth/deleteArchiveMonthRedux",
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
export const deleteArchiveMonthJobRedux = createAsyncThunk(
  "auth/deleteArchiveMonthJobRedux",
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
export const editArchiveJobRedux = createAsyncThunk(
  "auth/editArchiveJobRedux",
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
export const editArchiveMonthSummarySettingsRedux = createAsyncThunk(
  "auth/editArchiveMonthSummarySettingsRedux",
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

//
// -----------------------------------------------------------------------
//

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    infoMessage: null,
    toast: {
      isVisible: false,
      message: "",
      style: "",
      time: 0,
      resetToast: false,
    },

    isLoading: true,
    isLoading2: false,
    //
    isLoginPending: false,
    isLoggedIn: false,
    //
    isRegisterPending: false,
    isRegisterSuccess: false,
    //
    isEmailChangedSuccess: false,
    isPasswordChangedSuccess: false,
    isPasswordResetSuccess: false,
    //
    isAccountLogoutSuccess: false,
    isAccountDeletingPending: false,
    isAccountDisabled: false,
    isAccountDeletedSuccess: false,
    //
    loggedInUserEmail: null,
    loggedInUserUid: null,
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
    runToastRedux(state, action) {
      console.log("toast SPUŠTĚN");
      state.toast.isVisible = true;
      state.toast.message = action.payload.message;
      state.toast.style = action.payload.style;
      state.toast.time = action.payload.time;
      state.toast.resetToast = true;
    },

    resetToastRedux(state) {
      console.log("toast RESETOVÁN");
      state.toast.isVisible = false;
      state.toast.message = "";
      state.toast.style = "";
      state.toast.time = 0;
      state.toast.resetToast = false;
    },

    resetIsRegisterPending(state) {
      state.isRegisterPending = false;
    },

    resetIsRegisterSuccessRedux(state) {
      state.isRegisterSuccess = false;
      state.isRegisterPending = false;
    },

    resetIsEmailChangedSuccessRedux(state) {
      state.isEmailChangedSuccess = false;
    },

    resetIsPasswordChangedSuccessRedux(state) {
      state.isPasswordChangedSuccess = false;
    },

    resetIsAccountDisabledRedux(state) {
      state.isAccountDisabled = false;
    },

    resetIsAccountDeletedSuccessRedux(state) {
      state.isAccountDeletedSuccess = false;
      state.isAccountDeletingPending = false;
    },

    resetIsAccountLogoutSuccess(state) {
      state.isAccountLogoutSuccess = false;
    },

    setIsLoadingTrueRedux(state) {
      console.log("setIsLoadingTrueRedux SPUŠTĚN");
      state.isLoading = true;
    },

    setIsLoadingFalseRedux(state) {
      console.log("setIsLoadingFalseRedux SPUŠTĚN");
      state.isLoading = false;
    },

    setIsLoading2TrueRedux(state) {
      console.log("setIsLoadingTrueRedux SPUŠTĚN");
      state.isLoading2 = true;
    },

    setIsLoading2FalseRedux(state) {
      console.log("setIsLoadingFalseRedux SPUŠTĚN");
      state.isLoading2 = false;
    },

    loginOnAuthRedux(state, action) {
      console.log("loginOnAuthRedux SPUŠTĚN");
      // state.isLoggedIn = true;
      state.loggedInUserEmail = action.payload.email;
      state.loggedInUserUid = action.payload.uid;
    },

    logoutOnAuthRedux(state) {
      console.log("logoutOnAuthRedux SPUŠTĚN");
      state.infoMessage = null;
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
      state.isLoading = false;
    },

    setLoadedUserDataRedux(state, action) {
      console.log("setLoadedUsetLoadedUserDataReduxerData SPUŠTĚN");
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

    setJobToAddRedux: (state, action) => {
      console.log("setJobToAddRedux SPUŠTĚN");
      state.jobToAdd.city = action.payload.city;
      state.jobToAdd.isCustomJob = action.payload.isCustomJob;
      state.jobToAdd.terminal = action.payload.terminal;
      state.jobToAdd.weightTo27t = action.payload.weightTo27t;
      state.jobToAdd.weightTo34t = action.payload.weightTo34t;
      state.jobToAdd.zipcode = action.payload.zipcode;
    },

    resetJobToAddValuesRedux: (state) => {
      // console.log("resetJobToAddValuesRedux SPUŠTĚN");
      state.jobToAdd.city = "";
      state.jobToAdd.isCustomJob = true;
      state.jobToAdd.terminal = "";
      state.jobToAdd.weightTo27t = 0;
      state.jobToAdd.weightTo34t = 0;
      state.jobToAdd.zipcode = "";
    },

    setJobToEditRedux: (state, action) => {
      console.log("setJobToEditRedux SPUŠTĚN");
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

    setIsEditingArchivedJobTrueRedux: (state) => {
      console.log("setIsEditingArchivedJobTrueRedux SPUŠTĚN");
      state.isEditingArchivedJob = true;
    },

    setIsEditingArchivedJobFalseRedux: (state) => {
      console.log("setIsEditingArchivedJobFalseRedux SPUŠTĚN");
      state.isEditingArchivedJob = false;
    },

    setArchiveMonthSummarySettingsToEditRedux: (state, action) => {
      console.log("setArchiveMonthSummarySettingsToEditRedux SPUŠTĚN");
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

    resetArchiveMonthSummarySettingsToEditRedux: (state) => {
      console.log("resetArchiveMonthSummarySettingsToEditRedux SPUŠTĚN");
      state.archiveMonthSummarySettingsToEdit.date = "";
      state.archiveMonthSummarySettingsToEdit.baseMoney = 0;
      state.archiveMonthSummarySettingsToEdit.eurCzkRate = 0;
      state.archiveMonthSummarySettingsToEdit.percentage = 0;
      state.archiveMonthSummarySettingsToEdit.secondJobBenefit = 0;
      state.archiveMonthSummarySettingsToEdit.waitingBenefitEmployerCzk = 0;
      state.archiveMonthSummarySettingsToEdit.waitingBenefitEur = 0;
    },

    setIsEditingTrueRedux: (state) => {
      console.log("setIsEditingTrueRedux SPUŠTĚN");
      state.isEditing = true;
    },

    setIsEditingFalseRedux: (state) => {
      state.isEditing = false;
    },

    resetJobToEditValuesRedux: (state) => {
      console.log("resetJobToEditValuesRedux SPUŠTĚN");
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
      .addCase(registerRedux.pending, (state) => {
        console.log("registerRedux PROBÍHÁ");
        state.isRegisterPending = true;
        // state.isLoading = true;
        state.isLoading2 = true;
      })
      .addCase(registerRedux.fulfilled, (state) => {
        console.log("registerRedux ÚSPĚŠNĚ DOKONČEN");
        state.isRegisterSuccess = true;
        // state.isRegisterPending = false;
        // state.isLoading2 = false;
      })
      .addCase(registerRedux.rejected, (state, action) => {
        console.log("registerRedux SELHAL", action.error.message);
        state.isRegisterPending = false;
        // state.isLoading = false;
        state.isLoading2 = false;

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
      //
      // -----------------------------------------------------------------------
      //
      .addCase(loginRedux.pending, (state) => {
        console.log("loginRedux PROBÍHÁ");
        // state.isLoading = true;
        state.isLoading2 = true;
        state.isLoginPending = true;
      })
      .addCase(loginRedux.fulfilled, (state) => {
        console.log("loginRedux ÚSPĚŠNĚ DOKONČEN");
        // state.isLoading = false;
        state.isLoginPending = false;
        state.isLoading2 = false;

        state.isAccountDisabled = false;
      })
      .addCase(loginRedux.rejected, (state, action) => {
        console.log("loginRedux SELHAL", action.error.message);
        state.isLoggedIn = false;
        state.loggedInUserEmail = null;
        // state.isLoading = false;
        state.isLoading2 = false;
        state.isLoginPending = false;

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
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(logoutRedux.pending, (state) => {
        console.log("logoutRedux PROBÍHÁ");
        state.isLoading = true;
      })
      .addCase(logoutRedux.fulfilled, (state) => {
        console.log("logoutRedux ÚSPĚŠNĚ DOKONČEN");
        state.isLoading = false;
      })
      .addCase(logoutRedux.rejected, (state, action) => {
        console.log("logoutRedux SELHAL", action.error.message);
        state.isLoading = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(logoutInSettingsRedux.pending, (state) => {
        console.log("logoutInSettingsRedux PROBÍHÁ");
        state.isLoading = true;
      })
      .addCase(logoutInSettingsRedux.fulfilled, (state) => {
        console.log("logoutInSettingsRedux ÚSPĚŠNĚ DOKONČEN");
        state.isLoading = false;
        state.isAccountLogoutSuccess = true;
      })
      .addCase(logoutInSettingsRedux.rejected, (state, action) => {
        console.log("logoutInSettingsRedux SELHAL", action.error.message);
        state.isLoading = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(loadUserDataRedux.pending, (state) => {
        console.log("loadUserDataRedux PROBÍHÁ");
        state.isLoading = true;
        state.isLoading2 = true;
      })
      .addCase(loadUserDataRedux.fulfilled, (state, action) => {
        console.log("loadUserDataRedux ÚSPĚŠNĚ DOKONČEN");
        state.loggedInUserData.archivedJobs = action.payload.archivedJobs;
        state.loggedInUserData.currentJobs = action.payload.currentJobs;
        state.loggedInUserData.userSettings = action.payload.userSettings;
        // state.isLoading = false;
        state.isLoading2 = false;

        state.isLoggedIn = true;
      })
      .addCase(loadUserDataRedux.rejected, (state, action) => {
        console.log("loadUserDataRedux SELHAL", action.error.message);
        state.isLoading = false;
        state.isLoading2 = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(getInfoMessageRedux.pending, () => {
        console.log("getInfoMessageRedux PROBÍHÁ");
      })
      .addCase(getInfoMessageRedux.fulfilled, (state, action) => {
        console.log("getInfoMessageRedux ÚSPĚŠNĚ DOKONČEN");
        state.infoMessage = action.payload;
      })
      .addCase(getInfoMessageRedux.rejected, (state, action) => {
        console.log("getInfoMessageRedux SELHAL", action.error.message);
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(changeEmailRedux.pending, (state) => {
        console.log("changeEmailRedux SPUŠTĚN");
        // state.isLoading = true;
        state.isLoading2 = true;
      })
      .addCase(changeEmailRedux.fulfilled, (state) => {
        console.log("changeEmailRedux ÚSPĚŠNĚ DOKONČEN");
        // isLoading2 se neukončuje jelikož po úspěšné změně dojde k přesměrování na changeVerification
        // state.isLoading = false;
        state.isEmailChangedSuccess = true;
      })
      .addCase(changeEmailRedux.rejected, (state, action) => {
        console.log("changeEmailRedux selhal", action.error.message);
        // state.isLoading = false;
        state.isLoading2 = false;

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
      //
      // -----------------------------------------------------------------------
      //
      .addCase(changePasswordRedux.pending, (state) => {
        console.log("changePasswordRedux SPUŠTĚN");
        // state.isLoading = true;
        state.isLoading2 = true;
      })
      .addCase(changePasswordRedux.fulfilled, (state) => {
        console.log("changePasswordRedux ÚSPĚŠNĚ DOKONČEN");
        // isLoading2 se neukončuje jelikož po úspěšné změně dojde k přesměrování na changeVerification
        // state.isLoading = false;

        state.isPasswordChangedSuccess = true;

        state.toast.isVisible = true;
        state.toast.message = "Heslo změněno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(changePasswordRedux.rejected, (state, action) => {
        console.log("changePasswordRedux selhal", action.error.message);
        // state.isLoading = false;
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message =
          action.error.message === "Firebase: Error (auth/wrong-password)."
            ? "Zadali jste špatné heslo"
            : "Něco se pokazilo";
        state.toast.style = "error";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(resetPasswordRedux.pending, (state) => {
        console.log("resetPasswordRedux SPUŠTĚN");
        state.isLoading2 = true;
      })
      .addCase(resetPasswordRedux.fulfilled, (state) => {
        console.log("resetPasswordRedux ÚSPĚŠNĚ DOKONČEN");
        state.isPasswordResetSuccess = true;
        // isLoading2 se neukončuje jelikož po úspěšné změně dojde k přesměrování na changeVerification
        // state.isLoading2 = false;
      })
      .addCase(resetPasswordRedux.rejected, (state, action) => {
        console.log("resetPasswordRedux SELHAL");
        console.log(action.error.message);
        state.isLoading2 = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(changeSettingsRedux.pending, (state) => {
        console.log("changeSettingsRedux SPUŠTĚN");
        state.isLoading2 = true;
      })
      .addCase(changeSettingsRedux.fulfilled, (state, action) => {
        console.log("changeSettingsRedux ÚSPĚŠNĚ DOKONČEN");
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
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message = "Změny uloženy";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(changeSettingsRedux.rejected, (state) => {
        console.log("changeSettingsRedux SELHAL");
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message = "Něco se pokazilo";
        state.toast.style = "error";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(deleteAccountRedux.pending, (state) => {
        console.log("deleteAccountRedux SPUŠTĚN");
        // state.isLoading = true;
        state.isLoading2 = true;
        state.isAccountDeletingPending = true;
      })
      .addCase(deleteAccountRedux.fulfilled, (state) => {
        console.log("deleteAccountRedux ÚSPĚŠNĚ DOKONČEN");
        // state.isLoading = false;
        // isLoading2 se neukončuje jelikož po úspěšné změně dojde k přesměrování na changeVerification
        // state.isLoading2 = false;
        state.isAccountDeletedSuccess = true;
      })

      .addCase(deleteAccountRedux.rejected, (state) => {
        console.log("deleteAccountRedux SELHAL");
        // state.isLoading = false;
        state.isLoading2 = false;
        state.isAccountDeletingPending = false;

        state.toast.isVisible = true;
        state.toast.message = "Něco se pokazilo, zkuste to znovu";
        state.toast.style = "error";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(addJobRedux.pending, (state) => {
        console.log("addJobRedux PROBÍHÁ");
        state.isLoading2 = true;
      })
      .addCase(addJobRedux.fulfilled, (state, action) => {
        console.log("addJobRedux ÚSPĚŠNĚ DOKONČEN");
        state.jobToAdd.city = "";
        state.jobToAdd.price = 0;
        state.jobToAdd.terminal = "";
        state.jobToAdd.weight = 0;
        state.jobToAdd.weightTo27t = 0;
        state.jobToAdd.weightTo34t = 0;
        state.jobToAdd.zipcode = "";
        state.loggedInUserData.currentJobs = action.payload;
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message = "Práce přidána";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(addJobRedux.rejected, (state) => {
        console.log("addJobRedux SELHAL");
        state.isLoading2 = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(editJobRedux.pending, (state) => {
        console.log("editJobRedux PROBÍHÁ");
        state.isLoading2 = true;
      })
      .addCase(editJobRedux.fulfilled, (state, action) => {
        console.log("editJobRedux ÚSPĚŠNĚ DOKONČEN");
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
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message = "Práce upravena";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(editJobRedux.rejected, (state) => {
        console.log("editJobRedux SELHAL");
        state.isLoading2 = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(deleteJobRedux.pending, (state) => {
        console.log("deleteJobRedux PROBÍHÁ");
        state.isLoading2 = true;
      })
      .addCase(deleteJobRedux.fulfilled, (state, action) => {
        state.loggedInUserData.currentJobs = action.payload;
        console.log("deleteJobRedux ÚSPĚŠNĚ DOKONČEN");
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message = "Práce smazána";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(deleteJobRedux.rejected, (state) => {
        console.log("deleteJobRedux SELHAL");
        state.isLoading2 = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(archiveDoneJobsFirstTimeRedux.pending, (state) => {
        console.log("archiveDoneJobsFirstTimeRedux PROBÍHÁ");
        state.isLoading2 = true;
      })
      .addCase(archiveDoneJobsFirstTimeRedux.fulfilled, (state, action) => {
        console.log("archiveDoneJobsFirstTimeRedux ÚSPĚŠNĚ DOKONČEN");
        console.log(action.payload);
        state.loggedInUserData.archivedJobs = action.payload.monthToArchive;
        state.loggedInUserData.currentJobs = action.payload.filteredCurrentJobs;
        state.loggedInUserData.userSettings.eurCzkRate =
          action.payload.newEurCzkRate;
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message = "Archivováno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(archiveDoneJobsFirstTimeRedux.rejected, (state) => {
        console.log("archiveDoneJobsFirstTimeRedux SELHAL");
        state.isLoading2 = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(archiveDoneJobsNewMonthRedux.pending, (state) => {
        console.log("archiveDoneJobsNewMonthRedux PROBÍHÁ");
        state.isLoading2 = true;
      })
      .addCase(archiveDoneJobsNewMonthRedux.fulfilled, (state, action) => {
        console.log("archiveDoneJobsNewMonthRedux ÚSPĚŠNĚ DOKONČEN");
        console.log(action.payload);
        state.loggedInUserData.archivedJobs = action.payload.newMonthToArchive;
        state.loggedInUserData.currentJobs = action.payload.filteredCurrentJobs;
        state.loggedInUserData.userSettings.eurCzkRate =
          action.payload.newEurCzkRate;
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message = "Archivováno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(archiveDoneJobsNewMonthRedux.rejected, (state) => {
        console.log("archiveDoneJobsNewMonthRedux SELHAL");
        state.isLoading2 = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(archiveDoneJobsExistingMonthRedux.pending, (state) => {
        console.log("archiveDoneJobsExistingMonthRedux PROBÍHÁ");
        state.isLoading2 = true;
      })
      .addCase(archiveDoneJobsExistingMonthRedux.fulfilled, (state, action) => {
        console.log("archiveDoneJobsExistingMonthRedux ÚSPĚŠNĚ DOKONČEN");
        console.log(action.payload);
        state.loggedInUserData.archivedJobs =
          action.payload.updatedArchivedJobs;
        state.loggedInUserData.currentJobs = action.payload.filteredCurrentJobs;
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message = "Archivováno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(archiveDoneJobsExistingMonthRedux.rejected, (state) => {
        console.log("archiveDoneJobsExistingMonthRedux SELHAL");
        state.isLoading2 = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(deleteArchiveMonthRedux.pending, (state) => {
        console.log("deleteArchiveMonthRedux PROBÍHÁ");
        state.isLoading2 = true;
      })
      .addCase(deleteArchiveMonthRedux.fulfilled, (state, action) => {
        console.log("deleteArchiveMonthRedux ÚSPĚŠNĚ DOKONČEN");
        state.loggedInUserData.archivedJobs = action.payload;
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message = "Smazáno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(deleteArchiveMonthRedux.rejected, (state) => {
        console.log("deleteArchiveMonthRedux SELHAL");
        state.isLoading2 = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(deleteArchiveMonthJobRedux.pending, (state) => {
        console.log("deleteArchiveMonthJobRedux PROBÍHÁ");
        state.isLoading2 = true;
      })
      .addCase(deleteArchiveMonthJobRedux.fulfilled, (state, action) => {
        console.log("deleteArchiveMonthJobRedux ÚSPĚŠNĚ DOKONČEN");
        state.loggedInUserData.archivedJobs = action.payload;
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message = "Smazáno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(deleteArchiveMonthJobRedux.rejected, (state) => {
        console.log("deleteArchiveMonthJobRedux SELHAL");
        state.isLoading2 = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(editArchiveJobRedux.pending, (state) => {
        console.log("editArchiveJobRedux PROBÍHÁ");
        state.isLoading2 = true;
      })
      .addCase(editArchiveJobRedux.fulfilled, (state, action) => {
        console.log("editArchiveJobRedux ÚSPĚŠNĚ DOKONČEN");
        state.loggedInUserData.archivedJobs = action.payload;
        state.isLoading2 = false;

        state.toast.isVisible = true;
        state.toast.message = "Upraveno";
        state.toast.style = "success";
        state.toast.time = 3000;
        state.toast.resetToast = true;
      })
      .addCase(editArchiveJobRedux.rejected, (state) => {
        console.log("editArchiveJobRedux SELHAL");
        state.isLoading2 = false;
      })
      //
      // -----------------------------------------------------------------------
      //
      .addCase(editArchiveMonthSummarySettingsRedux.pending, (state) => {
        console.log("editArchiveMonthSummarySettingsRedux PROBÍHÁ");
        state.isLoading2 = true;
      })

      .addCase(
        editArchiveMonthSummarySettingsRedux.fulfilled,
        (state, action) => {
          console.log("editArchiveMonthSummarySettingsRedux ÚSPĚŠNĚ DOKONČEN");
          state.loggedInUserData.archivedJobs = action.payload;

          state.archiveMonthSummarySettingsToEdit.date = "";
          state.archiveMonthSummarySettingsToEdit.baseMoney = 0;
          state.archiveMonthSummarySettingsToEdit.eurCzkRate = 0;
          state.archiveMonthSummarySettingsToEdit.percentage = 0;
          state.archiveMonthSummarySettingsToEdit.secondJobBenefit = 0;
          state.archiveMonthSummarySettingsToEdit.waitingBenefitEmployerCzk = 0;
          state.archiveMonthSummarySettingsToEdit.waitingBenefitEur = 0;
          state.isLoading2 = false;

          state.toast.isVisible = true;
          state.toast.message = "Upraveno";
          state.toast.style = "success";
          state.toast.time = 3000;
          state.toast.resetToast = true;
        }
      )
      .addCase(editArchiveMonthSummarySettingsRedux.rejected, (state) => {
        console.log("editArchiveMonthSummarySettingsRedux SELHAL");
        state.isLoading2 = false;
      });
  },
});

export const {
  runToastRedux,
  resetToastRedux,
  resetJobToEditValuesRedux,
  resetIsRegisterPending,
  resetIsRegisterSuccessRedux,
  resetIsEmailChangedSuccessRedux,
  resetIsPasswordChangedSuccessRedux,
  resetIsAccountDisabledRedux,
  resetIsAccountDeletedSuccessRedux,
  resetIsAccountLogoutSuccess,
  setIsLoadingTrueRedux,
  setIsLoadingFalseRedux,
  setIsLoading2TrueRedux,
  setIsLoading2FalseRedux,
  loginOnAuthRedux,
  logoutOnAuthRedux,
  setLoadedUserDataRedux,
  setJobToAddRedux,
  resetJobToAddValuesRedux,
  setJobToEditRedux,
  setIsEditingArchivedJobTrueRedux,
  setIsEditingArchivedJobFalseRedux,
  setArchiveMonthSummarySettingsToEditRedux,
  resetArchiveMonthSummarySettingsToEditRedux,
  setIsEditingTrueRedux,
  setIsEditingFalseRedux,
} = authSlice.actions;

export default authSlice.reducer;
