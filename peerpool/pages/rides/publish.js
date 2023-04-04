import { useState, useEffect, useRef } from 'react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../../constants';
import { newRide, getProviderorSigner, connectWallet } from '../../utils/functions';
import Web3Modal from "web3modal";
import { Contract, ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';
import Navbar_custom from '../navbar_custom';




export default function Publish() {

    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departureTime, setDepartureTime] = useState();
    const [fare, setFare] = useState();
    const [seats, setSeats] = useState()
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(false)
    const web3ModalRef = useRef();
    const [walletConnected, setWalletConnected] = useState(true);

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

    const publishRide = async () => {
        try {
            const signer = await getProviderorSigner(true);
            const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            console.log(signer)
            setLoading(true);
            newRide(signer, contract, origin, destination, departureTime, fare, seats);
            var res = localStorage.getItem('allRides')
            if(res!=null){
                res.add(
                    {
                        'origin':origin,
                        'destination':destination,
                        'departuretime':departureTime,
                        'seats':seats,
                        'fare':fare
                    }
                )
            }else{
                res = [
                    {
                        'origin':origin,
                        'destination':destination,
                        'departuretime':departureTime,
                        'seats':seats,
                        'fare':fare
                    }
                ]
            }
            localStorage.setItem('allRides',JSON.stringify(res) )
            setLoading(false);
        }
        catch (err) {
            console.error(err);
        }


    }

    useEffect(() => {
        if (!walletConnected) {
            web3ModalRef.current = new Web3Modal({
                network: "goerli",
                providerOptions: {},
                disableInjectedProvider: false,
            });
        }

    }, [walletConnected]);

    const renderButton = () => {
        if (!walletConnected) {
            return (
                <button className={styles.button} onClick={connectWallet}>Connect your wallet</button>
            );
        }
        else if (loading) {
            return (
                <div>
                <h1>Loading...</h1>
                </div>
            )
        }

        else {
            if(address == ""){
                connectWallet()
            }
            return (
                <div>
                    <Navbar_custom/>
                    <section className="bg-gray-50 dark:bg-gray-900">
                        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                        Publish a Ride
                                    </h1>
                                <form>
                                    <div className="mb-6">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Origin</label>
                                        <input type="text" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder="Enter your Origin" required onChange={(e) => {
                                            setOrigin(e.target.value || "")
                                        }}></input>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Destination</label>
                                        <input type="text" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder="Enter your Destination" required onChange={(e) => {
                                            setDestination(e.target.value || "")
                                        }}></input>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Departure Time</label>
                                        <input type="text" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder="Enter time in 24hr format" required onChange={(e) => {
                                            setDepartureTime(e.target.value || "")
                                        }}></input>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seats Available</label>
                                        <input type="number" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder="Choose Seats Available" required onChange={(e) => {
                                            setSeats(e.target.value || "")
                                        }}></input>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fare</label>
                                        <input type="text" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' min="0" step="any" placeholder="Enter your Number" required onChange={(e) => {
                                            setFare(e.target.value || "")
                                        }}></input>
                                    </div>
                                    <div className="button">
                                        <input type="submit" value="Register" onClick={publishRide}></input>
                                    </div>
                                </form>
                            </div>
                        </div>
                        </div>
                    </section>
                </div>
            )
        }
    }
    return (
        <div className="main_body">
            {renderButton()}
        </div>
    )
}