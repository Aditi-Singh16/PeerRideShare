import Link from 'next/link';
import Image from 'next/image'

import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { useEffect,useRef, useState } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState("")
  const web3ModalRef = useRef();


  

  const getProviderorSigner = async (needSigner = false) => {
    const provider = new ethers.providers.Web3Provider(await detectEthereumProvider());
        // const provider = new ethers.providers.JsonRpcProvider(networks[5].provider);
        await provider.send('eth_requestAccounts', []);

        const { chainId } = await provider.getNetwork();
        if (chainId !== 5) {
            window.alert("Change the network to Goerli");
            throw new Error("Change the network to Goerli");
        }

        if (needSigner) {
            const signer = provider.getSigner();
            setAddress(await signer.getAddress());
            return signer;
        }
        return provider;
}

const connectWallet = async () => {
    try {
        await getProviderorSigner(true);
        setWalletConnected(true);
        // checkUser();
    }
    catch (err) {
        console.error(err);
    }
};

  const renderButton = () => {
    if(!walletConnected){
            return (
        <button className={styles.button} onClick={connectWallet}>Connect your wallet</button>
      );
    }
    else {
      return (
        <div>
        <Link className={styles.button} href="/rides/book">Book a Ride</Link>
        <Link className={styles.button} href="/rides/publish">Publish a Ride</Link>
        </div>
      )
    }

  };



  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network:"goerli",
        providerOptions:{},
        disableInjectedProvider:false,
      });
    }
  }, [walletConnected]);


  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>
          <Image width={100} height={100} src="/open logo.png" className={styles.openlogo} alt="open_logo"></Image>
          </div>
          <div className={styles.header}>Address: {address}</div>
          <div className={styles.buttons}>
          <Link className={styles.button} href="/auth/register">Register</Link>
          <Link className={styles.button} href="/auth/login">login</Link>
          </div>
        </nav>
        <main>
          <h1 className={styles.title}>
            Welcome to PeerPool!
          </h1>
          {renderButton()}
        </main>
      </div>
    </div>
        
      
  );


}


