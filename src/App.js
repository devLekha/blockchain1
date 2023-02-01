
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { contract_abi } from './contract_abi';

function App() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  const [account, setAccount] = useState('')
  const [signer, setSigner] = useState('')
  const [contract, setContract] = useState('')
  const [TokenName, setTokenName] = useState('')
  const [TokenSymbol, setTokenSymbol] = useState('')
  const [Receiver, setReceiver] = useState('')
  const [Amount, setAmount] = useState('')
  const [Decimal, setDecimal] = useState(0)

  const isMetamaskInstalled = () => {
    return ethereum && ethereum.isMetaMask;
  }
  const connectWallet = async () => {
    if (!isMetamaskInstalled()) {
      console.log("MetaMask is not installed :(");
    } else {
      console.log("MetaMask is installed Hurray!!!!!");
      setAccount(await ethereum.request({ method: "eth_requestAccounts" }));
      updateContract()
    }
  }

  const updateContract = async () => {
    const tempSigner = provider.getSigner();
    const tempContract = new ethers.Contract('0x68c443c9F99ddDdB971D517B9e8B6e33CD95f0f2', contract_abi, tempSigner);
    setSigner(tempSigner)
    setContract(tempContract)
  }
  const TokenInfo = async () => {
    let nameOfToken = await contract.name();
    let symbolOfToken = await contract.symbol();
    let decimalsOfToken = await contract.decimals();
    setTokenName(nameOfToken)
    setTokenSymbol(symbolOfToken)
    setDecimal(decimalsOfToken)
  }
  const sendToken = async () => {
    let tokens = ethers.utils.parseUnits(Amount, 18)
    contract.transfer(Receiver, tokens).then((transferResult) => {
      console.dir(transferResult)
      alert("wait for a moment for your transaction to complete");
    })
  }

  useEffect(() => {
    updateContract()
  }, [])
  return (
    <div className="App">
      <Header />
      <div className='home'>
        <h4>To transfer tokens first connect your wallet:</h4>
        <div>
          <button className="block-button" onClick={() => connectWallet()}>Connect Wallet</button>
        </div>
        <p>{account}</p>
        <h4>Click here to get the Token information:</h4>
        <button className="block-button" onClick={() => TokenInfo()}>Token Info</button>
        <p>Token Name: {TokenName}</p>
        <p>Token Symbol: {TokenSymbol}</p>
        <p>Token Decimal: {Decimal}</p>
        <h4>Enter the receiver's address and amount to transfer token:</h4>
        <input type="text" placeholder='address' onChange={(evt) => { setReceiver(evt.target.value); }} name="receiver" />
        <input type="number" placeholder='amount' onChange={(evt) => { setAmount(evt.target.value); }} name="amount" />
        <div>
          <button className="block-button" onClick={() => sendToken()}>Transfer Token</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
