import { BehaviorSubject, Observable } from 'rxjs';
import Web3 from 'web3';
import { Account } from 'web3-eth-accounts';
import { SignedTransaction, TransactionReceipt } from 'web3-core';
declare class InitConfig {
    rpcUrl: string;
}
interface IGochainWeb3Service {
    initialize(config: InitConfig): any;
    initializePlugin(): any;
    activatePlugin(): any;
    getPluginAccountAddress(): any;
    createAccount(): any;
    closeAccount(): any;
}
export declare class GochainNgWeb3Service implements IGochainWeb3Service {
    private _metamaskInstalled;
    private _metamaskConfigured;
    private _metamaskActivated;
    private _config;
    private _gochainNetId;
    metamaskInstalled: boolean;
    metamaskConfigured: boolean;
    metamaskActivated: boolean;
    metamaskInstalled$: BehaviorSubject<boolean>;
    metamaskConfigured$: BehaviorSubject<boolean>;
    metamaskActivated$: BehaviorSubject<boolean>;
    ready$: BehaviorSubject<boolean>;
    accountBalance: string;
    gochainWeb3: Web3;
    pluginWeb3: Web3;
    accountAddress: string;
    account: Account;
    readonly web3: Web3;
    constructor();
    initialize(config: InitConfig): Observable<boolean>;
    initializePlugin(): Observable<any>;
    activatePlugin(): Observable<any>;
    getPluginAccountAddress(): void;
    createAccount(): Account;
    closeAccount(): void;
    sendSignedTx(signed: SignedTransaction): Observable<TransactionReceipt>;
    isAddress(address: string): boolean;
}
export {};
