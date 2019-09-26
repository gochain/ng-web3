import { Injectable, ɵɵdefineInjectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map, tap } from 'rxjs/operators';
import Web3 from 'web3';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var InitConfig = /** @class */ (function () {
    function InitConfig() {
    }
    return InitConfig;
}());
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
var GochainNgWeb3Service = /** @class */ (function () {
    function GochainNgWeb3Service() {
        this.metamaskInstalled$ = new BehaviorSubject(null);
        this.metamaskConfigured$ = new BehaviorSubject(null);
        this.metamaskActivated$ = new BehaviorSubject(null);
        this.ready$ = new BehaviorSubject(null);
    }
    Object.defineProperty(GochainNgWeb3Service.prototype, "metamaskInstalled", {
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._metamaskInstalled = value;
            this.metamaskInstalled$.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GochainNgWeb3Service.prototype, "metamaskConfigured", {
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._metamaskConfigured = value;
            this.metamaskConfigured$.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GochainNgWeb3Service.prototype, "metamaskActivated", {
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._metamaskActivated = value;
            this.metamaskActivated$.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GochainNgWeb3Service.prototype, "web3", {
        get: /**
         * @return {?}
         */
        function () {
            if (this._metamaskConfigured && this._metamaskInstalled) {
                return this.pluginWeb3;
            }
            return this.gochainWeb3;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} config
     * @return {?}
     */
    GochainNgWeb3Service.prototype.initialize = /**
     * @param {?} config
     * @return {?}
     */
    function (config) {
        this._config = config;
        if (!config.rpcUrl) {
            return throwError('rpc url hasn\'t been provided');
        }
        this.gochainWeb3 = new Web3(new Web3.providers.HttpProvider(config.rpcUrl), null, { transactionConfirmationBlocks: 1 });
        return fromPromise(this.gochainWeb3.eth.net.getId()).pipe(catchError((/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            return throwError('Can\'t get GoChain network id');
        })), map((/**
         * @param {?} v
         * @return {?}
         */
        function (v) { return !!v; })));
    };
    /**
     * @return {?}
     */
    GochainNgWeb3Service.prototype.initializePlugin = /**
     * @return {?}
     */
    function () {
        var _this = this;
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
        function (e) {
            _this.metamaskInstalled = true;
            _this.metamaskConfigured = false;
            return throwError('Metamask installed but not configured properly - can\'t get network id from Metamask');
        })), map((/**
         * @param {?} metamaskNetID
         * @return {?}
         */
        function (metamaskNetID) {
            if (_this._gochainNetId !== metamaskNetID) {
                _this.metamaskInstalled = true;
                _this.metamaskConfigured = false;
                return throwError("Metamask installed but misconfigured - network ID mismatch (must use GoChain " + _this._gochainNetId + " - e.g. by pointing to " + _this._config.rpcUrl + ")");
            }
            _this.metamaskInstalled = true;
            _this.metamaskConfigured = true;
            _this.getPluginAccountAddress();
            return true;
        })));
    };
    /**
     * @return {?}
     */
    GochainNgWeb3Service.prototype.activatePlugin = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return fromPromise(((/** @type {?} */ (window))).ethereum.enable()).pipe(catchError((/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            _this.metamaskActivated = false;
            return throwError('Access haven\'t been granted');
        })), tap((/**
         * @return {?}
         */
        function () {
            _this.metamaskActivated = true;
        })));
    };
    /**
     * @return {?}
     */
    GochainNgWeb3Service.prototype.getPluginAccountAddress = /**
     * @return {?}
     */
    function () {
        var _this = this;
        fromPromise(this.pluginWeb3.eth.getAccounts()).subscribe((/**
         * @param {?} accounts
         * @return {?}
         */
        function (accounts) {
            _this.accountAddress = accounts[0];
        }));
    };
    /**
     * @return {?}
     */
    GochainNgWeb3Service.prototype.createAccount = /**
     * @return {?}
     */
    function () {
        return !!this.web3 ? this.web3.eth.accounts.create() : null;
    };
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
    GochainNgWeb3Service.prototype.closeAccount = /*protected _openAccount(privateKey: string) {
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
    function () {
        this.account = null;
        this.accountAddress = null;
        this.accountBalance = null;
    };
    /*getBalance() {
      return fromPromise(this.gochainWeb3.eth.getBalance(this.account.address)).pipe(
        map((balance: string) => {
          this.accountBalance = this.gochainWeb3.utils.fromWei(balance, 'ether').toString();
          return this.accountBalance;
        }),
      );
    }*/
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
    GochainNgWeb3Service.prototype.sendSignedTx = /*getBalance() {
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
    function (signed) {
        return fromPromise(this.gochainWeb3.eth.sendSignedTransaction(signed.rawTransaction));
    };
    /**
     * @param {?} address
     * @return {?}
     */
    GochainNgWeb3Service.prototype.isAddress = /**
     * @param {?} address
     * @return {?}
     */
    function (address) {
        return this.gochainWeb3.utils.isAddress(address);
    };
    GochainNgWeb3Service.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    GochainNgWeb3Service.ctorParameters = function () { return []; };
    /** @nocollapse */ GochainNgWeb3Service.ngInjectableDef = ɵɵdefineInjectable({ factory: function GochainNgWeb3Service_Factory() { return new GochainNgWeb3Service(); }, token: GochainNgWeb3Service, providedIn: "root" });
    return GochainNgWeb3Service;
}());
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { GochainNgWeb3Service };
//# sourceMappingURL=gochain-ng-web3.js.map
