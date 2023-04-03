import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Web3Modal from "web3modal";
import {  Contract,ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../../constants';
import styles from "../../styles/Home.module.css";
import detectEthereumProvider from '@metamask/detect-provider';

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
                <div className="container">
                    <div className="title">Book A Ride</div>
                    <div className="content">
                        <form action="#">
                            <div className="user-details">
                                <div className="input-box">
                                    <span className="details">Origin</span>
                                    <input type="text" placeholder="Enter your Origin" required onChange={(e) => {
                                        setOrigin(e.target.value || "")
                                    }}></input>
                                </div>
                                <div className="input-box">
                                    <span className="details">Destination</span>
                                    <input type="text" placeholder="Enter your Destination" required onChange={(e) => {
                                        setDestination(e.target.value || "")
                                    }}></input>
                                </div>
                                <div className="input-box">
                                    <span className="details">Departure Time</span>
                                    <input type="text" placeholder="Enter time in 24hr format" required onChange={(e) => {
                                        setDepartureTime(e.target.value || "")
                                    }}></input>
                                </div>
                                <div className="input-box">
                                    <span className="details">Seats Available</span>
                                    <input type="number" placeholder="Choose Seats Available" required onChange={(e) => {
                                        setSeats(e.target.value || "")
                                    }}></input>
                                </div>
                                <div className="input-box">
                                    <span className="details">Fare</span>
                                    <input type="text" min="0" step="any" placeholder="Enter your Number" required onChange={(e) => {
                                        setFare(e.target.value || "")
                                    }}></input>
                                </div>

                            </div>

                            <div className="button">
                                <input type="submit" onClick={book_} value="Search"></input>
                            </div>
                        </form>
                    </div>
                    <div>
                    <h1>Matching Rides</h1>
                    {ridematch.length > 0 ? (
                        ridematch.map((ride) => (
                        <div>
                            <div className={styles.card}>
                            <h2>{ride.origin} to {ride.destination}</h2>
                            <p>Departure Time: {ride.departuretime}</p>
                            <p>Seats Available: {ride.seats}</p>
                            <button className={styles.btn}>Book Ride</button>
                            </div>
                        </div>
                        ))
                    ) : (
                        <p>No matching ride found.</p>
                    )}
                    </div>
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