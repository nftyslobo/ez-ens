import Head from 'next/head'
import { useState } from "react";
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PrimaryNameForm from './js-form';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

import ContractInterface from '../../contract-abi.json';

export default function Home() {


  const [formData, setFormData] = useState({});

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
        <br />
        {/* from wagmi docs example: https://wagmi.sh/docs/hooks/useContractWrite */}
        <div>
          <button disabled={!write} onClick={() => write?.()}>
            Set Name {Object.values(formData)[0]}
          </button>
          {isLoading && <div>Check Wallet</div>}
          {isSuccess && <div>Transaction: <a href={"https://goerli.etherscan.io/tx/" + data.hash}>Etherscan</a></div>}
          
        </div>

      </main>

      <footer className={styles.footer}>
        <p>2022</p>
      </footer>
    </div>
  )
}
