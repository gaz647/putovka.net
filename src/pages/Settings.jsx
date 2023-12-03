import "./Settings.css";
import { useDispatch } from "react-redux";
import {
  changeSettingsRedux,
  logoutInSettingsRedux,
  runToastRedux,
} from "../redux/AuthSlice";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import firstLetterToUpperCase from "../customFunctionsAndHooks/firstLetterToUpperCase";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import Spinner from "../components/Spinner";
import ModalPrompt from "../components/ModalPrompt";
import InputField from "../components/InputField";
import Heading from "../components/Heading";
import SettingsMenu from "../components/SettingsMenu";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const loggedInUserEmail = useSelector(
    (state) => state.auth.loggedInUserEmail
  );
  // const isLoading = useSelector((state) => state.auth.isLoading);
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isLogoutReduxSuccess = useSelector(
    (state) => state.auth.isLogoutReduxSuccess
  );
  const userUid = useSelector((state) => state.auth.loggedInUserUid);
  const email = useSelector((state) => state.auth.loggedInUserEmail);
  const referenceIdSel = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.referenceId
  );
  const isChangeSettingsReduxSuccess = useSelector(
    (state) => state.auth.isChangeSettingsReduxSuccess
  );

  // USE STATE -----------------------------------------------------------
  //
  const [baseMoney, setBaseMoney] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.baseMoney)
  );
  const [nameFirst, setNameFirst] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.nameFirst)
  );
  const [nameSecond, setNameSecond] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.nameSecond)
  );
  const [numberEm, setNumberEm] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.numberEm)
  );
  const [numberTrailer, setNumberTrailer] = useState(
    useSelector(
      (state) => state.auth.loggedInUserData.userSettings.numberTrailer
    )
  );
  const [numberTruck, setNumberTruck] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.numberTruck)
  );

  const [terminal, setTerminal] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.terminal)
  );
  const [percentage, setPercentage] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.percentage)
  );
  const [referenceId, setReferenceId] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.referenceId)
  );
  const [secondJobBenefit, setSecondJobBenefit] = useState(
    useSelector(
      (state) => state.auth.loggedInUserData.userSettings.secondJobBenefit
    )
  );
  const [waitingBenefitEmployerCzk, setWaitingBenefitEmployerCzk] = useState(
    useSelector(
      (state) =>
        state.auth.loggedInUserData.userSettings.waitingBenefitEmployerCzk
    )
  );
  const [waitingBenefitEur, setWaitingBenefitEur] = useState(
    useSelector(
      (state) => state.auth.loggedInUserData.userSettings.waitingBenefitEur
    )
  );
  const [eurCzkRate, setEurCzkRate] = useState(
    useSelector((state) => state.auth.loggedInUserData.userSettings.eurCzkRate)
  );
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // HANDLE MODAL VISIBILITY ---------------------------------------------
  //
  const handleArchiveModalVisibility = () => {
    setReferenceId(referenceIdSel);
    setShowArchiveModal(!showArchiveModal);
  };

  // COPY TO CLIPBOARD ---------------------------------------------------
  //
  // const copyToClipBoardReferenceId = () => {
  //   if (referenceIdSel !== referenceId) {
  //     dispatch(
  //       runToastRedux({
  //         message: "Nejdříve uložte nastavení.",
  //         style: "error",
  //         time: 3000,
  //       })
  //     );
  //     return;
  //   }
  //   navigator.clipboard
  //     .writeText(referenceIdSel)
  //     .then(() => {
  //       dispatch(
  //         runToastRedux({
  //           message: "Zkopírováno do schránky",
  //           style: "success",
  //           time: 3000,
  //         })
  //       );
  //     })
  //     .catch(() => {
  //       dispatch(
  //         runToastRedux({
  //           message: "Zkopírování do schránky se nepovedlo. Zkuste to znovu",
  //           style: "error",
  //           time: 3000,
  //         })
  //       );
  //     });
  // };

  // GENERATE NEW REFERENCE ID -------------------------------------------
  //
  const generateNewReferenceId = () => {
    setShowArchiveModal(!showArchiveModal);
    setReferenceId(uuidv4());
  };

  // HANDLE SUBMIT -------------------------------------------------------
  //
  const handleSubmit = () => {
    if (!nameFirst || !nameSecond || !numberEm || !numberTruck) {
      dispatch(
        runToastRedux({
          message: "Vyplňte povinná pole.",
          style: "error",
          time: 3000,
        })
      );
      return;
    }

    if (eurCzkRate === 0) {
      dispatch(
        runToastRedux({
          message: "Zadejte kurz Eur/Kč.",
          style: "error",
          time: 3000,
        })
      );
      return;
    }

    if (eurCzkRate.toString().length > 7) {
      dispatch(
        runToastRedux({
          message: "Zadané číslo musí obsahovat maximálně 4 desetinná místa.",
          style: "error",
          time: 3000,
        })
      );
      return;
    }

    const payload = {
      userUid,
      userSettings: {
        baseMoney: Number(baseMoney),
        email,
        eurCzkRate: Number(eurCzkRate),
        nameFirst: firstLetterToUpperCase(nameFirst),
        nameSecond: firstLetterToUpperCase(nameSecond),
        numberEm: numberEm.toUpperCase(),
        numberTrailer: numberTrailer.toUpperCase(),
        numberTruck: numberTruck.toUpperCase(),
        percentage: Number(percentage),
        referenceId,
        secondJobBenefit: Number(secondJobBenefit),
        terminal,
        waitingBenefitEmployerCzk: Number(waitingBenefitEmployerCzk),
        waitingBenefitEur: Number(waitingBenefitEur),
      },
    };
    dispatch(changeSettingsRedux(payload));
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    navigate("/");
  };

  // HANDLE LOGOUT -------------------------------------------------------
  //
  const handleLogout = () => {
    dispatch(logoutInSettingsRedux());
    // dispatch(logoutOnAuthRedux());
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    if (isLogoutReduxSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage: "Odhlášení proběhlo úspěšně",
        },
      });
    } else if (isChangeSettingsReduxSuccess) {
      navigate("/");
    }
  }, [dispatch, isLogoutReduxSuccess, isChangeSettingsReduxSuccess, navigate]);

  return (
    <section className="wrapper">
      {isLoading2 ? (
        <div className="full-page-container-center">
          <Spinner />
        </div>
      ) : (
        <section className="settings">
          {showArchiveModal && (
            <ModalPrompt
              heading={
                "Vygenerovat nové referenční číslo? Sledování Vašich dat bude tomu kdo vlastní stávající referenční číslo znemožněno."
              }
              text={"Pro dokončení uložte Vaše nastavení."}
              confirmFunction={generateNewReferenceId}
              declineFunction={handleArchiveModalVisibility}
            />
          )}
          <SettingsMenu />
          <header className="settings-header">
            <Heading text={"Nastavení"} />
            <div className="settings-header-user-email text-shadow">
              {loggedInUserEmail}
            </div>
            <button
              className="settings-header-user-btns text-shadow"
              onClick={() => handleLogout()}
            >
              odhlásit
            </button>
            <Link
              className="settings-header-user-btns text-shadow"
              to={"/change-email"}
            >
              změnit email
            </Link>
            <Link
              className="settings-header-user-btns text-shadow"
              to={"/change-password"}
            >
              změnit heslo
            </Link>
            <Link
              className="settings-header-user-btns text-shadow"
              to={"/delete-account"}
            >
              smazat účet
            </Link>
          </header>
          <main>
            <form className="settings-form">
              {/* <InputField
                type={"referenceId"}
                label={"Referenční číslo"}
                subLabel={"(pro sdílení vašich dat se zaměstnavatelem)"}
                value={referenceId}
                onResetReferenceId={handleArchiveModalVisibility}
                onCopyReferenceId={copyToClipBoardReferenceId}
              /> */}
              <InputField
                required={true}
                type={"text"}
                label={"Jméno"}
                value={nameFirst}
                onTextChange={(e) => setNameFirst(e)}
              />
              <InputField
                required={true}
                type={"text"}
                label={"Příjmení"}
                value={nameSecond}
                onTextChange={(e) => setNameSecond(e)}
              />
              <InputField
                required={true}
                type={"text"}
                label={"Číslo"}
                subLabel={"(např. 101, U01 atd.)"}
                value={numberEm}
                onTextChange={(e) => setNumberEm(e)}
              />
              <InputField
                type={"text"}
                required={true}
                label={"SPZ tahač"}
                value={numberTruck}
                onTextChange={(e) => setNumberTruck(e)}
              />
              <InputField
                type={"text"}
                label={"SPZ návěs"}
                value={numberTrailer}
                onTextChange={(e) => setNumberTrailer(e)}
              />
              <InputField
                type={"terminal"}
                label={"Terminál"}
                value={terminal}
                onTerminalChange={(e) => {
                  setTerminal(e);
                }}
              />
              <InputField
                type={"number"}
                label={"Základní mzda"}
                subLabel={"(Kč)"}
                value={baseMoney}
                onNumberChange={(e) => {
                  setBaseMoney(e);
                }}
              />
              <InputField
                type={"number"}
                label={"% z fakturace"}
                value={percentage}
                onNumberChange={(e) => {
                  setPercentage(e);
                }}
              />
              <InputField
                type={"number"}
                label={"Příplatek za druhou práci"}
                subLabel={"(Kč)"}
                value={secondJobBenefit}
                onNumberChange={(e) => {
                  setSecondJobBenefit(e);
                }}
              />
              <InputField
                type={"number"}
                label={"Příplatek za čekání - zaměstnavatel"}
                subLabel={"(Kč)"}
                value={waitingBenefitEmployerCzk}
                onNumberChange={(e) => {
                  setWaitingBenefitEmployerCzk(e);
                }}
              />
              <InputField
                type={"number"}
                label={"Příplatek za čekání"}
                subLabel={"(€)"}
                value={waitingBenefitEur}
                onNumberChange={(e) => {
                  setWaitingBenefitEur(e);
                }}
              />
              <InputField
                required={true}
                type={"number-decimal"}
                label={"Kurz Eur/Kč"}
                subLabel={"(automaticky aktualizován po archivaci)"}
                value={eurCzkRate}
                onNumberChange={(e) => {
                  setEurCzkRate(e);
                }}
              />
              <br />
              <div className="settings-form-confirm-decline-btns-container">
                <ConfirmDeclineBtns
                  disabled={
                    !nameFirst ||
                    !nameSecond ||
                    !numberEm ||
                    !numberTruck ||
                    !eurCzkRate
                  }
                  confirmFunction={handleSubmit}
                  declineFunction={handleDecline}
                />
              </div>
            </form>
          </main>
        </section>
      )}
    </section>
  );
};

export default Settings;
