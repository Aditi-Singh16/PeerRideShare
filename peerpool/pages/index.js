import Link from 'next/link';
import Web3Modal from "web3modal";
import { useEffect,useRef, useState } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import NavbarCustom from './navbar_custom';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState("")
  const web3ModalRef = useRef();

  const getProviderorSigner = async (needSigner = false) => {
    const provider = new ethers.providers.Web3Provider(await detectEthereumProvider());
      // const provider = new ethers.providers.JsonRpcProvider(networks[5].provider);
      await provider.send('eth_requestAccounts', []);

      const { chainId } = await provider.getNetwork();
      if (chainId !== 11155111) {
          window.alert("Change the network to Sepolia");
          throw new Error("Change the network to Sepolia");
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
        <button type="button" className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={connectWallet}>Connect your wallet</button>
      );
    }
    else {
      return (
        <div>
        <Link className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" href="/rides/book">Book a Ride</Link>
        <Link className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" href="/rides/publish">Publish a Ride</Link>
        </div>
      )
    }

  };



  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network:"sepolia",
        providerOptions:{},
        disableInjectedProvider:false,
      });
    }
  }, [walletConnected]);


  return (
    <div>
      <NavbarCustom address={address}/>
      <h1>
        Welcome to PeerPool!
      </h1>
      {renderButton()}
    </div>
  );
}


