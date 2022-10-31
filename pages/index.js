import Head from 'next/head'
import { useState } from "react";
import { useRef } from "react";
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PrimaryNameForm from './js-form';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

import ContractInterface from '../contract-abi.json';

export default function Home() {


  const [formData, setFormData] = useState({});
  const save = () => {
    console.log(formData);
    console.log(Object.values(formData)[0])
  };

  console.log(formData.keys)
  const {isConnected} = useAccount();


  const {config, error} = usePrepareContractWrite({
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
      </Head>
      <main className={styles.main}>
        <ConnectButton />
        <br />
        <PrimaryNameForm onChange={setFormData}/>
        <button type="button" onClick={save}>
        Save
      </button>
        <br />
        <p>{formData.hasOwnProperty("primary_name")}</p>
        {/* from wagmi docs example: https://wagmi.sh/docs/hooks/useContractWrite */}
        <div>
          <button disabled={!write} onClick={() => write?.()}>
            Feed
          </button>
          {isLoading && <div>Check Wallet</div>}
          {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
        </div>

      </main>

      

      <footer className={styles.footer}>
        <p>2022</p>
      </footer>
    </div>
  )
}
