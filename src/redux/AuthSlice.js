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

  // Funkce pro vytvoření databázové struktury uživatele
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
      // Chyba při registraci
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
      console.log(error.message);
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
      // Chyba při přidávání práce do databáze
      console.log("kokot");
      throw error.message;
    }
  }
);

// -------------------------------------------------------------------------------------

export const authSlice = createSlice({
  name: "auth",
  initialState: {
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
  },
  reducers: {
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
    // setEurCzkRate(state, action) {
    //   console.log("setEurCzkRate SPUŠTĚN");
    //   state.loggedInUserData.userSettings.eurCzkRate = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, () => {
        console.log("register PROBÍHÁ");
      })
      .addCase(register.fulfilled, () => {
        console.log("register ÚSPĚŠNĚ DOKONČEN");
      })
      .addCase(register.rejected, (action) => {
        console.log("registr SELHAL", action.error.message);
      })
      .addCase(login.pending, (state) => {
        console.log("login PROBÍHÁ");
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loggedInUserEmail = auth.currentUser.email;
        state.isLoading = false;
        state.loggedInUserUid = auth.currentUser.uid;
        state.loggedInUserData.archivedJobs = action.payload.archivedJobs;
        state.loggedInUserData.currentJobs = action.payload.currentJobs;
        state.loggedInUserData.userSettings = action.payload.userSettings;
        console.log("login ÚSPĚŠNĚ DOKONČEN", state.loggedInUserEmail);
      })
      .addCase(login.rejected, (state, action) => {
        console.log("login SELHAL", action.error.message);
        state.isLoggedIn = false;
        state.loggedInUserEmail = null;
        state.isLoading = false;
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
        console.log("loadUserData ÚSPĚŠNĚ DOKONČEN", action.payload);
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
      });
  },
});

export const {
  setLoadingTrue,
  setLoadingFalse,
  loginOnAuth,
  logoutOnAuth,
  setLoadedUserData,
} = authSlice.actions;

export default authSlice.reducer;
