/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*CORE*/
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map, tap } from 'rxjs/operators';
/*WEB3*/
import Web3 from 'web3';
import * as i0 from "@angular/core";
class InitConfig {
}
if (false) {
    /** @type {?} */
    InitConfig.prototype.rpcUrl;
}
/**
 * @record
 */
function IGochainWeb3Service() { }
if (false) {
    /**
     * @param {?} config
     * @return {?}
     */
    IGochainWeb3Service.prototype.initialize = function (config) { };
    /**
     * @return {?}
     */
    IGochainWeb3Service.prototype.initializePlugin = function () { };
    /**
     * @return {?}
     */
    IGochainWeb3Service.prototype.activatePlugin = function () { };
    /**
     * @return {?}
     */
    IGochainWeb3Service.prototype.getPluginAccountAddress = function () { };
    /**
     * @return {?}
     */
    IGochainWeb3Service.prototype.createAccount = function () { };
    /**
     * @return {?}
     */
    IGochainWeb3Service.prototype.closeAccount = function () { };
}
export class GochainNgWeb3Service {
    constructor() {
        this.metamaskInstalled$ = new BehaviorSubject(null);
        this.metamaskConfigured$ = new BehaviorSubject(null);
        this.metamaskActivated$ = new BehaviorSubject(null);
        this.ready$ = new BehaviorSubject(null);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set metamaskInstalled(value) {
        this._metamaskInstalled = value;
        this.metamaskInstalled$.next(value);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set metamaskConfigured(value) {
        this._metamaskConfigured = value;
        this.metamaskConfigured$.next(value);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set metamaskActivated(value) {
        this._metamaskActivated = value;
        this.metamaskActivated$.next(value);
    }
    /**
     * @return {?}
     */
    get web3() {
        if (this._metamaskConfigured && this._metamaskInstalled) {
            return this.pluginWeb3;
        }
        return this.gochainWeb3;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    initialize(config) {
        this._config = config;
        if (!config.rpcUrl) {
            return throwError('rpc url hasn\'t been provided');
        }
        this.gochainWeb3 = new Web3(new Web3.providers.HttpProvider(config.rpcUrl), null, { transactionConfirmationBlocks: 1 });
        return fromPromise(this.gochainWeb3.eth.net.getId()).pipe(catchError((/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            return throwError('Can\'t get GoChain network id');
        })), map((/**
         * @param {?} v
         * @return {?}
         */
        v => !!v)));
    }
    /**
     * @return {?}
     */
    initializePlugin() {
        if (!this.gochainWeb3) {
            return throwError('initialize first');
        }
        if (!this._gochainNetId) {
            return throwError('gochain network id is not provided');
        }
        this.pluginWeb3 = new Web3(Web3.givenProvider, null, { transactionConfirmationBlocks: 1 });
        if (!this.pluginWeb3.currentProvider) {
            this.metamaskInstalled = false;
            this.metamaskConfigured = false;
            return throwError('metamask is not installed');
        }
        return fromPromise(this.pluginWeb3.eth.net.getId()).pipe(catchError((/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            this.metamaskInstalled = true;
            this.metamaskConfigured = false;
            return throwError('Metamask installed but not configured properly - can\'t get network id from Metamask');
        })), map((/**
         * @param {?} metamaskNetID
         * @return {?}
         */
        (metamaskNetID) => {
            if (this._gochainNetId !== metamaskNetID) {
                this.metamaskInstalled = true;
                this.metamaskConfigured = false;
                return throwError(`Metamask installed but misconfigured - network ID mismatch (must use GoChain ${this._gochainNetId} - e.g. by pointing to ${this._config.rpcUrl})`);
            }
            this.metamaskInstalled = true;
            this.metamaskConfigured = true;
            this.getPluginAccountAddress();
            return true;
        })));
    }
    /**
     * @return {?}
     */
    activatePlugin() {
        return fromPromise(((/** @type {?} */ (window))).ethereum.enable()).pipe(catchError((/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            this.metamaskActivated = false;
            return throwError('Access haven\'t been granted');
        })), tap((/**
         * @return {?}
         */
        () => {
            this.metamaskActivated = true;
        })));
    }
    /**
     * @return {?}
     */
    getPluginAccountAddress() {
        fromPromise(this.pluginWeb3.eth.getAccounts()).subscribe((/**
         * @param {?} accounts
         * @return {?}
         */
        (accounts) => {
            this.accountAddress = accounts[0];
        }));
    }
    /**
     * @return {?}
     */
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
    /**
     * @return {?}
     */
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
    /**
     * @param {?} signed
     * @return {?}
     */
    sendSignedTx(signed) {
        return fromPromise(this.gochainWeb3.eth.sendSignedTransaction(signed.rawTransaction));
    }
    /**
     * @param {?} address
     * @return {?}
     */
    isAddress(address) {
        return this.gochainWeb3.utils.isAddress(address);
    }
}
GochainNgWeb3Service.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
GochainNgWeb3Service.ctorParameters = () => [];
/** @nocollapse */ GochainNgWeb3Service.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function GochainNgWeb3Service_Factory() { return new GochainNgWeb3Service(); }, token: GochainNgWeb3Service, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    GochainNgWeb3Service.prototype._metamaskInstalled;
    /**
     * @type {?}
     * @private
     */
    GochainNgWeb3Service.prototype._metamaskConfigured;
    /**
     * @type {?}
     * @private
     */
    GochainNgWeb3Service.prototype._metamaskActivated;
    /**
     * @type {?}
     * @private
     */
    GochainNgWeb3Service.prototype._config;
    /**
     * @type {?}
     * @private
     */
    GochainNgWeb3Service.prototype._gochainNetId;
    /** @type {?} */
    GochainNgWeb3Service.prototype.metamaskInstalled$;
    /** @type {?} */
    GochainNgWeb3Service.prototype.metamaskConfigured$;
    /** @type {?} */
    GochainNgWeb3Service.prototype.metamaskActivated$;
    /** @type {?} */
    GochainNgWeb3Service.prototype.ready$;
    /** @type {?} */
    GochainNgWeb3Service.prototype.accountBalance;
    /** @type {?} */
    GochainNgWeb3Service.prototype.gochainWeb3;
    /** @type {?} */
    GochainNgWeb3Service.prototype.pluginWeb3;
    /** @type {?} */
    GochainNgWeb3Service.prototype.accountAddress;
    /** @type {?} */
    GochainNgWeb3Service.prototype.account;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29jaGFpbi1uZy13ZWIzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9nb2NoYWluLW5nLXdlYjMvIiwic291cmNlcyI6WyJsaWIvZ29jaGFpbi1uZy13ZWIzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQWMsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFcEQsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDOztBQUl4QixNQUFNLFVBQVU7Q0FFZjs7O0lBREMsNEJBQWU7Ozs7O0FBR2pCLGtDQWdCQzs7Ozs7O0lBZkMsaUVBQStCOzs7O0lBRS9CLGlFQUFtQjs7OztJQUVuQiwrREFBaUI7Ozs7SUFFakIsd0VBQTBCOzs7O0lBRTFCLDhEQUFnQjs7OztJQUloQiw2REFBZTs7QUFRakIsTUFBTSxPQUFPLG9CQUFvQjtJQXVDL0I7UUFqQkEsdUJBQWtCLEdBQTZCLElBQUksZUFBZSxDQUFVLElBQUksQ0FBQyxDQUFDO1FBQ2xGLHdCQUFtQixHQUE2QixJQUFJLGVBQWUsQ0FBVSxJQUFJLENBQUMsQ0FBQztRQUNuRix1QkFBa0IsR0FBNkIsSUFBSSxlQUFlLENBQVUsSUFBSSxDQUFDLENBQUM7UUFDbEYsV0FBTSxHQUE2QixJQUFJLGVBQWUsQ0FBVSxJQUFJLENBQUMsQ0FBQztJQWV0RSxDQUFDOzs7OztJQWpDRCxJQUFJLGlCQUFpQixDQUFDLEtBQWM7UUFDbEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztRQUNoQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RD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Q0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUM5RCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQkQsWUFBWTtRQUNWLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0lBQzdCLENBQUM7Ozs7Ozs7Ozs7Ozs7SUFXRCxZQUFZLENBQUMsTUFBeUI7UUFDcEMsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDeEYsQ0FBQzs7Ozs7SUFFRCxTQUFTLENBQUMsT0FBZTtRQUN2QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuRCxDQUFDOzs7WUExSkYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7Ozs7Ozs7O0lBRUMsa0RBQW9DOzs7OztJQUNwQyxtREFBcUM7Ozs7O0lBQ3JDLGtEQUFvQzs7Ozs7SUFDcEMsdUNBQTRCOzs7OztJQUM1Qiw2Q0FBOEI7O0lBaUI5QixrREFBa0Y7O0lBQ2xGLG1EQUFtRjs7SUFDbkYsa0RBQWtGOztJQUNsRixzQ0FBc0U7O0lBQ3RFLDhDQUF1Qjs7SUFDdkIsMkNBQWtCOztJQUNsQiwwQ0FBaUI7O0lBQ2pCLDhDQUF1Qjs7SUFDdkIsdUNBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLypDT1JFKi9cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgdGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2Zyb21Qcm9taXNlfSBmcm9tICdyeGpzL2ludGVybmFsLWNvbXBhdGliaWxpdHknO1xuaW1wb3J0IHtjYXRjaEVycm9yLCBtYXAsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuLypXRUIzKi9cbmltcG9ydCBXZWIzIGZyb20gJ3dlYjMnO1xuaW1wb3J0IHtBY2NvdW50fSBmcm9tICd3ZWIzLWV0aC1hY2NvdW50cyc7XG5pbXBvcnQge1NpZ25lZFRyYW5zYWN0aW9uLCBUcmFuc2FjdGlvblJlY2VpcHR9IGZyb20gJ3dlYjMtY29yZSc7XG5cbmNsYXNzIEluaXRDb25maWcge1xuICBycGNVcmw6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIElHb2NoYWluV2ViM1NlcnZpY2Uge1xuICBpbml0aWFsaXplKGNvbmZpZzogSW5pdENvbmZpZyk7XG5cbiAgaW5pdGlhbGl6ZVBsdWdpbigpO1xuXG4gIGFjdGl2YXRlUGx1Z2luKCk7XG5cbiAgZ2V0UGx1Z2luQWNjb3VudEFkZHJlc3MoKTtcblxuICBjcmVhdGVBY2NvdW50KCk7XG5cbiAgLypvcGVuQWNjb3VudChwcml2YXRlS2V5OiBzdHJpbmcpOyovXG5cbiAgY2xvc2VBY2NvdW50KCk7XG5cbiAgLypnZXRCYWxhbmNlKCk7Ki9cbn1cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgR29jaGFpbk5nV2ViM1NlcnZpY2UgaW1wbGVtZW50cyBJR29jaGFpbldlYjNTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfbWV0YW1hc2tJbnN0YWxsZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX21ldGFtYXNrQ29uZmlndXJlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfbWV0YW1hc2tBY3RpdmF0ZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX2NvbmZpZzogSW5pdENvbmZpZztcbiAgcHJpdmF0ZSBfZ29jaGFpbk5ldElkOiBudW1iZXI7XG5cbiAgc2V0IG1ldGFtYXNrSW5zdGFsbGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbWV0YW1hc2tJbnN0YWxsZWQgPSB2YWx1ZTtcbiAgICB0aGlzLm1ldGFtYXNrSW5zdGFsbGVkJC5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIHNldCBtZXRhbWFza0NvbmZpZ3VyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9tZXRhbWFza0NvbmZpZ3VyZWQgPSB2YWx1ZTtcbiAgICB0aGlzLm1ldGFtYXNrQ29uZmlndXJlZCQubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBzZXQgbWV0YW1hc2tBY3RpdmF0ZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9tZXRhbWFza0FjdGl2YXRlZCA9IHZhbHVlO1xuICAgIHRoaXMubWV0YW1hc2tBY3RpdmF0ZWQkLm5leHQodmFsdWUpO1xuICB9XG5cbiAgbWV0YW1hc2tJbnN0YWxsZWQkOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KG51bGwpO1xuICBtZXRhbWFza0NvbmZpZ3VyZWQkOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KG51bGwpO1xuICBtZXRhbWFza0FjdGl2YXRlZCQ6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4obnVsbCk7XG4gIHJlYWR5JDogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihudWxsKTtcbiAgYWNjb3VudEJhbGFuY2U6IHN0cmluZztcbiAgZ29jaGFpbldlYjM6IFdlYjM7XG4gIHBsdWdpbldlYjM6IFdlYjM7XG4gIGFjY291bnRBZGRyZXNzOiBzdHJpbmc7XG4gIGFjY291bnQ6IEFjY291bnQ7XG5cbiAgZ2V0IHdlYjMoKTogV2ViMyB7XG4gICAgaWYgKHRoaXMuX21ldGFtYXNrQ29uZmlndXJlZCAmJiB0aGlzLl9tZXRhbWFza0luc3RhbGxlZCkge1xuICAgICAgcmV0dXJuIHRoaXMucGx1Z2luV2ViMztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ29jaGFpbldlYjM7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIGluaXRpYWxpemUoY29uZmlnOiBJbml0Q29uZmlnKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xuICAgIGlmICghY29uZmlnLnJwY1VybCkge1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoJ3JwYyB1cmwgaGFzblxcJ3QgYmVlbiBwcm92aWRlZCcpO1xuICAgIH1cbiAgICB0aGlzLmdvY2hhaW5XZWIzID0gbmV3IFdlYjMobmV3IFdlYjMucHJvdmlkZXJzLkh0dHBQcm92aWRlcihjb25maWcucnBjVXJsKSwgbnVsbCwge3RyYW5zYWN0aW9uQ29uZmlybWF0aW9uQmxvY2tzOiAxfSk7XG5cbiAgICByZXR1cm4gZnJvbVByb21pc2UodGhpcy5nb2NoYWluV2ViMy5ldGgubmV0LmdldElkKCkpLnBpcGUoXG4gICAgICBjYXRjaEVycm9yKChlOiBFcnJvcikgPT4ge1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcignQ2FuXFwndCBnZXQgR29DaGFpbiBuZXR3b3JrIGlkJyk7XG4gICAgICB9KSxcbiAgICAgIG1hcCh2ID0+ICEhdiksXG4gICAgKTtcbiAgfVxuXG4gIGluaXRpYWxpemVQbHVnaW4oKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAoIXRoaXMuZ29jaGFpbldlYjMpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdpbml0aWFsaXplIGZpcnN0Jyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fZ29jaGFpbk5ldElkKSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcignZ29jaGFpbiBuZXR3b3JrIGlkIGlzIG5vdCBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIHRoaXMucGx1Z2luV2ViMyA9IG5ldyBXZWIzKFdlYjMuZ2l2ZW5Qcm92aWRlciwgbnVsbCwge3RyYW5zYWN0aW9uQ29uZmlybWF0aW9uQmxvY2tzOiAxfSk7XG5cbiAgICBpZiAoIXRoaXMucGx1Z2luV2ViMy5jdXJyZW50UHJvdmlkZXIpIHtcbiAgICAgIHRoaXMubWV0YW1hc2tJbnN0YWxsZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMubWV0YW1hc2tDb25maWd1cmVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcignbWV0YW1hc2sgaXMgbm90IGluc3RhbGxlZCcpO1xuICAgIH1cblxuICAgIHJldHVybiBmcm9tUHJvbWlzZSh0aGlzLnBsdWdpbldlYjMuZXRoLm5ldC5nZXRJZCgpKS5waXBlKFxuICAgICAgY2F0Y2hFcnJvcigoZTogRXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5tZXRhbWFza0luc3RhbGxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubWV0YW1hc2tDb25maWd1cmVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdNZXRhbWFzayBpbnN0YWxsZWQgYnV0IG5vdCBjb25maWd1cmVkIHByb3Blcmx5IC0gY2FuXFwndCBnZXQgbmV0d29yayBpZCBmcm9tIE1ldGFtYXNrJyk7XG4gICAgICB9KSxcbiAgICAgIG1hcCgobWV0YW1hc2tOZXRJRDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9nb2NoYWluTmV0SWQgIT09IG1ldGFtYXNrTmV0SUQpIHtcbiAgICAgICAgICB0aGlzLm1ldGFtYXNrSW5zdGFsbGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLm1ldGFtYXNrQ29uZmlndXJlZCA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGBNZXRhbWFzayBpbnN0YWxsZWQgYnV0IG1pc2NvbmZpZ3VyZWQgLSBuZXR3b3JrIElEIG1pc21hdGNoIChtdXN0IHVzZSBHb0NoYWluICR7dGhpcy5fZ29jaGFpbk5ldElkfSAtIGUuZy4gYnkgcG9pbnRpbmcgdG8gJHt0aGlzLl9jb25maWcucnBjVXJsfSlgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1ldGFtYXNrSW5zdGFsbGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tZXRhbWFza0NvbmZpZ3VyZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmdldFBsdWdpbkFjY291bnRBZGRyZXNzKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIGFjdGl2YXRlUGx1Z2luKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIGZyb21Qcm9taXNlKCh3aW5kb3cgYXMgYW55KS5ldGhlcmV1bS5lbmFibGUoKSkucGlwZShcbiAgICAgIGNhdGNoRXJyb3IoKGUpID0+IHtcbiAgICAgICAgdGhpcy5tZXRhbWFza0FjdGl2YXRlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcignQWNjZXNzIGhhdmVuXFwndCBiZWVuIGdyYW50ZWQnKTtcbiAgICAgIH0pLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgdGhpcy5tZXRhbWFza0FjdGl2YXRlZCA9IHRydWU7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgZ2V0UGx1Z2luQWNjb3VudEFkZHJlc3MoKTogdm9pZCB7XG4gICAgZnJvbVByb21pc2UodGhpcy5wbHVnaW5XZWIzLmV0aC5nZXRBY2NvdW50cygpKS5zdWJzY3JpYmUoKGFjY291bnRzOiBzdHJpbmdbXSkgPT4ge1xuICAgICAgdGhpcy5hY2NvdW50QWRkcmVzcyA9IGFjY291bnRzWzBdO1xuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlQWNjb3VudCgpIHtcbiAgICByZXR1cm4gISF0aGlzLndlYjMgPyB0aGlzLndlYjMuZXRoLmFjY291bnRzLmNyZWF0ZSgpIDogbnVsbDtcbiAgfVxuXG4gIC8qcHJvdGVjdGVkIF9vcGVuQWNjb3VudChwcml2YXRlS2V5OiBzdHJpbmcpIHtcbiAgICBpZiAocHJpdmF0ZUtleS5sZW5ndGggPT09IDY0ICYmIHByaXZhdGVLZXkuaW5kZXhPZignMHgnKSAhPT0gMCkge1xuICAgICAgcHJpdmF0ZUtleSA9ICcweCcgKyBwcml2YXRlS2V5O1xuICAgIH1cbiAgICBpZiAocHJpdmF0ZUtleS5sZW5ndGggIT09IDY2KSB7XG4gICAgICB0aHJvdyBFcnJvcignR2l2ZW4gcHJpdmF0ZSBrZXkgaXMgbm90IHZhbGlkJyk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmFjY291bnQgPSB0aGlzLmdvY2hhaW5XZWIzLmV0aC5hY2NvdW50cy5wcml2YXRlS2V5VG9BY2NvdW50KHByaXZhdGVLZXkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFjY291bnQ7XG4gIH0qL1xuXG4gIGNsb3NlQWNjb3VudCgpIHtcbiAgICB0aGlzLmFjY291bnQgPSBudWxsO1xuICAgIHRoaXMuYWNjb3VudEFkZHJlc3MgPSBudWxsO1xuICAgIHRoaXMuYWNjb3VudEJhbGFuY2UgPSBudWxsO1xuICB9XG5cbiAgLypnZXRCYWxhbmNlKCkge1xuICAgIHJldHVybiBmcm9tUHJvbWlzZSh0aGlzLmdvY2hhaW5XZWIzLmV0aC5nZXRCYWxhbmNlKHRoaXMuYWNjb3VudC5hZGRyZXNzKSkucGlwZShcbiAgICAgIG1hcCgoYmFsYW5jZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuYWNjb3VudEJhbGFuY2UgPSB0aGlzLmdvY2hhaW5XZWIzLnV0aWxzLmZyb21XZWkoYmFsYW5jZSwgJ2V0aGVyJykudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNjb3VudEJhbGFuY2U7XG4gICAgICB9KSxcbiAgICApO1xuICB9Ki9cblxuICBzZW5kU2lnbmVkVHgoc2lnbmVkOiBTaWduZWRUcmFuc2FjdGlvbik6IE9ic2VydmFibGU8VHJhbnNhY3Rpb25SZWNlaXB0PiB7XG4gICAgcmV0dXJuIGZyb21Qcm9taXNlKHRoaXMuZ29jaGFpbldlYjMuZXRoLnNlbmRTaWduZWRUcmFuc2FjdGlvbihzaWduZWQucmF3VHJhbnNhY3Rpb24pKTtcbiAgfVxuXG4gIGlzQWRkcmVzcyhhZGRyZXNzOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5nb2NoYWluV2ViMy51dGlscy5pc0FkZHJlc3MoYWRkcmVzcyk7XG4gIH1cbn1cbiJdfQ==