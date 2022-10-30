import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PageWithJSbasedForm from './js-form';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

import ContractInterface from '../contract-abi.json';

export default function Home() {

  const {isConnected} = useAccount();

  const {config, error} = usePrepareContractWrite({
    addressOrName: '0xD5610A08E370051a01fdfe4bB3ddf5270af1aA48',
    contractInterface: ContractInterface,
    functionName: 'setName',
    args:['slobo.eth'],
  });

  //const test = useContractWrite(config);
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  //console.log(error);
  //console.log(ContractInterface);
  //console.log(config);
  return (
    <div className={styles.container}>
      <Head>
        <title>ez ens</title>
      </Head>
      <main className={styles.main}>
        <ConnectButton />
        <p>console.log({error})</p>
        <PageWithJSbasedForm/>
        <button disabled={!write} onClick={() => write?.()}>
        set
      </button>

      </main>

      

      <footer className={styles.footer}>
        <p>2022</p>
      </footer>
    </div>
  )
}
