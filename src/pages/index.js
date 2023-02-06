import Head from "next/head";
import { useState, useEffect, Ref } from "react";
import styles from "../styles/Home.module.css";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Icon } from "@iconify/react";
import { gql } from "@apollo/client";
import { UniversalSupport } from "nftychat-universe";
import { Popover } from "react-tiny-popover";

import {
  useWaitForTransaction,
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
  useEnsAddress,
  useAccount,
} from "wagmi";
import TopBar from "../components/TopBar";
import apolloClient from "../components/ApolloClient";

import ContractInterface from "../../contract-abi.json";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  // Tracks input after user has stopped typing
  const [finalUserInput, setFinalUserInput] = useState("");
  // Tracks whether input is valid
  const [validInput, setValidInput] = useState(false);
  const [typing, setTyping] = useState(false);
  const [ensOwned, setEnsOwned] = useState(false);

  const [ownedNames, setOwnedNames] = useState([]);

  const { openConnectModal } = useConnectModal();
  const [searchedNames, SetSearchedNames] = useState([]);
  const [searchFocus, setSearchFocus] = useState(false);

  const {
    address: accountAddress,
    isConnecting: accountIsConnecting,
    isDisconnected: accountIsDisconnected,
    status: accountConnectionStatus,
  } = useAccount();

  function focusSearchbox() {
    // Allows for opening of dropdown
    setTimeout(() => {
      setSearchFocus(true);
    }, 1);
  }

  useEffect(() => {
    if (accountConnectionStatus === "connected") {
      apolloClient
        .query({
          query: gql`
            {
              resolvers (where: { addr: "${accountAddress.toLowerCase()}" })
              {
              domain{name}
              }
            }
        `,
        })
        .then((result) => {
          const tempOwnedNames = result.data.resolvers.map((entry) => {
            return entry.domain.name;
          });
          setOwnedNames(tempOwnedNames);
          //console.log(ownedNames);
        });
    }
  }, [accountAddress]);

  useEffect(() => {
    //console.log(accountConnectionStatus);
    if (accountConnectionStatus === "connected") {
      const tempSearchedNames = ownedNames.filter((entry) => {
        return entry.toLowerCase().includes(finalUserInput.toLowerCase());
      });
      SetSearchedNames(tempSearchedNames);
      //console.log("search names " + searchedNames);
    }
  }, [finalUserInput, ownedNames]);

  const { chain, chains } = useNetwork();

  const contract_address = "0x084b1c3C81545d370f3634392De611CaaBFf8148";
  const etherscan_url = "https://etherscan.io/tx/";

  const { config, error } = usePrepareContractWrite({
    address: contract_address,
    abi: ContractInterface,
    functionName: "setName",
    args: [userInput],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const waitForTransaction = useWaitForTransaction({
    chainId: chain?.id,
    hash: data?.hash,
  });

  const {
    //useEnsAddress
    data: ensDataAddress,
    isError: ensIsError,
    isLoading: ensIsLoading,
    status: ensStatus,
  } = useEnsAddress({
    name: finalUserInput,
    chainId: chain?.id,
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
  });

  const [typingTimer, setTypingTimer] = useState();

  // Use Effect to update Final userInput
  function handleNewUserInput(newUserInput) {
    // skip if setting from dropdown
    if (newUserInput === finalUserInput) {
      return;
    }
    // focus search
    focusSearchbox();
    // set user input first
    setUserInput(newUserInput);
    // Valid input will be false
    setValidInput(false);
    setTyping(true);
    // Set typing timer
    clearTimeout(typingTimer);
    setTypingTimer(
      setTimeout(() => {
        setTyping(false);
        setFinalUserInput(newUserInput);
      }, 1000)
    );
  }

  // useEffect to verify input
  useEffect(() => {
    if (
      accountAddress === ensDataAddress &&
      ![null, undefined, ""].includes(accountAddress)
    ) {
      setValidInput(true);
      setEnsOwned(true);
    } else if (
      ![null, undefined, ""].includes(accountAddress) &&
      accountAddress != ensDataAddress
    ) {
      setEnsOwned(false);
    }
  }, [ensDataAddress, accountAddress, contract_address, finalUserInput]);

  // useEffect to set searchFocus
  useEffect(() => {
    if (searchedNames?.length === 1 && searchedNames[0] === finalUserInput) {
      setSearchFocus(false);
    }

    function handleOnBlur(event) {
      // Gets the dropdown options container
      const optionsContainer = document.getElementsByClassName("dropdown")[0];

      // Gets the input options container
      const inputContainer =
        document.getElementsByClassName("set-primary-input")[0];

      // Gets the selected asset container
      const selectedContainer =
        document.getElementsByClassName("dropdown-item")[0];

      // Checks if event.target is in any of the DOM elements
      const touchLogic =
        optionsContainer?.contains(event.target) === true ||
        inputContainer?.contains(event.target) === true ||
        selectedContainer?.contains(event.target) === true;

      //console.log("touch logic " + touchLogic);
      // When dropdown is open and click is outside of the elements
      if (searchFocus && touchLogic === false) {
        setSearchFocus(false);
      }
    }
    document.addEventListener("click", handleOnBlur);
    return () => document.removeEventListener("click", handleOnBlur);
  }, [searchedNames, finalUserInput, searchFocus]);

  return (
    <div className={styles.container}>
      <Head>
        <title>ez ens</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <TopBar />

      <main className={styles.main}>
        <div className="box">
          <div>
            <div align="center">
              <img className="vector-2" src="/logo.svg" alt="Vector"></img>
            </div>
            <h1 className="valign-text-middle sfprorounded-bold-black-22px">
              Set Primary Name
            </h1>
            <div className="popover" align="center">
              <Popover
                content={
                  <div className="dropdown">
                    {searchedNames?.map((name) => {
                      return (
                        <div
                          className="dropdown-item"
                          key={name}
                          onClick={() => {
                            setFinalUserInput(name);
                            setUserInput(name);
                            setValidInput(true);
                            setEnsOwned(true);
                          }}
                        >
                          <p>{name}</p>
                        </div>
                      );
                    })}
                  </div>
                }
                // Show when greater than zero
                isOpen={searchFocus && searchedNames?.length > 0}
                padding={8}
                positions={["bottom"]}
              >
                {/* //input goes here */}
                <input
                  className="set-primary-input"
                  type="text"
                  placeholder="Enter name"
                  onChange={(event) => {
                    handleNewUserInput(event.target.value.toLowerCase());
                  }}
                  value={userInput}
                  onFocus={focusSearchbox}
                />
              </Popover>
            </div>
            <br />
            <div align="center">
              <button
                className="small-button sfpro-bold-black-16px"
                disabled={!validInput} /* put !write into disabled */
                onClick={() => write?.()}
              >
                Set
              </button>

              <br />
              <div className="input-state">
                {!userInput && (
                  <div className="sfpro-bold-black-16px">
                    {" "}
                    <Icon icon="mdi:ethereum" color="purple" />
                  </div>
                )}
                {typing && userInput && (
                  <div className="sfpro-bold-black-16px">
                    {" "}
                    <Icon
                      icon="eos-icons:typing"
                      color="green"
                      style={{ marginBottom: "-2px" }}
                    />
                  </div>
                )}
                {validInput && ensOwned && (
                  <div className="sfpro-bold-black-16px">
                    {" "}
                    <Icon
                      icon="akar-icons:circle-check"
                      color="green"
                      style={{ marginBottom: "-2px" }}
                    />
                    {" Valid"}
                  </div>
                )}
                {!ensOwned &&
                  userInput &&
                  accountAddress &&
                  !typing &&
                  !ensIsLoading && (
                    <div className="sfpro-black-16px">
                      <Icon
                        icon="akar-icons:face-sad"
                        color="orange"
                        style={{ marginBottom: "-2px" }}
                      />
                      {" " +
                        "  This name does not resolve to " +
                        accountAddress.slice(0, 6) +
                        "..." +
                        accountAddress.slice(-4)}
                    </div>
                  )}
              </div>
            </div>
            <div className="transaction-state">
              <div className="sfpro-bold-black-16px" align="center">
                {isLoading && (
                  <div>
                    {" "}
                    <Icon
                      icon="eos-icons:bubble-loading"
                      style={{ marginBottom: "-2px" }}
                    />{" "}
                    Waiting for transaction approval.
                  </div>
                )}

                {waitForTransaction.isLoading && (
                  <div>
                    <div className="sfpro-black-16px">
                      <Icon
                        icon="eos-icons:bubble-loading"
                        style={{ marginBottom: "-2px" }}
                      />{" "}
                      Pending Transaction Confirmation:{" "}
                      <a href={"https://etherscan.io/tx/" + data.hash}>
                        Etherscan
                      </a>
                    </div>
                  </div>
                )}
                {waitForTransaction.isSuccess && (
                  <div className="sfpro-black-16px">
                    Success! 🎉 Confirmation:{" "}
                    <a href={"https://etherscan.io/tx/" + data.hash}>
                      Etherscan
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/*<button onClick={handleClick}>query</button>*/}
        </div>

        <div className={styles.support}>
          <UniversalSupport
            address="0x534631Bcf33BDb069fB20A93d2fdb9e4D4dD42CF"
            theme="light"
            welcomeMessage="slobo.eth is standing by to help."
            connectWalletFunction={openConnectModal}
          />
        </div>
        <hr></hr>
      </main>
    </div>
  );
}
