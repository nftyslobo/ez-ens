import Head from 'next/head'
import { useState } from "react";
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PrimaryNameForm from './js-form';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import Image from 'next/image'
import TopBar from '../components/TopBar';

import ContractInterface from '../../contract-abi.json';

export default function Home() {


  const [formData, setFormData] = useState({});

  const { config, error } = usePrepareContractWrite({
    address: '0xD5610A08E370051a01fdfe4bB3ddf5270af1aA48',
    abi: ContractInterface,
    functionName: 'setName',
    args: [Object.values(formData)[0]],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config)

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
              <div align="center"><img class="vector-2" src="/logo.svg" alt="Vector"></img></div>
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
              {isLoading && <div>Check Wallet</div>}
              {isSuccess && <div>Transaction: <a href={"https://goerli.etherscan.io/tx/" + data.hash}>Etherscan</a></div>}
            </div>
            <div align="center">
              <ConnectButton
                chainStatus="icon"
                showBalance={false}
              />
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>2022</p>
      </footer>
    </div>
  )
}
