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
    address: '0xD5610A08E370051a01fdfe4bB3ddf5270af1aA48',
    abi: ContractInterface,
    functionName: 'setName',
    args: ['slobo.eth'],
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
        <PageWithJSbasedForm/>
        <br />

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
