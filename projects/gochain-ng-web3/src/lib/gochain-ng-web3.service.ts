/*CORE*/
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {catchError, map, tap} from 'rxjs/operators';
/*WEB3*/
import Web3 from 'web3';
import {Account} from 'web3-eth-accounts';
import {SignedTransaction, TransactionReceipt} from 'web3-core';

class InitConfig {
  rpcUrl: string;
}

interface IGochainWeb3Service {
  initialize(config: InitConfig);

  initializePlugin();

  activatePlugin();

  getPluginAccountAddress();

  createAccount();

  /*openAccount(privateKey: string);*/

  closeAccount();

  /*getBalance();*/
}

@Injectable({
  providedIn: 'root'
})
export class GochainNgWeb3Service implements IGochainWeb3Service {
  private _metamaskInstalled: boolean;
  private _metamaskConfigured: boolean;
  private _metamaskActivated: boolean;
  private _config: InitConfig;
  private _gochainNetId: number;

  set metamaskInstalled(value: boolean) {
    this._metamaskInstalled = value;
    this.metamaskInstalled$.next(value);
  }

  set metamaskConfigured(value: boolean) {
    this._metamaskConfigured = value;
    this.metamaskConfigured$.next(value);
  }

  set metamaskActivated(value: boolean) {
    this._metamaskActivated = value;
    this.metamaskActivated$.next(value);
  }

  metamaskInstalled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  metamaskConfigured$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  metamaskActivated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  ready$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  accountBalance: string;
  gochainWeb3: Web3;
  pluginWeb3: Web3;
  accountAddress: string;
  account: Account;

  get web3(): Web3 {
    if (this._metamaskConfigured && this._metamaskInstalled) {
      return this.pluginWeb3;
    }
    return this.gochainWeb3;
  }

  constructor() {
  }

  initialize(config: InitConfig): Observable<boolean> {
    this._config = config;
    if (!config.rpcUrl) {
      return throwError('rpc url hasn\'t been provided');
    }
    this.gochainWeb3 = new Web3(new Web3.providers.HttpProvider(config.rpcUrl), null, {transactionConfirmationBlocks: 1});

    return fromPromise(this.web3.eth.net.getId()).pipe(
      catchError((e: Error) => {
        return throwError('Can\'t get GoChain network id');
      }),
      map(v => !!v),
    );
  }

  initializePlugin(): Observable<any> {
    if (!this.gochainWeb3) {
      return throwError('initialize first');
    }
    if (!this._gochainNetId) {
      return throwError('gochain network id is not provided');
    }

    this.pluginWeb3 = new Web3(Web3.givenProvider, null, {transactionConfirmationBlocks: 1});

    if (!this.pluginWeb3.currentProvider) {
      this.metamaskInstalled = false;
      this.metamaskConfigured = false;
      return throwError('metamask is not installed');
    }

    return fromPromise(this.pluginWeb3.eth.net.getId()).pipe(
      catchError((e: Error) => {
        this.metamaskInstalled = true;
        this.metamaskConfigured = false;
        return throwError('Metamask installed but not configured properly - can\'t get network id from Metamask');
      }),
      map((metamaskNetID: number) => {
        if (this._gochainNetId !== metamaskNetID) {
          this.metamaskInstalled = true;
          this.metamaskConfigured = false;
          return throwError(`Metamask installed but misconfigured - network ID mismatch (must use GoChain ${this._gochainNetId} - e.g. by pointing to ${this._config.rpcUrl})`);
        }
        this.metamaskInstalled = true;
        this.metamaskConfigured = true;
        this.getPluginAccountAddress();
        return true;
      }),
    );
  }

  activatePlugin(): Observable<any> {
    return fromPromise((window as any).ethereum.enable()).pipe(
      catchError((e) => {
        this.metamaskActivated = false;
        return throwError('Access haven\'t been granted');
      }),
      tap(() => {
        this.metamaskActivated = true;
      }),
    );
  }

  getPluginAccountAddress(): void {
    fromPromise(this.pluginWeb3.eth.getAccounts()).subscribe((accounts: string[]) => {
      this.accountAddress = accounts[0];
    });
  }

  createAccount() {
    return !!this.web3 ? this.web3.eth.accounts.create() : null;
  }

  /*protected _openAccount(privateKey: string) {
    if (privateKey.length === 64 && privateKey.indexOf('0x') !== 0) {
      privateKey = '0x' + privateKey;
    }
    if (privateKey.length !== 66) {
      throw Error('Given private key is not valid');
    }
    try {
      this.account = this.gochainWeb3.eth.accounts.privateKeyToAccount(privateKey);
    } catch (e) {
      throw e;
    }
    return this.account;
  }*/

  closeAccount() {
    this.account = null;
    this.accountAddress = null;
    this.accountBalance = null;
  }

  /*getBalance() {
    return fromPromise(this.gochainWeb3.eth.getBalance(this.account.address)).pipe(
      map((balance: string) => {
        this.accountBalance = this.gochainWeb3.utils.fromWei(balance, 'ether').toString();
        return this.accountBalance;
      }),
    );
  }*/

  sendSignedTx(signed: SignedTransaction): Observable<TransactionReceipt> {
    return fromPromise(this.gochainWeb3.eth.sendSignedTransaction(signed.rawTransaction));
  }

  isAddress(address: string) {
    return this.gochainWeb3.utils.isAddress(address);
  }
}
