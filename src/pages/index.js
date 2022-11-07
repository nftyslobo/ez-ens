import Head from 'next/head'
import { useState } from "react";
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PrimaryNameForm from './js-form';
import { useWaitForTransaction, useContractWrite, usePrepareContractWrite, useNetwork } from 'wagmi';
import Image from 'next/image'
import TopBar from '../components/TopBar';

import ContractInterface from '../../contract-abi.json';

export default function Home() {


  const [formData, setFormData] = useState({});
  const { chain, chains } = useNetwork();

  const mainnet_contract = '0x084b1c3C81545d370f3634392De611CaaBFf8148';
  const goerli_contract = '0xD5610A08E370051a01fdfe4bB3ddf5270af1aA48';

  const mainnet_etherscan = "https://etherscan.io/tx/"
  const goerl_etherscan = "https://goerli.etherscan.io/tx/"


  const contract_address = chain?.id === 1 ? mainnet_contract : goerli_contract;
  const etherscan_url = chain?.id === 1 ? mainnet_etherscan : goerl_etherscan;


  const { config, error } = usePrepareContractWrite({
    address: contract_address,
    abi: ContractInterface,
    functionName: 'setName',
    args: [Object.values(formData)[0]],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const waitForTransaction = useWaitForTransaction({
    chainId: chain?.id,
    hash: data?.hash,
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>ez ens</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="/favicon.ico"
        />
      </Head>
      <main className={styles.main}>
        <TopBar />
        <div>
          <div class="box">
            <div>
              <div align="center">
                <img class="vector-2" src="/logo.svg" alt="Vector"></img>
              </div>
              <div class="title-2">
                <h1 class="title-4 valign-text-middle sfprorounded-bold-black-32px">Set your primary ENS</h1>
              </div>
              <div align="center">
                <PrimaryNameForm onChange={setFormData} />
              </div>
              <br />
              <div align="center">
                <button class="small-button sfpro-bold-black-16px"
                  disabled={!write} onClick={() => write?.()}>
                  Set
                </button>
              </div>

            </div>
            <div align="center">
              <ConnectButton
              />
            </div>
          </div>
          <div class="sfpro-bold-black-16px">
            <br />
            {isLoading && <div align="center">Waiting for txn approval...</div>}

            {waitForTransaction.isLoading &&
              <div align="center">
                {chain.name}: <a href={etherscan_url + data.hash}>Etherscan</a> - ...pending...
              </div>
            }
            {waitForTransaction.isSuccess &&
              <div align="center">
                {chain.name}: <a href={etherscan_url + data.hash}>Etherscan</a> - Success!
              </div>
            }
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>2022</p>
      </footer>
    </div>
  )
}
