// import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { useState } from 'react';
import ABI from './ABI.json';
import TokenABI from './TokenABI.json'

const bankContractAdd = '0x3Fb6aC145bb9AaCD5E0909E79F763f355d7E55c1';
const tokenContractAdd = "0x0AC86F01B1AbfDe96DE1709855424ec526A12973";
function App() {

  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [bankContract, setBankContract] = useState(0);
  const [tokenContract, setTokenContract] = useState(0);
  const [myDeposit, setMyDeposit] = useState(null);
  const [number, setNumber] = useState('');
  const [withdrawNumber, setWithdrawNumber] = useState('');
  const [to, setTo] = useState(null);
  const newNumber = (e) => {
    setNumber(e.target.value);
  }
  const newAddress = (e) => {
    setTo(e.target.value);
  }

  const getMyDeposit = async () => {
    const deposit = await bankContract.methods.myBalance().call({
      from: address,
    });
    setMyDeposit(deposit+"");
  }

  const deposit = async () => {
    let allowance = await checkAllowance();
    if (!allowance){
      await approveTokenToContract();
    }
    await bankContract.methods.deposit(number).send({
      from: address
    });
  }
  
  const withdraw = async () => {
    await bankContract.methods.withdraw(withdrawNumber).send({
      from: address
    });
  }

  const transfer = async () => {
    await bankContract.methods.bankTransfer(to, number).send({
      from: address,
    });
  };

  //授权金额
  const approveTokenToContract = async () =>{
    try {
      await tokenContract.methods.approve(bankContractAdd,1).send({
        from: address,
      })
    }catch(err){
      console.error('授权失败', err);
    }
  }

  const checkAllowance = async () => {
    try {
      // 确保 address 和 number 已经被设置
      if (!address || !number) {
        console.error('地址或数量未设置');
        return;
      }
  
      // 将 number 转换为 Wei，如果需要的话
      const value = web3.utils.toWei(number, 'ether');
  
      // 获取当前授权的代币数量
      const allowance = await tokenContract.methods.allowance(address, bankContractAdd).call();
  
      // 检查授权是否足够
      if (allowance >= value) {
        console.log('授权足够');
        return true;
      } else {
        console.log('授权不足');
        return false;
      }
    } catch (error) {
      console.error('检查授权失败', error);
    }
  };

  const connectWallet = async () => {
    // 1.获取钱包账户
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    console.log('accounts',accounts)
    setAddress(accounts[0]);

    // 2. 连接web3
    const web3 = new Web3(window.web3.currentProvider);
    setWeb3(web3);

    // 3. 获取智能合约 ABI + address
    const bankContract = new web3.eth.Contract(ABI, bankContractAdd);
    setBankContract(bankContract);

    // 4.token合约
    const tokenContract = new web3.eth.Contract(TokenABI,tokenContractAdd)
    setTokenContract(tokenContract);
  }

  const onChangeWithDrawNumber  =(val) => {
    console.log(Number(val.target.value));
    setWithdrawNumber(Number(val.target.value))
  }

  return (
    <body className='body' style={{height:'100vh'}}>
    <div className="App bg-img">
      <div className='card'>
        <h1 className='h1'>MY FIRST DAPP</h1>
        <button className='button' onClick={connectWallet}>connect wallet</button>
      <h3 className='h3'>账户地址-Address:{address}</h3>


      <section>
        <div>
          <p className='h3'>银行余额:{myDeposit} <button onClick={getMyDeposit}>查询</button> </p>
        </div>
      </section>

        <div>
        <button onClick={approveTokenToContract}>授权</button>
        </div>
      
      <section>
        <div>
        <p className='h3'>金额：<input className='input' onChange={newNumber} type='type'/>
        <button onClick={deposit}>存钱</button></p>
        </div>
      </section>
      <section>
        <div>
        <p className='h3'>金额：<input className='input' onChange={onChangeWithDrawNumber} type='type' value={withdrawNumber}/>
          <button onClick={withdraw}>取钱</button></p>
        </div>
      </section>
      <section>
        <div>
          <p className='p1'>转账地址：<input className='input' onChange={newAddress} type='type'/></p>
          <p className='p2'>转账金额：<input className='input' onChange={newNumber} type='type'/><button onClick={transfer}>转账</button></p>
        </div>
      </section>
      </div>
    </div></body>
  );
}

export default App;
