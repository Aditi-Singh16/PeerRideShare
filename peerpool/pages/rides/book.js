import { useState, useEffect, useRef } from 'react';
import Web3Modal from "web3modal";
import {  Contract,ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../../constants';
import detectEthereumProvider from '@metamask/detect-provider';
import NavbarCustom from '../navbar_custom';

export default function Book() {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departureTime, setDepartureTime] = useState();
    const [fare, setFare] = useState();
    const [seats, setSeats] = useState()
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(false)
    const [ridematch,setMatchingRide] = useState([])

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

    const searchRide = () => {
        var allRides = JSON.parse(localStorage.getItem('allRides'));
        var matchingRide = [];
        for (var i = 0; i < allRides.length; i++) {
            var ride = allRides[i];
            if (ride.origin == searchOrigin &&
                ride.destination == searchDestination &&
                ride.departuretime == searchDepartureTime &&
                ride.seats >= searchSeats)
            {
                    matchingRide.push(ride);
                }
            setMatchingRide(matchingRide)
        }
    }

    const book_ = async () => {
        try {
            const signer = await getProviderorSigner(true);
            const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            console.log(contract)
            setLoading(true);
            searchRide(contract, origin, destination, departureTime, seats);
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
            return (
                <div>
                    <NavbarCustom/>
                    <section className="bg-gray-50 dark:bg-gray-900">
                        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                        Book a Ride
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
                                        <input type="submit" onClick={book_} value="Search"></input>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <h1>Matching Rides</h1>
                    {ridematch.length > 0 ? (
                        ridematch.map((ride) => (
                            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{ride.origin} to {ride.destination}</h5>
                                </div>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                Departure Time: {ride.departuretime}</p>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Seats Available: {ride.seats}</p>
                                <button className={styles.btn}>Book Ride</button>
                            </div>
                        ))
                    ) : (
                        <p>No matching ride found.</p>
                    )}

</section>
                </div>
                
            )
        }
    }
    return (
        <div>
            {renderButton()}
        </div>
    )
}