import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { Icon } from "@iconify/react";
import { gql } from "@apollo/client";
import { UniversalSupport } from "nftychat-universe";

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

  const [ownedNames, setOwnedNames] = useState();

  const { openConnectModal } = useConnectModal();

  // const client = ...

  function handleClick() {
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
      .then((result) => setOwnedNames(result));
    console.log(ownedNames);
  }

  const { chain, chains } = useNetwork();

  const mainnet_contract = "0x084b1c3C81545d370f3634392De611CaaBFf8148";
  const goerli_contract = "0x6F628b68b30Dc3c17f345c9dbBb1E483c2b7aE5c";

  const mainnet_etherscan = "https://etherscan.io/tx/";
  const goerl_etherscan = "https://goerli.etherscan.io/tx/";

  const contract_address = chain?.id === 1 ? mainnet_contract : goerli_contract;
  const etherscan_url = chain?.id === 1 ? mainnet_etherscan : goerl_etherscan;

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
    address: accountAddress,
    isConnecting: accountIsConnecting,
    isDisconnected: accountIsDisconnected,
  } = useAccount();

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
    // set user input first
    setUserInput(newUserInput);
    // Valid input will be false
    setValidInput(false);
    setTyping(false);
    // Set typing timer
    clearTimeout(typingTimer);
    setTypingTimer(
      setTimeout(() => {
        setTyping(true);
        setFinalUserInput(newUserInput);
        console.log(typingTimer);
      }, 1000)
    );
  }

  // useEffect to verify input
  useEffect(() => {
    console.log("New address from wagmi 1 " + ensDataAddress);
    console.log("contract address:" + contract_address);
    if (
      accountAddress === ensDataAddress &&
      ![null, undefined, ""].includes(accountAddress)
    ) {
      console.log("Valid ens selection");
      setValidInput(true);
      setEnsOwned(true);
    } else if (
      ![null, undefined, ""].includes(accountAddress) &&
      accountAddress != ensDataAddress
    ) {
      console.log("inputed addresss not owned by connected address");
      setEnsOwned(false);
    }
  }, [ensDataAddress, accountAddress, contract_address, finalUserInput]);

  return (
    <div className={styles.container}>
      <Head>
        <title>ez ens</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="box">
          <TopBar />
          <div>
            <div align="center">
              <img className="vector-2" src="/logo.svg" alt="Vector"></img>
            </div>
            <h1 className="valign-text-middle sfprorounded-bold-black-32px">
              Set your primary ENS
            </h1>
            <div align="center">
              <input
                className="name-input-field new-ens-name sfprorounded-regular-normal-dove-gray-16px"
                type="text"
                placeholder="enter name"
                onChange={(event) => {
                  handleNewUserInput(event.target.value.toLowerCase());
                }}
                value={userInput}
              />
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
              {!userInput && (
                <div className="sfpro-bold-black-16px">
                  {" "}
                  <Icon icon="mdi:ethereum" color="purple" />
                  <br />
                  <p></p>
                </div>
              )}
              {!typing && userInput && (
                <div className="sfpro-bold-black-16px">
                  {" "}
                  <Icon icon="eos-icons:typing" color="green" />
                  <br />
                  <p></p>
                </div>
              )}
              {validInput && ensOwned && (
                <div className="sfpro-bold-black-16px">
                  {" "}
                  <Icon icon="akar-icons:circle-check" color="green" />
                  <br />
                  <p></p>
                </div>
              )}
              {!ensOwned &&
                userInput &&
                accountAddress &&
                typing &&
                !ensIsLoading && (
                  <div className="sfpro-black-16px">
                    <Icon icon="akar-icons:face-sad" color="orange" />
                    <br />
                    {userInput + " does not resolve to connected address"}
                  </div>
                )}
            </div>
          </div>
          <div align="center">
            <ConnectButton />
          </div>
          <button onClick={handleClick}>query</button>
        </div>
        <div className="sfpro-bold-black-16px" align="center">
          <br />
          {isLoading && <div>Waiting for txn approval...</div>}

          {waitForTransaction.isLoading && (
            <div>
              Pending Confirmation: {chain.name}:{" "}
              <div className="sfpro-black-16px">
                <div className="sfpro-black-16px">
                  Txn Hash:{" "}
                  <a href={etherscan_url + data.hash}>
                    {data.hash.slice(0, 12)}...
                  </a>
                </div>
              </div>
            </div>
          )}
          {waitForTransaction.isSuccess && (
            <div>
              Success!{" "}
              <div className="sfpro-black-16px">
                Txn Hash:{" "}
                <a href={etherscan_url + data.hash}>
                  {data.hash.slice(0, 12)}...
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <div className={styles.support}>
        <UniversalSupport
          address="0x534631Bcf33BDb069fB20A93d2fdb9e4D4dD42CF"
          theme="light"
          welcomeMessage="Slobo.eth is standing by to help."
          connectWalletFunction={openConnectModal}
        />
      </div>
    </div>
  );
}
