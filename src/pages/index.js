import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Icon } from "@iconify/react";

import {
  useWaitForTransaction,
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
  useEnsAddress,
  useAccount,
} from "wagmi";
import TopBar from "../components/TopBar";

import ContractInterface from "../../contract-abi.json";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  // Tracks input after user has stopped typing
  const [finalUserInput, setFinalUserInput] = useState("")
  // Tracks whether input is valid
  const [validInput, setValidInput] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);

  const { chain, chains } = useNetwork();

  const mainnet_contract = "0x084b1c3C81545d370f3634392De611CaaBFf8148";
  const goerli_contract = "0xD5610A08E370051a01fdfe4bB3ddf5270af1aA48";

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
  function handleNewUserInput(newUserInput){
    // set user input first
    setUserInput(newUserInput)
    // Valid input will be false
    setValidInput(false);
    // Set typing timer
    clearTimeout(typingTimer);
    setTypingTimer(
      setTimeout(() => {
        setFinalUserInput(newUserInput)
        console.log(typingTimer);
      }, 2000)
    );
  }

  // useEffect to verify input
  useEffect(() =>{
    console.log('New address from wagmi ' + ensDataAddress);
    console.log()
    if (accountAddress === ensDataAddress && ![null, undefined, ""].includes(accountAddress) ) {
      console.log("Valid ens selection")
      setValidInput(true);
    }
  }, [ensDataAddress, accountAddress])

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
                onChange={(event) =>{
                    handleNewUserInput(event.target.value.toLowerCase())
                  }
                }
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

              {[null, undefined, ""].includes(accountAddress) && <div className="sfpro-bold-black-16px"> Please connect wallet</div>}
              {![null, undefined, ""].includes(accountAddress)  && userInput && !validInput && (
                <div className="sfpro-bold-black-16px">verifying name...</div>
              )}
              {!userInput && <div className="sfpro-bold-black-16px"> .</div>}
              {validInput && (
                <div className="sfpro-bold-black-16px">
                  {" "}
                  <Icon icon="akar-icons:circle-check" color="green" />
                </div>
              )}
            </div>
          </div>
          <div align="center">
            <ConnectButton />
          </div>
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
        {/*
        {validInput && ensisLoading && <div className="notosans-normal-white-10px">Fetching address…</div>}
        {validInput && ensisError && <div className="notosans-normal-white-10px">Error fetching address</div>}
        {validInput && ensAddressdata && <div className="notosans-normal-white-10px">Address: {ensAddressdata}</div>}
      */}
      </main>
    </div>
  );
}
