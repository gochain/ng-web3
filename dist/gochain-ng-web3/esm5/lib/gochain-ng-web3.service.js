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
    /** @nocollapse */ GochainNgWeb3Service.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function GochainNgWeb3Service_Factory() { return new GochainNgWeb3Service(); }, token: GochainNgWeb3Service, providedIn: "root" });
    return GochainNgWeb3Service;
}());
export { GochainNgWeb3Service };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29jaGFpbi1uZy13ZWIzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9nb2NoYWluLW5nLXdlYjMvIiwic291cmNlcyI6WyJsaWIvZ29jaGFpbi1uZy13ZWIzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQWMsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFcEQsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDOztBQUl4QjtJQUFBO0lBRUEsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7OztJQURDLDRCQUFlOzs7OztBQUdqQixrQ0FnQkM7Ozs7OztJQWZDLGlFQUErQjs7OztJQUUvQixpRUFBbUI7Ozs7SUFFbkIsK0RBQWlCOzs7O0lBRWpCLHdFQUEwQjs7OztJQUUxQiw4REFBZ0I7Ozs7SUFJaEIsNkRBQWU7O0FBS2pCO0lBMENFO1FBakJBLHVCQUFrQixHQUE2QixJQUFJLGVBQWUsQ0FBVSxJQUFJLENBQUMsQ0FBQztRQUNsRix3QkFBbUIsR0FBNkIsSUFBSSxlQUFlLENBQVUsSUFBSSxDQUFDLENBQUM7UUFDbkYsdUJBQWtCLEdBQTZCLElBQUksZUFBZSxDQUFVLElBQUksQ0FBQyxDQUFDO1FBQ2xGLFdBQU0sR0FBNkIsSUFBSSxlQUFlLENBQVUsSUFBSSxDQUFDLENBQUM7SUFldEUsQ0FBQztJQWpDRCxzQkFBSSxtREFBaUI7Ozs7O1FBQXJCLFVBQXNCLEtBQWM7WUFDbEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztZQUNoQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFD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OztJQUNqQiw4Q0FBdUI7O0lBQ3ZCLHVDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qQ09SRSovXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIHRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmcm9tUHJvbWlzZX0gZnJvbSAncnhqcy9pbnRlcm5hbC1jb21wYXRpYmlsaXR5JztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbi8qV0VCMyovXG5pbXBvcnQgV2ViMyBmcm9tICd3ZWIzJztcbmltcG9ydCB7QWNjb3VudH0gZnJvbSAnd2ViMy1ldGgtYWNjb3VudHMnO1xuaW1wb3J0IHtTaWduZWRUcmFuc2FjdGlvbiwgVHJhbnNhY3Rpb25SZWNlaXB0fSBmcm9tICd3ZWIzLWNvcmUnO1xuXG5jbGFzcyBJbml0Q29uZmlnIHtcbiAgcnBjVXJsOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJR29jaGFpbldlYjNTZXJ2aWNlIHtcbiAgaW5pdGlhbGl6ZShjb25maWc6IEluaXRDb25maWcpO1xuXG4gIGluaXRpYWxpemVQbHVnaW4oKTtcblxuICBhY3RpdmF0ZVBsdWdpbigpO1xuXG4gIGdldFBsdWdpbkFjY291bnRBZGRyZXNzKCk7XG5cbiAgY3JlYXRlQWNjb3VudCgpO1xuXG4gIC8qb3BlbkFjY291bnQocHJpdmF0ZUtleTogc3RyaW5nKTsqL1xuXG4gIGNsb3NlQWNjb3VudCgpO1xuXG4gIC8qZ2V0QmFsYW5jZSgpOyovXG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEdvY2hhaW5OZ1dlYjNTZXJ2aWNlIGltcGxlbWVudHMgSUdvY2hhaW5XZWIzU2VydmljZSB7XG4gIHByaXZhdGUgX21ldGFtYXNrSW5zdGFsbGVkOiBib29sZWFuO1xuICBwcml2YXRlIF9tZXRhbWFza0NvbmZpZ3VyZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX21ldGFtYXNrQWN0aXZhdGVkOiBib29sZWFuO1xuICBwcml2YXRlIF9jb25maWc6IEluaXRDb25maWc7XG4gIHByaXZhdGUgX2dvY2hhaW5OZXRJZDogbnVtYmVyO1xuXG4gIHNldCBtZXRhbWFza0luc3RhbGxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX21ldGFtYXNrSW5zdGFsbGVkID0gdmFsdWU7XG4gICAgdGhpcy5tZXRhbWFza0luc3RhbGxlZCQubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBzZXQgbWV0YW1hc2tDb25maWd1cmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbWV0YW1hc2tDb25maWd1cmVkID0gdmFsdWU7XG4gICAgdGhpcy5tZXRhbWFza0NvbmZpZ3VyZWQkLm5leHQodmFsdWUpO1xuICB9XG5cbiAgc2V0IG1ldGFtYXNrQWN0aXZhdGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbWV0YW1hc2tBY3RpdmF0ZWQgPSB2YWx1ZTtcbiAgICB0aGlzLm1ldGFtYXNrQWN0aXZhdGVkJC5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIG1ldGFtYXNrSW5zdGFsbGVkJDogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihudWxsKTtcbiAgbWV0YW1hc2tDb25maWd1cmVkJDogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihudWxsKTtcbiAgbWV0YW1hc2tBY3RpdmF0ZWQkOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KG51bGwpO1xuICByZWFkeSQ6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4obnVsbCk7XG4gIGFjY291bnRCYWxhbmNlOiBzdHJpbmc7XG4gIGdvY2hhaW5XZWIzOiBXZWIzO1xuICBwbHVnaW5XZWIzOiBXZWIzO1xuICBhY2NvdW50QWRkcmVzczogc3RyaW5nO1xuICBhY2NvdW50OiBBY2NvdW50O1xuXG4gIGdldCB3ZWIzKCk6IFdlYjMge1xuICAgIGlmICh0aGlzLl9tZXRhbWFza0NvbmZpZ3VyZWQgJiYgdGhpcy5fbWV0YW1hc2tJbnN0YWxsZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsdWdpbldlYjM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdvY2hhaW5XZWIzO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBpbml0aWFsaXplKGNvbmZpZzogSW5pdENvbmZpZyk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcbiAgICBpZiAoIWNvbmZpZy5ycGNVcmwpIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdycGMgdXJsIGhhc25cXCd0IGJlZW4gcHJvdmlkZWQnKTtcbiAgICB9XG4gICAgdGhpcy5nb2NoYWluV2ViMyA9IG5ldyBXZWIzKG5ldyBXZWIzLnByb3ZpZGVycy5IdHRwUHJvdmlkZXIoY29uZmlnLnJwY1VybCksIG51bGwsIHt0cmFuc2FjdGlvbkNvbmZpcm1hdGlvbkJsb2NrczogMX0pO1xuXG4gICAgcmV0dXJuIGZyb21Qcm9taXNlKHRoaXMuZ29jaGFpbldlYjMuZXRoLm5ldC5nZXRJZCgpKS5waXBlKFxuICAgICAgY2F0Y2hFcnJvcigoZTogRXJyb3IpID0+IHtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoJ0NhblxcJ3QgZ2V0IEdvQ2hhaW4gbmV0d29yayBpZCcpO1xuICAgICAgfSksXG4gICAgICBtYXAodiA9PiAhIXYpLFxuICAgICk7XG4gIH1cblxuICBpbml0aWFsaXplUGx1Z2luKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKCF0aGlzLmdvY2hhaW5XZWIzKSB7XG4gICAgICByZXR1cm4gdGhyb3dFcnJvcignaW5pdGlhbGl6ZSBmaXJzdCcpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2dvY2hhaW5OZXRJZCkge1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoJ2dvY2hhaW4gbmV0d29yayBpZCBpcyBub3QgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLnBsdWdpbldlYjMgPSBuZXcgV2ViMyhXZWIzLmdpdmVuUHJvdmlkZXIsIG51bGwsIHt0cmFuc2FjdGlvbkNvbmZpcm1hdGlvbkJsb2NrczogMX0pO1xuXG4gICAgaWYgKCF0aGlzLnBsdWdpbldlYjMuY3VycmVudFByb3ZpZGVyKSB7XG4gICAgICB0aGlzLm1ldGFtYXNrSW5zdGFsbGVkID0gZmFsc2U7XG4gICAgICB0aGlzLm1ldGFtYXNrQ29uZmlndXJlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRocm93RXJyb3IoJ21ldGFtYXNrIGlzIG5vdCBpbnN0YWxsZWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnJvbVByb21pc2UodGhpcy5wbHVnaW5XZWIzLmV0aC5uZXQuZ2V0SWQoKSkucGlwZShcbiAgICAgIGNhdGNoRXJyb3IoKGU6IEVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMubWV0YW1hc2tJbnN0YWxsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm1ldGFtYXNrQ29uZmlndXJlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcignTWV0YW1hc2sgaW5zdGFsbGVkIGJ1dCBub3QgY29uZmlndXJlZCBwcm9wZXJseSAtIGNhblxcJ3QgZ2V0IG5ldHdvcmsgaWQgZnJvbSBNZXRhbWFzaycpO1xuICAgICAgfSksXG4gICAgICBtYXAoKG1ldGFtYXNrTmV0SUQ6IG51bWJlcikgPT4ge1xuICAgICAgICBpZiAodGhpcy5fZ29jaGFpbk5ldElkICE9PSBtZXRhbWFza05ldElEKSB7XG4gICAgICAgICAgdGhpcy5tZXRhbWFza0luc3RhbGxlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5tZXRhbWFza0NvbmZpZ3VyZWQgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihgTWV0YW1hc2sgaW5zdGFsbGVkIGJ1dCBtaXNjb25maWd1cmVkIC0gbmV0d29yayBJRCBtaXNtYXRjaCAobXVzdCB1c2UgR29DaGFpbiAke3RoaXMuX2dvY2hhaW5OZXRJZH0gLSBlLmcuIGJ5IHBvaW50aW5nIHRvICR7dGhpcy5fY29uZmlnLnJwY1VybH0pYCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tZXRhbWFza0luc3RhbGxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubWV0YW1hc2tDb25maWd1cmVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nZXRQbHVnaW5BY2NvdW50QWRkcmVzcygpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBhY3RpdmF0ZVBsdWdpbigpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBmcm9tUHJvbWlzZSgod2luZG93IGFzIGFueSkuZXRoZXJldW0uZW5hYmxlKCkpLnBpcGUoXG4gICAgICBjYXRjaEVycm9yKChlKSA9PiB7XG4gICAgICAgIHRoaXMubWV0YW1hc2tBY3RpdmF0ZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoJ0FjY2VzcyBoYXZlblxcJ3QgYmVlbiBncmFudGVkJyk7XG4gICAgICB9KSxcbiAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgIHRoaXMubWV0YW1hc2tBY3RpdmF0ZWQgPSB0cnVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIGdldFBsdWdpbkFjY291bnRBZGRyZXNzKCk6IHZvaWQge1xuICAgIGZyb21Qcm9taXNlKHRoaXMucGx1Z2luV2ViMy5ldGguZ2V0QWNjb3VudHMoKSkuc3Vic2NyaWJlKChhY2NvdW50czogc3RyaW5nW10pID0+IHtcbiAgICAgIHRoaXMuYWNjb3VudEFkZHJlc3MgPSBhY2NvdW50c1swXTtcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUFjY291bnQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy53ZWIzID8gdGhpcy53ZWIzLmV0aC5hY2NvdW50cy5jcmVhdGUoKSA6IG51bGw7XG4gIH1cblxuICAvKnByb3RlY3RlZCBfb3BlbkFjY291bnQocHJpdmF0ZUtleTogc3RyaW5nKSB7XG4gICAgaWYgKHByaXZhdGVLZXkubGVuZ3RoID09PSA2NCAmJiBwcml2YXRlS2V5LmluZGV4T2YoJzB4JykgIT09IDApIHtcbiAgICAgIHByaXZhdGVLZXkgPSAnMHgnICsgcHJpdmF0ZUtleTtcbiAgICB9XG4gICAgaWYgKHByaXZhdGVLZXkubGVuZ3RoICE9PSA2Nikge1xuICAgICAgdGhyb3cgRXJyb3IoJ0dpdmVuIHByaXZhdGUga2V5IGlzIG5vdCB2YWxpZCcpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5hY2NvdW50ID0gdGhpcy5nb2NoYWluV2ViMy5ldGguYWNjb3VudHMucHJpdmF0ZUtleVRvQWNjb3VudChwcml2YXRlS2V5KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hY2NvdW50O1xuICB9Ki9cblxuICBjbG9zZUFjY291bnQoKSB7XG4gICAgdGhpcy5hY2NvdW50ID0gbnVsbDtcbiAgICB0aGlzLmFjY291bnRBZGRyZXNzID0gbnVsbDtcbiAgICB0aGlzLmFjY291bnRCYWxhbmNlID0gbnVsbDtcbiAgfVxuXG4gIC8qZ2V0QmFsYW5jZSgpIHtcbiAgICByZXR1cm4gZnJvbVByb21pc2UodGhpcy5nb2NoYWluV2ViMy5ldGguZ2V0QmFsYW5jZSh0aGlzLmFjY291bnQuYWRkcmVzcykpLnBpcGUoXG4gICAgICBtYXAoKGJhbGFuY2U6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLmFjY291bnRCYWxhbmNlID0gdGhpcy5nb2NoYWluV2ViMy51dGlscy5mcm9tV2VpKGJhbGFuY2UsICdldGhlcicpLnRvU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmFjY291bnRCYWxhbmNlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfSovXG5cbiAgc2VuZFNpZ25lZFR4KHNpZ25lZDogU2lnbmVkVHJhbnNhY3Rpb24pOiBPYnNlcnZhYmxlPFRyYW5zYWN0aW9uUmVjZWlwdD4ge1xuICAgIHJldHVybiBmcm9tUHJvbWlzZSh0aGlzLmdvY2hhaW5XZWIzLmV0aC5zZW5kU2lnbmVkVHJhbnNhY3Rpb24oc2lnbmVkLnJhd1RyYW5zYWN0aW9uKSk7XG4gIH1cblxuICBpc0FkZHJlc3MoYWRkcmVzczogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZ29jaGFpbldlYjMudXRpbHMuaXNBZGRyZXNzKGFkZHJlc3MpO1xuICB9XG59XG4iXX0=