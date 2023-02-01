
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
// import Home from './components/home';
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
        // prompt the user to install it
        console.log("MetaMask is not installed :(");
        // connectButton.value = "Click here to install metamask";
        // connectButton.onclick = installMetaMask;
    } else {
        console.log("MetaMask is installed Hurray!!!!!");
        setAccount(await ethereum.request({ method: "eth_requestAccounts" }));
        updateContract()
        // connectButton.onclick = connectMetaMask;
    }
}

  const updateContract = async ()=>{
    const tempSigner =  provider.getSigner();
    const tempContract =  new ethers.Contract('0x68c443c9F99ddDdB971D517B9e8B6e33CD95f0f2', contract_abi, tempSigner);
    setSigner(tempSigner)
    setContract(tempContract) 
  }
  const TokenInfo = async ()=>{
    let nameOfToken = await contract.name();
     let symbolOfToken = await contract.symbol();
     let totalSupplyOfToken = await contract.totalSupply();
     let decimalsOfToken = await contract.decimals();
      setTokenName(nameOfToken)
      setTokenSymbol(symbolOfToken)
      // setTotalSupply(totalSupplyOfToken)
      setDecimal(decimalsOfToken)
     
      // console.log(".....................", nameOfToken)
  }
  const sendToken = async ()=>{
    // const tokens = Amount * 10 ** Decimal
    let tokens = ethers.utils.parseUnits(Amount, 18)
    contract.transfer(Receiver, tokens).then((transferResult) => {
      console.dir(transferResult)
      alert("sent token");
    })
  }
  // console.log(TokenName)
  useEffect(()=>{
    updateContract()
  }, [])
  return (
    <div className="App">
     <Header/>
     <div>
        <button className="block-button" onClick={()=>connectWallet()}>Connect Wallet</button>
    </div>
    <p>{account}</p>
    <button className="block-button" onClick={()=> TokenInfo()}>Token Info</button>
   <p>Token Name: {TokenName}</p>
   <p>Token Symbol: {TokenSymbol}</p>
   {/* <p>Token TotalSupply: {TotalSupply}</p> */}
   <p>Token Decimal: {Decimal}</p>
   <button className="block-button" onClick={()=> sendToken()}>Token Transfer</button>
   <input type="text" placeholder='address' onChange={(evt) => { setReceiver(evt.target.value); }} name="receiver" />
   <input type="number" placeholder='amount' onChange={(evt) => { setAmount(evt.target.value); }} name="amount"/>
     <Footer/>
    </div>
  );
}

export default App;
