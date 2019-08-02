(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["components-component-module"],{

/***/ "./node_modules/rxjs/internal/Observable.js":
/*!**************************************************!*\
  !*** ./node_modules/rxjs/internal/Observable.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var canReportError_1 = __webpack_require__(/*! ./util/canReportError */ "./node_modules/rxjs/internal/util/canReportError.js");
var toSubscriber_1 = __webpack_require__(/*! ./util/toSubscriber */ "./node_modules/rxjs/internal/util/toSubscriber.js");
var observable_1 = __webpack_require__(/*! ../internal/symbol/observable */ "./node_modules/rxjs/internal/symbol/observable.js");
var pipe_1 = __webpack_require__(/*! ./util/pipe */ "./node_modules/rxjs/internal/util/pipe.js");
var config_1 = __webpack_require__(/*! ./config */ "./node_modules/rxjs/internal/config.js");
var Observable = (function () {
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        }
        else {
            sink.add(this.source || (config_1.config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                this._subscribe(sink) :
                this._trySubscribe(sink));
        }
        if (config_1.config.useDeprecatedSynchronousErrorHandling) {
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
                sink.syncErrorThrown = true;
                sink.syncErrorValue = err;
            }
            if (canReportError_1.canReportError(sink)) {
                sink.error(err);
            }
            else {
                console.warn(err);
            }
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscription;
            subscription = _this.subscribe(function (value) {
                try {
                    next(value);
                }
                catch (err) {
                    reject(err);
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var source = this.source;
        return source && source.subscribe(subscriber);
    };
    Observable.prototype[observable_1.observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipe_1.pipeFromArray(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
exports.Observable = Observable;
function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
        promiseCtor = config_1.config.Promise || Promise;
    }
    if (!promiseCtor) {
        throw new Error('no Promise impl found');
    }
    return promiseCtor;
}
//# sourceMappingURL=Observable.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/Observer.js":
/*!************************************************!*\
  !*** ./node_modules/rxjs/internal/Observer.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __webpack_require__(/*! ./config */ "./node_modules/rxjs/internal/config.js");
var hostReportError_1 = __webpack_require__(/*! ./util/hostReportError */ "./node_modules/rxjs/internal/util/hostReportError.js");
exports.empty = {
    closed: true,
    next: function (value) { },
    error: function (err) {
        if (config_1.config.useDeprecatedSynchronousErrorHandling) {
            throw err;
        }
        else {
            hostReportError_1.hostReportError(err);
        }
    },
    complete: function () { }
};
//# sourceMappingURL=Observer.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/Subscriber.js":
/*!**************************************************!*\
  !*** ./node_modules/rxjs/internal/Subscriber.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var isFunction_1 = __webpack_require__(/*! ./util/isFunction */ "./node_modules/rxjs/internal/util/isFunction.js");
var Observer_1 = __webpack_require__(/*! ./Observer */ "./node_modules/rxjs/internal/Observer.js");
var Subscription_1 = __webpack_require__(/*! ./Subscription */ "./node_modules/rxjs/internal/Subscription.js");
var rxSubscriber_1 = __webpack_require__(/*! ../internal/symbol/rxSubscriber */ "./node_modules/rxjs/internal/symbol/rxSubscriber.js");
var config_1 = __webpack_require__(/*! ./config */ "./node_modules/rxjs/internal/config.js");
var hostReportError_1 = __webpack_require__(/*! ./util/hostReportError */ "./node_modules/rxjs/internal/util/hostReportError.js");
var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destinationOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this.syncErrorValue = null;
        _this.syncErrorThrown = false;
        _this.syncErrorThrowable = false;
        _this.isStopped = false;
        _this._parentSubscription = null;
        switch (arguments.length) {
            case 0:
                _this.destination = Observer_1.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    _this.destination = Observer_1.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                        _this.destination = destinationOrNext;
                        destinationOrNext.add(_this);
                    }
                    else {
                        _this.syncErrorThrowable = true;
                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
                    }
                    break;
                }
            default:
                _this.syncErrorThrowable = true;
                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                break;
        }
        return _this;
    }
    Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function () { return this; };
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        this._parentSubscription = null;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
exports.Subscriber = Subscriber;
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this._parentSubscriber = _parentSubscriber;
        var next;
        var context = _this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== Observer_1.empty) {
                context = Object.create(observerOrNext);
                if (isFunction_1.isFunction(context.unsubscribe)) {
                    _this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = _this.unsubscribe.bind(_this);
            }
        }
        _this._context = context;
        _this._next = next;
        _this._error = error;
        _this._complete = complete;
        return _this;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!config_1.config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            var useDeprecatedSynchronousErrorHandling = config_1.config.useDeprecatedSynchronousErrorHandling;
            if (this._error) {
                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                if (useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                hostReportError_1.hostReportError(err);
            }
            else {
                if (useDeprecatedSynchronousErrorHandling) {
                    _parentSubscriber.syncErrorValue = err;
                    _parentSubscriber.syncErrorThrown = true;
                }
                else {
                    hostReportError_1.hostReportError(err);
                }
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!config_1.config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError_1.hostReportError(err);
            }
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        if (!config_1.config.useDeprecatedSynchronousErrorHandling) {
            throw new Error('bad call');
        }
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
                parent.syncErrorValue = err;
                parent.syncErrorThrown = true;
                return true;
            }
            else {
                hostReportError_1.hostReportError(err);
                return true;
            }
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));
exports.SafeSubscriber = SafeSubscriber;
//# sourceMappingURL=Subscriber.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/Subscription.js":
/*!****************************************************!*\
  !*** ./node_modules/rxjs/internal/Subscription.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isArray_1 = __webpack_require__(/*! ./util/isArray */ "./node_modules/rxjs/internal/util/isArray.js");
var isObject_1 = __webpack_require__(/*! ./util/isObject */ "./node_modules/rxjs/internal/util/isObject.js");
var isFunction_1 = __webpack_require__(/*! ./util/isFunction */ "./node_modules/rxjs/internal/util/isFunction.js");
var tryCatch_1 = __webpack_require__(/*! ./util/tryCatch */ "./node_modules/rxjs/internal/util/tryCatch.js");
var errorObject_1 = __webpack_require__(/*! ./util/errorObject */ "./node_modules/rxjs/internal/util/errorObject.js");
var UnsubscriptionError_1 = __webpack_require__(/*! ./util/UnsubscriptionError */ "./node_modules/rxjs/internal/util/UnsubscriptionError.js");
var Subscription = (function () {
    function Subscription(unsubscribe) {
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        while (_parent) {
            _parent.remove(this);
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [errorObject_1.errorObject.e]);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function') {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            this._parent = parent;
        }
        else if (!_parents) {
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
exports.Subscription = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}
//# sourceMappingURL=Subscription.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/config.js":
/*!**********************************************!*\
  !*** ./node_modules/rxjs/internal/config.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _enable_super_gross_mode_that_will_cause_bad_things = false;
exports.config = {
    Promise: undefined,
    set useDeprecatedSynchronousErrorHandling(value) {
        if (value) {
            var error = new Error();
            console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
        }
        else if (_enable_super_gross_mode_that_will_cause_bad_things) {
            console.log('RxJS: Back to a better error behavior. Thank you. <3');
        }
        _enable_super_gross_mode_that_will_cause_bad_things = value;
    },
    get useDeprecatedSynchronousErrorHandling() {
        return _enable_super_gross_mode_that_will_cause_bad_things;
    },
};
//# sourceMappingURL=config.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/observable/empty.js":
/*!********************************************************!*\
  !*** ./node_modules/rxjs/internal/observable/empty.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/internal/Observable.js");
exports.EMPTY = new Observable_1.Observable(function (subscriber) { return subscriber.complete(); });
function empty(scheduler) {
    return scheduler ? emptyScheduled(scheduler) : exports.EMPTY;
}
exports.empty = empty;
function emptyScheduled(scheduler) {
    return new Observable_1.Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
}
exports.emptyScheduled = emptyScheduled;
//# sourceMappingURL=empty.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/operators/defaultIfEmpty.js":
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/internal/operators/defaultIfEmpty.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(/*! ../Subscriber */ "./node_modules/rxjs/internal/Subscriber.js");
function defaultIfEmpty(defaultValue) {
    if (defaultValue === void 0) { defaultValue = null; }
    return function (source) { return source.lift(new DefaultIfEmptyOperator(defaultValue)); };
}
exports.defaultIfEmpty = defaultIfEmpty;
var DefaultIfEmptyOperator = (function () {
    function DefaultIfEmptyOperator(defaultValue) {
        this.defaultValue = defaultValue;
    }
    DefaultIfEmptyOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
    };
    return DefaultIfEmptyOperator;
}());
var DefaultIfEmptySubscriber = (function (_super) {
    __extends(DefaultIfEmptySubscriber, _super);
    function DefaultIfEmptySubscriber(destination, defaultValue) {
        var _this = _super.call(this, destination) || this;
        _this.defaultValue = defaultValue;
        _this.isEmpty = true;
        return _this;
    }
    DefaultIfEmptySubscriber.prototype._next = function (value) {
        this.isEmpty = false;
        this.destination.next(value);
    };
    DefaultIfEmptySubscriber.prototype._complete = function () {
        if (this.isEmpty) {
            this.destination.next(this.defaultValue);
        }
        this.destination.complete();
    };
    return DefaultIfEmptySubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=defaultIfEmpty.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/operators/filter.js":
/*!********************************************************!*\
  !*** ./node_modules/rxjs/internal/operators/filter.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(/*! ../Subscriber */ "./node_modules/rxjs/internal/Subscriber.js");
function filter(predicate, thisArg) {
    return function filterOperatorFunction(source) {
        return source.lift(new FilterOperator(predicate, thisArg));
    };
}
exports.filter = filter;
var FilterOperator = (function () {
    function FilterOperator(predicate, thisArg) {
        this.predicate = predicate;
        this.thisArg = thisArg;
    }
    FilterOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
    };
    return FilterOperator;
}());
var FilterSubscriber = (function (_super) {
    __extends(FilterSubscriber, _super);
    function FilterSubscriber(destination, predicate, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.thisArg = thisArg;
        _this.count = 0;
        return _this;
    }
    FilterSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.predicate.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.destination.next(value);
        }
    };
    return FilterSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=filter.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/operators/first.js":
/*!*******************************************************!*\
  !*** ./node_modules/rxjs/internal/operators/first.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EmptyError_1 = __webpack_require__(/*! ../util/EmptyError */ "./node_modules/rxjs/internal/util/EmptyError.js");
var filter_1 = __webpack_require__(/*! ./filter */ "./node_modules/rxjs/internal/operators/filter.js");
var take_1 = __webpack_require__(/*! ./take */ "./node_modules/rxjs/internal/operators/take.js");
var defaultIfEmpty_1 = __webpack_require__(/*! ./defaultIfEmpty */ "./node_modules/rxjs/internal/operators/defaultIfEmpty.js");
var throwIfEmpty_1 = __webpack_require__(/*! ./throwIfEmpty */ "./node_modules/rxjs/internal/operators/throwIfEmpty.js");
var identity_1 = __webpack_require__(/*! ../util/identity */ "./node_modules/rxjs/internal/util/identity.js");
function first(predicate, defaultValue) {
    var hasDefaultValue = arguments.length >= 2;
    return function (source) { return source.pipe(predicate ? filter_1.filter(function (v, i) { return predicate(v, i, source); }) : identity_1.identity, take_1.take(1), hasDefaultValue ? defaultIfEmpty_1.defaultIfEmpty(defaultValue) : throwIfEmpty_1.throwIfEmpty(function () { return new EmptyError_1.EmptyError(); })); };
}
exports.first = first;
//# sourceMappingURL=first.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/operators/take.js":
/*!******************************************************!*\
  !*** ./node_modules/rxjs/internal/operators/take.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(/*! ../Subscriber */ "./node_modules/rxjs/internal/Subscriber.js");
var ArgumentOutOfRangeError_1 = __webpack_require__(/*! ../util/ArgumentOutOfRangeError */ "./node_modules/rxjs/internal/util/ArgumentOutOfRangeError.js");
var empty_1 = __webpack_require__(/*! ../observable/empty */ "./node_modules/rxjs/internal/observable/empty.js");
function take(count) {
    return function (source) {
        if (count === 0) {
            return empty_1.empty();
        }
        else {
            return source.lift(new TakeOperator(count));
        }
    };
}
exports.take = take;
var TakeOperator = (function () {
    function TakeOperator(total) {
        this.total = total;
        if (this.total < 0) {
            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
        }
    }
    TakeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeSubscriber(subscriber, this.total));
    };
    return TakeOperator;
}());
var TakeSubscriber = (function (_super) {
    __extends(TakeSubscriber, _super);
    function TakeSubscriber(destination, total) {
        var _this = _super.call(this, destination) || this;
        _this.total = total;
        _this.count = 0;
        return _this;
    }
    TakeSubscriber.prototype._next = function (value) {
        var total = this.total;
        var count = ++this.count;
        if (count <= total) {
            this.destination.next(value);
            if (count === total) {
                this.destination.complete();
                this.unsubscribe();
            }
        }
    };
    return TakeSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=take.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/operators/tap.js":
/*!*****************************************************!*\
  !*** ./node_modules/rxjs/internal/operators/tap.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(/*! ../Subscriber */ "./node_modules/rxjs/internal/Subscriber.js");
var noop_1 = __webpack_require__(/*! ../util/noop */ "./node_modules/rxjs/internal/util/noop.js");
var isFunction_1 = __webpack_require__(/*! ../util/isFunction */ "./node_modules/rxjs/internal/util/isFunction.js");
function tap(nextOrObserver, error, complete) {
    return function tapOperatorFunction(source) {
        return source.lift(new DoOperator(nextOrObserver, error, complete));
    };
}
exports.tap = tap;
var DoOperator = (function () {
    function DoOperator(nextOrObserver, error, complete) {
        this.nextOrObserver = nextOrObserver;
        this.error = error;
        this.complete = complete;
    }
    DoOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    };
    return DoOperator;
}());
var TapSubscriber = (function (_super) {
    __extends(TapSubscriber, _super);
    function TapSubscriber(destination, observerOrNext, error, complete) {
        var _this = _super.call(this, destination) || this;
        _this._tapNext = noop_1.noop;
        _this._tapError = noop_1.noop;
        _this._tapComplete = noop_1.noop;
        _this._tapError = error || noop_1.noop;
        _this._tapComplete = complete || noop_1.noop;
        if (isFunction_1.isFunction(observerOrNext)) {
            _this._context = _this;
            _this._tapNext = observerOrNext;
        }
        else if (observerOrNext) {
            _this._context = observerOrNext;
            _this._tapNext = observerOrNext.next || noop_1.noop;
            _this._tapError = observerOrNext.error || noop_1.noop;
            _this._tapComplete = observerOrNext.complete || noop_1.noop;
        }
        return _this;
    }
    TapSubscriber.prototype._next = function (value) {
        try {
            this._tapNext.call(this._context, value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(value);
    };
    TapSubscriber.prototype._error = function (err) {
        try {
            this._tapError.call(this._context, err);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.error(err);
    };
    TapSubscriber.prototype._complete = function () {
        try {
            this._tapComplete.call(this._context);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        return this.destination.complete();
    };
    return TapSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=tap.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/operators/throwIfEmpty.js":
/*!**************************************************************!*\
  !*** ./node_modules/rxjs/internal/operators/throwIfEmpty.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __webpack_require__(/*! ./tap */ "./node_modules/rxjs/internal/operators/tap.js");
var EmptyError_1 = __webpack_require__(/*! ../util/EmptyError */ "./node_modules/rxjs/internal/util/EmptyError.js");
exports.throwIfEmpty = function (errorFactory) {
    if (errorFactory === void 0) { errorFactory = defaultErrorFactory; }
    return tap_1.tap({
        hasValue: false,
        next: function () { this.hasValue = true; },
        complete: function () {
            if (!this.hasValue) {
                throw errorFactory();
            }
        }
    });
};
function defaultErrorFactory() {
    return new EmptyError_1.EmptyError();
}
//# sourceMappingURL=throwIfEmpty.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/symbol/observable.js":
/*!*********************************************************!*\
  !*** ./node_modules/rxjs/internal/symbol/observable.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';
//# sourceMappingURL=observable.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/symbol/rxSubscriber.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs/internal/symbol/rxSubscriber.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.rxSubscriber = typeof Symbol === 'function'
    ? Symbol('rxSubscriber')
    : '@@rxSubscriber_' + Math.random();
exports.$$rxSubscriber = exports.rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/ArgumentOutOfRangeError.js":
/*!********************************************************************!*\
  !*** ./node_modules/rxjs/internal/util/ArgumentOutOfRangeError.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function ArgumentOutOfRangeErrorImpl() {
    Error.call(this);
    this.message = 'argument out of range';
    this.name = 'ArgumentOutOfRangeError';
    return this;
}
ArgumentOutOfRangeErrorImpl.prototype = Object.create(Error.prototype);
exports.ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;
//# sourceMappingURL=ArgumentOutOfRangeError.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/EmptyError.js":
/*!*******************************************************!*\
  !*** ./node_modules/rxjs/internal/util/EmptyError.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function EmptyErrorImpl() {
    Error.call(this);
    this.message = 'no elements in sequence';
    this.name = 'EmptyError';
    return this;
}
EmptyErrorImpl.prototype = Object.create(Error.prototype);
exports.EmptyError = EmptyErrorImpl;
//# sourceMappingURL=EmptyError.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/UnsubscriptionError.js":
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/internal/util/UnsubscriptionError.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function UnsubscriptionErrorImpl(errors) {
    Error.call(this);
    this.message = errors ?
        errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
    this.name = 'UnsubscriptionError';
    this.errors = errors;
    return this;
}
UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
exports.UnsubscriptionError = UnsubscriptionErrorImpl;
//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/canReportError.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs/internal/util/canReportError.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(/*! ../Subscriber */ "./node_modules/rxjs/internal/Subscriber.js");
function canReportError(observer) {
    while (observer) {
        var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
        if (closed_1 || isStopped) {
            return false;
        }
        else if (destination && destination instanceof Subscriber_1.Subscriber) {
            observer = destination;
        }
        else {
            observer = null;
        }
    }
    return true;
}
exports.canReportError = canReportError;
//# sourceMappingURL=canReportError.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/errorObject.js":
/*!********************************************************!*\
  !*** ./node_modules/rxjs/internal/util/errorObject.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.errorObject = { e: {} };
//# sourceMappingURL=errorObject.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/hostReportError.js":
/*!************************************************************!*\
  !*** ./node_modules/rxjs/internal/util/hostReportError.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function hostReportError(err) {
    setTimeout(function () { throw err; });
}
exports.hostReportError = hostReportError;
//# sourceMappingURL=hostReportError.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/identity.js":
/*!*****************************************************!*\
  !*** ./node_modules/rxjs/internal/util/identity.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function identity(x) {
    return x;
}
exports.identity = identity;
//# sourceMappingURL=identity.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/isArray.js":
/*!****************************************************!*\
  !*** ./node_modules/rxjs/internal/util/isArray.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArray.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/isFunction.js":
/*!*******************************************************!*\
  !*** ./node_modules/rxjs/internal/util/isFunction.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=isFunction.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/isObject.js":
/*!*****************************************************!*\
  !*** ./node_modules/rxjs/internal/util/isObject.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isObject(x) {
    return x != null && typeof x === 'object';
}
exports.isObject = isObject;
//# sourceMappingURL=isObject.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/noop.js":
/*!*************************************************!*\
  !*** ./node_modules/rxjs/internal/util/noop.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function noop() { }
exports.noop = noop;
//# sourceMappingURL=noop.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/pipe.js":
/*!*************************************************!*\
  !*** ./node_modules/rxjs/internal/util/pipe.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var noop_1 = __webpack_require__(/*! ./noop */ "./node_modules/rxjs/internal/util/noop.js");
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return pipeFromArray(fns);
}
exports.pipe = pipe;
function pipeFromArray(fns) {
    if (!fns) {
        return noop_1.noop;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}
exports.pipeFromArray = pipeFromArray;
//# sourceMappingURL=pipe.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/toSubscriber.js":
/*!*********************************************************!*\
  !*** ./node_modules/rxjs/internal/util/toSubscriber.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(/*! ../Subscriber */ "./node_modules/rxjs/internal/Subscriber.js");
var rxSubscriber_1 = __webpack_require__(/*! ../symbol/rxSubscriber */ "./node_modules/rxjs/internal/symbol/rxSubscriber.js");
var Observer_1 = __webpack_require__(/*! ../Observer */ "./node_modules/rxjs/internal/Observer.js");
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber_1.rxSubscriber]) {
            return nextOrObserver[rxSubscriber_1.rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber(Observer_1.empty);
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
exports.toSubscriber = toSubscriber;
//# sourceMappingURL=toSubscriber.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/tryCatch.js":
/*!*****************************************************!*\
  !*** ./node_modules/rxjs/internal/util/tryCatch.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var errorObject_1 = __webpack_require__(/*! ./errorObject */ "./node_modules/rxjs/internal/util/errorObject.js");
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject_1.errorObject.e = e;
        return errorObject_1.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;
//# sourceMappingURL=tryCatch.js.map

/***/ }),

/***/ "./src/app/components/company-details/company-details.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/components/company-details/company-details.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"container-fluid\">\n  <!-- <img src=\"../../../assets/banner-image1.png\" alt=\"\"> -->\n</section>\n<div class=\"container\">\n  <div class=\"row\">\n    <div _ngcontent-vgi-c8=\"\" class=\"first\">\n      <div _ngcontent-vgi-c8=\"\" class=\"card\">\n        <div _ngcontent-vgi-c8=\"\" class=\"card-body\">\n          <img _ngcontent-vgi-c8=\"\" alt=\"\" height=\"50px\" src=\"/assets/Layer5.png\" />\n          <h5 _ngcontent-vgi-c8=\"\" class=\"title\">HEWLETT PACKARD</h5>\n          <div _ngcontent-vgi-c8=\"\" class=\"content\">\n            <p _ngcontent-vgi-c8=\"\" class=\"inq\">InQ</p>\n            <p _ngcontent-vgi-c8=\"\" class=\"include\">INCLUSION QUOTIENT</p>\n          </div>\n          <div _ngcontent-vgi-c8=\"\" class=\"number_sdj\">\n            <div _ngcontent-vgi-c8=\"\" class=\"number_align\">\n              <p _ngcontent-vgi-c8=\"\" class=\"card-text\">93</p>\n              <p _ngcontent-vgi-c8=\"\" class=\"adjble\">100</p>\n            </div>\n            <div _ngcontent-vgi-c8=\"\" class=\"go\">\n              <div _ngcontent-vgi-c8=\"\" class=\"percieved\">\n                <p _ngcontent-vgi-c8=\"\" class=\"quotient\">\n                  percieved <br _ngcontent-vgi-c8=\"\" />quotient\n                </p>\n                <p _ngcontent-vgi-c8=\"\" class=\"somewhere\">67</p>\n              </div>\n              <div _ngcontent-vgi-c8=\"\" class=\"perce\">\n                <p _ngcontent-vgi-c8=\"\" class=\"nab\">\n                  verified<br _ngcontent-vgi-c8=\"\" />quotient\n                </p>\n                <p _ngcontent-vgi-c8=\"\" class=\"where\">NA</p>\n              </div>\n            </div>\n          </div>\n          <p _ngcontent-vgi-c8=\"\" class=\"male\">MALE FEMALE RATIO</p>\n          <ul _ngcontent-vgi-c8=\"\" class=\"list-inline\">\n            <li _ngcontent-vgi-c8=\"\" class=\"percent\">\n              27%<br _ngcontent-vgi-c8=\"\" />\n              <p _ngcontent-vgi-c8=\"\" class=\"range\">FEMALE</p>\n            </li>\n            <p-chart type=\"doughnut\" width=\"80\" height=\"70\" [data]=\"data\" [options]=\"pieChartOptions\">\n            </p-chart>\n\n            <li _ngcontent-vgi-c8=\"\" class=\"mahindra\">\n              73%<br _ngcontent-vgi-c8=\"\" />\n              <p _ngcontent-vgi-c8=\"\" class=\"range\">MALE</p>\n            </li>\n          </ul>\n          <p _ngcontent-vgi-c8=\"\" class=\"up_to_date\">27TH JAN 2019</p>\n        </div>\n      </div>\n    </div>\n    <div class=\"alin\">\n      <div class=\"col-6 col-md-6\">\n        <div class=\"card-horizontal\">\n          <div>\n            <img src=\"assets/current-employee.png\" alt=\"Card image cap\" width=\"90\" />\n          </div>\n          <div class=\"former-padd\">\n            <h4 class=\"card-title1\">I AM A CURRENT EMPLOYEE</h4>\n            <p class=\"card-text1\">PLEASE HELP US UNDERSTAND THE SITUATION</p>\n            <div class=\"w-100 btn_aling\">\n              <button class=\"btn btn-color\" routerLink=\"/quiz-test\">\n                TAKE QUIZ\n              </button>\n            </div>\n          </div>\n        </div>\n        <div class=\"card-horizontal card-margin\">\n          <div>\n            <img src=\"assets/current-employee.png\" alt=\"Card image cap\" width=\"90\" />\n          </div>\n          <div class=\"former-padd\">\n            <h4 class=\"card-title1\">I AM A FORMER EMPLYEE</h4>\n            <p class=\"card-text1\">PLEASE HELP US UNDERSTAND THE SITUATION</p>\n            <div class=\"w-100 btn_aling\">\n              <button class=\"btn btn-color\" routerLink=\"/quiz-test\">\n                TAKE QUIZ\n              </button>\n            </div>\n          </div>\n        </div>\n        <div class=\"card-horizontal card-margin\">\n          <div>\n            <img src=\"assets/current-employee.png\" alt=\"Card image cap\" width=\"90\" />\n          </div>\n          <div class=\"former-padd\">\n            <h4 class=\"card-title1\">I AM THE EMPLOYER</h4>\n            <p class=\"card-text1\">PLEASE HELP US UNDERSTAND THE SITUATION</p>\n            <div class=\"w-100 btn_aling\">\n              <button class=\"btn btn-color\" routerLink=\"/quiz-test\">\n                TAKE QUIZ\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"forgotPassword\">\n  <div type=\"\" class=\"btn google Btn\" data-toggle=\"\" data-target=\"#myModal\" data-dismiss=\"modal\"></div>\n  <div class=\"container\">\n    <div class=\"modal fade\" id=\"myModal\" role=\"dialog\">\n      <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n          <div class=\"displayTable\">\n            <div class=\"displayTableCell\">\n              <!-- <div class=\"title_wrap\">\n                <img src=\"../../assets/Logo.png\" class=\"logo_wrap\" alt=\"\" />\n              </div> -->\n              <div class=\"formGroup\">\n                <!-- <div type=\"button\" class=\"google_wrap\" (click)=\"auth()\">\n                  <img class=\"icon_wrap\"\n                    src=\"https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png\" alt=\"\" />\n                </div> -->\n                <mat-tab-group dynamicHeight>\n                  <mat-tab label=\"Register\">\n                    <div class=\"row m-1\">\n                      <div class=\"col-md-12\">\n                        <form [formGroup]=\"registerForm\" (ngSubmit)=\"register()\" novalidate>\n                          <div class=\"form-group\">\n                            <label for=\"userName\">User Name</label>\n                            <input id=\"userName\" type=\"text\" formControlName=\"name\" class=\"form-control\" autocomplete=\"off\"\n                              [ngClass]=\"{ 'is-invalid': submitted && f.name.errors }\"\n                              placeholder=\"Enter User Name\" />\n                            <div *ngIf=\"submitted && f.name.errors\" class=\"invalid-feedback\">\n                              <div *ngIf=\"f.name.errors.required\">First Name is required</div>\n                            </div>\n                          </div>\n                          <div class=\"form-group\">\n                            <label for=\"email\">Email</label>\n                            <input id=\"email\" type=\"text\" formControlName=\"email\" class=\"form-control\" autocomplete=\"off\"\n                              [ngClass]=\"{ 'is-invalid': submitted && f.email.errors }\" placeholder=\"Enter Mail Id\" />\n                            <div *ngIf=\"submitted && f.email.errors\" class=\"invalid-feedback\">\n                              <div *ngIf=\"f.email.errors.required\">Email is required</div>\n                              <div *ngIf=\"f.email.errors.email\">Email must be a valid email address</div>\n                            </div>\n                          </div>\n                          <div class=\"form-group\">\n                            <label for=\"password\">Password</label>\n                            <input id=\"password\" type=\"password\" formControlName=\"password\" class=\"form-control\"\n                              [ngClass]=\"{ 'is-invalid': submitted && f.password.errors }\"\n                              placeholder=\"Enter Password\" />\n                            <div *ngIf=\"submitted && f.password.errors\" class=\"invalid-feedback\">\n                              <div *ngIf=\"f.password.errors.required\">Password is required</div>\n                              <div *ngIf=\"f.password.errors.minlength\">Password must be at least 6 characters</div>\n                            </div>\n                          </div>\n\n                          <div class=\"form-group\">\n                            <label>Select your gender</label>\n                            <div>\n                              <input type=\"radio\" value=\"female\" name=\"gender\" formControlName=\"gender\" class=\"\"\n                                [ngClass]=\"{ 'is-invalid': submitted && f.email.errors }\">\n                              Female\n                              <input type=\"radio\" value=\"male\" name=\"gender\" formControlName=\"gender\" class=\"\"\n                                [ngClass]=\"{ 'is-invalid': submitted && f.email.errors }\">\n                              Male\n                            </div>\n                            <div *ngIf=\"submitted && f.gender.errors\" class=\"invalid-feedback\">\n                              <div *ngIf=\"f.gender.errors.required\">select Gender</div>\n                            </div>\n                          </div>\n                          <div class=\"form-group text-center\">\n                            <button [disabled]=\"loading || this.registerForm.invalid\"\n                              class=\"btn btn-primary m-1\">Register</button>\n                            <button type=\"reset\" class=\"btn btn-danger\">Reset</button>\n                          </div>\n\n                        </form>\n                      </div>\n                    </div>\n                  </mat-tab>\n                  <mat-tab label=\"Login\">\n                    <div class=\"row m-0\">\n                      <div class=\"col-md-12 \">\n                        <form name=\"form\" (ngSubmit)=\"f.form.valid && onSubmit()\" #f=\"ngForm\" novalidate>\n                          <div class=\"form-group\">\n                            <label for=\"email\">Email</label>\n                            <input type=\"text\" class=\"form-control\" name=\"email\" [(ngModel)]=\"model.email\" autocomplete=\"off\"\n                              #email=\"ngModel\" [ngClass]=\"{ 'is-invalid': f.submitted && email.invalid }\" required\n                              email />\n                            <div *ngIf=\"f.submitted && email.invalid\" class=\"invalid-feedback\">\n                              <div *ngIf=\"email.errors.required\">Email is required</div>\n                              <div *ngIf=\"email.errors.email\">Email must be a valid email address</div>\n                            </div>\n                          </div>\n                          <div class=\"form-group\">\n                            <label for=\"password\">Password</label>\n                            <input type=\"password\" class=\"form-control\" name=\"password\" [(ngModel)]=\"model.password\"\n                              #password=\"ngModel\" [ngClass]=\"{ 'is-invalid': f.submitted && password.invalid }\" required\n                              minlength=\"6\" />\n                            <div *ngIf=\"f.submitted && password.invalid\" class=\"invalid-feedback\">\n                              <div *ngIf=\"password.errors.required\">Password is required</div>\n                              <div *ngIf=\"password.errors.minlength\">Password must be at least 6 characters</div>\n                            </div>\n                          </div>\n                          <div class=\"form-group text-center\">\n                            <button class=\"btn btn-primary\" [disabled]=\"f.invalid\">Login</button>\n                          </div>\n                        </form>\n                      </div>\n                    </div>\n                  </mat-tab>\n                </mat-tab-group>\n\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/components/company-details/company-details.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/components/company-details/company-details.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  padding: 35px 0px 40px 0px;\n}\n\n.card-horizontal {\n  width: 380px;\n  border-left: 5px solid #d6c609;\n  padding: 20px 10px 10px 20px;\n  display: grid;\n  grid-template-columns: auto auto;\n  background-color: #ededed;\n}\n\n.modal-content {\n  margin: 0 auto;\n}\n\n.modal-dialog {\n  padding-top: 3rem;\n  background: white;\n  padding: 10px;\n}\n\n.align-ment {\n  display: flex;\n}\n\n.card-title1 {\n  font-size: 15px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.25;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  /* padding-top:20px; */\n}\n\n.card-text1 {\n  font-size: 13px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-top: 5px;\n}\n\n.btn_aling {\n  padding-top: 20px;\n  text-align: right;\n}\n\n.btn-color {\n  background: linear-gradient(89.3701009832deg, #28c728 20.1795559572%, #28c728 21.3031962047%, #1d630c 80.1070358254%);\n  color: #fff;\n  border: none;\n  border-radius: 40px;\n  font-size: 12px;\n  font-weight: 600;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.13;\n  letter-spacing: 0.4px;\n  padding: 9px 20px 9px 20px;\n}\n\n.card-margin {\n  margin-top: 10px;\n}\n\n.former-padd {\n  padding-left: 25px;\n}\n\n.border-color {\n  border-right: 1px solid #ededed;\n}\n\n@media (max-width: 762px) {\n  .row {\n    margin: 0px;\n  }\n\n  .card-row {\n    padding: 30px 20px 20px 20px;\n  }\n\n  .card-horizontal {\n    width: 280px;\n  }\n\n  .former-padd {\n    padding-left: 10px;\n  }\n\n  .card-title1 {\n    font-size: 9px;\n  }\n\n  .card-text1 {\n    font-size: 8px;\n  }\n\n  .btn-color {\n    font-size: 10px;\n    padding: 7px 12px 7px 12px;\n  }\n}\n\n#enquirypopup .modal-dialog {\n  width: 500px;\n  padding: 0px;\n  position: relative;\n}\n\n@media (max-width: 500px) {\n  #enquirypopup .modal-dialog {\n    width: 410px;\n  }\n}\n\n#enquirypopup .modal-dialog:before {\n  content: \"\";\n  height: 0px;\n  width: 0px;\n  border-right: 50px solid transparent;\n  border-bottom: 50px solid transparent;\n  position: absolute;\n  top: 1px;\n  left: -14px;\n  z-index: 99;\n}\n\n.custom-modal-header {\n  text-align: center;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n}\n\n#enquirypopup .modal-dialog .close {\n  z-index: 99999999;\n  right: 6px;\n  position: absolute;\n  opacity: 1;\n}\n\n.custom-modal-header .modal-title {\n  /* font-weight: bold; */\n  font-size: 18px;\n}\n\n#enquirypopup .modal-dialog:after {\n  content: \"\";\n  height: 0px;\n  width: 0px;\n  /* border-right: 50px solid rgba(255, 0, 0, 0.98); */\n  border-bottom: 50px solid transparent;\n  position: absolute;\n  top: 1px;\n  right: -14px;\n  z-index: 999999;\n}\n\n.form-group {\n  margin-bottom: 15px !important;\n}\n\n.form-inline .form-control {\n  display: inline-block;\n  width: 100%;\n  vertical-align: middle;\n}\n\n.close {\n  padding: 1rem 30px 0px 0px;\n}\n\n.modal-content {\n  border-radius: 0%;\n}\n\n.bottom {\n  display: flex;\n}\n\n.exist {\n  padding: 0px 0px 0px 1rem;\n}\n\n.login {\n  font-family: montserrat;\n}\n\n.rigister {\n  padding-right: 5px;\n}\n\n.or {\n  text-align: center;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  margin: 0 auto;\n  border-radius: 10px;\n  border: 2px solid #bada55;\n}\n\n.icons {\n  margin: 0 auto;\n  text-align: center;\n  padding-top: 20px;\n}\n\ni.fa {\n  padding: 10px;\n  font-size: 30px;\n}\n\n.with {\n  text-align: center;\n}\n\ni.fa.fa-facebook-square {\n  color: #3b5998;\n}\n\ni.fa.fa-twitter {\n  color: #28aae1;\n}\n\ni.fa.fa-linkedin {\n  color: #0077b5;\n}\n\ni.fa.fa-instagram {\n  color: #eb4924;\n}\n\n.logo {\n  text-align: center;\n  width: 100%;\n  float: right;\n}\n\n.title {\n  font-family: Montserrat;\n  font-size: 25px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 20px 0px 30px 0px;\n  border-bottom: 3px solid;\n}\n\n@media (max-width: 768px) {\n  .title {\n    font-size: 15px;\n  }\n}\n\n.inq {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px 0px 30px 0px;\n}\n\n@media (max-width: 768px) {\n  .inq {\n    font-size: 15px;\n  }\n}\n\n.content {\n  display: flex;\n}\n\n.include {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px 0px 0px 10px;\n}\n\n@media (max-width: 768px) {\n  .include {\n    font-size: 13px;\n  }\n}\n\n.card-text {\n  font-family: Montserrat;\n  font-size: 85.5px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #397c86;\n  border-bottom: 1px solid;\n}\n\n@media (max-width: 768px) {\n  .card-text {\n    font-size: 35px;\n  }\n}\n\n.adjble {\n  font-family: Montserrat;\n  font-size: 24px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px 0px 10px 0px;\n}\n\n@media (max-width: 768) {\n  .adjble {\n    padding: 20px 0px 10px 0px;\n  }\n}\n\n.number_sdj {\n  display: flex;\n  border-bottom: 3px solid;\n}\n\n.quotient {\n  font-family: Montserrat;\n  font-size: 14px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.percieved {\n  display: flex;\n  padding: 30px 0px 0px 20px;\n}\n\n@media (max-width: 768px) {\n  .percieved {\n    padding: 10px 0px 0px 20px;\n  }\n}\n\n.perce {\n  display: flex;\n  padding: 3.5rem 0px 0px 20px;\n}\n\n@media (max-width: 768px) {\n  .perce {\n    padding: 1rem 0px 0px 20px;\n  }\n}\n\n@media (max-width: 768px) {\n  .container {\n    max-width: 100%;\n  }\n}\n\n.solutions {\n  display: none;\n}\n\n@media (max-width: 500px) {\n  .solutions {\n    display: block;\n  }\n}\n\n.somewhere {\n  font-family: Montserrat;\n  font-size: 32px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  /* padding-left: 13px; */\n  /* padding: 1rem 0px 0px 13px; */\n}\n\n@media (max-width: 500px) {\n  .somewhere {\n    padding: 0rem 0px 0px 4rem;\n  }\n}\n\n@media (max-width: 500px) {\n  .where {\n    padding: 0rem 0px 0px 4rem;\n  }\n}\n\n.nab {\n  font-family: Montserrat;\n  font-size: 14px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.where {\n  font-family: Montserrat;\n  font-size: 35px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.male {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 10px 0px 10px 0px;\n}\n\n@media (max-width: 768px) {\n  .male {\n    font-size: 15px;\n  }\n}\n\n.mat-input-element {\n  background: transparent;\n  border: 1px solid white;\n}\n\nform.example input[type=text] {\n  padding: 10px;\n  font-size: 17px;\n  border: 2px solid white;\n  float: left;\n  width: 90%;\n  border-radius: 0px;\n  opacity: 0.25;\n  border-right: none;\n  color: darkmagenta;\n}\n\n@media (max-width: 500px) {\n  form.example input[type=text] {\n    padding: 0px;\n    font-size: 17px;\n    border: 1px solid white;\n    float: left;\n    width: 60%;\n    background: #f1f1f1;\n    border-radius: 0px;\n    opacity: 0.25;\n    margin-left: 1.5rem;\n    border-right: none;\n  }\n}\n\n.list-inline {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 2px solid;\n  padding: 0px 0px 20px 0px;\n}\n\n.up_to_date {\n  font-family: Montserrat;\n  font-size: 14px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  font: bold;\n  font-weight: bold;\n}\n\n.percent {\n  font-family: Montserrat;\n  font-size: 32px;\n  text-align: left;\n  color: #000000;\n}\n\n.mahindra {\n  font-family: Montserrat;\n  font-size: 32px;\n  text-align: left;\n  color: #000000;\n}\n\n.range {\n  font-family: Montserrat;\n  font-size: 14px;\n  text-align: left;\n  color: #000000;\n}\n\nform.example button {\n  float: left;\n  width: 10%;\n  padding: 10px;\n  background: #0797ae;\n  color: white;\n  font-size: 17px;\n  border: 1px solid white;\n  border-left: none;\n  cursor: pointer;\n  border-radius: 5px;\n  opacity: 0.85;\n}\n\n@media (max-width: 500px) {\n  form.example button {\n    float: left;\n    width: 10%;\n    background: #0797ae;\n    color: white;\n    font-size: 14.1px;\n    border: 1px solid white;\n    border-left: none;\n    cursor: pointer;\n    border-radius: 3px;\n    padding: 1px;\n    opacity: 0.85;\n  }\n}\n\n.company2 {\n  padding-left: 55px;\n}\n\n.top-companies-text {\n  font-size: 30px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.7;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n@media (max-width: 768px) {\n  .top-companies-text {\n    text-align: center;\n  }\n}\n\n.percieved {\n  display: flex;\n  padding: 30px 0px 0px 20px;\n}\n\n@media (max-width: 768px) {\n  .percieved {\n    padding: 10px 0px 0px 30px;\n  }\n}\n\n@media (max-width: 500px) {\n  .percieved {\n    padding: 10px 0px 0px 50px;\n  }\n}\n\n.perce {\n  display: flex;\n  padding: 3.5rem 0px 0px 20px;\n}\n\n@media (max-width: 768px) {\n  .perce {\n    padding: 1rem 0px 0px 30px;\n  }\n}\n\n@media (max-width: 500px) {\n  .perce {\n    padding: 1rem 0px 0px 50px;\n  }\n}\n\n.newsletter ::ng-deep .mat-form-field-label {\n  /*change color of label*/\n  color: black !important;\n}\n\n.styled-select select {\n  size: 100px;\n}\n\n.card {\n  border: none;\n}\n\n.alin {\n  align-items: center;\n  margin: 0 auto;\n  padding-top: 5rem;\n}\n\n.first {\n  width: 40%;\n  border-right: 0.1px solid gray;\n  padding-left: 10px;\n}\n\n@media (max-width: 500px) {\n  .first {\n    width: 100%;\n  }\n}\n\n.title_wrap {\n  text-align: center;\n}\n\n.logo_wrap {\n  padding: 5rem 0px 5rem 0px;\n}\n\n.icon_wrap {\n  padding: 20px 0px 20px 0px;\n}\n\n.container-fluid {\n  background: url('banner-image1.png');\n  height: 137px;\n  background-position: center center;\n  background-size: cover;\n}\n\n.btn-form-group {\n  text-align: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hcHBpbmVzcy9EZXNrdG9wL0VuZ2VuZGVyZWQtUHJvamVjdC9zcmMvYXBwL2NvbXBvbmVudHMvY29tcGFueS1kZXRhaWxzL2NvbXBhbnktZGV0YWlscy5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvY29tcG9uZW50cy9jb21wYW55LWRldGFpbHMvY29tcGFueS1kZXRhaWxzLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsMEJBQUE7QUNDRjs7QURDQTtFQUNFLFlBQUE7RUFDQSw4QkFBQTtFQUNBLDRCQUFBO0VBQ0EsYUFBQTtFQUNBLGdDQUFBO0VBQ0EseUJBQUE7QUNFRjs7QURBQTtFQUNFLGNBQUE7QUNHRjs7QUREQTtFQUNFLGlCQUFBO0VBQ0EsaUJBQUE7RUFDQSxhQUFBO0FDSUY7O0FERkE7RUFDRSxhQUFBO0FDS0Y7O0FESEE7RUFDRSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLHNCQUFBO0FDTUY7O0FESEE7RUFDRSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLGdCQUFBO0FDTUY7O0FESEE7RUFDRSxpQkFBQTtFQUNBLGlCQUFBO0FDTUY7O0FESEE7RUFDRSxxSEFBQTtFQU1BLFdBQUE7RUFDQSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxxQkFBQTtFQUNBLDBCQUFBO0FDQ0Y7O0FERUE7RUFDRSxnQkFBQTtBQ0NGOztBREVBO0VBQ0Usa0JBQUE7QUNDRjs7QURFQTtFQUNFLCtCQUFBO0FDQ0Y7O0FERUE7RUFDRTtJQUNFLFdBQUE7RUNDRjs7RURFQTtJQUNFLDRCQUFBO0VDQ0Y7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Q0Y7QUFDRjs7QUQvQkE7RUFDRSxrQkFBQTtBQ2lDRjs7QUQvQkE7RUFDRSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ2tDRjs7QURoQ0E7RUFDRTtJQUNFLGtCQUFBO0VDbUNGO0FBQ0Y7O0FEakNBO0VBQ0UsYUFBQTtFQUNBLDBCQUFBO0FDbUNGOztBRGpDQTtFQUNFO0lBQ0UsMEJBQUE7RUNvQ0Y7QUFDRjs7QURsQ0E7RUFDRTtJQUNFLDBCQUFBO0VDb0NGO0FBQ0Y7O0FEbENBO0VBQ0UsYUFBQTtFQUNBLDRCQUFBO0FDb0NGOztBRGxDQTtFQUNFO0lBQ0UsMEJBQUE7RUNxQ0Y7QUFDRjs7QURuQ0E7RUFDRTtJQUNFLDBCQUFBO0VDcUNGO0FBQ0Y7O0FEbkNBO0VBQ0Usd0JBQUE7RUFDQSx1QkFBQTtBQ3FDRjs7QURsQ0E7RUFDRSxXQUFBO0FDcUNGOztBRG5DQTtFQUNFLFlBQUE7QUNzQ0Y7O0FEcENBO0VBQ0UsbUJBQUE7RUFDQSxjQUFBO0VBQ0EsaUJBQUE7QUN1Q0Y7O0FEckNBO0VBQ0UsVUFBQTtFQUNBLDhCQUFBO0VBQ0Esa0JBQUE7QUN3Q0Y7O0FEdENBO0VBQ0U7SUFDRSxXQUFBO0VDeUNGO0FBQ0Y7O0FEdkNBO0VBQ0Usa0JBQUE7QUN5Q0Y7O0FEdkNBO0VBQ0UsMEJBQUE7QUMwQ0Y7O0FEckNBO0VBQ0UsMEJBQUE7QUN3Q0Y7O0FEckNBO0VBQ0Usb0NBQUE7RUFDQSxhQUFBO0VBQ0Esa0NBQUE7RUFJQSxzQkFBQTtBQ3dDRjs7QURyQ0E7RUFDRSxrQkFBQTtBQ3dDRiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvY29tcGFueS1kZXRhaWxzL2NvbXBhbnktZGV0YWlscy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jb250YWluZXIge1xuICBwYWRkaW5nOiAzNXB4IDBweCA0MHB4IDBweDtcbn1cbi5jYXJkLWhvcml6b250YWwge1xuICB3aWR0aDogMzgwcHg7XG4gIGJvcmRlci1sZWZ0OiA1cHggc29saWQgI2Q2YzYwOTtcbiAgcGFkZGluZzogMjBweCAxMHB4IDEwcHggMjBweDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIGF1dG87XG4gIGJhY2tncm91bmQtY29sb3I6ICNlZGVkZWQ7XG59XG4ubW9kYWwtY29udGVudCB7XG4gIG1hcmdpbjogMCBhdXRvO1xufVxuLm1vZGFsLWRpYWxvZyB7XG4gIHBhZGRpbmctdG9wOiAzcmVtO1xuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgcGFkZGluZzogMTBweDtcbn1cbi5hbGlnbi1tZW50IHtcbiAgZGlzcGxheTogZmxleDtcbn1cbi5jYXJkLXRpdGxlMSB7XG4gIGZvbnQtc2l6ZTogMTVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjI1O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgLyogcGFkZGluZy10b3A6MjBweDsgKi9cbn1cblxuLmNhcmQtdGV4dDEge1xuICBmb250LXNpemU6IDEzcHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZy10b3A6IDVweDtcbn1cblxuLmJ0bl9hbGluZyB7XG4gIHBhZGRpbmctdG9wOiAyMHB4O1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn1cblxuLmJ0bi1jb2xvciB7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudChcbiAgICA4OS4zNzAxMDA5ODMxNzQ1NWRlZyxcbiAgICByZ2JhKDQwLCAxOTksIDQwLCAxKSAyMC4xNzk1NTU5NTcxNzQyMyUsXG4gICAgcmdiYSg0MCwgMTk5LCA0MCwgMSkgMjEuMzAzMTk2MjA0NzAzNTE0JSxcbiAgICByZ2JhKDI5LCA5OSwgMTIsIDEpIDgwLjEwNzAzNTgyNTQwMjYzJVxuICApO1xuICBjb2xvcjogI2ZmZjtcbiAgYm9yZGVyOiBub25lO1xuICBib3JkZXItcmFkaXVzOiA0MHB4O1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjEzO1xuICBsZXR0ZXItc3BhY2luZzogMC40cHg7XG4gIHBhZGRpbmc6IDlweCAyMHB4IDlweCAyMHB4O1xufVxuXG4uY2FyZC1tYXJnaW4ge1xuICBtYXJnaW4tdG9wOiAxMHB4O1xufVxuXG4uZm9ybWVyLXBhZGQge1xuICBwYWRkaW5nLWxlZnQ6IDI1cHg7XG59XG5cbi5ib3JkZXItY29sb3Ige1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjZWRlZGVkO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzYycHgpIHtcbiAgLnJvdyB7XG4gICAgbWFyZ2luOiAwcHg7XG4gIH1cblxuICAuY2FyZC1yb3cge1xuICAgIHBhZGRpbmc6IDMwcHggMjBweCAyMHB4IDIwcHg7XG4gIH1cblxuICAuY2FyZC1ob3Jpem9udGFsIHtcbiAgICB3aWR0aDogMjgwcHg7XG4gIH1cblxuICAuZm9ybWVyLXBhZGQge1xuICAgIHBhZGRpbmctbGVmdDogMTBweDtcbiAgfVxuXG4gIC5jYXJkLXRpdGxlMSB7XG4gICAgZm9udC1zaXplOiA5cHg7XG4gIH1cblxuICAuY2FyZC10ZXh0MSB7XG4gICAgZm9udC1zaXplOiA4cHg7XG4gIH1cblxuICAuYnRuLWNvbG9yIHtcbiAgICBmb250LXNpemU6IDEwcHg7XG4gICAgcGFkZGluZzogN3B4IDEycHggN3B4IDEycHg7XG4gIH1cbn1cblxuI2VucXVpcnlwb3B1cCAubW9kYWwtZGlhbG9nIHtcbiAgd2lkdGg6IDUwMHB4O1xuICBwYWRkaW5nOiAwcHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA1MDBweCkge1xuICAjZW5xdWlyeXBvcHVwIC5tb2RhbC1kaWFsb2cge1xuICAgIHdpZHRoOiA0MTBweDtcbiAgfVxufVxuXG4jZW5xdWlyeXBvcHVwIC5tb2RhbC1kaWFsb2c6YmVmb3JlIHtcbiAgY29udGVudDogXCJcIjtcbiAgaGVpZ2h0OiAwcHg7XG4gIHdpZHRoOiAwcHg7XG4gIGJvcmRlci1yaWdodDogNTBweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLWJvdHRvbTogNTBweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDFweDtcbiAgbGVmdDogLTE0cHg7XG4gIHotaW5kZXg6IDk5O1xufVxuXG4uY3VzdG9tLW1vZGFsLWhlYWRlciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgbGV0dGVyLXNwYWNpbmc6IDJweDtcbn1cblxuI2VucXVpcnlwb3B1cCAubW9kYWwtZGlhbG9nIC5jbG9zZSB7XG4gIHotaW5kZXg6IDk5OTk5OTk5O1xuICByaWdodDogNnB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIG9wYWNpdHk6IDE7XG59XG5cbi5jdXN0b20tbW9kYWwtaGVhZGVyIC5tb2RhbC10aXRsZSB7XG4gIC8qIGZvbnQtd2VpZ2h0OiBib2xkOyAqL1xuICBmb250LXNpemU6IDE4cHg7XG59XG5cbiNlbnF1aXJ5cG9wdXAgLm1vZGFsLWRpYWxvZzphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGhlaWdodDogMHB4O1xuICB3aWR0aDogMHB4O1xuICAvKiBib3JkZXItcmlnaHQ6IDUwcHggc29saWQgcmdiYSgyNTUsIDAsIDAsIDAuOTgpOyAqL1xuICBib3JkZXItYm90dG9tOiA1MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMXB4O1xuICByaWdodDogLTE0cHg7XG4gIHotaW5kZXg6IDk5OTk5OTtcbn1cblxuLmZvcm0tZ3JvdXAge1xuICBtYXJnaW4tYm90dG9tOiAxNXB4ICFpbXBvcnRhbnQ7XG59XG4vLyAuZm9ybUdyb3VwIHtcbi8vICAgdGV4dC1hbGlnbjogY2VudGVyO1xuLy8gfVxuXG4uZm9ybS1pbmxpbmUgLmZvcm0tY29udHJvbCB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgd2lkdGg6IDEwMCU7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi5jbG9zZSB7XG4gIHBhZGRpbmc6IDFyZW0gMzBweCAwcHggMHB4O1xufVxuXG4ubW9kYWwtY29udGVudCB7XG4gIGJvcmRlci1yYWRpdXM6IDAlO1xufVxuLmJvdHRvbSB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG4uZXhpc3Qge1xuICBwYWRkaW5nOiAwcHggMHB4IDBweCAxcmVtO1xufVxuLmxvZ2luIHtcbiAgZm9udC1mYW1pbHk6IG1vbnRzZXJyYXQ7XG59XG4ucmlnaXN0ZXIge1xuICBwYWRkaW5nLXJpZ2h0OiA1cHg7XG59XG4ub3Ige1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHdpZHRoOiBmaXQtY29udGVudDtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gIGJvcmRlcjogMnB4IHNvbGlkICNiYWRhNTU7XG59XG4uaWNvbnMge1xuICBtYXJnaW46IDAgYXV0bztcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwYWRkaW5nLXRvcDogMjBweDtcbn1cbmkuZmEge1xuICBwYWRkaW5nOiAxMHB4O1xuICBmb250LXNpemU6IDMwcHg7XG59XG4ud2l0aCB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cbmkuZmEuZmEtZmFjZWJvb2stc3F1YXJlIHtcbiAgY29sb3I6ICMzYjU5OTg7XG59XG5pLmZhLmZhLXR3aXR0ZXIge1xuICBjb2xvcjogIzI4YWFlMTtcbn1cbmkuZmEuZmEtbGlua2VkaW4ge1xuICBjb2xvcjogIzAwNzdiNTtcbn1cbmkuZmEuZmEtaW5zdGFncmFtIHtcbiAgY29sb3I6ICNlYjQ5MjQ7XG59XG4ubG9nbyB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIGZsb2F0OiByaWdodDtcbn1cbi50aXRsZSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDI1cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMC44MztcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDIwcHggMHB4IDMwcHggMHB4O1xuICBib3JkZXItYm90dG9tOiAzcHggc29saWQ7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLnRpdGxlIHtcbiAgICBmb250LXNpemU6IDE1cHg7XG4gIH1cbn1cbi5pbnEge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAwcHggMHB4IDMwcHggMHB4O1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pbnEge1xuICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgfVxufVxuLmNvbnRlbnQge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuLmluY2x1ZGUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAwcHggMTBweDtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuaW5jbHVkZSB7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICB9XG59XG4uY2FyZC10ZXh0IHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogODUuNXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMzOTdjODY7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZDtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuY2FyZC10ZXh0IHtcbiAgICBmb250LXNpemU6IDM1cHg7XG4gIH1cbn1cbi5hZGpibGUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAyNHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAxMHB4IDBweDtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjgpIHtcbiAgLmFkamJsZSB7XG4gICAgcGFkZGluZzogMjBweCAwcHggMTBweCAwcHg7XG4gIH1cbn1cbi5udW1iZXJfc2RqIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkO1xufVxuLnF1b3RpZW50IHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG4ucGVyY2lldmVkIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMzBweCAwcHggMHB4IDIwcHg7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLnBlcmNpZXZlZCB7XG4gICAgcGFkZGluZzogMTBweCAwcHggMHB4IDIwcHg7XG4gIH1cbn1cbi5wZXJjZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDMuNXJlbSAwcHggMHB4IDIwcHg7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLnBlcmNlIHtcbiAgICBwYWRkaW5nOiAxcmVtIDBweCAwcHggMjBweDtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5jb250YWluZXIge1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgfVxufVxuLnNvbHV0aW9ucyB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLnNvbHV0aW9ucyB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gIH1cbn1cbi5zb21ld2hlcmUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAzMnB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIC8qIHBhZGRpbmctbGVmdDogMTNweDsgKi9cbiAgLyogcGFkZGluZzogMXJlbSAwcHggMHB4IDEzcHg7ICovXG59XG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLnNvbWV3aGVyZSB7XG4gICAgcGFkZGluZzogMHJlbSAwcHggMHB4IDRyZW07XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA1MDBweCkge1xuICAud2hlcmUge1xuICAgIHBhZGRpbmc6IDByZW0gMHB4IDBweCA0cmVtO1xuICB9XG59XG5cbi5uYWIge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cbi53aGVyZSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDM1cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjA0O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cbi5tYWxlIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMTBweCAwcHggMTBweCAwcHg7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLm1hbGUge1xuICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgfVxufVxuLm1hdC1pbnB1dC1lbGVtZW50IHtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xufVxuZm9ybS5leGFtcGxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdIHtcbiAgcGFkZGluZzogMTBweDtcbiAgZm9udC1zaXplOiAxN3B4O1xuICBib3JkZXI6IDJweCBzb2xpZCB3aGl0ZTtcbiAgZmxvYXQ6IGxlZnQ7XG4gIHdpZHRoOiA5MCU7XG4gIGJvcmRlci1yYWRpdXM6IDBweDtcbiAgb3BhY2l0eTogMC4yNTtcbiAgYm9yZGVyLXJpZ2h0OiBub25lO1xuICBjb2xvcjogZGFya21hZ2VudGE7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgZm9ybS5leGFtcGxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdIHtcbiAgICBwYWRkaW5nOiAwcHg7XG4gICAgZm9udC1zaXplOiAxN3B4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xuICAgIGZsb2F0OiBsZWZ0O1xuICAgIHdpZHRoOiA2MCU7XG4gICAgYmFja2dyb3VuZDogI2YxZjFmMTtcbiAgICBib3JkZXItcmFkaXVzOiAwcHg7XG4gICAgb3BhY2l0eTogMC4yNTtcbiAgICBtYXJnaW4tbGVmdDogMS41cmVtO1xuICAgIGJvcmRlci1yaWdodDogbm9uZTtcbiAgfVxufVxuLmxpc3QtaW5saW5lIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3JkZXItYm90dG9tOiAycHggc29saWQ7XG4gIHBhZGRpbmc6IDBweCAwcHggMjBweCAwcHg7XG59XG4udXBfdG9fZGF0ZSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBmb250OiBib2xkO1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cbi5wZXJjZW50IHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMzJweDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG4ubWFoaW5kcmEge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAzMnB4O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cbi5yYW5nZSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE0cHg7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuZm9ybS5leGFtcGxlIGJ1dHRvbiB7XG4gIGZsb2F0OiBsZWZ0O1xuICB3aWR0aDogMTAlO1xuICBwYWRkaW5nOiAxMHB4O1xuICBiYWNrZ3JvdW5kOiAjMDc5N2FlO1xuICBjb2xvcjogd2hpdGU7XG4gIGZvbnQtc2l6ZTogMTdweDtcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XG4gIGJvcmRlci1sZWZ0OiBub25lO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgb3BhY2l0eTogMC44NTtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA1MDBweCkge1xuICBmb3JtLmV4YW1wbGUgYnV0dG9uIHtcbiAgICBmbG9hdDogbGVmdDtcbiAgICB3aWR0aDogMTAlO1xuICAgIGJhY2tncm91bmQ6ICMwNzk3YWU7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIGZvbnQtc2l6ZTogMTQuMXB4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xuICAgIGJvcmRlci1sZWZ0OiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgcGFkZGluZzogMXB4O1xuICAgIG9wYWNpdHk6IDAuODU7XG4gIH1cbn1cbi5jb21wYW55MiB7XG4gIHBhZGRpbmctbGVmdDogNTVweDtcbn1cbi50b3AtY29tcGFuaWVzLXRleHQge1xuICBmb250LXNpemU6IDMwcHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMC43O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAudG9wLWNvbXBhbmllcy10ZXh0IHtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cbn1cbi5wZXJjaWV2ZWQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAzMHB4IDBweCAwcHggMjBweDtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAucGVyY2lldmVkIHtcbiAgICBwYWRkaW5nOiAxMHB4IDBweCAwcHggMzBweDtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC5wZXJjaWV2ZWQge1xuICAgIHBhZGRpbmc6IDEwcHggMHB4IDBweCA1MHB4O1xuICB9XG59XG4ucGVyY2Uge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAzLjVyZW0gMHB4IDBweCAyMHB4O1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5wZXJjZSB7XG4gICAgcGFkZGluZzogMXJlbSAwcHggMHB4IDMwcHg7XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA1MDBweCkge1xuICAucGVyY2Uge1xuICAgIHBhZGRpbmc6IDFyZW0gMHB4IDBweCA1MHB4O1xuICB9XG59XG4ubmV3c2xldHRlciA6Om5nLWRlZXAgLm1hdC1mb3JtLWZpZWxkLWxhYmVsIHtcbiAgLypjaGFuZ2UgY29sb3Igb2YgbGFiZWwqL1xuICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcbn1cblxuLnN0eWxlZC1zZWxlY3Qgc2VsZWN0IHtcbiAgc2l6ZTogMTAwcHg7XG59XG4uY2FyZCB7XG4gIGJvcmRlcjogbm9uZTtcbn1cbi5hbGluIHtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHBhZGRpbmctdG9wOiA1cmVtO1xufVxuLmZpcnN0IHtcbiAgd2lkdGg6IDQwJTtcbiAgYm9yZGVyLXJpZ2h0OiAwLjFweCBzb2xpZCBncmF5O1xuICBwYWRkaW5nLWxlZnQ6IDEwcHg7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLmZpcnN0IHtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxufVxuLnRpdGxlX3dyYXAge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG4ubG9nb193cmFwIHtcbiAgcGFkZGluZzogNXJlbSAwcHggNXJlbSAwcHg7XG59XG4vLyAuZGlzcGxheVRhYmxlQ2VsbCB7XG4vLyAgIGJhY2tncm91bmQ6ICMwNzk3YWU7XG4vLyB9XG4uaWNvbl93cmFwIHtcbiAgcGFkZGluZzogMjBweCAwcHggMjBweCAwcHg7XG59XG5cbi5jb250YWluZXItZmx1aWQge1xuICBiYWNrZ3JvdW5kOiB1cmwoLi4vLi4vLi4vYXNzZXRzL2Jhbm5lci1pbWFnZTEucG5nKTtcbiAgaGVpZ2h0OiAxMzdweDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIGNlbnRlcjtcbiAgLW1vei1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAtd2Via2l0LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIC1vLWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIH1cblxuLmJ0bi1mb3JtLWdyb3Vwe1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59IiwiLmNvbnRhaW5lciB7XG4gIHBhZGRpbmc6IDM1cHggMHB4IDQwcHggMHB4O1xufVxuXG4uY2FyZC1ob3Jpem9udGFsIHtcbiAgd2lkdGg6IDM4MHB4O1xuICBib3JkZXItbGVmdDogNXB4IHNvbGlkICNkNmM2MDk7XG4gIHBhZGRpbmc6IDIwcHggMTBweCAxMHB4IDIwcHg7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogYXV0byBhdXRvO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWRlZGVkO1xufVxuXG4ubW9kYWwtY29udGVudCB7XG4gIG1hcmdpbjogMCBhdXRvO1xufVxuXG4ubW9kYWwtZGlhbG9nIHtcbiAgcGFkZGluZy10b3A6IDNyZW07XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICBwYWRkaW5nOiAxMHB4O1xufVxuXG4uYWxpZ24tbWVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5cbi5jYXJkLXRpdGxlMSB7XG4gIGZvbnQtc2l6ZTogMTVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjI1O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgLyogcGFkZGluZy10b3A6MjBweDsgKi9cbn1cblxuLmNhcmQtdGV4dDEge1xuICBmb250LXNpemU6IDEzcHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZy10b3A6IDVweDtcbn1cblxuLmJ0bl9hbGluZyB7XG4gIHBhZGRpbmctdG9wOiAyMHB4O1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn1cblxuLmJ0bi1jb2xvciB7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg4OS4zNzAxMDA5ODMyZGVnLCAjMjhjNzI4IDIwLjE3OTU1NTk1NzIlLCAjMjhjNzI4IDIxLjMwMzE5NjIwNDclLCAjMWQ2MzBjIDgwLjEwNzAzNTgyNTQlKTtcbiAgY29sb3I6ICNmZmY7XG4gIGJvcmRlcjogbm9uZTtcbiAgYm9yZGVyLXJhZGl1czogNDBweDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogNjAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4xMztcbiAgbGV0dGVyLXNwYWNpbmc6IDAuNHB4O1xuICBwYWRkaW5nOiA5cHggMjBweCA5cHggMjBweDtcbn1cblxuLmNhcmQtbWFyZ2luIHtcbiAgbWFyZ2luLXRvcDogMTBweDtcbn1cblxuLmZvcm1lci1wYWRkIHtcbiAgcGFkZGluZy1sZWZ0OiAyNXB4O1xufVxuXG4uYm9yZGVyLWNvbG9yIHtcbiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgI2VkZWRlZDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2MnB4KSB7XG4gIC5yb3cge1xuICAgIG1hcmdpbjogMHB4O1xuICB9XG5cbiAgLmNhcmQtcm93IHtcbiAgICBwYWRkaW5nOiAzMHB4IDIwcHggMjBweCAyMHB4O1xuICB9XG5cbiAgLmNhcmQtaG9yaXpvbnRhbCB7XG4gICAgd2lkdGg6IDI4MHB4O1xuICB9XG5cbiAgLmZvcm1lci1wYWRkIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDEwcHg7XG4gIH1cblxuICAuY2FyZC10aXRsZTEge1xuICAgIGZvbnQtc2l6ZTogOXB4O1xuICB9XG5cbiAgLmNhcmQtdGV4dDEge1xuICAgIGZvbnQtc2l6ZTogOHB4O1xuICB9XG5cbiAgLmJ0bi1jb2xvciB7XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICAgIHBhZGRpbmc6IDdweCAxMnB4IDdweCAxMnB4O1xuICB9XG59XG4jZW5xdWlyeXBvcHVwIC5tb2RhbC1kaWFsb2cge1xuICB3aWR0aDogNTAwcHg7XG4gIHBhZGRpbmc6IDBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgI2VucXVpcnlwb3B1cCAubW9kYWwtZGlhbG9nIHtcbiAgICB3aWR0aDogNDEwcHg7XG4gIH1cbn1cbiNlbnF1aXJ5cG9wdXAgLm1vZGFsLWRpYWxvZzpiZWZvcmUge1xuICBjb250ZW50OiBcIlwiO1xuICBoZWlnaHQ6IDBweDtcbiAgd2lkdGg6IDBweDtcbiAgYm9yZGVyLXJpZ2h0OiA1MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBib3JkZXItYm90dG9tOiA1MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMXB4O1xuICBsZWZ0OiAtMTRweDtcbiAgei1pbmRleDogOTk7XG59XG5cbi5jdXN0b20tbW9kYWwtaGVhZGVyIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBsZXR0ZXItc3BhY2luZzogMnB4O1xufVxuXG4jZW5xdWlyeXBvcHVwIC5tb2RhbC1kaWFsb2cgLmNsb3NlIHtcbiAgei1pbmRleDogOTk5OTk5OTk7XG4gIHJpZ2h0OiA2cHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgb3BhY2l0eTogMTtcbn1cblxuLmN1c3RvbS1tb2RhbC1oZWFkZXIgLm1vZGFsLXRpdGxlIHtcbiAgLyogZm9udC13ZWlnaHQ6IGJvbGQ7ICovXG4gIGZvbnQtc2l6ZTogMThweDtcbn1cblxuI2VucXVpcnlwb3B1cCAubW9kYWwtZGlhbG9nOmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgaGVpZ2h0OiAwcHg7XG4gIHdpZHRoOiAwcHg7XG4gIC8qIGJvcmRlci1yaWdodDogNTBweCBzb2xpZCByZ2JhKDI1NSwgMCwgMCwgMC45OCk7ICovXG4gIGJvcmRlci1ib3R0b206IDUwcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAxcHg7XG4gIHJpZ2h0OiAtMTRweDtcbiAgei1pbmRleDogOTk5OTk5O1xufVxuXG4uZm9ybS1ncm91cCB7XG4gIG1hcmdpbi1ib3R0b206IDE1cHggIWltcG9ydGFudDtcbn1cblxuLmZvcm0taW5saW5lIC5mb3JtLWNvbnRyb2wge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xufVxuXG4uY2xvc2Uge1xuICBwYWRkaW5nOiAxcmVtIDMwcHggMHB4IDBweDtcbn1cblxuLm1vZGFsLWNvbnRlbnQge1xuICBib3JkZXItcmFkaXVzOiAwJTtcbn1cblxuLmJvdHRvbSB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5cbi5leGlzdCB7XG4gIHBhZGRpbmc6IDBweCAwcHggMHB4IDFyZW07XG59XG5cbi5sb2dpbiB7XG4gIGZvbnQtZmFtaWx5OiBtb250c2VycmF0O1xufVxuXG4ucmlnaXN0ZXIge1xuICBwYWRkaW5nLXJpZ2h0OiA1cHg7XG59XG5cbi5vciB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xuICBtYXJnaW46IDAgYXV0bztcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgYm9yZGVyOiAycHggc29saWQgI2JhZGE1NTtcbn1cblxuLmljb25zIHtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcGFkZGluZy10b3A6IDIwcHg7XG59XG5cbmkuZmEge1xuICBwYWRkaW5nOiAxMHB4O1xuICBmb250LXNpemU6IDMwcHg7XG59XG5cbi53aXRoIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG5pLmZhLmZhLWZhY2Vib29rLXNxdWFyZSB7XG4gIGNvbG9yOiAjM2I1OTk4O1xufVxuXG5pLmZhLmZhLXR3aXR0ZXIge1xuICBjb2xvcjogIzI4YWFlMTtcbn1cblxuaS5mYS5mYS1saW5rZWRpbiB7XG4gIGNvbG9yOiAjMDA3N2I1O1xufVxuXG5pLmZhLmZhLWluc3RhZ3JhbSB7XG4gIGNvbG9yOiAjZWI0OTI0O1xufVxuXG4ubG9nbyB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIGZsb2F0OiByaWdodDtcbn1cblxuLnRpdGxlIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMjVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAwLjgzO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMjBweCAwcHggMzBweCAwcHg7XG4gIGJvcmRlci1ib3R0b206IDNweCBzb2xpZDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC50aXRsZSB7XG4gICAgZm9udC1zaXplOiAxNXB4O1xuICB9XG59XG4uaW5xIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAzMHB4IDBweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pbnEge1xuICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgfVxufVxuLmNvbnRlbnQge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uaW5jbHVkZSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAwcHggMHB4IDBweCAxMHB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmluY2x1ZGUge1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgfVxufVxuLmNhcmQtdGV4dCB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDg1LjVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMzk3Yzg2O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQ7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuY2FyZC10ZXh0IHtcbiAgICBmb250LXNpemU6IDM1cHg7XG4gIH1cbn1cbi5hZGpibGUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAyNHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAxMHB4IDBweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OCkge1xuICAuYWRqYmxlIHtcbiAgICBwYWRkaW5nOiAyMHB4IDBweCAxMHB4IDBweDtcbiAgfVxufVxuLm51bWJlcl9zZGoge1xuICBkaXNwbGF5OiBmbGV4O1xuICBib3JkZXItYm90dG9tOiAzcHggc29saWQ7XG59XG5cbi5xdW90aWVudCB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG4ucGVyY2lldmVkIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMzBweCAwcHggMHB4IDIwcHg7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAucGVyY2lldmVkIHtcbiAgICBwYWRkaW5nOiAxMHB4IDBweCAwcHggMjBweDtcbiAgfVxufVxuLnBlcmNlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMy41cmVtIDBweCAwcHggMjBweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5wZXJjZSB7XG4gICAgcGFkZGluZzogMXJlbSAwcHggMHB4IDIwcHg7XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuY29udGFpbmVyIHtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gIH1cbn1cbi5zb2x1dGlvbnMge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLnNvbHV0aW9ucyB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gIH1cbn1cbi5zb21ld2hlcmUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAzMnB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIC8qIHBhZGRpbmctbGVmdDogMTNweDsgKi9cbiAgLyogcGFkZGluZzogMXJlbSAwcHggMHB4IDEzcHg7ICovXG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA1MDBweCkge1xuICAuc29tZXdoZXJlIHtcbiAgICBwYWRkaW5nOiAwcmVtIDBweCAwcHggNHJlbTtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC53aGVyZSB7XG4gICAgcGFkZGluZzogMHJlbSAwcHggMHB4IDRyZW07XG4gIH1cbn1cbi5uYWIge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLndoZXJlIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMzVweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMDQ7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG4ubWFsZSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zOTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDEwcHggMHB4IDEwcHggMHB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLm1hbGUge1xuICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgfVxufVxuLm1hdC1pbnB1dC1lbGVtZW50IHtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xufVxuXG5mb3JtLmV4YW1wbGUgaW5wdXRbdHlwZT10ZXh0XSB7XG4gIHBhZGRpbmc6IDEwcHg7XG4gIGZvbnQtc2l6ZTogMTdweDtcbiAgYm9yZGVyOiAycHggc29saWQgd2hpdGU7XG4gIGZsb2F0OiBsZWZ0O1xuICB3aWR0aDogOTAlO1xuICBib3JkZXItcmFkaXVzOiAwcHg7XG4gIG9wYWNpdHk6IDAuMjU7XG4gIGJvcmRlci1yaWdodDogbm9uZTtcbiAgY29sb3I6IGRhcmttYWdlbnRhO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgZm9ybS5leGFtcGxlIGlucHV0W3R5cGU9dGV4dF0ge1xuICAgIHBhZGRpbmc6IDBweDtcbiAgICBmb250LXNpemU6IDE3cHg7XG4gICAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XG4gICAgZmxvYXQ6IGxlZnQ7XG4gICAgd2lkdGg6IDYwJTtcbiAgICBiYWNrZ3JvdW5kOiAjZjFmMWYxO1xuICAgIGJvcmRlci1yYWRpdXM6IDBweDtcbiAgICBvcGFjaXR5OiAwLjI1O1xuICAgIG1hcmdpbi1sZWZ0OiAxLjVyZW07XG4gICAgYm9yZGVyLXJpZ2h0OiBub25lO1xuICB9XG59XG4ubGlzdC1pbmxpbmUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJvcmRlci1ib3R0b206IDJweCBzb2xpZDtcbiAgcGFkZGluZzogMHB4IDBweCAyMHB4IDBweDtcbn1cblxuLnVwX3RvX2RhdGUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgZm9udDogYm9sZDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG5cbi5wZXJjZW50IHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMzJweDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5tYWhpbmRyYSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDMycHg7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG4ucmFuZ2Uge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cblxuZm9ybS5leGFtcGxlIGJ1dHRvbiB7XG4gIGZsb2F0OiBsZWZ0O1xuICB3aWR0aDogMTAlO1xuICBwYWRkaW5nOiAxMHB4O1xuICBiYWNrZ3JvdW5kOiAjMDc5N2FlO1xuICBjb2xvcjogd2hpdGU7XG4gIGZvbnQtc2l6ZTogMTdweDtcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XG4gIGJvcmRlci1sZWZ0OiBub25lO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgb3BhY2l0eTogMC44NTtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIGZvcm0uZXhhbXBsZSBidXR0b24ge1xuICAgIGZsb2F0OiBsZWZ0O1xuICAgIHdpZHRoOiAxMCU7XG4gICAgYmFja2dyb3VuZDogIzA3OTdhZTtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgZm9udC1zaXplOiAxNC4xcHg7XG4gICAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XG4gICAgYm9yZGVyLWxlZnQ6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICBwYWRkaW5nOiAxcHg7XG4gICAgb3BhY2l0eTogMC44NTtcbiAgfVxufVxuLmNvbXBhbnkyIHtcbiAgcGFkZGluZy1sZWZ0OiA1NXB4O1xufVxuXG4udG9wLWNvbXBhbmllcy10ZXh0IHtcbiAgZm9udC1zaXplOiAzMHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuNztcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAudG9wLWNvbXBhbmllcy10ZXh0IHtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cbn1cbi5wZXJjaWV2ZWQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAzMHB4IDBweCAwcHggMjBweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5wZXJjaWV2ZWQge1xuICAgIHBhZGRpbmc6IDEwcHggMHB4IDBweCAzMHB4O1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLnBlcmNpZXZlZCB7XG4gICAgcGFkZGluZzogMTBweCAwcHggMHB4IDUwcHg7XG4gIH1cbn1cbi5wZXJjZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDMuNXJlbSAwcHggMHB4IDIwcHg7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAucGVyY2Uge1xuICAgIHBhZGRpbmc6IDFyZW0gMHB4IDBweCAzMHB4O1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLnBlcmNlIHtcbiAgICBwYWRkaW5nOiAxcmVtIDBweCAwcHggNTBweDtcbiAgfVxufVxuLm5ld3NsZXR0ZXIgOjpuZy1kZWVwIC5tYXQtZm9ybS1maWVsZC1sYWJlbCB7XG4gIC8qY2hhbmdlIGNvbG9yIG9mIGxhYmVsKi9cbiAgY29sb3I6IGJsYWNrICFpbXBvcnRhbnQ7XG59XG5cbi5zdHlsZWQtc2VsZWN0IHNlbGVjdCB7XG4gIHNpemU6IDEwMHB4O1xufVxuXG4uY2FyZCB7XG4gIGJvcmRlcjogbm9uZTtcbn1cblxuLmFsaW4ge1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtYXJnaW46IDAgYXV0bztcbiAgcGFkZGluZy10b3A6IDVyZW07XG59XG5cbi5maXJzdCB7XG4gIHdpZHRoOiA0MCU7XG4gIGJvcmRlci1yaWdodDogMC4xcHggc29saWQgZ3JheTtcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLmZpcnN0IHtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxufVxuLnRpdGxlX3dyYXAge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5sb2dvX3dyYXAge1xuICBwYWRkaW5nOiA1cmVtIDBweCA1cmVtIDBweDtcbn1cblxuLmljb25fd3JhcCB7XG4gIHBhZGRpbmc6IDIwcHggMHB4IDIwcHggMHB4O1xufVxuXG4uY29udGFpbmVyLWZsdWlkIHtcbiAgYmFja2dyb3VuZDogdXJsKC4uLy4uLy4uL2Fzc2V0cy9iYW5uZXItaW1hZ2UxLnBuZyk7XG4gIGhlaWdodDogMTM3cHg7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XG4gIC1tb3otYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAtby1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xufVxuXG4uYnRuLWZvcm0tZ3JvdXAge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59Il19 */"

/***/ }),

/***/ "./src/app/components/company-details/company-details.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/company-details/company-details.component.ts ***!
  \*************************************************************************/
/*! exports provided: CompanyDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompanyDetailsComponent", function() { return CompanyDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _service_authentication_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/authentication.service */ "./src/app/service/authentication.service.ts");





var CompanyDetailsComponent = /** @class */ (function () {
    function CompanyDetailsComponent(formBuilder, router, authService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.authService = authService;
        this.submitted = false;
        this.model = {};
        this.data = {
            events: [],
            labels: ["Female", "Male"],
            datasets: [
                {
                    data: [25, 75],
                    backgroundColor: ["#148fd5", "#da1b63"]
                }
            ]
        };
        this.pieChartOptions = {
            legend: {
                display: false
            },
            tooltips: {
                enabled: true
            }
        };
    }
    CompanyDetailsComponent.prototype.ngOnInit = function () {
        this.registerForm = this.formBuilder.group({
            name: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            email: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].email]],
            password: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(6)]],
            gender: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
        this.loginFrom = this.formBuilder.group({
            email: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].email]],
            password: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(5)]]
        });
        $("#myModal").modal("show");
    };
    CompanyDetailsComponent.prototype.auth = function () {
        this.authService.GoogleAuth().then(function (_res) {
            $("#myModal").modal("hide");
        });
    };
    // register a new user
    CompanyDetailsComponent.prototype.register = function () {
        this.authService.register(this.registerForm.value).subscribe(function (res) {
            console.log(res);
        });
    };
    Object.defineProperty(CompanyDetailsComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () {
            return this.registerForm.controls;
        },
        enumerable: true,
        configurable: true
    });
    // login if user exists
    CompanyDetailsComponent.prototype.onSubmit = function () {
        var _this = this;
        console.log(this.model);
        this.authService.login(this.model).subscribe(function (res) {
            if (res.statuscode === 200) {
                _this.authService.sendToken(res.data.token);
            }
        });
    };
    CompanyDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: "app-company-details",
            template: __webpack_require__(/*! ./company-details.component.html */ "./src/app/components/company-details/company-details.component.html"),
            styles: [__webpack_require__(/*! ./company-details.component.scss */ "./src/app/components/company-details/company-details.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _service_authentication_service__WEBPACK_IMPORTED_MODULE_4__["AuthenticationService"]])
    ], CompanyDetailsComponent);
    return CompanyDetailsComponent;
}());



/***/ }),

/***/ "./src/app/components/company-profile/company-profile.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/components/company-profile/company-profile.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"container-fluid\">\n  <!-- <img src=\"../../../assets/banner-image1.png\" alt=\"\"> -->\n</section>\n<div class=\"card\">\n  <div>\n    <img class=\"card-img-top\" src=\"../../assets/infosys2.png\" alt=\"infosys\" />\n  </div>\n  <div class=\"card-body Custom header-text\">\n    <h5\n      class=\"card-title Custom company-name\"\n      *ngFor=\"let companyprofilename of companyprofiledetails\"\n    >\n      {{ companyprofiledetails }}\n    </h5>\n  </div>\n  <div class=\"card-body Custom body-border\">\n    <div class=\"inq-inclusion\">\n      <span class=\"inq-text\">InQ</span>\n      <span class=\"inclusion-text\">INCLUSION QUOTIENT</span>\n    </div>\n    <div class=\"grid-row\">\n      <h5 class=\"ninty-three\">93</h5>\n      <p class=\"percieved-text\">PERCIEVED <br />QUOTIENT</p>\n      <p class=\"sixty-seven\">67</p>\n    </div>\n    <div class=\"grid-row1\">\n      <h5 class=\"hundred body-border1\">100</h5>\n      <p class=\"verified-text\">VERIFIED<br />QUOTIENT</p>\n      <p class=\"not-applicable\">90</p>\n    </div>\n  </div>\n  <div class=\"card-body Custom body-border\">\n    <p class=\"male-female\">MALE FEMALE RATIO</p>\n    <div class=\"male-female-bars\">\n      <p class=\"fm-t-15\">\n        43% <br />\n        <span class=\"female-text\">FEMALE</span>\n      </p>\n      <div>\n        <p-chart\n          type=\"doughnut\"\n          width=\"400\"\n          height=\"120\"\n          [data]=\"data\"\n          [options]=\"pieChartOptions\"\n          >></p-chart\n        >\n      </div>\n      <p class=\"m-t-15\">\n        57% <br />\n        <span class=\"female-text\">MALE</span>\n      </p>\n    </div>\n  </div>\n  <div class=\"card-body\">\n    <p class=\"month-text\">27TH <b>JAN</b> 2019</p>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/company-profile/company-profile.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/components/company-profile/company-profile.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container-fluid {\n  background: url('banner-image1.png');\n  height: 137px;\n  background-position: center center;\n  background-size: cover;\n}\n\n.company-name {\n  font-size: 22px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-top: 15px;\n}\n\n.m-t-15 {\n  padding: 40px 0px 0px 11px;\n  font-size: 25px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.fm-t-15 {\n  padding: 40px 0px 0px 0px;\n  font-size: 25px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.card-body {\n  padding: 0px;\n  /* padding-left: 1rem; */\n}\n\n.inq-text {\n  font-size: 13px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.inclusion-text {\n  font-size: 13px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-left: 9px;\n}\n\n.ninty-three {\n  padding: 7px 0px 7px 0px;\n  font-size: 50.5px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.42;\n  letter-spacing: normal;\n  text-align: left;\n  color: #397c86;\n  width: 75%;\n}\n\n.percieved-text {\n  font-size: 12px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  /* padding-top:7px; */\n}\n\n.hundred {\n  padding-top: 10px;\n  font-size: 18px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  width: 50%;\n}\n\n.verified-text {\n  font-size: 12px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-bottom: 10px;\n}\n\n.sixty-seven {\n  padding: 0px 0px 0px 0px;\n  font-size: 28px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.not-applicable {\n  padding: 0px 0px 0px 0px;\n  font-size: 28px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.male-female {\n  font-size: 14px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-top: 12px;\n}\n\n.female-text {\n  font-size: 12px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.month-text {\n  font-size: 12px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.79;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-top: 8px;\n}\n\n.example-margin {\n  margin: 0 10px;\n}\n\n.male-female-bars {\n  padding: 10px 0px 17px 0px;\n}\n\n.inq-inclusion {\n  padding-top: 5px;\n}\n\n.card {\n  border: none;\n  /* width: 18rem; */\n  padding: 5%;\n}\n\n.grid-row {\n  padding-top: 9px;\n  display: grid;\n  grid-template-columns: 48% 27% 25%;\n}\n\n@media (max-width: 768px) {\n  .grid-row {\n    grid-template-columns: 30% 29% 25%;\n  }\n}\n\n.grid-row1 {\n  padding-top: 13px;\n  display: grid;\n  grid-template-columns: 48% 27% 25%;\n}\n\n@media (max-width: 768px) {\n  .grid-row1 {\n    grid-template-columns: 32% 29% 25%;\n  }\n}\n\n.card-img-top {\n  width: 194px;\n  height: 75px;\n}\n\n.male-female-bars {\n  display: grid;\n  grid-template-columns: 25% 50% 25%;\n}\n\n.chartjs-render-monitor {\n  width: 200px;\n}\n\n@media only screen and (max-width: 768px) {\n  .card {\n    border: none !important;\n  }\n\n  .verified-text,\n.percieved-text {\n    font-size: 13px;\n  }\n\n  .sixty-seven,\n.not-applicable {\n    font-size: 25px;\n  }\n\n  .m-t-15 {\n    font-size: 25px;\n    padding-left: 11px;\n  }\n\n  .fm-t-15 {\n    font-size: 25px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hcHBpbmVzcy9EZXNrdG9wL0VuZ2VuZGVyZWQtUHJvamVjdC9zcmMvYXBwL2NvbXBvbmVudHMvY29tcGFueS1wcm9maWxlL2NvbXBhbnktcHJvZmlsZS5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvY29tcG9uZW50cy9jb21wYW55LXByb2ZpbGUvY29tcGFueS1wcm9maWxlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usb0NBQUE7RUFDQSxhQUFBO0VBQ0Esa0NBQUE7RUFJQSxzQkFBQTtBQ0NGOztBRENBO0VBQ0UsZUFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxpQkFBQTtBQ0VGOztBREFBO0VBQ0UsMEJBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ0dGOztBRERBO0VBQ0UseUJBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ0lGOztBREZBO0VBQ0UsWUFBQTtFQUNBLHdCQUFBO0FDS0Y7O0FERkE7RUFDRSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ0tGOztBREZBO0VBQ0UsZUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxpQkFBQTtBQ0tGOztBREZBO0VBQ0Usd0JBQUE7RUFDQSxpQkFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxVQUFBO0FDS0Y7O0FERkE7RUFDRSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsbUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLHFCQUFBO0FDS0Y7O0FERkE7RUFDRSxpQkFBQTtFQUNBLGVBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0JBQUE7RUFDQSxpQkFBQTtFQUNBLHNCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsVUFBQTtBQ0tGOztBREZBO0VBQ0UsZUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLG1CQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxvQkFBQTtBQ0tGOztBREhBO0VBQ0Usd0JBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ01GOztBREhBO0VBQ0Usd0JBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ01GOztBREhBO0VBQ0UsZUFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxpQkFBQTtBQ01GOztBREhBO0VBQ0UsZUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLG1CQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUNNRjs7QURKQTtFQUNFLGVBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0JBQUE7RUFDQSxpQkFBQTtFQUNBLHNCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsZ0JBQUE7QUNPRjs7QURKQTtFQUNFLGNBQUE7QUNPRjs7QURKQTtFQUNFLDBCQUFBO0FDT0Y7O0FESkE7RUFDRSxnQkFBQTtBQ09GOztBREpBO0VBQ0UsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsV0FBQTtBQ09GOztBRENBO0VBQ0UsZ0JBQUE7RUFDQSxhQUFBO0VBQ0Esa0NBQUE7QUNFRjs7QURBQTtFQUNFO0lBQ0Usa0NBQUE7RUNHRjtBQUNGOztBREFBO0VBQ0UsaUJBQUE7RUFDQSxhQUFBO0VBQ0Esa0NBQUE7QUNFRjs7QURBQTtFQUNFO0lBQ0Usa0NBQUE7RUNHRjtBQUNGOztBRERBO0VBQ0UsWUFBQTtFQUNBLFlBQUE7QUNHRjs7QURBQTtFQUNFLGFBQUE7RUFDQSxrQ0FBQTtBQ0dGOztBREFBO0VBQ0UsWUFBQTtBQ0dGOztBRERBO0VBQ0U7SUFDRSx1QkFBQTtFQ0lGOztFRERBOztJQUVFLGVBQUE7RUNJRjs7RUREQTs7SUFFRSxlQUFBO0VDSUY7O0VEREE7SUFDRSxlQUFBO0lBQ0Esa0JBQUE7RUNJRjs7RUREQTtJQUNFLGVBQUE7RUNJRjtBQUNGIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9jb21wYW55LXByb2ZpbGUvY29tcGFueS1wcm9maWxlLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRhaW5lci1mbHVpZCB7XG4gIGJhY2tncm91bmQ6IHVybCguLi8uLi8uLi9hc3NldHMvL2Jhbm5lci1pbWFnZTEucG5nKTtcbiAgaGVpZ2h0OiAxMzdweDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIGNlbnRlcjtcbiAgLW1vei1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAtd2Via2l0LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIC1vLWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG59XG4uY29tcGFueS1uYW1lIHtcbiAgZm9udC1zaXplOiAyMnB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuODM7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nLXRvcDogMTVweDtcbn1cbi5tLXQtMTUge1xuICBwYWRkaW5nOiA0MHB4IDBweCAwcHggMTFweDtcbiAgZm9udC1zaXplOiAyNXB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG4uZm0tdC0xNSB7XG4gIHBhZGRpbmc6IDQwcHggMHB4IDBweCAwcHg7XG4gIGZvbnQtc2l6ZTogMjVweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMDQ7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuLmNhcmQtYm9keSB7XG4gIHBhZGRpbmc6IDBweDtcbiAgLyogcGFkZGluZy1sZWZ0OiAxcmVtOyAqL1xufVxuXG4uaW5xLXRleHQge1xuICBmb250LXNpemU6IDEzcHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zOTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5pbmNsdXNpb24tdGV4dCB7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nLWxlZnQ6IDlweDtcbn1cblxuLm5pbnR5LXRocmVlIHtcbiAgcGFkZGluZzogN3B4IDBweCA3cHggMHB4O1xuICBmb250LXNpemU6IDUwLjVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAwLjQyO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzM5N2M4NjtcbiAgd2lkdGg6IDc1JTtcbn1cblxuLnBlcmNpZXZlZC10ZXh0IHtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgLyogcGFkZGluZy10b3A6N3B4OyAqL1xufVxuXG4uaHVuZHJlZCB7XG4gIHBhZGRpbmctdG9wOiAxMHB4O1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjA0O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgd2lkdGg6IDUwJTtcbn1cblxuLnZlcmlmaWVkLXRleHQge1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nLWJvdHRvbTogMTBweDtcbn1cbi5zaXh0eS1zZXZlbiB7XG4gIHBhZGRpbmc6IDBweCAwcHggMHB4IDBweDtcbiAgZm9udC1zaXplOiAyOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5ub3QtYXBwbGljYWJsZSB7XG4gIHBhZGRpbmc6IDBweCAwcHggMHB4IDBweDtcbiAgZm9udC1zaXplOiAyOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5tYWxlLWZlbWFsZSB7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZy10b3A6IDEycHg7XG59XG5cbi5mZW1hbGUtdGV4dCB7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG4ubW9udGgtdGV4dCB7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuNzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nLXRvcDogOHB4O1xufVxuXG4uZXhhbXBsZS1tYXJnaW4ge1xuICBtYXJnaW46IDAgMTBweDtcbn1cblxuLm1hbGUtZmVtYWxlLWJhcnMge1xuICBwYWRkaW5nOiAxMHB4IDBweCAxN3B4IDBweDtcbn1cblxuLmlucS1pbmNsdXNpb24ge1xuICBwYWRkaW5nLXRvcDogNXB4O1xufVxuXG4uY2FyZCB7XG4gIGJvcmRlcjogbm9uZTtcbiAgLyogd2lkdGg6IDE4cmVtOyAqL1xuICBwYWRkaW5nOiA1JTtcbn1cbi8vIEBtZWRpYShtYXgtd2lkdGg6NzY4cHgpe1xuLy8gICAgIC5jYXJke1xuLy8gICAgICAgICBwYWRkaW5nOiAzMCUgMHB4IDIwcHggMHB4O1xuLy8gICAgIH1cbi8vIH1cblxuLmdyaWQtcm93IHtcbiAgcGFkZGluZy10b3A6IDlweDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA0OCUgMjclIDI1JTtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuZ3JpZC1yb3cge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMzAlIDI5JSAyNSU7XG4gIH1cbn1cblxuLmdyaWQtcm93MSB7XG4gIHBhZGRpbmctdG9wOiAxM3B4O1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDQ4JSAyNyUgMjUlO1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5ncmlkLXJvdzEge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMzIlIDI5JSAyNSU7XG4gIH1cbn1cbi5jYXJkLWltZy10b3Age1xuICB3aWR0aDogMTk0cHg7XG4gIGhlaWdodDogNzVweDtcbn1cblxuLm1hbGUtZmVtYWxlLWJhcnMge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDI1JSA1MCUgMjUlO1xufVxuXG4uY2hhcnRqcy1yZW5kZXItbW9uaXRvciB7XG4gIHdpZHRoOiAyMDBweDtcbn1cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmNhcmQge1xuICAgIGJvcmRlcjogbm9uZSAhaW1wb3J0YW50O1xuICB9XG5cbiAgLnZlcmlmaWVkLXRleHQsXG4gIC5wZXJjaWV2ZWQtdGV4dCB7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICB9XG5cbiAgLnNpeHR5LXNldmVuLFxuICAubm90LWFwcGxpY2FibGUge1xuICAgIGZvbnQtc2l6ZTogMjVweDtcbiAgfVxuXG4gIC5tLXQtMTUge1xuICAgIGZvbnQtc2l6ZTogMjVweDtcbiAgICBwYWRkaW5nLWxlZnQ6IDExcHg7XG4gIH1cblxuICAuZm0tdC0xNSB7XG4gICAgZm9udC1zaXplOiAyNXB4O1xuICB9XG59XG4iLCIuY29udGFpbmVyLWZsdWlkIHtcbiAgYmFja2dyb3VuZDogdXJsKC4uLy4uLy4uL2Fzc2V0cy8vYmFubmVyLWltYWdlMS5wbmcpO1xuICBoZWlnaHQ6IDEzN3B4O1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXIgY2VudGVyO1xuICAtbW96LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIC13ZWJraXQtYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgLW8tYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgYmFja2dyb3VuZC1zaXplOiBjb3Zlcjtcbn1cblxuLmNvbXBhbnktbmFtZSB7XG4gIGZvbnQtc2l6ZTogMjJweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAwLjgzO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZy10b3A6IDE1cHg7XG59XG5cbi5tLXQtMTUge1xuICBwYWRkaW5nOiA0MHB4IDBweCAwcHggMTFweDtcbiAgZm9udC1zaXplOiAyNXB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5mbS10LTE1IHtcbiAgcGFkZGluZzogNDBweCAwcHggMHB4IDBweDtcbiAgZm9udC1zaXplOiAyNXB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5jYXJkLWJvZHkge1xuICBwYWRkaW5nOiAwcHg7XG4gIC8qIHBhZGRpbmctbGVmdDogMXJlbTsgKi9cbn1cblxuLmlucS10ZXh0IHtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG4uaW5jbHVzaW9uLXRleHQge1xuICBmb250LXNpemU6IDEzcHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZy1sZWZ0OiA5cHg7XG59XG5cbi5uaW50eS10aHJlZSB7XG4gIHBhZGRpbmc6IDdweCAwcHggN3B4IDBweDtcbiAgZm9udC1zaXplOiA1MC41cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMC40MjtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMzOTdjODY7XG4gIHdpZHRoOiA3NSU7XG59XG5cbi5wZXJjaWV2ZWQtdGV4dCB7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIC8qIHBhZGRpbmctdG9wOjdweDsgKi9cbn1cblxuLmh1bmRyZWQge1xuICBwYWRkaW5nLXRvcDogMTBweDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHdpZHRoOiA1MCU7XG59XG5cbi52ZXJpZmllZC10ZXh0IHtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZy1ib3R0b206IDEwcHg7XG59XG5cbi5zaXh0eS1zZXZlbiB7XG4gIHBhZGRpbmc6IDBweCAwcHggMHB4IDBweDtcbiAgZm9udC1zaXplOiAyOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5ub3QtYXBwbGljYWJsZSB7XG4gIHBhZGRpbmc6IDBweCAwcHggMHB4IDBweDtcbiAgZm9udC1zaXplOiAyOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5tYWxlLWZlbWFsZSB7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZy10b3A6IDEycHg7XG59XG5cbi5mZW1hbGUtdGV4dCB7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5tb250aC10ZXh0IHtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS43OTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmctdG9wOiA4cHg7XG59XG5cbi5leGFtcGxlLW1hcmdpbiB7XG4gIG1hcmdpbjogMCAxMHB4O1xufVxuXG4ubWFsZS1mZW1hbGUtYmFycyB7XG4gIHBhZGRpbmc6IDEwcHggMHB4IDE3cHggMHB4O1xufVxuXG4uaW5xLWluY2x1c2lvbiB7XG4gIHBhZGRpbmctdG9wOiA1cHg7XG59XG5cbi5jYXJkIHtcbiAgYm9yZGVyOiBub25lO1xuICAvKiB3aWR0aDogMThyZW07ICovXG4gIHBhZGRpbmc6IDUlO1xufVxuXG4uZ3JpZC1yb3cge1xuICBwYWRkaW5nLXRvcDogOXB4O1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDQ4JSAyNyUgMjUlO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmdyaWQtcm93IHtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDMwJSAyOSUgMjUlO1xuICB9XG59XG4uZ3JpZC1yb3cxIHtcbiAgcGFkZGluZy10b3A6IDEzcHg7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogNDglIDI3JSAyNSU7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuZ3JpZC1yb3cxIHtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDMyJSAyOSUgMjUlO1xuICB9XG59XG4uY2FyZC1pbWctdG9wIHtcbiAgd2lkdGg6IDE5NHB4O1xuICBoZWlnaHQ6IDc1cHg7XG59XG5cbi5tYWxlLWZlbWFsZS1iYXJzIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAyNSUgNTAlIDI1JTtcbn1cblxuLmNoYXJ0anMtcmVuZGVyLW1vbml0b3Ige1xuICB3aWR0aDogMjAwcHg7XG59XG5cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmNhcmQge1xuICAgIGJvcmRlcjogbm9uZSAhaW1wb3J0YW50O1xuICB9XG5cbiAgLnZlcmlmaWVkLXRleHQsXG4ucGVyY2lldmVkLXRleHQge1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgfVxuXG4gIC5zaXh0eS1zZXZlbixcbi5ub3QtYXBwbGljYWJsZSB7XG4gICAgZm9udC1zaXplOiAyNXB4O1xuICB9XG5cbiAgLm0tdC0xNSB7XG4gICAgZm9udC1zaXplOiAyNXB4O1xuICAgIHBhZGRpbmctbGVmdDogMTFweDtcbiAgfVxuXG4gIC5mbS10LTE1IHtcbiAgICBmb250LXNpemU6IDI1cHg7XG4gIH1cbn0iXX0= */"

/***/ }),

/***/ "./src/app/components/company-profile/company-profile.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/company-profile/company-profile.component.ts ***!
  \*************************************************************************/
/*! exports provided: CompanyProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompanyProfileComponent", function() { return CompanyProfileComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_service_company_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/service/company.service */ "./src/app/service/company.service.ts");



var CompanyProfileComponent = /** @class */ (function () {
    function CompanyProfileComponent(companyService) {
        this.companyService = companyService;
        this.companyProfiledetails = [];
        this.data = {
            events: [],
            labels: ["Female", "Male"],
            datasets: [
                {
                    data: [25, 75],
                    backgroundColor: ["#148fd5", "#da1b63"]
                }
            ]
        };
        this.pieChartOptions = {
            legend: {
                display: false
            },
            tooltips: {
                enabled: true
            }
        };
    }
    // const data= this.companyService.companayName
    CompanyProfileComponent.prototype.ngOnInit = function () {
        this.companyProfile();
    };
    CompanyProfileComponent.prototype.companyProfile = function () {
        var _this = this;
        this.companyService.getCompanyProfile().subscribe(function (data) {
            // this.companyService.companayName;
            console.log(data);
            if (data) {
                //companyProfiledetails array
                for (var _i = 0, _a = data.data; _i < _a.length; _i++) {
                    var companyProfiledetails = _a[_i];
                    _this.companyProfiledetails.push(companyProfiledetails.companyName); //companyName is api name
                }
                console.log(_this.companyProfiledetails);
            }
        });
    };
    CompanyProfileComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: "app-company-profile",
            template: __webpack_require__(/*! ./company-profile.component.html */ "./src/app/components/company-profile/company-profile.component.html"),
            styles: [__webpack_require__(/*! ./company-profile.component.scss */ "./src/app/components/company-profile/company-profile.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_service_company_service__WEBPACK_IMPORTED_MODULE_2__["CompanyService"]])
    ], CompanyProfileComponent);
    return CompanyProfileComponent;
}());



/***/ }),

/***/ "./src/app/components/component-routing.module.ts":
/*!********************************************************!*\
  !*** ./src/app/components/component-routing.module.ts ***!
  \********************************************************/
/*! exports provided: ComponentRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComponentRoutingModule", function() { return ComponentRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./home/home.component */ "./src/app/components/home/home.component.ts");
/* harmony import */ var _quiz_test_quiz_test_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./quiz-test/quiz-test.component */ "./src/app/components/quiz-test/quiz-test.component.ts");
/* harmony import */ var _quiz_results_quiz_results_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./quiz-results/quiz-results.component */ "./src/app/components/quiz-results/quiz-results.component.ts");
/* harmony import */ var _company_details_company_details_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./company-details/company-details.component */ "./src/app/components/company-details/company-details.component.ts");
/* harmony import */ var _company_profile_company_profile_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./company-profile/company-profile.component */ "./src/app/components/company-profile/company-profile.component.ts");
/* harmony import */ var _detailed_report_detailed_report_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./detailed-report/detailed-report.component */ "./src/app/components/detailed-report/detailed-report.component.ts");
/* harmony import */ var _request_company_request_company_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./request-company/request-company.component */ "./src/app/components/request-company/request-company.component.ts");











var routes = [
    { path: '', component: _home_home_component__WEBPACK_IMPORTED_MODULE_4__["HomeComponent"] },
    { path: 'quiz-test', component: _quiz_test_quiz_test_component__WEBPACK_IMPORTED_MODULE_5__["QuizTestComponent"] },
    { path: 'quiz-results', component: _quiz_results_quiz_results_component__WEBPACK_IMPORTED_MODULE_6__["QuizResultsComponent"] },
    { path: 'company-details', component: _company_details_company_details_component__WEBPACK_IMPORTED_MODULE_7__["CompanyDetailsComponent"] },
    { path: 'company-profile', component: _company_profile_company_profile_component__WEBPACK_IMPORTED_MODULE_8__["CompanyProfileComponent"] },
    { path: 'detailed-report', component: _detailed_report_detailed_report_component__WEBPACK_IMPORTED_MODULE_9__["DetailedReportComponent"] },
    { path: 'request-company', component: _request_company_request_company_component__WEBPACK_IMPORTED_MODULE_10__["RequestCompanyComponent"] }
];
var ComponentRoutingModule = /** @class */ (function () {
    function ComponentRoutingModule() {
    }
    ComponentRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes)
            ],
            exports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]
            ]
        })
    ], ComponentRoutingModule);
    return ComponentRoutingModule;
}());



/***/ }),

/***/ "./src/app/components/component.module.ts":
/*!************************************************!*\
  !*** ./src/app/components/component.module.ts ***!
  \************************************************/
/*! exports provided: ComponentModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComponentModule", function() { return ComponentModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _component_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./component-routing.module */ "./src/app/components/component-routing.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./home/home.component */ "./src/app/components/home/home.component.ts");
/* harmony import */ var _quiz_test_quiz_test_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./quiz-test/quiz-test.component */ "./src/app/components/quiz-test/quiz-test.component.ts");
/* harmony import */ var _quiz_results_quiz_results_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./quiz-results/quiz-results.component */ "./src/app/components/quiz-results/quiz-results.component.ts");
/* harmony import */ var _company_details_company_details_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./company-details/company-details.component */ "./src/app/components/company-details/company-details.component.ts");
/* harmony import */ var _company_profile_company_profile_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./company-profile/company-profile.component */ "./src/app/components/company-profile/company-profile.component.ts");
/* harmony import */ var _detailed_report_detailed_report_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./detailed-report/detailed-report.component */ "./src/app/components/detailed-report/detailed-report.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var primeng_chart__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/chart */ "./node_modules/primeng/chart.js");
/* harmony import */ var primeng_chart__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(primeng_chart__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _request_company_request_company_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./request-company/request-company.component */ "./src/app/components/request-company/request-company.component.ts");















var ComponentModule = /** @class */ (function () {
    function ComponentModule() {
    }
    ComponentModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _home_home_component__WEBPACK_IMPORTED_MODULE_6__["HomeComponent"],
                _quiz_test_quiz_test_component__WEBPACK_IMPORTED_MODULE_7__["QuizTestComponent"],
                _quiz_results_quiz_results_component__WEBPACK_IMPORTED_MODULE_8__["QuizResultsComponent"],
                _company_details_company_details_component__WEBPACK_IMPORTED_MODULE_9__["CompanyDetailsComponent"],
                _company_profile_company_profile_component__WEBPACK_IMPORTED_MODULE_10__["CompanyProfileComponent"],
                _detailed_report_detailed_report_component__WEBPACK_IMPORTED_MODULE_11__["DetailedReportComponent"],
                _request_company_request_company_component__WEBPACK_IMPORTED_MODULE_14__["RequestCompanyComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _component_routing_module__WEBPACK_IMPORTED_MODULE_4__["ComponentRoutingModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ReactiveFormsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_12__["MatAutocompleteModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_12__["MatRadioModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_12__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_12__["MatProgressBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_12__["MatInputModule"],
                primeng_chart__WEBPACK_IMPORTED_MODULE_13__["ChartModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_12__["MatTabsModule"]
            ],
            providers: []
        })
    ], ComponentModule);
    return ComponentModule;
}());



/***/ }),

/***/ "./src/app/components/detailed-report/detailed-report.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/components/detailed-report/detailed-report.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"container-fluid\">\n  <!-- <img src=\"../../../assets/banner-image1.png\" alt=\"\"> -->\n</section>\n<div class=\"detailed_page_wrap\">\n  <div class=\"container flud_wrap\">\n    <div class=\"row infosys\">\n      <div class=\"\">\n        <p class=\"quiz\">\n          INCLUSION<br />\n          quotient quiz\n        </p>\n        <div class=\"contribute\">\n          <p>CONTRIBUTING AS:</p>\n          <p class=\"employee\">EMPLOYEE</p>\n        </div>\n      </div>\n      <div class=\"adjest_info\">\n        <!-- <img src=\"{{detailedReports.imageUrl}}\" alt=\"\"> -->\n        <p class=\"limited\">{{ detailedReports.companyName }}</p>\n      </div>\n    </div>\n  </div>\n  <div class=\"container\">\n    <div class=\"row paging_wrap\">\n      <div class=\"col-md-4\">\n        <div class=\"alg_cord\">\n          <div class=\"card mb-3\">\n            <div class=\"card-body\">\n              <div class=\"abbre\">\n                <p class=\"inq\">InQ</p>\n                <p class=\"mins\">INCLUSION QUOTIENT</p>\n              </div>\n              <div class=\"emmit\">\n                <h5 class=\"card-title\">\n                  {{ detailedReports.inclusionQuotient }}\n                </h5>\n                <img src=\"../../assets/Group 1.png\" alt=\"\" />\n              </div>\n            </div>\n            <div class=\"shareon\">\n              <h4 class=\"share\">SHARE ON</h4>\n              <p class=\"icons\">\n                <a href=\"#\"\n                  ><img\n                    class=\"icon\"\n                    src=\"../../assets/face.png\"\n                    alt=\"facebook\"\n                    class=\"item\"\n                /></a>\n                <a href=\"#\"\n                  ><img\n                    class=\"icon\"\n                    src=\"../../assets/twit.png\"\n                    alt=\"twitter\"\n                    class=\"item\"\n                /></a>\n                <a href=\"#\"\n                  ><img\n                    class=\"icon\"\n                    src=\"../../assets/whats.png\"\n                    alt=\"whatspp\"\n                    class=\"item\"\n                /></a>\n                <a href=\"#\"\n                  ><img\n                    class=\"icon\"\n                    src=\"../../assets/link.png\"\n                    alt=\"linkedin\"\n                    class=\"item\"\n                /></a>\n              </p>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-md-4 p-0\">\n        <div class=\"alg_cord\">\n          <div class=\"card mb-4\">\n            <div class=\"card-body\">\n              <div class=\"facts-score\">\n                <p class=\"mins\">FACTS SCORE</p>\n              </div>\n              <div class=\"emmit\">\n                <h5 class=\"card-title here\">{{ detailedReports.factScore }}</h5>\n                <img src=\"../../assets/Group 1.png\" alt=\"\" />\n              </div>\n            </div>\n            <div class=\"shareon\">\n              <div class=\"grid-images\">\n                <div class=\"manf\">\n                  <img\n                    src=\"../../assets/management.PNG\"\n                    class=\"empratio\"\n                    alt=\"Management\"\n                  />\n                  <p class=\"empratio\">MANGEMENT</p>\n                </div>\n                <div class=\"manf\">\n                  <img\n                    src=\"../../assets/empratio.PNG\"\n                    class=\"empratio\"\n                    alt=\"Empratio\"\n                  />\n                  <p class=\"empratio\">EMPLOYEE RATIO</p>\n                </div>\n                <div class=\"manf\">\n                  <img\n                    src=\"../../assets/directors.PNG\"\n                    class=\"empratio\"\n                    alt=\"Directors\"\n                  />\n                  <p class=\"empratio\">BOARD OF DIRECTORS</p>\n                </div>\n                <div class=\"manf\">\n                  <img\n                    src=\"../../assets/gender.PNG\"\n                    class=\"empratio\"\n                    alt=\"Gender\"\n                  />\n                </div>\n              </div>\n            </div>\n            <div class=\"shareon\">\n              <div class=\"grid-images\">\n                <div class=\"manf\">\n                  <img src=\"../../assets/baby-boy.png\" alt=\"Babyboy\" />\n                  <p class=\"empratio\">CRECHE</p>\n                </div>\n                <div class=\"manf\">\n                  <img src=\"../../assets/family.png\" alt=\"Family\" />\n                  <p class=\"empratio\">\n                    PARENTAL<br />\n                    LEAVE\n                  </p>\n                </div>\n                <div class=\"manf\">\n                  <img src=\"../../assets/compliant.PNG\" alt=\"Complaint\" />\n                  <p class=\"empratio\">POSH<br />COMPLITNT</p>\n                </div>\n                <div class=\"manf\">\n                  <img src=\"../../assets/back-in-time.png\" alt=\"Backintime\" />\n                  <p class=\"empratio\">FLEXI TIME</p>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-md-4 p-0\">\n        <div class=\"alg_cord\">\n          <div class=\"card mb-5\">\n            <div class=\"card-body\">\n              <div class=\"facts-score\">\n                <p class=\"mins\">PERCEPTION SCORE</p>\n              </div>\n              <div class=\"emmit\">\n                <h5 class=\"card-title here\">\n                  {{ detailedReports.perceptionSocre }}\n                </h5>\n                <img src=\"../../assets/Group 1.png\" alt=\"\" />\n              </div>\n            </div>\n            <div class=\"shareon\">\n              <div class=\"grid-images\">\n                <div class=\"manf\">\n                  <img\n                    src=\"../../assets/parity.PNG\"\n                    class=\"align_imgs\"\n                    alt=\"parity\"\n                  />\n                  <p class=\"empratio\">PAY PARITY</p>\n                </div>\n                <div class=\"manf\">\n                  <img\n                    src=\"../../assets/flexitime.PNG\"\n                    class=\"align_imgs\"\n                    alt=\"flexitime\"\n                  />\n                  <p class=\"empratio\">SAFE WORKPLACE</p>\n                </div>\n                <div class=\"manf\">\n                  <img\n                    src=\"../../assets/worklife.PNG\"\n                    class=\"align_imgs\"\n                    alt=\"worklife\"\n                  />\n                  <p class=\"empratio\">WORK LIFE BALANCE</p>\n                </div>\n              </div>\n            </div>\n            <div class=\"shareon\">\n              <p class=\"bab\">REPUTATION SCORE</p>\n              <div class=\"score\">\n                <div class=\"grid-group\">\n                  <h5 class=\"eighty\">\n                    {{ detailedReports.reputationScore }}\n                    <img src=\"../../assets/Group 1.png\" />\n                  </h5>\n                </div>\n                <div class=\"imh\">\n                  <img src=\"../../assets/reputation.PNG\" />\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/detailed-report/detailed-report.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/components/detailed-report/detailed-report.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container-fluid {\n  background: url('banner-image1.png');\n  height: 137px;\n  background-position: center center;\n  background-size: cover;\n}\n\n.detailed_page_wrap {\n  padding: 30px 0px 10px 0px;\n}\n\n.quiz {\n  font-family: Montserrat;\n  font-size: 49px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.infosys {\n  justify-content: space-between;\n  border-bottom: 3px solid;\n}\n\n.contribute {\n  display: flex;\n  padding: 10px 0px 10px 0px;\n}\n\n.employee {\n  font-weight: bold;\n}\n\n.limited {\n  font-family: Montserrat;\n  font-size: 30px;\n  font-weight: 600;\n  color: #000000;\n}\n\n.alg_cord {\n  padding: 20px 0px 0px 0px;\n}\n\n.card-title {\n  background-color: var(--dirty-blue);\n  font-family: Montserrat;\n  font-size: 85.5px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #397c86;\n}\n\n@media (max-width: 768px) {\n  .card-title {\n    font-size: 45px;\n  }\n}\n\n@media (max-width: 768px) {\n  .item {\n    width: 20%;\n  }\n}\n\n.card {\n  border: none;\n}\n\n.emmit {\n  display: flex;\n}\n\n.abbre {\n  display: flex;\n  padding: 0px 0px 10% 0px;\n}\n\n.inq {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n@media (max-width: 768px) {\n  .inq {\n    font-size: 12px;\n  }\n}\n\n.mins {\n  padding: 0px 0px 0px 10px;\n}\n\n@media (max-width: 768px) {\n  .mins {\n    font-size: 12px;\n  }\n}\n\n.share {\n  font-family: Montserrat;\n  font-size: 24px;\n  font-weight: 800;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 10% 0px 0px 0px;\n}\n\n.icons {\n  padding: 20px 0px 0px 0px;\n}\n\n.mb-4 {\n  background: #f6f8f9;\n  border-right: 1px solid #4a7b85;\n  border-radius: 0;\n}\n\n.here {\n  font-size: 60px;\n}\n\n@media (max-width: 768px) {\n  .here {\n    font-size: 35px;\n  }\n}\n\n.grid-images {\n  text-align: center;\n  display: flex;\n  justify-content: space-between;\n}\n\n.facts-score {\n  color: #397c86;\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: bold;\n}\n\n.shareon {\n  padding: 20px 0px 20px 0px;\n}\n\n.empratio {\n  font-size: 14px;\n  line-height: normal;\n  color: #000000;\n  padding: 5px;\n}\n\n@media (max-width: 1024px) {\n  .empratio {\n    font-size: 10px;\n  }\n}\n\n@media (max-width: 768px) {\n  .empratio {\n    font-size: 12px;\n  }\n}\n\n.bab {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.11;\n  letter-spacing: normal;\n  text-align: left;\n  color: #397c86;\n}\n\n.score {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.eighty {\n  background-color: var(--dirty-blue);\n  font-family: Montserrat;\n  font-size: 64px;\n  font-weight: 500;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.45;\n  letter-spacing: normal;\n  text-align: left;\n  color: #397c86;\n}\n\n.mb-5 {\n  background: #f6f8f9;\n}\n\n@media (max-width: 768px) {\n  .col-md-4 {\n    min-width: 50%;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hcHBpbmVzcy9EZXNrdG9wL0VuZ2VuZGVyZWQtUHJvamVjdC9zcmMvYXBwL2NvbXBvbmVudHMvZGV0YWlsZWQtcmVwb3J0L2RldGFpbGVkLXJlcG9ydC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvY29tcG9uZW50cy9kZXRhaWxlZC1yZXBvcnQvZGV0YWlsZWQtcmVwb3J0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usb0NBQUE7RUFDQSxhQUFBO0VBQ0Esa0NBQUE7RUFJQSxzQkFBQTtBQ0NGOztBRENBO0VBQ0UsMEJBQUE7QUNFRjs7QURBQTtFQUNFLHVCQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGNBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ0dGOztBRERBO0VBQ0UsOEJBQUE7RUFDQSx3QkFBQTtBQ0lGOztBREZBO0VBQ0UsYUFBQTtFQUNBLDBCQUFBO0FDS0Y7O0FESEE7RUFDRSxpQkFBQTtBQ01GOztBREpBO0VBQ0UsdUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0FDT0Y7O0FETEE7RUFDRSx5QkFBQTtBQ1FGOztBRE5BO0VBQ0UsbUNBQUE7RUFDQSx1QkFBQTtFQUNBLGlCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUNTRjs7QURQQTtFQUNFO0lBQ0UsZUFBQTtFQ1VGO0FBQ0Y7O0FEUkE7RUFDRTtJQUNFLFVBQUE7RUNVRjtBQUNGOztBRFJBO0VBQ0UsWUFBQTtBQ1VGOztBRFJBO0VBQ0UsYUFBQTtBQ1dGOztBRFRBO0VBQ0UsYUFBQTtFQUNBLHdCQUFBO0FDWUY7O0FEVkE7RUFDRSx1QkFBQTtFQUNBLGVBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0JBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ2FGOztBRFhBO0VBQ0U7SUFDRSxlQUFBO0VDY0Y7QUFDRjs7QURaQTtFQUNFLHlCQUFBO0FDY0Y7O0FEWkE7RUFDRTtJQUNFLGVBQUE7RUNlRjtBQUNGOztBRGJBO0VBQ0UsdUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSx3QkFBQTtBQ2VGOztBRGJBO0VBQ0UseUJBQUE7QUNnQkY7O0FEZEE7RUFDRSxtQkFBQTtFQUNBLCtCQUFBO0VBQ0EsZ0JBQUE7QUNpQkY7O0FEZkE7RUFDRSxlQUFBO0FDa0JGOztBRGhCQTtFQUNFO0lBQ0UsZUFBQTtFQ21CRjtBQUNGOztBRGpCQTtFQUNFLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLDhCQUFBO0FDbUJGOztBRGpCQTtFQUNFLGNBQUE7RUFDQSx1QkFBQTtFQUNBLGVBQUE7RUFDQSxpQkFBQTtBQ29CRjs7QURsQkE7RUFDRSwwQkFBQTtBQ3FCRjs7QURuQkE7RUFDRSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxjQUFBO0VBQ0EsWUFBQTtBQ3NCRjs7QURwQkE7RUFDRTtJQUNFLGVBQUE7RUN1QkY7QUFDRjs7QURyQkE7RUFDRTtJQUNFLGVBQUE7RUN1QkY7QUFDRjs7QURyQkE7RUFDRSx1QkFBQTtFQUNBLGVBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0JBQUE7RUFDQSxpQkFBQTtFQUNBLHNCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0FDdUJGOztBRHJCQTtFQUNFLGFBQUE7RUFDQSw4QkFBQTtFQUNBLG1CQUFBO0FDd0JGOztBRHRCQTtFQUNFLG1DQUFBO0VBQ0EsdUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ3lCRjs7QUR2QkE7RUFDRSxtQkFBQTtBQzBCRjs7QUR4QkE7RUFDRTtJQUNFLGNBQUE7RUMyQkY7QUFDRiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvZGV0YWlsZWQtcmVwb3J0L2RldGFpbGVkLXJlcG9ydC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jb250YWluZXItZmx1aWQge1xuICBiYWNrZ3JvdW5kOiB1cmwoLi4vLi4vLi4vYXNzZXRzLy9iYW5uZXItaW1hZ2UxLnBuZyk7XG4gIGhlaWdodDogMTM3cHg7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XG4gIC1tb3otYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAtby1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xufVxuLmRldGFpbGVkX3BhZ2Vfd3JhcCB7XG4gIHBhZGRpbmc6IDMwcHggMHB4IDEwcHggMHB4O1xufVxuLnF1aXoge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiA0OXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDE7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuLmluZm9zeXMge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGJvcmRlci1ib3R0b206IDNweCBzb2xpZDtcbn1cbi5jb250cmlidXRlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMTBweCAwcHggMTBweCAwcHg7XG59XG4uZW1wbG95ZWUge1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cbi5saW1pdGVkIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMzBweDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG4uYWxnX2NvcmQge1xuICBwYWRkaW5nOiAyMHB4IDBweCAwcHggMHB4O1xufVxuLmNhcmQtdGl0bGUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kaXJ0eS1ibHVlKTtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogODUuNXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMzOTdjODY7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmNhcmQtdGl0bGUge1xuICAgIGZvbnQtc2l6ZTogNDVweDtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pdGVtIHtcbiAgICB3aWR0aDogMjAlO1xuICB9XG59XG4uY2FyZCB7XG4gIGJvcmRlcjogbm9uZTtcbn1cbi5lbW1pdCB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG4uYWJicmUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwcHggMHB4IDEwJSAwcHg7XG59XG4uaW5xIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pbnEge1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgfVxufVxuLm1pbnMge1xuICBwYWRkaW5nOiAwcHggMHB4IDBweCAxMHB4O1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5taW5zIHtcbiAgICBmb250LXNpemU6IDEycHg7XG4gIH1cbn1cbi5zaGFyZSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDI0cHg7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAxMCUgMHB4IDBweCAwcHg7XG59XG4uaWNvbnMge1xuICBwYWRkaW5nOiAyMHB4IDBweCAwcHggMHB4O1xufVxuLm1iLTQge1xuICBiYWNrZ3JvdW5kOiAjZjZmOGY5O1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjNGE3Yjg1O1xuICBib3JkZXItcmFkaXVzOiAwO1xufVxuLmhlcmUge1xuICBmb250LXNpemU6IDYwcHg7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmhlcmUge1xuICAgIGZvbnQtc2l6ZTogMzVweDtcbiAgfVxufVxuLmdyaWQtaW1hZ2VzIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG59XG4uZmFjdHMtc2NvcmUge1xuICBjb2xvcjogIzM5N2M4NjtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG4uc2hhcmVvbiB7XG4gIHBhZGRpbmc6IDIwcHggMHB4IDIwcHggMHB4O1xufVxuLmVtcHJhdGlvIHtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBsaW5lLWhlaWdodDogbm9ybWFsO1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogNXB4O1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xuICAuZW1wcmF0aW8ge1xuICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5lbXByYXRpbyB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG59XG4uYmFiIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjExO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzM5N2M4Njtcbn1cbi5zY29yZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbi5laWdodHkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kaXJ0eS1ibHVlKTtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogNjRweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuNDU7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMzk3Yzg2O1xufVxuLm1iLTUge1xuICBiYWNrZ3JvdW5kOiAjZjZmOGY5O1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5jb2wtbWQtNCB7XG4gICAgbWluLXdpZHRoOiA1MCU7XG4gIH1cbn1cbiIsIi5jb250YWluZXItZmx1aWQge1xuICBiYWNrZ3JvdW5kOiB1cmwoLi4vLi4vLi4vYXNzZXRzLy9iYW5uZXItaW1hZ2UxLnBuZyk7XG4gIGhlaWdodDogMTM3cHg7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XG4gIC1tb3otYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAtby1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xufVxuXG4uZGV0YWlsZWRfcGFnZV93cmFwIHtcbiAgcGFkZGluZzogMzBweCAwcHggMTBweCAwcHg7XG59XG5cbi5xdWl6IHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogNDlweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLmluZm9zeXMge1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGJvcmRlci1ib3R0b206IDNweCBzb2xpZDtcbn1cblxuLmNvbnRyaWJ1dGUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAxMHB4IDBweCAxMHB4IDBweDtcbn1cblxuLmVtcGxveWVlIHtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG5cbi5saW1pdGVkIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMzBweDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5hbGdfY29yZCB7XG4gIHBhZGRpbmc6IDIwcHggMHB4IDBweCAwcHg7XG59XG5cbi5jYXJkLXRpdGxlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGlydHktYmx1ZSk7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDg1LjVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMzk3Yzg2O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmNhcmQtdGl0bGUge1xuICAgIGZvbnQtc2l6ZTogNDVweDtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pdGVtIHtcbiAgICB3aWR0aDogMjAlO1xuICB9XG59XG4uY2FyZCB7XG4gIGJvcmRlcjogbm9uZTtcbn1cblxuLmVtbWl0IHtcbiAgZGlzcGxheTogZmxleDtcbn1cblxuLmFiYnJlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMHB4IDBweCAxMCUgMHB4O1xufVxuXG4uaW5xIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmlucSB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG59XG4ubWlucyB7XG4gIHBhZGRpbmc6IDBweCAwcHggMHB4IDEwcHg7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAubWlucyB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG59XG4uc2hhcmUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAyNHB4O1xuICBmb250LXdlaWdodDogODAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMTAlIDBweCAwcHggMHB4O1xufVxuXG4uaWNvbnMge1xuICBwYWRkaW5nOiAyMHB4IDBweCAwcHggMHB4O1xufVxuXG4ubWItNCB7XG4gIGJhY2tncm91bmQ6ICNmNmY4Zjk7XG4gIGJvcmRlci1yaWdodDogMXB4IHNvbGlkICM0YTdiODU7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG59XG5cbi5oZXJlIHtcbiAgZm9udC1zaXplOiA2MHB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmhlcmUge1xuICAgIGZvbnQtc2l6ZTogMzVweDtcbiAgfVxufVxuLmdyaWQtaW1hZ2VzIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG59XG5cbi5mYWN0cy1zY29yZSB7XG4gIGNvbG9yOiAjMzk3Yzg2O1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cblxuLnNoYXJlb24ge1xuICBwYWRkaW5nOiAyMHB4IDBweCAyMHB4IDBweDtcbn1cblxuLmVtcHJhdGlvIHtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBsaW5lLWhlaWdodDogbm9ybWFsO1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogNXB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTAyNHB4KSB7XG4gIC5lbXByYXRpbyB7XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmVtcHJhdGlvIHtcbiAgICBmb250LXNpemU6IDEycHg7XG4gIH1cbn1cbi5iYWIge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMTE7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMzk3Yzg2O1xufVxuXG4uc2NvcmUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5laWdodHkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kaXJ0eS1ibHVlKTtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogNjRweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuNDU7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMzk3Yzg2O1xufVxuXG4ubWItNSB7XG4gIGJhY2tncm91bmQ6ICNmNmY4Zjk7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuY29sLW1kLTQge1xuICAgIG1pbi13aWR0aDogNTAlO1xuICB9XG59Il19 */"

/***/ }),

/***/ "./src/app/components/detailed-report/detailed-report.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/detailed-report/detailed-report.component.ts ***!
  \*************************************************************************/
/*! exports provided: DetailedReportComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DetailedReportComponent", function() { return DetailedReportComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_service_detailed_report_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/service/detailed-report.service */ "./src/app/service/detailed-report.service.ts");
/* harmony import */ var src_app_service_company_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/service/company.service */ "./src/app/service/company.service.ts");




var DetailedReportComponent = /** @class */ (function () {
    function DetailedReportComponent(detailedService, companyService) {
        this.detailedService = detailedService;
        this.companyService = companyService;
        this.companyNameList = [];
    }
    DetailedReportComponent.prototype.ngOnInit = function () {
        this.getDetailedReports();
    };
    // get detailed report list of each company
    DetailedReportComponent.prototype.getDetailedReports = function () {
        var _this = this;
        this.id = this.companyService.getParticularCompanyId();
        sessionStorage.setItem('companyId', this.id);
        console.log(this.id, 'id');
        this.detailedService.getCompanyById(this.id).subscribe(function (res) {
            _this.detailedReports = res.data;
            console.log(_this.detailedReports);
        });
    };
    DetailedReportComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-detailed-report',
            template: __webpack_require__(/*! ./detailed-report.component.html */ "./src/app/components/detailed-report/detailed-report.component.html"),
            styles: [__webpack_require__(/*! ./detailed-report.component.scss */ "./src/app/components/detailed-report/detailed-report.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_service_detailed_report_service__WEBPACK_IMPORTED_MODULE_2__["DetailedReportService"],
            src_app_service_company_service__WEBPACK_IMPORTED_MODULE_3__["CompanyService"]])
    ], DetailedReportComponent);
    return DetailedReportComponent;
}());



/***/ }),

/***/ "./src/app/components/home/home.component.html":
/*!*****************************************************!*\
  !*** ./src/app/components/home/home.component.html ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"banner\">\n  <div class=\"container-fluid\">\n    <div class=\"banne_content\">\n      <div class=\"txt_align\">\n        <h1 class=\"text-center\">Is my company treating me fairly?</h1>\n        <div class=\"row m-0 justify-content-center\">\n          <div\n            class=\"col-lg-10 col-md-12 col-sm-12 col-xs-12 align-self-center\"\n          >\n            <form class=\"items_aline\">\n              <div class=\"form-group company_wrap\">\n                <input\n                  class=\"form-control arange-item\"\n                  #companyName\n                  required\n                  (input)=\"(null)\"\n                  placeholder=\"Search for a Company\"\n                  [formControl]=\"companycontrol\"\n                  [matAutocomplete]=\"auto\"\n                />\n                <button\n                  [ngClass]=\"\n                    !companyName.value ? 'enable' : 'button_wrap-align'\n                  \"\n                  class=\"\"\n                  type=\"submit\"\n                  (click)=\"searchCompany()\"\n                  [disabled]=\"!companyName.value\"\n                >\n                  <i class=\"fa fa-search\"></i>\n                </button>\n              </div>\n              <mat-autocomplete #auto=\"matAutocomplete\">\n                <mat-option\n                  *ngFor=\"let company of filteredcompany | async\"\n                  [value]=\"company\"\n                >\n                  {{ company }}\n                </mat-option>\n              </mat-autocomplete>\n            </form>\n          </div>\n        </div>\n      </div>\n    </div>\n    <!-- <div class=\"down-arrow\">\n      <div class=\"arrow bounce\">\n        <a class=\"fa fa-arrow-down fa-2x\" href=\"#\"></a>\n      </div>\n    </div> -->\n  </div>\n</section>\n<!------------------------------------ Contributor section----------------------------- -->\n<section id=\"contributor-section\">\n  <p class=\"text-center contributors\">DO YOU WANT TO BE A CONTRIBUTOR ?</p>\n  <div class=\"container\">\n    <form [formGroup]=\"profileForm\">\n      <div class=\"form-row\">\n        <div class=\"col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0 companylist\">\n          <select\n            class=\"form-control\"\n            id=\"comapany-select\"\n            formControlName=\"company\"\n          >\n            <option value=\"\">SELECT THE COMPANY</option>\n            <option\n              *ngFor=\"let companytoplis of companytop\"\n              [value]=\"companytoplis\"\n            >\n              {{ companytoplis }}</option\n            >\n          </select>\n          <div id=\"select-company-icon\">\n            <img\n              src=\"../../assets/select-company.png\"\n              height=\"30px\"\n              alt=\"Select Company\"\n            />\n          </div>\n        </div>\n        <div class=\"col-lg-3 col-md-3 col-sm-12 col-xs-12 p-0 emp\">\n          <select\n            class=\"form-control\"\n            id=\"contribute-as\"\n            #company\n            required\n            (input)=\"(null)\"\n            ng-model=\"selected\"\n            ng-init=\"selected=true\"\n          >\n            <option value=\"\">SELECT THE EMPLOYEE</option>\n            <option [value]=\"curemp\" *ngIf=\"selected\">FORMAR EMPLOYEE</option>\n            <option value=\"1\">CURRENT EMPLOYEE</option>\n          </select>\n        </div>\n        <!-- <pre>{{currentcontrol | json}}</pre> -->\n        <div class=\"col-lg-3 col-md-3 col-sm-12 col-xs-12 p-0\">\n          <div class=\"form-group\">\n            <button\n              class=\"btn btn-started btn-lg\"\n              (click)=\"curforEmp()\"\n              [disabled]=\"profileForm.invalid\"\n            >\n              GET STARTED\n            </button>\n          </div>\n        </div>\n      </div>\n    </form>\n  </div>\n</section>\n<!-----------------------------------Top company's A-Z  section-------------------------->\n<section class=\"top-companiess\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-md-5 col-sm-12 col-xs-12\">\n        <div class=\"top-company-name\">\n          <p>Top company</p>\n        </div>\n      </div>\n      <div class=\"col-md-7 col-sm-12 col-xs-12 float-right\">\n        <p class=\"company-list-order\">\n          <span> A</span>\n          <span> B</span>\n          <span> C</span>\n          <span> D</span>\n          <span> E</span>\n          <span> F</span>\n          <span> G</span>\n          <span> H</span>\n          <span> I</span>\n          <span> J</span>\n          <span> K</span>\n          <span> L</span>\n          <span> M</span>\n          <span> N</span>\n          <span> O</span>\n          <span> P</span>\n          <span> Q</span>\n          <span> R</span>\n          <span> S</span>\n          <span> T</span>\n          <span> U</span>\n          <span> V</span>\n          <span> W</span>\n          <span> X</span>\n          <span> Y</span>\n          <span> Z</span>\n        </p>\n      </div>\n    </div>\n    <div class=\"border-line\"></div>\n  </div>\n</section>\n<!----------------------------- Company list section --------------------------------->\n<section class=\"container\">\n  <div class=\"search-container\">\n    <div class=\"row\">\n      <div class=\"col-md-4 p-0\" *ngFor=\"let companylist of companyCard\">\n        <div class=\"first\">\n          <div class=\"card\">\n            <div class=\"card-body\">\n              <img src=\"/assets/Layer5.png\" alt=\"\" class=\"img-fluid\" />\n              <h5 class=\"title\">{{ companylist.data.companyName }}</h5>\n              <div class=\"content\">\n                <p class=\"inq\">InQ</p>\n                <p class=\"include\">INCLUSION QUOTIENT</p>\n              </div>\n              <div class=\"total-number\">\n                <div class=\"number_align\">\n                  <p class=\"card-text\">\n                    {{ companylist.data.inclusionQuotient }}\n                  </p>\n                  <p class=\"total\">100</p>\n                </div>\n                <div class=\"percieved-quotient-total\">\n                  <div class=\"percieved\">\n                    <p class=\"quotient\">percieved <br />quotient</p>\n                    <p class=\"percent-wrap\">\n                      {{ companylist.data.perceptionSocre }}\n                    </p>\n                  </div>\n                  <div class=\"perce\">\n                    <p class=\"verified\">verified<br />quotient</p>\n                    <p class=\"percent-wrap\">\n                      {{ companylist.data.reputationScore }}\n                    </p>\n                  </div>\n                </div>\n              </div>\n              <p class=\"ratio\">MALE FEMALE RATIO</p>\n              <ul class=\"chart-display\">\n                <li class=\"female-percent\">\n                  {{ companylist.data.managment.female }}<br />\n                  <p class=\"range\">FEMALE</p>\n                </li>\n                <p-chart\n                  type=\"doughnut\"\n                  width=\"100\"\n                  height=\"90\"\n                  [data]=\"data\"\n                  [options]=\"pieChartOptions\"\n                ></p-chart>\n                <li class=\"male-percent\">\n                  {{ companylist.data.managment.male }}<br />\n                  <p class=\"range\">MALE</p>\n                </li>\n              </ul>\n              <p class=\"up_to_date\">27TH <strong>JAN</strong> 2019</p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n"

/***/ }),

/***/ "./src/app/components/home/home.component.scss":
/*!*****************************************************!*\
  !*** ./src/app/components/home/home.component.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".home-text {\n  text-decoration: none;\n  color: #ffffff;\n}\n\n.sub-menu-items {\n  text-decoration: none;\n  color: #d7d7d7;\n}\n\n.header {\n  background: url('banner-image1.png');\n  background-size: contain;\n  background-position: center center;\n  width: 100%;\n  height: 100%;\n}\n\n.header-icon .mat-drawer-container {\n  position: absolute;\n}\n\n.aboutus-header {\n  padding: 30px 0px 0px 0px;\n}\n\n@media (max-width: 500px) {\n  .aboutus-header {\n    display: none;\n  }\n}\n\n.aboutus-header a.directory {\n  color: #fff;\n  font-weight: bold;\n  text-transform: uppercase;\n  font-size: 17px;\n}\n\n/* ------------------------------------Banner section 0 ------------------------------ */\n\n.form-control:focus {\n  box-shadow: 0 0 0 0rem #007bff;\n}\n\n.banner {\n  background-image: url('homepage.png');\n  background-size: inherit;\n  background-position: center center;\n  width: 100%;\n  height: 100%;\n  padding: 1em;\n  padding-top: 4em;\n}\n\n.banner .container-fluid {\n  padding-left: 0px;\n}\n\nh1 {\n  font-family: Montserrat;\n  font-size: 55.5px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.38;\n  letter-spacing: normal;\n  text-align: left;\n  color: #ffffff;\n}\n\nul.side-menu-list {\n  position: absolute;\n  padding-top: 30px;\n}\n\n.banne_content {\n  padding-top: 100px;\n}\n\n.form-control {\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ced4da;\n  border-radius: 0;\n}\n\n@media (max-width: 1500px) {\n  .items_aline {\n    padding: 5% 8% 5% 8%;\n  }\n}\n\n@media (max-width: 1300px) {\n  .items_aline {\n    padding: 5% 2.7% 5% 2.7%;\n  }\n}\n\n@media (max-width: 450px) {\n  .items_aline {\n    padding: 5% 18% 5% 18%;\n  }\n}\n\n@media (max-width: 350px) {\n  .items_aline {\n    padding: 5% 18% 5% 18%;\n  }\n}\n\n@media (max-width: 320px) {\n  .items_aline {\n    padding: 5% 6% 5% 6%;\n  }\n}\n\n.company_wrap {\n  display: flex;\n  box-shadow: 4px 4px 19px -6px #000000;\n}\n\n.button_wrap-align {\n  width: 60px;\n  border: none;\n  background: #0797ae;\n}\n\n.enable {\n  width: 60px;\n  border: none;\n  cursor: not-allowed;\n  background: #afcace;\n}\n\ni.fa.fa-search {\n  color: white;\n}\n\n.arange-item {\n  height: 50px;\n}\n\n@media (max-width: 1024px) {\n  h1.text-center {\n    font-size: 42px;\n  }\n\n  ul.side-menu-list li {\n    padding-bottom: 4px;\n    font-size: 16px;\n  }\n\n  ul.side-menu-list {\n    padding-top: 25px;\n  }\n}\n\n@media (max-width: 768px) {\n  section.banner h1 {\n    font-size: 38px;\n  }\n\n  .banner {\n    background-size: cover;\n  }\n}\n\n@media (max-width: 640px) and (min-width: 360px) {\n  section.banner h1 {\n    font-size: 18px;\n  }\n\n  .img-fluid {\n    max-width: 100%;\n    height: 90px;\n  }\n\n  ul.side-menu-list {\n    display: none;\n  }\n\n  .banne_content[_ngcontent-bqh-c1] {\n    padding-top: 30px;\n  }\n}\n\n@media (max-width: 480px) and (min-width: 320px) {\n  section.banner h1 {\n    font-size: 13px;\n  }\n\n  .form-control {\n    font-size: 12px;\n  }\n\n  .arange-item {\n    height: 30px;\n  }\n\n  .img-fluid {\n    max-width: 100%;\n    height: 90px;\n  }\n\n  ul.side-menu-list {\n    display: none;\n  }\n}\n\n/* ---------------------------------arrow section 1-------------------------------- */\n\n.down-arrow a {\n  color: white;\n  text-decoration: none;\n}\n\n.down-arrow .arrow {\n  text-align: center;\n  margin: 0 0;\n}\n\n.arrow {\n  position: unset;\n  top: 0;\n  right: 0;\n}\n\n.down-arrow .bounce {\n  -webkit-animation: bounce 2s infinite;\n  animation: bounce 2s infinite;\n}\n\n@-webkit-keyframes bounce {\n  0%, 20%, 50%, 80%, 100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-30px);\n  }\n  60% {\n    transform: translateY(-15px);\n  }\n}\n\n@keyframes bounce {\n  0%, 20%, 50%, 80%, 100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-30px);\n  }\n  60% {\n    transform: translateY(-15px);\n  }\n}\n\n/* ------------------------------contributor-section 2------------------------------- */\n\nsection#contributor-section {\n  padding: 30px 0;\n}\n\np.text-center.contributors {\n  font-size: 30px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-bottom: 30px;\n}\n\n.emp,\n.companylist {\n  padding-left: 35px;\n  color: #000000;\n  font-size: 13px;\n  background-position-x: 240px;\n  border-radius: 0px;\n  height: 60px;\n}\n\n#comapany-select {\n  border-left: 1px solid #e0e6ed;\n  position: relative;\n  padding-left: 80px;\n  color: #000000;\n  font-size: 13px;\n}\n\n.emp select,\n.companylist select {\n  -webkit-appearance: menulist;\n  border-radius: 0px;\n  height: 60px;\n  border-left: 0px;\n}\n\n#select-company-icon {\n  position: absolute;\n  top: 16px;\n  left: 32px;\n}\n\n#contribute-as {\n  padding-left: 0px;\n  color: #000000;\n  position: relative;\n  font-size: 13px;\n  background-position-x: 240px;\n  padding-left: 60px;\n}\n\n.btn-started {\n  border: 1px solid #e0e6ed;\n  border-radius: 0;\n  border-left: none;\n  font-size: 13px;\n  color: black;\n  background-color: white;\n  position: relative;\n}\n\n.btn {\n  font-size: 15px;\n  font-weight: 700;\n  line-height: 18px;\n  border-radius: 0;\n  outline: none;\n  height: 60px;\n  width: 100%;\n}\n\n/* ------------------------------Top company A-Z section 3------------------------------- */\n\nsection.top-companiess {\n  padding: 30px 0 20px 0;\n}\n\n.top-company-name p {\n  font-family: Montserrat;\n  font-size: 40px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.7;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  text-transform: uppercase;\n}\n\np.company-list-order {\n  float: right;\n}\n\np.company-list-order span {\n  letter-spacing: 3px;\n}\n\n.border-line {\n  padding-top: 40px;\n  border-bottom: 1px solid #e0e6ed;\n}\n\n@media (max-width: 1024px) {\n  .emp,\n.companylist {\n    border-left: 1px solid #e0e6ed;\n    margin-bottom: 1rem;\n  }\n}\n\n@media (max-width: 768px) {\n  p.text-center.contributors {\n    font-size: 16px;\n  }\n\n  #contribute-as {\n    padding-left: 80px;\n    color: #000000;\n    font-size: 13px;\n    background-position-x: 300px;\n  }\n\n  .form-group {\n    border-left: 1px solid #e0e6ed;\n  }\n\n  .top-company-name p {\n    font-size: 16px;\n    text-align: center;\n    margin-bottom: 15px;\n  }\n}\n\n/* -------------------------Top company list section 4 --------------------------------*/\n\n.card {\n  padding: 20px 0px 20px 0px;\n  border: none;\n}\n\n.title {\n  font-family: Montserrat;\n  font-size: 25px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 20px 0px 20px 0px;\n  border-bottom: 3px solid;\n}\n\n.content {\n  display: flex;\n  padding-top: 15px;\n}\n\n.total-number {\n  display: flex;\n  border-bottom: 1px solid #ccc;\n  padding: 0 0 10px 0;\n}\n\n.ratio {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 10px 0px 10px 0px;\n}\n\n.chart-display {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid #cccccc;\n  padding: 0px 0px 20px 0px;\n}\n\n.up_to_date {\n  font-family: Montserrat;\n  font-size: 14px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  font: bold;\n  padding-top: 10px;\n}\n\n.inq {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px 0px 20px 0px;\n}\n\n.include {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px 0px 0px 10px;\n}\n\n.card-text {\n  font-family: Montserrat;\n  font-size: 85.5px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #397c86;\n  border-bottom: 1px solid;\n}\n\n.percieved-quotient-total {\n  width: 100%;\n}\n\nli {\n  list-style-type: none;\n  color: #fff;\n  text-transform: uppercase;\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  padding-bottom: 5px;\n  letter-spacing: normal;\n  text-align: left;\n  color: #ffffff;\n}\n\n.range {\n  font-family: Montserrat;\n  font-size: 14px;\n  text-align: left;\n  color: #000000;\n}\n\n.percieved {\n  display: flex;\n  padding: 30px 0px 0px 20px;\n  float: right;\n}\n\n.quotient {\n  font-family: Montserrat;\n  font-size: 14px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0 10px 0px 0px;\n}\n\n.percent-wrap {\n  font-family: Montserrat;\n  font-size: 35px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.perce {\n  display: flex;\n  padding: 30px 0px 0px 20px;\n  float: right;\n}\n\n.verified {\n  font-family: Montserrat;\n  font-size: 14px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px 20px 0px 0px;\n}\n\n@media (max-width: 480px) and (min-width: 320px) {\n  section.banner .img-fluid {\n    max-width: 100%;\n    height: 90px;\n  }\n}\n\n.sidenav {\n  height: 100%;\n  width: 0;\n  position: fixed;\n  z-index: 1;\n  top: 0;\n  left: 0;\n  background-color: #111;\n  overflow-x: hidden;\n  transition: 0.5s;\n  padding-top: 60px;\n}\n\n.sidenav a {\n  padding: 8px 8px 8px 32px;\n  text-decoration: none;\n  font-size: 25px;\n  color: #818181;\n  display: block;\n  transition: 0.3s;\n}\n\n.sidenav a:hover {\n  color: #f1f1f1;\n}\n\n.sidenav .closebtn {\n  position: absolute;\n  top: 0;\n  right: 25px;\n  font-size: 36px;\n  margin-left: 50px;\n}\n\n@media screen and (max-height: 450px) {\n  .sidenav {\n    padding-top: 15px;\n  }\n\n  .sidenav a {\n    font-size: 18px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hcHBpbmVzcy9EZXNrdG9wL0VuZ2VuZGVyZWQtUHJvamVjdC9zcmMvYXBwL2NvbXBvbmVudHMvaG9tZS9ob21lLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9jb21wb25lbnRzL2hvbWUvaG9tZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFBO0VBQ0EsY0FBQTtBQ0NGOztBREVBO0VBQ0UscUJBQUE7RUFDQSxjQUFBO0FDQ0Y7O0FERUE7RUFDRSxvQ0FBQTtFQUlBLHdCQUFBO0VBQ0Esa0NBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQ0NGOztBREVBO0VBQ0Usa0JBQUE7QUNDRjs7QURFQTtFQUNFLHlCQUFBO0FDQ0Y7O0FEQ0E7RUFDRTtJQUNFLGFBQUE7RUNFRjtBQUNGOztBRENBO0VBQ0UsV0FBQTtFQUNBLGlCQUFBO0VBQ0EseUJBQUE7RUFDQSxlQUFBO0FDQ0Y7O0FERUEsd0ZBQUE7O0FBQ0E7RUFDRSw4QkFBQTtBQ0NGOztBRENBO0VBQ0UscUNBQUE7RUFJQSx3QkFBQTtFQUNBLGtDQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7QUNFRjs7QURDQTtFQUNFLGlCQUFBO0FDRUY7O0FEQ0E7RUFDRSx1QkFBQTtFQUNBLGlCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ0VGOztBRENBO0VBQ0Usa0JBQUE7RUFDQSxpQkFBQTtBQ0VGOztBRENBO0VBQ0Usa0JBQUE7QUNFRjs7QURDQTtFQUNFLHNCQUFBO0VBQ0EsNEJBQUE7RUFDQSx5QkFBQTtFQUNBLGdCQUFBO0FDRUY7O0FEQUE7RUFDRTtJQUNFLG9CQUFBO0VDR0Y7QUFDRjs7QUREQTtFQUNFO0lBQ0Usd0JBQUE7RUNHRjtBQUNGOztBRERBO0VBQ0U7SUFDRSxzQkFBQTtFQ0dGO0FBQ0Y7O0FEREE7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Q0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0FDQUY7O0FER0E7RUFDRSx5QkFBQTtFQUNBLHFCQUFBO0VBQ0EsZUFBQTtFQUNBLGNBQUE7RUFDQSxjQUFBO0VBQ0EsZ0JBQUE7QUNBRjs7QURHQTtFQUNFLGNBQUE7QUNBRjs7QURHQTtFQUNFLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLFdBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7QUNBRjs7QURHQTtFQUNFO0lBQ0UsaUJBQUE7RUNBRjs7RURFQTtJQUNFLGVBQUE7RUNDRjtBQUNGIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9ob21lL2hvbWUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaG9tZS10ZXh0IHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjb2xvcjogI2ZmZmZmZjtcbn1cblxuLnN1Yi1tZW51LWl0ZW1zIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjb2xvcjogI2Q3ZDdkNztcbn1cblxuLmhlYWRlciB7XG4gIGJhY2tncm91bmQ6IHVybCguLi8uLi8uLi9hc3NldHMvYmFubmVyLWltYWdlMS5wbmcpO1xuICAtd2Via2l0LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIC1tb3otYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgLW8tYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgYmFja2dyb3VuZC1zaXplOiBjb250YWluO1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXIgY2VudGVyO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4uaGVhZGVyLWljb24gLm1hdC1kcmF3ZXItY29udGFpbmVyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xufVxuXG4uYWJvdXR1cy1oZWFkZXIge1xuICBwYWRkaW5nOiAzMHB4IDBweCAwcHggMHB4O1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC5hYm91dHVzLWhlYWRlciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuXG4uYWJvdXR1cy1oZWFkZXIgYS5kaXJlY3Rvcnkge1xuICBjb2xvcjogI2ZmZjtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGZvbnQtc2l6ZTogMTdweDtcbn1cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tQmFubmVyIHNlY3Rpb24gMCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi5mb3JtLWNvbnRyb2w6Zm9jdXMge1xuICBib3gtc2hhZG93OiAwIDAgMCAwcmVtIHJnYmEoMCwgMTIzLCAyNTUpO1xufVxuLmJhbm5lciB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi8uLi8uLi9hc3NldHMvaG9tZXBhZ2UucG5nKTtcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAtbW96LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIC1vLWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIGJhY2tncm91bmQtc2l6ZTogaW5oZXJpdDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgcGFkZGluZzogMWVtO1xuICBwYWRkaW5nLXRvcDogNGVtO1xufVxuXG4uYmFubmVyIC5jb250YWluZXItZmx1aWQge1xuICBwYWRkaW5nLWxlZnQ6IDBweDtcbn1cblxuaDEge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiA1NS41cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zODtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICNmZmZmZmY7XG59XG5cbnVsLnNpZGUtbWVudS1saXN0IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBwYWRkaW5nLXRvcDogMzBweDtcbn1cblxuLmJhbm5lX2NvbnRlbnQge1xuICBwYWRkaW5nLXRvcDogMTAwcHg7XG59XG5cbi5mb3JtLWNvbnRyb2wge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICBiYWNrZ3JvdW5kLWNsaXA6IHBhZGRpbmctYm94O1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2VkNGRhO1xuICBib3JkZXItcmFkaXVzOiAwO1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDE1MDBweCkge1xuICAuaXRlbXNfYWxpbmUge1xuICAgIHBhZGRpbmc6IDUlIDglIDUlIDglO1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogMTMwMHB4KSB7XG4gIC5pdGVtc19hbGluZSB7XG4gICAgcGFkZGluZzogNSUgMi43JSA1JSAyLjclO1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogNDUwcHgpIHtcbiAgLml0ZW1zX2FsaW5lIHtcbiAgICBwYWRkaW5nOiA1JSAxOCUgNSUgMTglO1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogMzUwcHgpIHtcbiAgLml0ZW1zX2FsaW5lIHtcbiAgICBwYWRkaW5nOiA1JSAxOCUgNSUgMTglO1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogMzIwcHgpIHtcbiAgLml0ZW1zX2FsaW5lIHtcbiAgICBwYWRkaW5nOiA1JSA2JSA1JSA2JTtcbiAgfVxufVxuLmNvbXBhbnlfd3JhcCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGJveC1zaGFkb3c6IDRweCA0cHggMTlweCAtNnB4ICMwMDAwMDA7XG59XG5cbi5idXR0b25fd3JhcC1hbGlnbiB7XG4gIHdpZHRoOiA2MHB4O1xuICBib3JkZXI6IG5vbmU7XG4gIGJhY2tncm91bmQ6ICMwNzk3YWU7XG59XG4uZW5hYmxlIHtcbiAgd2lkdGg6IDYwcHg7XG4gIGJvcmRlcjogbm9uZTtcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgYmFja2dyb3VuZDogI2FmY2FjZTtcbn1cblxuaS5mYS5mYS1zZWFyY2gge1xuICBjb2xvcjogd2hpdGU7XG59XG5cbi5hcmFuZ2UtaXRlbSB7XG4gIGhlaWdodDogNTBweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xuICBoMS50ZXh0LWNlbnRlciB7XG4gICAgZm9udC1zaXplOiA0MnB4O1xuICB9XG4gIHVsLnNpZGUtbWVudS1saXN0IGxpIHtcbiAgICBwYWRkaW5nLWJvdHRvbTogNHB4O1xuICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgfVxuICB1bC5zaWRlLW1lbnUtbGlzdCB7XG4gICAgcGFkZGluZy10b3A6IDI1cHg7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIHNlY3Rpb24uYmFubmVyIGgxIHtcbiAgICBmb250LXNpemU6IDM4cHg7XG4gIH1cblxuICAuYmFubmVyIHtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCkgYW5kIChtaW4td2lkdGg6IDM2MHB4KSB7XG4gIHNlY3Rpb24uYmFubmVyIGgxIHtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gIH1cbiAgLmltZy1mbHVpZCB7XG4gICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogOTBweDtcbiAgfVxuICB1bC5zaWRlLW1lbnUtbGlzdCB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuICAuYmFubmVfY29udGVudFtfbmdjb250ZW50LWJxaC1jMV0ge1xuICAgIHBhZGRpbmctdG9wOiAzMHB4O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA0ODBweCkgYW5kIChtaW4td2lkdGg6IDMyMHB4KSB7XG4gIHNlY3Rpb24uYmFubmVyIGgxIHtcbiAgICBmb250LXNpemU6IDEzcHg7XG4gIH1cbiAgLmZvcm0tY29udHJvbCB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG4gIC5hcmFuZ2UtaXRlbSB7XG4gICAgaGVpZ2h0OiAzMHB4O1xuICB9XG4gIC5pbWctZmx1aWQge1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDkwcHg7XG4gIH1cbiAgdWwuc2lkZS1tZW51LWxpc3Qge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbn1cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tYXJyb3cgc2VjdGlvbiAxLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLmRvd24tYXJyb3cgYSB7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuXG4uZG93bi1hcnJvdyAuYXJyb3cge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIG1hcmdpbjogMCAwO1xufVxuXG4uYXJyb3cge1xuICBwb3NpdGlvbjogdW5zZXQ7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG59XG5cbi5kb3duLWFycm93IC5ib3VuY2Uge1xuICAtbW96LWFuaW1hdGlvbjogYm91bmNlIDJzIGluZmluaXRlO1xuICAtd2Via2l0LWFuaW1hdGlvbjogYm91bmNlIDJzIGluZmluaXRlO1xuICBhbmltYXRpb246IGJvdW5jZSAycyBpbmZpbml0ZTtcbn1cblxuQGtleWZyYW1lcyBib3VuY2Uge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zMHB4KTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTVweCk7XG4gIH1cbn1cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tY29udHJpYnV0b3Itc2VjdGlvbiAyLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5zZWN0aW9uI2NvbnRyaWJ1dG9yLXNlY3Rpb24ge1xuICBwYWRkaW5nOiAzMHB4IDA7XG59XG5cbnAudGV4dC1jZW50ZXIuY29udHJpYnV0b3JzIHtcbiAgZm9udC1zaXplOiAzMHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuODM7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nLWJvdHRvbTogMzBweDtcbn1cblxuLmVtcCxcbi5jb21wYW55bGlzdCB7XG4gIHBhZGRpbmctbGVmdDogMzVweDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbi14OiAyNDBweDtcbiAgYm9yZGVyLXJhZGl1czogMHB4O1xuICBoZWlnaHQ6IDYwcHg7XG59XG5cbiNjb21hcGFueS1zZWxlY3Qge1xuICBib3JkZXItbGVmdDogMXB4IHNvbGlkICNlMGU2ZWQ7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZy1sZWZ0OiA4MHB4O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgZm9udC1zaXplOiAxM3B4O1xufVxuXG4uZW1wIHNlbGVjdCxcbi5jb21wYW55bGlzdCBzZWxlY3Qge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG1lbnVsaXN0O1xuICBib3JkZXItcmFkaXVzOiAwcHg7XG4gIGhlaWdodDogNjBweDtcbiAgYm9yZGVyLWxlZnQ6IDBweDtcbn1cblxuI3NlbGVjdC1jb21wYW55LWljb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTZweDtcbiAgbGVmdDogMzJweDtcbn1cblxuI2NvbnRyaWJ1dGUtYXMge1xuICBwYWRkaW5nLWxlZnQ6IDBweDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uLXg6IDI0MHB4O1xuICBwYWRkaW5nLWxlZnQ6IDYwcHg7XG59XG5cbi5idG4tc3RhcnRlZCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlMGU2ZWQ7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG4gIGJvcmRlci1sZWZ0OiBub25lO1xuICBmb250LXNpemU6IDEzcHg7XG4gIGNvbG9yOiBibGFjaztcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuLmJ0biB7XG4gIGZvbnQtc2l6ZTogMTVweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDE4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG4gIG91dGxpbmU6IG5vbmU7XG4gIGhlaWdodDogNjBweDtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVRvcCBjb21wYW55IEEtWiBzZWN0aW9uIDMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbnNlY3Rpb24udG9wLWNvbXBhbmllc3Mge1xuICBwYWRkaW5nOiAzMHB4IDAgMjBweCAwO1xufVxuXG4udG9wLWNvbXBhbnktbmFtZSBwIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogNDBweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAwLjc7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuXG5wLmNvbXBhbnktbGlzdC1vcmRlciB7XG4gIGZsb2F0OiByaWdodDtcbn1cblxucC5jb21wYW55LWxpc3Qtb3JkZXIgc3BhbiB7XG4gIGxldHRlci1zcGFjaW5nOiAzcHg7XG59XG5cbi5ib3JkZXItbGluZSB7XG4gIHBhZGRpbmctdG9wOiA0MHB4O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2UwZTZlZDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xuICAuZW1wLFxuICAuY29tcGFueWxpc3Qge1xuICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgI2UwZTZlZDtcbiAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICBwLnRleHQtY2VudGVyLmNvbnRyaWJ1dG9ycyB7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICB9XG4gICNjb250cmlidXRlLWFzIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDgwcHg7XG4gICAgY29sb3I6ICMwMDAwMDA7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICAgIGJhY2tncm91bmQtcG9zaXRpb24teDogMzAwcHg7XG4gIH1cbiAgLmZvcm0tZ3JvdXAge1xuICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgI2UwZTZlZDtcbiAgfVxuICAudG9wLWNvbXBhbnktbmFtZSBwIHtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIG1hcmdpbi1ib3R0b206IDE1cHg7XG4gIH1cbn1cblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVRvcCBjb21wYW55IGxpc3Qgc2VjdGlvbiA0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLmNhcmQge1xuICBwYWRkaW5nOiAyMHB4IDBweCAyMHB4IDBweDtcbiAgYm9yZGVyOiBub25lO1xufVxuXG4udGl0bGUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAyNXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuODM7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAyMHB4IDBweCAyMHB4IDBweDtcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkO1xufVxuXG4uY29udGVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmctdG9wOiAxNXB4O1xufVxuXG4udG90YWwtbnVtYmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XG4gIHBhZGRpbmc6IDAgMCAxMHB4IDA7XG59XG5cbi5yYXRpbyB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zOTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDEwcHggMHB4IDEwcHggMHB4O1xufVxuXG4uY2hhcnQtZGlzcGxheSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2NjY2M7XG4gIHBhZGRpbmc6IDBweCAwcHggMjBweCAwcHg7XG59XG5cbi51cF90b19kYXRlIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIGZvbnQ6IGJvbGQ7XG4gIHBhZGRpbmctdG9wOiAxMHB4O1xufVxuXG4uaW5xIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAyMHB4IDBweDtcbn1cblxuLmluY2x1ZGUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAwcHggMTBweDtcbn1cblxuLmNhcmQtdGV4dCB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDg1LjVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMzk3Yzg2O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQ7XG59XG5cbi5wZXJjaWV2ZWQtcXVvdGllbnQtdG90YWwge1xuICB3aWR0aDogMTAwJTtcbn1cblxubGkge1xuICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XG4gIGNvbG9yOiAjZmZmO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIHBhZGRpbmctYm90dG9tOiA1cHg7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjZmZmZmZmO1xufVxuXG4ucmFuZ2Uge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLnBlcmNpZXZlZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDMwcHggMHB4IDBweCAyMHB4O1xuICBmbG9hdDogcmlnaHQ7XG59XG5cbi5xdW90aWVudCB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAwIDEwcHggMHB4IDBweDtcbn1cblxuLnBlcmNlbnQtd3JhcCB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDM1cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjA0O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLnBlcmNlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMzBweCAwcHggMHB4IDIwcHg7XG4gIGZsb2F0OiByaWdodDtcbn1cblxuLnZlcmlmaWVkIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDBweCAyMHB4IDBweCAwcHg7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA0ODBweCkgYW5kIChtaW4td2lkdGg6IDMyMHB4KSB7XG4gIHNlY3Rpb24uYmFubmVyIC5pbWctZmx1aWQge1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDkwcHg7XG4gIH1cbn1cblxuLnNpZGVuYXYge1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAwO1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHotaW5kZXg6IDE7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzExMTtcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICB0cmFuc2l0aW9uOiAwLjVzO1xuICBwYWRkaW5nLXRvcDogNjBweDtcbn1cblxuLnNpZGVuYXYgYSB7XG4gIHBhZGRpbmc6IDhweCA4cHggOHB4IDMycHg7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgZm9udC1zaXplOiAyNXB4O1xuICBjb2xvcjogIzgxODE4MTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHRyYW5zaXRpb246IDAuM3M7XG59XG5cbi5zaWRlbmF2IGE6aG92ZXIge1xuICBjb2xvcjogI2YxZjFmMTtcbn1cblxuLnNpZGVuYXYgLmNsb3NlYnRuIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAyNXB4O1xuICBmb250LXNpemU6IDM2cHg7XG4gIG1hcmdpbi1sZWZ0OiA1MHB4O1xufVxuXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LWhlaWdodDogNDUwcHgpIHtcbiAgLnNpZGVuYXYge1xuICAgIHBhZGRpbmctdG9wOiAxNXB4O1xuICB9XG4gIC5zaWRlbmF2IGEge1xuICAgIGZvbnQtc2l6ZTogMThweDtcbiAgfVxufVxuIiwiLmhvbWUtdGV4dCB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgY29sb3I6ICNmZmZmZmY7XG59XG5cbi5zdWItbWVudS1pdGVtcyB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgY29sb3I6ICNkN2Q3ZDc7XG59XG5cbi5oZWFkZXIge1xuICBiYWNrZ3JvdW5kOiB1cmwoLi4vLi4vLi4vYXNzZXRzL2Jhbm5lci1pbWFnZTEucG5nKTtcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAtbW96LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIC1vLWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIGJhY2tncm91bmQtc2l6ZTogY29udGFpbjtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbn1cblxuLmhlYWRlci1pY29uIC5tYXQtZHJhd2VyLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbn1cblxuLmFib3V0dXMtaGVhZGVyIHtcbiAgcGFkZGluZzogMzBweCAwcHggMHB4IDBweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC5hYm91dHVzLWhlYWRlciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuLmFib3V0dXMtaGVhZGVyIGEuZGlyZWN0b3J5IHtcbiAgY29sb3I6ICNmZmY7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LXNpemU6IDE3cHg7XG59XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUJhbm5lciBzZWN0aW9uIDAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4uZm9ybS1jb250cm9sOmZvY3VzIHtcbiAgYm94LXNoYWRvdzogMCAwIDAgMHJlbSAjMDA3YmZmO1xufVxuXG4uYmFubmVyIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4uLy4uLy4uL2Fzc2V0cy9ob21lcGFnZS5wbmcpO1xuICAtd2Via2l0LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIC1tb3otYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgLW8tYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgYmFja2dyb3VuZC1zaXplOiBpbmhlcml0O1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXIgY2VudGVyO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBwYWRkaW5nOiAxZW07XG4gIHBhZGRpbmctdG9wOiA0ZW07XG59XG5cbi5iYW5uZXIgLmNvbnRhaW5lci1mbHVpZCB7XG4gIHBhZGRpbmctbGVmdDogMHB4O1xufVxuXG5oMSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDU1LjVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM4O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogI2ZmZmZmZjtcbn1cblxudWwuc2lkZS1tZW51LWxpc3Qge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHBhZGRpbmctdG9wOiAzMHB4O1xufVxuXG4uYmFubmVfY29udGVudCB7XG4gIHBhZGRpbmctdG9wOiAxMDBweDtcbn1cblxuLmZvcm0tY29udHJvbCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIGJhY2tncm91bmQtY2xpcDogcGFkZGluZy1ib3g7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjZWQ0ZGE7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxNTAwcHgpIHtcbiAgLml0ZW1zX2FsaW5lIHtcbiAgICBwYWRkaW5nOiA1JSA4JSA1JSA4JTtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDEzMDBweCkge1xuICAuaXRlbXNfYWxpbmUge1xuICAgIHBhZGRpbmc6IDUlIDIuNyUgNSUgMi43JTtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDQ1MHB4KSB7XG4gIC5pdGVtc19hbGluZSB7XG4gICAgcGFkZGluZzogNSUgMTglIDUlIDE4JTtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDM1MHB4KSB7XG4gIC5pdGVtc19hbGluZSB7XG4gICAgcGFkZGluZzogNSUgMTglIDUlIDE4JTtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDMyMHB4KSB7XG4gIC5pdGVtc19hbGluZSB7XG4gICAgcGFkZGluZzogNSUgNiUgNSUgNiU7XG4gIH1cbn1cbi5jb21wYW55X3dyYXAge1xuICBkaXNwbGF5OiBmbGV4O1xuICBib3gtc2hhZG93OiA0cHggNHB4IDE5cHggLTZweCAjMDAwMDAwO1xufVxuXG4uYnV0dG9uX3dyYXAtYWxpZ24ge1xuICB3aWR0aDogNjBweDtcbiAgYm9yZGVyOiBub25lO1xuICBiYWNrZ3JvdW5kOiAjMDc5N2FlO1xufVxuXG4uZW5hYmxlIHtcbiAgd2lkdGg6IDYwcHg7XG4gIGJvcmRlcjogbm9uZTtcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgYmFja2dyb3VuZDogI2FmY2FjZTtcbn1cblxuaS5mYS5mYS1zZWFyY2gge1xuICBjb2xvcjogd2hpdGU7XG59XG5cbi5hcmFuZ2UtaXRlbSB7XG4gIGhlaWdodDogNTBweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xuICBoMS50ZXh0LWNlbnRlciB7XG4gICAgZm9udC1zaXplOiA0MnB4O1xuICB9XG5cbiAgdWwuc2lkZS1tZW51LWxpc3QgbGkge1xuICAgIHBhZGRpbmctYm90dG9tOiA0cHg7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICB9XG5cbiAgdWwuc2lkZS1tZW51LWxpc3Qge1xuICAgIHBhZGRpbmctdG9wOiAyNXB4O1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgc2VjdGlvbi5iYW5uZXIgaDEge1xuICAgIGZvbnQtc2l6ZTogMzhweDtcbiAgfVxuXG4gIC5iYW5uZXIge1xuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCkgYW5kIChtaW4td2lkdGg6IDM2MHB4KSB7XG4gIHNlY3Rpb24uYmFubmVyIGgxIHtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gIH1cblxuICAuaW1nLWZsdWlkIHtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiA5MHB4O1xuICB9XG5cbiAgdWwuc2lkZS1tZW51LWxpc3Qge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cblxuICAuYmFubmVfY29udGVudFtfbmdjb250ZW50LWJxaC1jMV0ge1xuICAgIHBhZGRpbmctdG9wOiAzMHB4O1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogNDgwcHgpIGFuZCAobWluLXdpZHRoOiAzMjBweCkge1xuICBzZWN0aW9uLmJhbm5lciBoMSB7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICB9XG5cbiAgLmZvcm0tY29udHJvbCB7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICB9XG5cbiAgLmFyYW5nZS1pdGVtIHtcbiAgICBoZWlnaHQ6IDMwcHg7XG4gIH1cblxuICAuaW1nLWZsdWlkIHtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiA5MHB4O1xuICB9XG5cbiAgdWwuc2lkZS1tZW51LWxpc3Qge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWFycm93IHNlY3Rpb24gMS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4uZG93bi1hcnJvdyBhIHtcbiAgY29sb3I6IHdoaXRlO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG59XG5cbi5kb3duLWFycm93IC5hcnJvdyB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbWFyZ2luOiAwIDA7XG59XG5cbi5hcnJvdyB7XG4gIHBvc2l0aW9uOiB1bnNldDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbn1cblxuLmRvd24tYXJyb3cgLmJvdW5jZSB7XG4gIC1tb3otYW5pbWF0aW9uOiBib3VuY2UgMnMgaW5maW5pdGU7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiBib3VuY2UgMnMgaW5maW5pdGU7XG4gIGFuaW1hdGlvbjogYm91bmNlIDJzIGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZSB7XG4gIDAlLCAyMCUsIDUwJSwgODAlLCAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMwcHgpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xNXB4KTtcbiAgfVxufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tY29udHJpYnV0b3Itc2VjdGlvbiAyLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuc2VjdGlvbiNjb250cmlidXRvci1zZWN0aW9uIHtcbiAgcGFkZGluZzogMzBweCAwO1xufVxuXG5wLnRleHQtY2VudGVyLmNvbnRyaWJ1dG9ycyB7XG4gIGZvbnQtc2l6ZTogMzBweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAwLjgzO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZy1ib3R0b206IDMwcHg7XG59XG5cbi5lbXAsXG4uY29tcGFueWxpc3Qge1xuICBwYWRkaW5nLWxlZnQ6IDM1cHg7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBmb250LXNpemU6IDEzcHg7XG4gIGJhY2tncm91bmQtcG9zaXRpb24teDogMjQwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDBweDtcbiAgaGVpZ2h0OiA2MHB4O1xufVxuXG4jY29tYXBhbnktc2VsZWN0IHtcbiAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjZTBlNmVkO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHBhZGRpbmctbGVmdDogODBweDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIGZvbnQtc2l6ZTogMTNweDtcbn1cblxuLmVtcCBzZWxlY3QsXG4uY29tcGFueWxpc3Qgc2VsZWN0IHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBtZW51bGlzdDtcbiAgYm9yZGVyLXJhZGl1czogMHB4O1xuICBoZWlnaHQ6IDYwcHg7XG4gIGJvcmRlci1sZWZ0OiAwcHg7XG59XG5cbiNzZWxlY3QtY29tcGFueS1pY29uIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDE2cHg7XG4gIGxlZnQ6IDMycHg7XG59XG5cbiNjb250cmlidXRlLWFzIHtcbiAgcGFkZGluZy1sZWZ0OiAwcHg7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbi14OiAyNDBweDtcbiAgcGFkZGluZy1sZWZ0OiA2MHB4O1xufVxuXG4uYnRuLXN0YXJ0ZWQge1xuICBib3JkZXI6IDFweCBzb2xpZCAjZTBlNmVkO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBib3JkZXItbGVmdDogbm9uZTtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBjb2xvcjogYmxhY2s7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5idG4ge1xuICBmb250LXNpemU6IDE1cHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGxpbmUtaGVpZ2h0OiAxOHB4O1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBvdXRsaW5lOiBub25lO1xuICBoZWlnaHQ6IDYwcHg7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1Ub3AgY29tcGFueSBBLVogc2VjdGlvbiAzLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuc2VjdGlvbi50b3AtY29tcGFuaWVzcyB7XG4gIHBhZGRpbmc6IDMwcHggMCAyMHB4IDA7XG59XG5cbi50b3AtY29tcGFueS1uYW1lIHAge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiA0MHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuNztcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG59XG5cbnAuY29tcGFueS1saXN0LW9yZGVyIHtcbiAgZmxvYXQ6IHJpZ2h0O1xufVxuXG5wLmNvbXBhbnktbGlzdC1vcmRlciBzcGFuIHtcbiAgbGV0dGVyLXNwYWNpbmc6IDNweDtcbn1cblxuLmJvcmRlci1saW5lIHtcbiAgcGFkZGluZy10b3A6IDQwcHg7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTBlNmVkO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTAyNHB4KSB7XG4gIC5lbXAsXG4uY29tcGFueWxpc3Qge1xuICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgI2UwZTZlZDtcbiAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgcC50ZXh0LWNlbnRlci5jb250cmlidXRvcnMge1xuICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgfVxuXG4gICNjb250cmlidXRlLWFzIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDgwcHg7XG4gICAgY29sb3I6ICMwMDAwMDA7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICAgIGJhY2tncm91bmQtcG9zaXRpb24teDogMzAwcHg7XG4gIH1cblxuICAuZm9ybS1ncm91cCB7XG4gICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjZTBlNmVkO1xuICB9XG5cbiAgLnRvcC1jb21wYW55LW5hbWUgcCB7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBtYXJnaW4tYm90dG9tOiAxNXB4O1xuICB9XG59XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tVG9wIGNvbXBhbnkgbGlzdCBzZWN0aW9uIDQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLmNhcmQge1xuICBwYWRkaW5nOiAyMHB4IDBweCAyMHB4IDBweDtcbiAgYm9yZGVyOiBub25lO1xufVxuXG4udGl0bGUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAyNXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuODM7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAyMHB4IDBweCAyMHB4IDBweDtcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkO1xufVxuXG4uY29udGVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmctdG9wOiAxNXB4O1xufVxuXG4udG90YWwtbnVtYmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XG4gIHBhZGRpbmc6IDAgMCAxMHB4IDA7XG59XG5cbi5yYXRpbyB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zOTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDEwcHggMHB4IDEwcHggMHB4O1xufVxuXG4uY2hhcnQtZGlzcGxheSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2NjY2M7XG4gIHBhZGRpbmc6IDBweCAwcHggMjBweCAwcHg7XG59XG5cbi51cF90b19kYXRlIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIGZvbnQ6IGJvbGQ7XG4gIHBhZGRpbmctdG9wOiAxMHB4O1xufVxuXG4uaW5xIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAyMHB4IDBweDtcbn1cblxuLmluY2x1ZGUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAwcHggMTBweDtcbn1cblxuLmNhcmQtdGV4dCB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDg1LjVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMzk3Yzg2O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQ7XG59XG5cbi5wZXJjaWV2ZWQtcXVvdGllbnQtdG90YWwge1xuICB3aWR0aDogMTAwJTtcbn1cblxubGkge1xuICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XG4gIGNvbG9yOiAjZmZmO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIHBhZGRpbmctYm90dG9tOiA1cHg7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjZmZmZmZmO1xufVxuXG4ucmFuZ2Uge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLnBlcmNpZXZlZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBhZGRpbmc6IDMwcHggMHB4IDBweCAyMHB4O1xuICBmbG9hdDogcmlnaHQ7XG59XG5cbi5xdW90aWVudCB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAwIDEwcHggMHB4IDBweDtcbn1cblxuLnBlcmNlbnQtd3JhcCB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDM1cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjA0O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLnBlcmNlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMzBweCAwcHggMHB4IDIwcHg7XG4gIGZsb2F0OiByaWdodDtcbn1cblxuLnZlcmlmaWVkIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDBweCAyMHB4IDBweCAwcHg7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA0ODBweCkgYW5kIChtaW4td2lkdGg6IDMyMHB4KSB7XG4gIHNlY3Rpb24uYmFubmVyIC5pbWctZmx1aWQge1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDkwcHg7XG4gIH1cbn1cbi5zaWRlbmF2IHtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMDtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB6LWluZGV4OiAxO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGJhY2tncm91bmQtY29sb3I6ICMxMTE7XG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgdHJhbnNpdGlvbjogMC41cztcbiAgcGFkZGluZy10b3A6IDYwcHg7XG59XG5cbi5zaWRlbmF2IGEge1xuICBwYWRkaW5nOiA4cHggOHB4IDhweCAzMnB4O1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGZvbnQtc2l6ZTogMjVweDtcbiAgY29sb3I6ICM4MTgxODE7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB0cmFuc2l0aW9uOiAwLjNzO1xufVxuXG4uc2lkZW5hdiBhOmhvdmVyIHtcbiAgY29sb3I6ICNmMWYxZjE7XG59XG5cbi5zaWRlbmF2IC5jbG9zZWJ0biB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMjVweDtcbiAgZm9udC1zaXplOiAzNnB4O1xuICBtYXJnaW4tbGVmdDogNTBweDtcbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC1oZWlnaHQ6IDQ1MHB4KSB7XG4gIC5zaWRlbmF2IHtcbiAgICBwYWRkaW5nLXRvcDogMTVweDtcbiAgfVxuXG4gIC5zaWRlbmF2IGEge1xuICAgIGZvbnQtc2l6ZTogMThweDtcbiAgfVxufSJdfQ== */"

/***/ }),

/***/ "./src/app/components/home/home.component.ts":
/*!***************************************************!*\
  !*** ./src/app/components/home/home.component.ts ***!
  \***************************************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _service_company_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/company.service */ "./src/app/service/company.service.ts");
/* harmony import */ var src_app_service_home_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/service/home.service */ "./src/app/service/home.service.ts");








var HomeComponent = /** @class */ (function () {
    function HomeComponent(router, companySvc, fb, http, homeService) {
        this.router = router;
        this.companySvc = companySvc;
        this.fb = fb;
        this.http = http;
        this.homeService = homeService;
        this.company = [];
        this.companycontrol = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]();
        this.companyCard = [];
        this.term = "";
        // company top list
        this.companytop = []; // company top list
        this.companytopform = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](); //formcontrol html
        this.currentempy = [];
        this.currentemplist = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]();
        this.curemp = [];
        this.currentcontrol = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]();
        this.shouldOpenSideMenu = false;
        this.myplaceHolder = "";
        this.companyName = "";
        this.data = {
            events: [],
            labels: ["Female", "Male"],
            datasets: [
                {
                    data: [25, 75],
                    backgroundColor: ["#148fd5", "#da1b63"]
                }
            ]
        };
        this.pieChartOptions = {
            legend: {
                display: false
            },
            tooltips: {
                enabled: true
            }
        };
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.companyNames();
        this.companyToplist();
        // this.currentEmp();
        this.filteredcompany = this.companycontrol.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["startWith"])(""), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (value) { return _this._filter(value); }));
        this.profileForm = this.fb.group({
            company: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]
        });
    };
    HomeComponent.prototype._filter = function (value) {
        var _this = this;
        var filterValue = this._normalizeValue(value);
        return this.company.filter(function (company) {
            return _this._normalizeValue(company).includes(filterValue);
        });
    };
    HomeComponent.prototype._normalizeValue = function (value) {
        return value.toLowerCase().replace(/\s/g, "");
    };
    HomeComponent.prototype.companyNames = function () {
        var _this = this;
        this.homeService.getCompanyNames().subscribe(function (data) {
            console.log(data);
            if (data) {
                _this.companyList = data.data;
                _this.companyCard = data.data;
                for (var _i = 0, _a = data.data; _i < _a.length; _i++) {
                    var company = _a[_i];
                    _this.company.push(company.data.companyName);
                }
                console.log(_this.company);
            }
        });
    };
    HomeComponent.prototype.companyToplist = function () {
        var _this = this;
        this.homeService.getCompanyToplist().subscribe(function (data) {
            console.log(data);
            if (data) {
                for (var _i = 0, _a = data.data; _i < _a.length; _i++) {
                    var companytop1 = _a[_i];
                    _this.companytop.push(companytop1.companyName); //companyName is api name
                }
                console.log(_this.companytop);
            }
        });
    };
    HomeComponent.prototype.curforEmp = function () {
        if (!this.company.includes(this.currentcontrol.value)) {
            this.router.navigate(["/new-company"]);
            console.log("ok");
        }
        else {
            this.router.navigate(["/company-details"]);
            console.log("not");
        }
    };
    //company.service
    HomeComponent.prototype.searchCompany = function () {
        var _this = this;
        this.companySvc.companayName = this.companycontrol.value;
        console.log(this.companycontrol.value);
        console.log(this.company);
        if (this.company.includes(this.companycontrol.value)) {
            this.id = this.companyList.filter(function (res) { return res.data.companyName === _this.companycontrol.value; })[0].id;
            this.router.navigate(["/detailed-report"]);
            this.companySvc.setParticularCompanyId(this.id);
        }
        else {
            this.router.navigate(["/request-company"]);
        }
    };
    HomeComponent.prototype.showSideMenu = function () {
        this.shouldOpenSideMenu = !this.shouldOpenSideMenu;
    };
    HomeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: "app-home",
            template: __webpack_require__(/*! ./home.component.html */ "./src/app/components/home/home.component.html"),
            styles: [__webpack_require__(/*! ./home.component.scss */ "./src/app/components/home/home.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _service_company_service__WEBPACK_IMPORTED_MODULE_6__["CompanyService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"],
            src_app_service_home_service__WEBPACK_IMPORTED_MODULE_7__["HomeService"]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "./src/app/components/quiz-results/quiz-results.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/components/quiz-results/quiz-results.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"container-fluid\">\n  <!-- <img src=\"../../../assets/banner-image1.png\" alt=\"\"> -->\n</section>\n<section class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-lg-8 col-md-8 col-sm-12 col-xs-12 Custom quiz-div\">\n      <div class=\"inclusion-done\">\n        <div class=\"grid-container\">\n          <h1 class=\"inclusion-text\">INCLUSION <br>QUOTIENT QUIZ<p class=\"contributing-as\">CONTRIBUTING AS:\n              <b>EMPLOYEE</b></p>\n          </h1>\n          <h1 class=\"done\">DONE</h1>\n        </div>\n      </div>\n      <div class=\"row Custom according\">\n        <div class=\"col-lg-6 col-md-6 col-sm-12 col-xs-12\">\n          <p class=\"according-to-you\">ACCORDING TO YOU</p>\n          <span class=\"inq-quotient\"><b>INQ</b> INCLUSION QUOTIENT</span>&nbsp;\n          <span class=\"forty\">48 <img src=\"../../assets/Group 1.png\" /></span>\n        </div>\n\n        <div class=\"col-lg-6 col-md-6 col-sm-12 col-xs-12\">\n          <div class=\"detailed\">\n            <p class=\"detailed-report\">TO VIEW <b>DETAILED REPORT,</b><br>\n              PLEASE ENTER YOUR MAIL ADDRESS BELOW</p>\n            <mat-form-field class=\"example-full-width\" style=\"position: relative\">\n              <input matInput placeholder=\"ENTER YOUR EMAIL ADDRESS\" value=\"\">\n              <i class=\"fa fa-arrow-right\" aria-hidden=\"true\"></i>\n            </mat-form-field>\n            <div class=\"arrow\">\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"shareon\">\n        <h4 class=\"shareon-text\">SHARE ON</h4>\n        <p>\n          <a href=\"#\"><img class=\"image\" src=\"../../assets/face.png\" alt=\"facebook\" /></a>\n          <a href=\"#\"><img class=\"image\" src=\"../../assets/twit.png\" alt=\"twitter\" /></a>\n          <a href=\"#\"><img class=\"image\" src=\"../../assets/whats.png\" alt=\"whatspp\" /></a>\n          <a href=\"#\"><img class=\"image\" src=\"../../assets/link.png\" alt=\"linkedin\" /></a>\n        </p>\n      </div>\n    </div>\n    <div class=\"col-md-4 Custom company-profile\">\n      <div class=\"col-4 p-0\">\n        <div class=\"first\">\n          <div class=\"card\">\n            <div class=\"card-body\">\n              <img src=\"/assets/Layer15.png\" alt=\"\" height=\"50px\">\n              <h5 class=\"title\">HEWLETT PACKARD</h5>\n              <div class=\"content\">\n                <p class=\"inq\">InQ</p>\n                <p class=\"include\">INCLUSION QUOTIENT</p>\n              </div>\n              <div class=\"number_sdj\">\n                <div class=\"number_align\">\n                  <p class=\"card-text\">67</p>\n                  <p class=\"adjble\">100</p>\n                </div>\n                <div class=\"go\">\n                  <div class=\"percieved\">\n                    <p class=\"quotient\">percieved <br>quotient</p>\n                    <p class=\"somewhere\">67</p>\n                  </div>\n                  <div class=\"perce\">\n                    <p class=\"nab\">verified<br>quotient</p>\n                    <p class=\"where\">NA</p>\n                  </div>\n                </div>\n              </div>\n              <!-- <p class=\"male\">MALE FEMALE RATIO</p>\n                            <ul class=\"list-inline\">\n                                <li class=\"percent\">27%<br>\n                                    <p class=\"range\">FEMALE</p>\n                                </li>\n                                <p-chart type=\"doughnut\" width=\"80\" height=\"70\" [data]=\"data\"\n                                    [options]=\"pieChartOptions\"></p-chart>\n                                <li class=\"mahindra\">73%<br>\n                                    <p class=\"range\">MALE</p>\n                                </li>\n                            </ul>\n                            <p class=\"up_to_date\">27TH JAN 2019</p> -->\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>"

/***/ }),

/***/ "./src/app/components/quiz-results/quiz-results.component.scss":
/*!*********************************************************************!*\
  !*** ./src/app/components/quiz-results/quiz-results.component.scss ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container-fluid {\n  background: url('banner-image1.png');\n  height: 137px;\n  background-position: center center;\n  background-size: cover;\n}\n\nbody {\n  font-family: \"Roboto\", Montserrat;\n}\n\n.quiz-div {\n  margin-top: 70px;\n  padding: 0px;\n}\n\n.grid-container {\n  display: grid;\n  grid-template-columns: 70% 30%;\n}\n\n.done {\n  font-size: 40px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: right;\n  color: #397c86;\n  padding-top: 43px;\n}\n\n.according-to-you {\n  font-size: 18px;\n  font-weight: 800;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.done-col {\n  padding-top: 40px;\n}\n\n.remove-padding {\n  padding: 0px;\n}\n\n.according {\n  padding-top: 45px;\n}\n\n.according-to {\n  font-size: 24px;\n  font-weight: 800;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.detailed {\n  background: rgba(74, 123, 133, 0.1);\n}\n\n.detailed-report {\n  font-size: 14px;\n  font-weight: 500;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #397c86;\n  padding: 10px;\n}\n\n.example-full-width {\n  padding: 10px;\n  font-size: 18px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #d1d2d2;\n}\n\n.arrow {\n  color: #397c86;\n  position: absolute;\n  top: 160px;\n  right: 50px;\n}\n\n.inq-quotient {\n  font-size: 13px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-top: 74px;\n}\n\n.forty {\n  font-size: 40px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #397c86;\n  padding-left: 15px;\n}\n\n.shareon {\n  padding: 72px 0px 112px 0px;\n}\n\n.shareon-text {\n  font-size: 18px;\n  font-weight: 800;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-bottom: 26px;\n}\n\n.inclusion-done {\n  border-bottom: 3px solid black;\n}\n\n@media only screen and (max-width: 768px) {\n  .inclusion-text {\n    font-size: 20px;\n  }\n\n  .done {\n    font-size: 20px;\n  }\n\n  .remove-padding {\n    padding-left: 15px;\n  }\n\n  .example-full-width {\n    font-size: 15px;\n  }\n\n  .arrow {\n    right: 30px;\n  }\n\n  .shareon {\n    padding: 15px 0px 15px 0px;\n  }\n\n  .image {\n    width: 69px;\n  }\n\n  .company-profile {\n    padding-left: 15px;\n  }\n\n  .row {\n    margin: 0px;\n  }\n\n  .according-to-you {\n    font-size: 18px;\n  }\n\n  .inq-quotient {\n    font-size: 14px;\n  }\n\n  .company-profile {\n    padding-left: 0px;\n    padding-right: 0px;\n  }\n}\n\n/* .header{\n    background: url(../../assets/homepage.png) no-repeat center center;\n    background-position: center center;\n    padding-bottom: 19rem;\n    -moz-background-size: cover;\n    -webkit-background-size: cover;\n    -o-background-size: cover;\n    background-size: cover;\n} */\n\n.aboutus-header {\n  padding: 20px 0px 0px 2px;\n}\n\n@media (max-width: 500px) {\n  .aboutus-header {\n    display: none;\n  }\n}\n\n.home-text {\n  text-decoration: none;\n  color: #ffffff;\n}\n\n.sub-menu-items {\n  text-decoration: none;\n  color: #d7d7d7;\n}\n\n.sidebar-container {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  right: 0;\n}\n\n.look-for-company {\n  padding: 0px;\n  margin: 0 auto;\n  width: 57%;\n}\n\n.treating {\n  padding-top: 13rem;\n}\n\n@media (max-width: 500px) {\n  .treating {\n    padding-top: 5rem;\n  }\n}\n\n.search-icon {\n  text-align: center;\n  padding-top: 0px;\n}\n\n.search-text {\n  font-size: 10px;\n  font-weight: 300;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.79;\n  letter-spacing: normal;\n  color: #ffffff;\n  padding: 10px 0px 0px 15px;\n}\n\n.contributor {\n  font-family: Montserrat;\n  font-size: 21px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: normal;\n  text-align: center;\n  color: #000000;\n  padding-top: 30px;\n}\n\n.search-container {\n  /* margin: 20px 100px 0px 135px; */\n  padding-top: 40px;\n  /* text-align: center; */\n}\n\n.margin0 {\n  margin: 0px;\n}\n\n#contributeAs {\n  padding-left: 35px;\n}\n\n#select-company-icon {\n  position: absolute;\n  top: 16px;\n  left: 32px;\n}\n\n.search-container .form-group select, .search-container .form-group input {\n  /*  : 77px !important; */\n  border-radius: 0 !important;\n  outline: none;\n  box-shadow: none;\n  border-right: 1px solid #E0E6ED;\n  border-left: none;\n  height: 60px;\n}\n\n.form-group select {\n  background: url('down.png') no-repeat center;\n  -webkit-appearance: none;\n}\n\n#comapany-select {\n  border-left: 1px solid #E0E6ED;\n  position: relative;\n  padding-left: 87px;\n  color: #000000;\n  font-size: 13px;\n  background-position-x: 515px;\n}\n\n#contribute-as {\n  padding-left: 35px;\n  color: #000000;\n  font-size: 13px;\n  background-position-x: 240px;\n}\n\n.search-container::-webkit-input-placeholder {\n  /* Chrome, Firefox, Opera, Safari 10.1+ */\n  color: #ADB7C7;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 19px;\n  text-align: left;\n}\n\n.search-container::-moz-placeholder {\n  /* Chrome, Firefox, Opera, Safari 10.1+ */\n  color: #ADB7C7;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 19px;\n  text-align: left;\n}\n\n.search-container::-ms-input-placeholder {\n  /* Chrome, Firefox, Opera, Safari 10.1+ */\n  color: #ADB7C7;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 19px;\n  text-align: left;\n}\n\n.search-container::placeholder {\n  /* Chrome, Firefox, Opera, Safari 10.1+ */\n  color: #ADB7C7;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 19px;\n  text-align: left;\n}\n\n.search-container::-ms-input-placeholder {\n  color: #ADB7C7;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 19px;\n  text-align: left;\n}\n\n@media (max-width: 768px) {\n  .btn-started {\n    width: 100%;\n  }\n}\n\n.card {\n  padding: 20px 0px 20px 0px;\n  border: none;\n}\n\n.right-arrow {\n  position: absolute;\n  top: 18px;\n  right: 45px;\n}\n\n.top-companies {\n  padding: 82px 0px 29px 0px;\n  border-bottom: 1px solid black;\n  margin: 0px;\n}\n\n.companies-text {\n  font-size: 48px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.7;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.abcd {\n  font-size: 18px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: 2.8px;\n  text-align: left;\n  color: #000000;\n}\n\n@media (max-width: 768px) {\n  .abcd {\n    padding: 30px 0px 0px 0px;\n    text-align: center;\n  }\n}\n\n.tagline {\n  font-size: 41px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  color: #fff;\n  padding-top: 7rem;\n  text-align: center;\n  font-family: Montserrat;\n}\n\n@media (max-width: 768px) {\n  .tagline {\n    font-size: 22px;\n  }\n}\n\n@media (max-width: 500px) {\n  .tagline {\n    font-size: 15px;\n    padding-top: 30px;\n  }\n}\n\n.look-for-company-mat {\n  width: 100%;\n  font-size: 41px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  color: white;\n  text-align: center;\n  font-family: Montserrat;\n  margin-top: 10px;\n  height: 150px;\n}\n\n/* .look-for-company-mat ::ng-deep .mat-focused .mat-form-field-label {\n\n    color: white !important;\n}\n\n.look-for-company-mat ::ng-deep .mat-input-placeholder {\n\n    color: white !important;\n} */\n\n/* \n.look-for-company-mat ::ng-deep.mat-form-field-underline { */\n\n/*change color of underline*/\n\n/*change color of underline*/\n\n/* background-color: rgb(255,255,255, 0.1) !important; */\n\n/* background-color: rgb(255,255,255, 0.1) !important; */\n\n/* background-color: white !important;\n} */\n\n/* \n.look-for-company-mat ::ng-deep.mat-form-field-ripple { */\n\n/*change color of underline when focused*/\n\n/* background-color: white !important;;\n} */\n\n/* \n.look-for-company-mat ::ng-deep  .mat-form-field-label {\n    color:white !important;\n}\n\n.example-full-width ::ng-deep  .mat-form-field-label{\n    color: black !important;\n}\n.mat-form-field-flex{\nborder: 1px solid white !important;\n} */\n\n@media (max-width: 500px) {\n  .col-4 {\n    flex: 100%;\n    max-width: 100%;\n  }\n}\n\n.title {\n  font-family: Montserrat;\n  font-size: 25px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 20px 0px 30px 0px;\n  border-bottom: 3px solid;\n}\n\n@media (max-width: 768px) {\n  .title {\n    font-size: 15px;\n  }\n}\n\n.inq {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px 0px 30px 0px;\n}\n\n@media (max-width: 768px) {\n  .inq {\n    font-size: 15px;\n  }\n}\n\n.content {\n  display: flex;\n}\n\n.include {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px 0px 0px 10px;\n}\n\n@media (max-width: 768px) {\n  .include {\n    font-size: 13px;\n  }\n}\n\n.card-text {\n  font-family: Montserrat;\n  font-size: 85.5px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #397c86;\n  border-bottom: 1px solid;\n}\n\n@media (max-width: 768px) {\n  .card-text {\n    font-size: 35px;\n  }\n}\n\n.adjble {\n  font-family: Montserrat;\n  font-size: 24px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px 0px 10px 0px;\n}\n\n@media (max-width: 768) {\n  .adjble {\n    padding: 20px 0px 10px 0px;\n  }\n}\n\n.number_sdj {\n  display: flex;\n  /* border-bottom: 3px solid; */\n}\n\n.quotient {\n  font-family: Montserrat;\n  font-size: 14px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.percieved {\n  display: flex;\n  padding: 30px 0px 0px 20px;\n}\n\n@media (max-width: 768px) {\n  .percieved {\n    padding: 10px 0px 0px 30px;\n  }\n}\n\n@media (max-width: 500px) {\n  .percieved {\n    padding: 10px 0px 0px 50px;\n  }\n}\n\n.perce {\n  display: flex;\n  padding: 3.5rem 0px 0px 20px;\n}\n\n@media (max-width: 768px) {\n  .perce {\n    padding: 1rem 0px 0px 30px;\n  }\n}\n\n@media (max-width: 500px) {\n  .perce {\n    padding: 1rem 0px 0px 50px;\n  }\n}\n\n@media (max-width: 768px) {\n  .container {\n    max-width: 100%;\n  }\n}\n\n.solutions {\n  display: none;\n}\n\n@media (max-width: 500px) {\n  .solutions {\n    display: block;\n  }\n}\n\n.somewhere {\n  font-family: Montserrat;\n  font-size: 32px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-left: 13px;\n}\n\n@media (max-width: 500px) {\n  .somewhere {\n    padding: 0px 0px 0px 5rem;\n  }\n}\n\n.nab {\n  font-family: Montserrat;\n  font-size: 14px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.where {\n  font-family: Montserrat;\n  font-size: 35px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-left: 13px;\n}\n\n@media (max-width: 500px) {\n  .where {\n    padding: 0px 0px 0px 5rem;\n  }\n}\n\n.male {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 10px 0px 10px 0px;\n}\n\n@media (max-width: 768px) {\n  .male {\n    font-size: 15px;\n  }\n}\n\n.mat-input-element {\n  background: transparent;\n}\n\nform.example input[type=text] {\n  padding: 10px;\n  font-size: 17px;\n  border: 2px solid white;\n  float: left;\n  width: 90%;\n  border-radius: 0px;\n  opacity: 0.25;\n  border-right: none;\n  color: darkmagenta;\n}\n\n@media (max-width: 500px) {\n  form.example input[type=text] {\n    padding: 0px;\n    font-size: 17px;\n    /* border: 1px solid white; */\n    float: left;\n    width: 60%;\n    background: #f1f1f1;\n    border-radius: 0px;\n    opacity: 0.25;\n    margin-left: 1.5rem;\n    border-right: none;\n  }\n}\n\n.list-inline {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 2px solid;\n  padding: 0px 0px 20px 0px;\n}\n\n.up_to_date {\n  font-family: Montserrat;\n  font-size: 14px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  font: bold;\n  font-weight: bold;\n}\n\n.percent {\n  font-family: Montserrat;\n  font-size: 32px;\n  text-align: left;\n  color: #000000;\n}\n\n.mahindra {\n  font-family: Montserrat;\n  font-size: 32px;\n  text-align: left;\n  color: #000000;\n}\n\n.range {\n  font-family: Montserrat;\n  font-size: 14px;\n  text-align: left;\n  color: #000000;\n}\n\nform.example button {\n  float: left;\n  width: 10%;\n  padding: 10px;\n  background: #0797ae;\n  color: white;\n  font-size: 17px;\n  /* border: 1px solid white; */\n  border-left: none;\n  cursor: pointer;\n  border-radius: 5px;\n  opacity: 0.85;\n}\n\n@media (max-width: 500px) {\n  form.example button {\n    float: left;\n    width: 10%;\n    background: #0797ae;\n    color: white;\n    font-size: 14.1px;\n    border: 1px solid white;\n    border-left: none;\n    cursor: pointer;\n    border-radius: 3px;\n    padding: 1px;\n    opacity: 0.85;\n  }\n}\n\n.company2 {\n  padding-left: 55px;\n}\n\n.top-companies-text {\n  font-size: 30px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.7;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n@media (max-width: 768px) {\n  .top-companies-text {\n    text-align: center;\n  }\n}\n\n.newsletter ::ng-deep .mat-form-field-label {\n  /*change color of label*/\n  color: black !important;\n}\n\n.styled-select select {\n  size: 100px;\n}\n\n@media only screen and (max-width: 762px) {\n  .looking-for-company-text {\n    font-size: 20.5px;\n  }\n\n  .look-for-company {\n    margin: 50px 30px 0px 30px;\n  }\n}\n\n@media only screen and (max-width: 762px) and (max-width: 500px) {\n  .look-for-company {\n    margin: 10px 0px 0px 40px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .header {\n    padding-bottom: 101px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .contributor {\n    font-size: 13px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .row {\n    margin: 0px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .btn-primary {\n    border: 1px solid #E0E6ED;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .top-companies-text {\n    text-align: center;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .top-companies {\n    padding-top: 20px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .abcd {\n    padding-top: 20px;\n    font-size: 18px;\n    line-height: 30px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .mat-side {\n    padding: 0px 50px 0px 40px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .look-for-company-mat {\n    font-size: 15px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .directory {\n    font-size: 12px;\n    padding-top: 0px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  #comapany-select {\n    font-size: 13px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .form-group {\n    border-left: 1px solid #E0E6ED;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .top-companies-text {\n    font-size: 27px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .newsletter {\n    padding: 0px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .footer-col1 {\n    padding: 30px 0px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .newsletter-text {\n    font-size: 16px;\n    padding: 10px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .example-full-width {\n    padding-top: 15px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .arrow {\n    top: 45px;\n    right: 6px;\n  }\n}\n\n@media only screen and (max-width: 762px) {\n  .footer-icons {\n    padding: 20px 0px 30px 0px;\n  }\n}\n\n.col-4.p-0 {\n  max-width: 100%;\n}\n\ni.fa.fa-arrow-right {\n  font-size: 25px;\n  float: right;\n  position: absolute;\n  right: 2px;\n  color: #397c86;\n}\n\n@media (max-width: 320px) {\n  i.fa.fa-arrow-right {\n    font-size: 18px;\n    float: right;\n    position: absolute;\n    right: 0px;\n    color: #397c86;\n    left: 233px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hcHBpbmVzcy9EZXNrdG9wL0VuZ2VuZGVyZWQtUHJvamVjdC9zcmMvYXBwL2NvbXBvbmVudHMvcXVpei1yZXN1bHRzL3F1aXotcmVzdWx0cy5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvY29tcG9uZW50cy9xdWl6LXJlc3VsdHMvcXVpei1yZXN1bHRzLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksb0NBQUE7RUFDQSxhQUFBO0VBQ0Esa0NBQUE7RUFJQSxzQkFBQTtBQ0NKOztBRENBO0VBQ0ksaUNBQUE7QUNFSjs7QURBQTtFQUNJLGdCQUFBO0VBQ0EsWUFBQTtBQ0dKOztBREFBO0VBQ0ksYUFBQTtFQUNBLDhCQUFBO0FDR0o7O0FEQUE7RUFDSSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGlCQUFBO0VBQ0EsY0FBQTtFQUNBLGlCQUFBO0FDR0o7O0FEQUE7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ0dKOztBRENBO0VBQ0ksaUJBQUE7QUNFSjs7QURDQTtFQUNJLFlBQUE7QUNFSjs7QURDQTtFQUNJLGlCQUFBO0FDRUo7O0FEQ0E7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUNFSjs7QURDQTtFQUNJLG1DQUFBO0FDRUo7O0FEQ0E7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxhQUFBO0FDRUo7O0FEQ0E7RUFDSSxhQUFBO0VBQ0EsZUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGlCQUFBO0VB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QTtFQ3VDTjtBQUNGOztBRGxIQTtFQTZFSTtJQUNJLGVBQUE7SUFDQSxhQUFBO0VDd0NOO0FBQ0Y7O0FEeEhBO0VBa0ZJO0lBQ0ksaUJBQUE7RUN5Q047QUFDRjs7QUQ3SEE7RUFzRkk7SUFDSSxTQUFBO0lBQ0EsVUFBQTtFQzBDTjtBQUNGOztBRG5JQTtFQTJGSTtJQUNJLDBCQUFBO0VDMkNOO0FBQ0Y7O0FEekNBO0VBQ0ksZUFBQTtBQzJDSjs7QUR6Q0E7RUFDSSxlQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLGNBQUE7QUM0Q0o7O0FEMUNBO0VBQ0k7SUFDSSxlQUFBO0lBQ0EsWUFBQTtJQUNBLGtCQUFBO0lBQ0EsVUFBQTtJQUNBLGNBQUE7SUFDQSxXQUFBO0VDNkNOO0FBQ0YiLCJmaWxlIjoic3JjL2FwcC9jb21wb25lbnRzL3F1aXotcmVzdWx0cy9xdWl6LXJlc3VsdHMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29udGFpbmVyLWZsdWlke1xuICAgIGJhY2tncm91bmQ6IHVybCguLi8uLi8uLi9hc3NldHMvL2Jhbm5lci1pbWFnZTEucG5nKTtcbiAgICBoZWlnaHQ6IDEzN3B4O1xuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XG4gICAgLW1vei1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAgIC13ZWJraXQtYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgICAtby1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG59XG5ib2R5e1xuICAgIGZvbnQtZmFtaWx5OiAnUm9ib3RvJywgTW9udHNlcnJhdDtcbn1cbi5xdWl6LWRpdntcbiAgICBtYXJnaW4tdG9wOjcwcHg7XG4gICAgcGFkZGluZzowcHg7XG59XG5cbi5ncmlkLWNvbnRhaW5lcntcbiAgICBkaXNwbGF5OmdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA3MCUgMzAlO1xufVxuXG4uZG9uZXtcbiAgICBmb250LXNpemU6IDQwcHg7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgY29sb3I6ICMzOTdjODY7XG4gICAgcGFkZGluZy10b3A6NDNweDtcbn1cblxuLmFjY29yZGluZy10by15b3V7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjA0O1xuICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjb2xvcjogIzAwMDAwMDtcbiAgXG59XG5cbi5kb25lLWNvbHtcbiAgICBwYWRkaW5nLXRvcDogNDBweDtcbn1cblxuLnJlbW92ZS1wYWRkaW5ne1xuICAgIHBhZGRpbmc6MHB4O1xufVxuXG4uYWNjb3JkaW5ne1xuICAgIHBhZGRpbmctdG9wOjQ1cHg7XG59XG5cbi5hY2NvcmRpbmctdG97XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA4MDA7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLmRldGFpbGVke1xuICAgIGJhY2tncm91bmQ6cmdiYSg3NCwxMjMsMTMzLCAwLjEpO1xufVxuXG4uZGV0YWlsZWQtcmVwb3J0e1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgY29sb3I6ICMzOTdjODY7XG4gICAgcGFkZGluZzoxMHB4O1xufVxuXG4uZXhhbXBsZS1mdWxsLXdpZHRoe1xuICAgIHBhZGRpbmc6MTBweDtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gICAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIGNvbG9yOiAjZDFkMmQyO1xufVxuXG4uYXJyb3d7XG4gICAgY29sb3I6ICMzOTdjODY7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDoxNjBweDtcbiAgICByaWdodDo1MHB4O1xufVxuXG4uaW5xLXF1b3RpZW50e1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICBmb250LXdlaWdodDogbm9ybWFsO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgY29sb3I6ICMwMDAwMDA7XG4gICAgcGFkZGluZy10b3A6NzRweDtcbn1cblxuLmZvcnR5e1xuICAgIGZvbnQtc2l6ZTogNDBweDtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIGNvbG9yOiAjMzk3Yzg2O1xuICAgIHBhZGRpbmctbGVmdDoxNXB4O1xufVxuXG4uc2hhcmVvbntcbiAgICBwYWRkaW5nOjcycHggMHB4IDExMnB4IDBweDtcbn1cblxuLnNoYXJlb24tdGV4dHtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGluZS1oZWlnaHQ6IDEuMDQ7XG4gICAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIGNvbG9yOiAjMDAwMDAwO1xuICAgIHBhZGRpbmctYm90dG9tOiAyNnB4O1xufVxuXG4uaW5jbHVzaW9uLWRvbmV7XG4gICAgYm9yZGVyLWJvdHRvbTozcHggc29saWQgYmxhY2s7XG59XG4gQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOjc2OHB4KVxuIHtcbiAgICAuaW5jbHVzaW9uLXRleHR7XG4gICAgICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgIH1cblxuICAgIC5kb25le1xuICAgICAgICAgZm9udC1zaXplOjIwcHg7XG4gICAgIH1cblxuICAgIC5yZW1vdmUtcGFkZGluZ3tcbiAgICAgICAgIHBhZGRpbmctbGVmdDoxNXB4O1xuICAgICB9XG5cbiAgICAuZXhhbXBsZS1mdWxsLXdpZHRoIHtcbiAgICAgICAgZm9udC1zaXplOiAxNXB4O1xuICAgIH1cblxuICAgIC5hcnJvd3tcbiAgICAgICAgcmlnaHQ6IDMwcHg7XG4gICAgfVxuICAgIC5zaGFyZW9ue1xuICAgICAgICBwYWRkaW5nOiAxNXB4IDBweCAxNXB4IDBweDtcbiAgICB9XG5cbiAgICAuaW1hZ2V7XG4gICAgICAgIHdpZHRoOiA2OXB4O1xuICAgIH1cblxuICAgIC5jb21wYW55LXByb2ZpbGV7XG4gICAgICAgIHBhZGRpbmctbGVmdDogMTVweDtcbiAgICB9XG5cbiAgICAucm93e1xuICAgICAgICBtYXJnaW46MHB4O1xuICAgIH1cblxuICAgIC5hY2NvcmRpbmctdG8teW91e1xuICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgfVxuXG4gICAgLmlucS1xdW90aWVudHtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgIH1cblxuICAgIC5jb21wYW55LXByb2ZpbGV7XG4gICAgICAgIHBhZGRpbmctbGVmdDowcHg7XG4gICAgICAgIHBhZGRpbmctcmlnaHQ6IDBweDsgXG4gICAgfVxuIH1cblxuLyogLmhlYWRlcntcbiAgICBiYWNrZ3JvdW5kOiB1cmwoLi4vLi4vYXNzZXRzL2hvbWVwYWdlLnBuZykgbm8tcmVwZWF0IGNlbnRlciBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIGNlbnRlcjtcbiAgICBwYWRkaW5nLWJvdHRvbTogMTlyZW07XG4gICAgLW1vei1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAgIC13ZWJraXQtYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgICAtby1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG59ICovXG5cbi5hYm91dHVzLWhlYWRlcntcbiAgICBwYWRkaW5nOiAyMHB4IDBweCAwcHggMnB4O1xufVxuQG1lZGlhIChtYXgtd2lkdGg6NTAwcHgpe1xuICAgIC5hYm91dHVzLWhlYWRlcntcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG59XG5cbi5ob21lLXRleHR7XG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgIGNvbG9yOiAjZmZmZmZmO1xufVxuXG4uc3ViLW1lbnUtaXRlbXN7XG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgIGNvbG9yOiAjZDdkN2Q3O1xufVxuXG4uc2lkZWJhci1jb250YWluZXJ7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHRvcDogICAgMDtcbiAgICBib3R0b206IDA7XG4gICAgcmlnaHQ6ICAwO1xufVxuXG4ubG9vay1mb3ItY29tcGFueXtcbiAgICBwYWRkaW5nOjBweDtcbiAgICBtYXJnaW46MCBhdXRvO1xuICAgIHdpZHRoOiA1NyU7XG59XG4udHJlYXRpbmcge1xuICAgIHBhZGRpbmctdG9wOiAxM3JlbTtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOjUwMHB4KXtcbiAgICAudHJlYXRpbmd7XG4gICAgICAgIHBhZGRpbmctdG9wOiA1cmVtO1xuICAgIH1cbn1cblxuLnNlYXJjaC1pY29ue1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBwYWRkaW5nLXRvcDowcHg7XG59XG5cbi5zZWFyY2gtdGV4dHtcbiAgICBmb250LXNpemU6IDEwcHg7XG4gICAgZm9udC13ZWlnaHQ6IDMwMDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGluZS1oZWlnaHQ6IDEuNzk7XG4gICAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgICBjb2xvcjogI2ZmZmZmZjtcbiAgICBwYWRkaW5nOjEwcHggMHB4IDBweCAxNXB4O1xufVxuXG4uY29udHJpYnV0b3J7XG4gICAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gICAgZm9udC1zaXplOiAyMXB4O1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgICBsaW5lLWhlaWdodDogMC44MztcbiAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBjb2xvcjogIzAwMDAwMDtcbiAgICBwYWRkaW5nLXRvcDozMHB4O1xufVxuXG4uc2VhcmNoLWNvbnRhaW5lcntcbiAgICAvKiBtYXJnaW46IDIwcHggMTAwcHggMHB4IDEzNXB4OyAqL1xuICAgIHBhZGRpbmctdG9wOjQwcHg7XG4gICAgLyogdGV4dC1hbGlnbjogY2VudGVyOyAqL1xufVxuXG4ubWFyZ2luMHtcbiAgICBtYXJnaW46MHB4O1xufVxuXG4jY29udHJpYnV0ZUFze1xuICAgIHBhZGRpbmctbGVmdDozNXB4O1xufVxuXG4jc2VsZWN0LWNvbXBhbnktaWNvbntcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOjE2cHg7XG4gICAgbGVmdDozMnB4O1xufVxuXG4uc2VhcmNoLWNvbnRhaW5lciAuZm9ybS1ncm91cCBzZWxlY3QsIC5zZWFyY2gtY29udGFpbmVyIC5mb3JtLWdyb3VwIGlucHV0IHtcbiAgICAvKiAgOiA3N3B4ICFpbXBvcnRhbnQ7ICovXG4gICAgYm9yZGVyLXJhZGl1czogMCAhaW1wb3J0YW50O1xuICAgIG91dGxpbmU6IG5vbmUgO1xuICAgIGJveC1zaGFkb3c6IG5vbmU7XG4gICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgI0UwRTZFRDtcbiAgICBib3JkZXItbGVmdDogbm9uZTtcbiAgICBoZWlnaHQ6IDYwcHg7XG59XG5cbi5mb3JtLWdyb3VwIHNlbGVjdCB7XG4gICAgYmFja2dyb3VuZDogdXJsKC4uLy4uLy4uL2Fzc2V0cy9kb3duLnBuZykgbm8tcmVwZWF0IGNlbnRlcjtcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG59XG5cbiNjb21hcGFueS1zZWxlY3R7XG4gICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjRTBFNkVEO1xuICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xuICAgIHBhZGRpbmctbGVmdDo4N3B4O1xuICAgIGNvbG9yOiAjMDAwMDAwO1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uLXg6IDUxNXB4O1xufVxuXG4jY29udHJpYnV0ZS1hc3tcbiAgICBwYWRkaW5nLWxlZnQ6MzVweDtcbiAgICBjb2xvcjogIzAwMDAwMDtcbiAgICBmb250LXNpemU6IDEzcHg7XG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbi14OiAyNDBweDtcbn1cblxuLnNlYXJjaC1jb250YWluZXI6OnBsYWNlaG9sZGVyIHsgLyogQ2hyb21lLCBGaXJlZm94LCBPcGVyYSwgU2FmYXJpIDEwLjErICovXG4gICAgY29sb3I6ICNBREI3Qzc7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgbGluZS1oZWlnaHQ6IDE5cHg7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbn1cblxuLnNlYXJjaC1jb250YWluZXI6Oi1tcy1pbnB1dC1wbGFjZWhvbGRlciB7IFxuICAgIGNvbG9yOiAjQURCN0M3O1xuICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxOXB4O1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOjc2OHB4KSB7XG4gICAgLmJ0bi1zdGFydGVkeyAgXG4gICAgICAgIHdpZHRoOiAxMDAlXG59XG59XG4uY2FyZCB7XG4gICAgcGFkZGluZzogMjBweCAwcHggMjBweCAwcHg7XG4gICAgYm9yZGVyOiBub25lO1xufVxuXG4ucmlnaHQtYXJyb3d7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDoxOHB4O1xuICAgIHJpZ2h0OjQ1cHhcbn1cblxuLnRvcC1jb21wYW5pZXN7XG4gICAgcGFkZGluZzogODJweCAwcHggMjlweCAwcHg7XG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYigwMDAsMDAwLDAwMCk7XG4gICAgbWFyZ2luOiAwcHg7XG59XG5cbi5jb21wYW5pZXMtdGV4dHtcbiAgICBmb250LXNpemU6IDQ4cHg7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICAgIGxpbmUtaGVpZ2h0OiAwLjc7XG4gICAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIGNvbG9yOiAjMDAwMDAwO1xufVxuXG4uYWJjZHtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGluZS1oZWlnaHQ6IDAuODM7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDIuOHB4O1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgY29sb3I6ICMwMDAwMDA7XG59XG5AbWVkaWEgKG1heC13aWR0aDo3NjhweCl7XG4gICAgLmFiY2R7XG4gICAgICAgIHBhZGRpbmc6MzBweCAwcHggMHB4IDBweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cbn1cblxuLnRhZ2xpbmV7XG4gICAgZm9udC1zaXplOiA0MXB4O1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgIGNvbG9yOiAjZmZmO1xuICAgIHBhZGRpbmctdG9wOjdyZW07XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xufVxuQG1lZGlhKG1heC13aWR0aDo3NjhweCl7XG4gICAgLnRhZ2xpbmV7XG4gICAgZm9udC1zaXplOiAyMnB4O1xufVxufVxuQG1lZGlhKG1heC13aWR0aDo1MDBweCl7XG4gICAgLnRhZ2xpbmV7XG4gICAgZm9udC1zaXplOiAxNXB4O1xuICAgIHBhZGRpbmctdG9wOiAzMHB4O1xufVxufVxuXG4ubG9vay1mb3ItY29tcGFueS1tYXR7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgZm9udC1zaXplOiA0MXB4O1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gICAgbWFyZ2luLXRvcDoxMHB4O1xuICAgIGhlaWdodDogMTUwcHg7XG59XG5cbi8qIC5sb29rLWZvci1jb21wYW55LW1hdCA6Om5nLWRlZXAgLm1hdC1mb2N1c2VkIC5tYXQtZm9ybS1maWVsZC1sYWJlbCB7XG4gICAgXG4gICAgY29sb3I6IHdoaXRlICFpbXBvcnRhbnQ7XG59XG5cbi5sb29rLWZvci1jb21wYW55LW1hdCA6Om5nLWRlZXAgLm1hdC1pbnB1dC1wbGFjZWhvbGRlciB7XG4gICAgXG4gICAgY29sb3I6IHdoaXRlICFpbXBvcnRhbnQ7XG59ICovXG4vKiBcbi5sb29rLWZvci1jb21wYW55LW1hdCA6Om5nLWRlZXAubWF0LWZvcm0tZmllbGQtdW5kZXJsaW5lIHsgKi9cbiAgICAvKmNoYW5nZSBjb2xvciBvZiB1bmRlcmxpbmUqL1xuICAgIC8qY2hhbmdlIGNvbG9yIG9mIHVuZGVybGluZSovXG4gICAgLyogYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwyNTUsMjU1LCAwLjEpICFpbXBvcnRhbnQ7ICovXG4gICAgLyogYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwyNTUsMjU1LCAwLjEpICFpbXBvcnRhbnQ7ICovXG4gICAgLyogYmFja2dyb3VuZC1jb2xvcjogd2hpdGUgIWltcG9ydGFudDtcbn0gKi9cbi8qIFxuLmxvb2stZm9yLWNvbXBhbnktbWF0IDo6bmctZGVlcC5tYXQtZm9ybS1maWVsZC1yaXBwbGUgeyAqL1xuICAgLypjaGFuZ2UgY29sb3Igb2YgdW5kZXJsaW5lIHdoZW4gZm9jdXNlZCovXG4gICAvKiBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50Oztcbn0gKi9cbi8qIFxuLmxvb2stZm9yLWNvbXBhbnktbWF0IDo6bmctZGVlcCAgLm1hdC1mb3JtLWZpZWxkLWxhYmVsIHtcbiAgICBjb2xvcjp3aGl0ZSAhaW1wb3J0YW50O1xufVxuXG4uZXhhbXBsZS1mdWxsLXdpZHRoIDo6bmctZGVlcCAgLm1hdC1mb3JtLWZpZWxkLWxhYmVse1xuICAgIGNvbG9yOiBibGFjayAhaW1wb3J0YW50O1xufVxuLm1hdC1mb3JtLWZpZWxkLWZsZXh7XG5ib3JkZXI6IDFweCBzb2xpZCB3aGl0ZSAhaW1wb3J0YW50O1xufSAqL1xuIEBtZWRpYSAobWF4LXdpZHRoOjUwMHB4KXtcbi5jb2wtNHtcbiAgICBmbGV4OiAxMDAlO1xuICAgIG1heC13aWR0aDogMTAwJTtcbn1cbn1cbi50aXRsZSB7XG4gICAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gICAgZm9udC1zaXplOiAyNXB4O1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgICBsaW5lLWhlaWdodDogMC44MztcbiAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgY29sb3I6ICMwMDAwMDA7XG4gICAgcGFkZGluZzogMjBweCAwcHggMzBweCAwcHg7XG4gICAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkO1xufVxuQG1lZGlhIChtYXgtd2lkdGg6NzY4cHgpe1xuICAgIC50aXRsZXtcbiAgICAgICAgZm9udC1zaXplOiAxNXB4O1xuICAgIH1cbn1cbi5pbnEge1xuICAgIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gICAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIGNvbG9yOiAjMDAwMDAwO1xuICAgIHBhZGRpbmc6IDBweCAwcHggMzBweCAwcHg7XG59XG5AbWVkaWEgKG1heC13aWR0aDo3NjhweCl7XG4gICAgLmlucXtcbiAgICAgICAgZm9udC1zaXplOiAxNXB4O1xuICAgIH1cbn1cbi5jb250ZW50e1xuICAgIGRpc3BsYXk6IGZsZXg7XG59XG4uaW5jbHVkZSB7XG4gICAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjb2xvcjogIzAwMDAwMDtcbiAgICBwYWRkaW5nOiAwcHggMHB4IDBweCAxMHB4O1xufVxuQG1lZGlhIChtYXgtd2lkdGg6NzY4cHgpe1xuLmluY2x1ZGV7XG4gICAgZm9udC1zaXplOiAxM3B4O1xufVxufVxuLmNhcmQtdGV4dCB7XG4gICAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gICAgZm9udC1zaXplOiA4NS41cHg7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjb2xvcjogIzM5N2M4NjtcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQ7XG59XG5AbWVkaWEgKG1heC13aWR0aDo3NjhweCl7XG4uY2FyZC10ZXh0e1xuICAgIGZvbnQtc2l6ZTogMzVweDtcbn1cbn1cbi5hZGpibGUge1xuICAgIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICBmb250LXdlaWdodDogbm9ybWFsO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIGNvbG9yOiAjMDAwMDAwO1xuICAgIHBhZGRpbmc6IDBweCAwcHggMTBweCAwcHg7XG59XG5AbWVkaWEgKG1heC13aWR0aDo3Njgpe1xuICAgIC5hZGpibGV7XG4gICAgICAgIHBhZGRpbmc6IDIwcHggMHB4IDEwcHggMHB4O1xuICAgIH1cbn1cbi5udW1iZXJfc2Rqe1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgLyogYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkOyAqL1xufVxuLnF1b3RpZW50e1xuICAgIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBmb250LXdlaWdodDogbm9ybWFsO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgICBsaW5lLWhlaWdodDogbm9ybWFsO1xuICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjb2xvcjogIzAwMDAwMDtcbn1cbi5wZXJjaWV2ZWQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgcGFkZGluZzogMzBweCAwcHggMHB4IDIwcHg7XG59XG5AbWVkaWEgKG1heC13aWR0aDo3NjhweCl7XG4gICAgLnBlcmNpZXZlZHtcbiAgICAgICAgcGFkZGluZzogMTBweCAwcHggMHB4IDMwcHg7XG4gICAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6NTAwcHgpe1xuICAgIC5wZXJjaWV2ZWR7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMHB4IDBweCA1MHB4O1xuICAgIH1cbn1cbi5wZXJjZXtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIHBhZGRpbmc6IDMuNXJlbSAwcHggMHB4IDIwcHg7XG59XG5AbWVkaWEgKG1heC13aWR0aDo3NjhweCl7XG4gICAgLnBlcmNle1xuICAgICAgICBwYWRkaW5nOiAxcmVtIDBweCAwcHggMzBweDtcbiAgICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDo1MDBweCl7XG4gICAgLnBlcmNle1xuICAgICAgICBwYWRkaW5nOiAxcmVtIDBweCAwcHggNTBweDtcbiAgICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDo3NjhweCl7XG4uY29udGFpbmVyIHtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG59XG59XG4uc29sdXRpb25zIHtcbiAgICBkaXNwbGF5OiBub25lO1xufVxuQG1lZGlhIChtYXgtd2lkdGg6NTAwcHgpe1xuICAgIC5zb2x1dGlvbnMge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICB9XG59XG4uc29tZXdoZXJlIHtcbiAgICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgICBmb250LXNpemU6IDMycHg7XG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGluZS1oZWlnaHQ6IDEuMDQ7XG4gICAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIGNvbG9yOiAjMDAwMDAwO1xuICAgIHBhZGRpbmctbGVmdDogMTNweDtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOjUwMHB4KXtcbiAgICAuc29tZXdoZXJlIHtcbiAgICAgICAgcGFkZGluZzogMHB4IDBweCAwcHggNXJlbTtcbiAgICB9XG59XG4ubmFiIHtcbiAgICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcbiAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgY29sb3I6ICMwMDAwMDA7XG59XG4ud2hlcmUge1xuICAgIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICAgIGZvbnQtc2l6ZTogMzVweDtcbiAgICBmb250LXdlaWdodDogbm9ybWFsO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgICBsaW5lLWhlaWdodDogMS4wNDtcbiAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgY29sb3I6ICMwMDAwMDA7XG4gICAgcGFkZGluZy1sZWZ0OiAxM3B4O1xufVxuQG1lZGlhIChtYXgtd2lkdGg6NTAwcHgpe1xuICAgIC53aGVyZSB7XG4gICAgICAgIHBhZGRpbmc6IDBweCAwcHggMHB4IDVyZW07XG4gICAgfVxufVxuXG4ubWFsZSB7XG4gICAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgICBsaW5lLWhlaWdodDogMS4zOTtcbiAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgY29sb3I6ICMwMDAwMDA7XG4gICAgcGFkZGluZzogMTBweCAwcHggMTBweCAwcHg7XG59XG4gICAgQG1lZGlhIChtYXgtd2lkdGg6NzY4cHgpIHtcbiAgICAgICAubWFsZXtcbmZvbnQtc2l6ZTogMTVweDtcbiAgICAgICB9IFxuICAgIH1cbi5tYXQtaW5wdXQtZWxlbWVudHtcbmJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xufVxuZm9ybS5leGFtcGxlIGlucHV0W3R5cGU9dGV4dF0ge1xuICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgZm9udC1zaXplOiAxN3B4O1xuICAgIGJvcmRlcjogMnB4IHNvbGlkIHdoaXRlO1xuICAgIGZsb2F0OiBsZWZ0O1xuICAgIHdpZHRoOiA5MCU7XG4gICAgYm9yZGVyLXJhZGl1czogMHB4O1xuICAgIG9wYWNpdHk6IC4yNTtcbiAgICBib3JkZXItcmlnaHQ6IG5vbmU7XG4gICAgY29sb3I6IGRhcmttYWdlbnRhIDtcblxuICAgIFxuICB9XG4gIEBtZWRpYSAobWF4LXdpZHRoOjUwMHB4KSB7XG4gIGZvcm0uZXhhbXBsZSBpbnB1dFt0eXBlPXRleHRdIHtcbiAgICAgICAgcGFkZGluZzogMHB4O1xuICAgICAgICBmb250LXNpemU6IDE3cHg7XG4gICAgICAgIC8qIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlOyAqL1xuICAgICAgICBmbG9hdDogbGVmdDtcbiAgICAgICAgd2lkdGg6IDYwJTtcbiAgICAgICAgYmFja2dyb3VuZDogI2YxZjFmMTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMHB4O1xuICAgICAgICBvcGFjaXR5OiAuMjU7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAxLjVyZW07XG4gICAgICAgIGJvcmRlci1yaWdodDogbm9uZTsgXG4gICAgICB9XG4gIH1cbiAgLmxpc3QtaW5saW5lIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZDtcbiAgICBwYWRkaW5nOiAwcHggMHB4IDIwcHggMHB4O1xufVxuLnVwX3RvX2RhdGUge1xuICAgIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBmb250LXdlaWdodDogbm9ybWFsO1xuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgY29sb3I6ICMwMDAwMDA7XG4gICAgZm9udDogYm9sZDtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbn1cbi5wZXJjZW50IHtcbiAgICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgICBmb250LXNpemU6IDMycHg7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjb2xvcjogIzAwMDAwMDtcbn1cbiAgICAubWFoaW5kcmEge1xuICAgICAgICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgICAgICAgZm9udC1zaXplOiAzMnB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgICBjb2xvcjogIzAwMDAwMDtcbiAgICB9XG4gICAgLnJhbmdlIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgY29sb3I6ICMwMDAwMDA7XG4gICAgfVxuICBmb3JtLmV4YW1wbGUgYnV0dG9uIHtcbiAgICBmbG9hdDogbGVmdDtcbiAgICB3aWR0aDogMTAlO1xuICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgYmFja2dyb3VuZDogIzA3OTdhZTtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgZm9udC1zaXplOiAxN3B4O1xuICAgIC8qIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlOyAqL1xuICAgIGJvcmRlci1sZWZ0OiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgb3BhY2l0eTogLjg1O1xuICB9XG4gIEBtZWRpYSAobWF4LXdpZHRoOjUwMHB4KXtcbiAgZm9ybS5leGFtcGxlIGJ1dHRvbntcbiAgICBmbG9hdDogbGVmdDtcbiAgICB3aWR0aDogMTAlO1xuICAgIGJhY2tncm91bmQ6ICMwNzk3YWU7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIGZvbnQtc2l6ZTogMTQuMXB4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xuICAgIGJvcmRlci1sZWZ0OiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgcGFkZGluZzogMXB4O1xuICAgIG9wYWNpdHk6IC44NTtcbiAgfVxuICB9XG4uY29tcGFueTJ7XG4gICAgcGFkZGluZy1sZWZ0OjU1cHg7XG59XG4udG9wLWNvbXBhbmllcy10ZXh0e1xuICAgIGZvbnQtc2l6ZTogMzBweDtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGluZS1oZWlnaHQ6IDAuNztcbiAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgY29sb3I6ICMwMDAwMDA7XG59XG5AbWVkaWEgKG1heC13aWR0aDo3NjhweCkge1xuICAgIC50b3AtY29tcGFuaWVzLXRleHR7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG59XG5cbi5uZXdzbGV0dGVyIDo6bmctZGVlcCAgLm1hdC1mb3JtLWZpZWxkLWxhYmVsIHtcbiAgICAvKmNoYW5nZSBjb2xvciBvZiBsYWJlbCovXG4gICAgY29sb3I6IGJsYWNrICFpbXBvcnRhbnQ7XG59XG5cbi5zdHlsZWQtc2VsZWN0IHNlbGVjdHtcbiAgICBzaXplOjEwMHB4O1xufVxuXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NzYycHgpe1xuICAgIC5sb29raW5nLWZvci1jb21wYW55LXRleHR7XG4gICAgICAgIGZvbnQtc2l6ZTogMjAuNXB4O1xuICAgIH1cblxuICAgIC5sb29rLWZvci1jb21wYW55e1xuICAgICAgICBtYXJnaW46IDUwcHggMzBweCAwcHggMzBweDtcbiAgICB9XG4gICAgXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOjUwMHB4KSB7XG4gICAgICAgICAgICAubG9vay1mb3ItY29tcGFueXtcbiAgICAgICAgICAgICAgICBtYXJnaW46IDEwcHggMHB4IDBweCA0MHB4O1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC5oZWFkZXJ7XG4gICAgICAgIHBhZGRpbmctYm90dG9tOiAxMDFweDtcbiAgICB9XG5cbiAgICAuY29udHJpYnV0b3J7XG4gICAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICB9XG5cbiAgICAucm93e1xuICAgICAgICBtYXJnaW46MHB4O1xuICAgIH1cblxuICAgIC5idG4tcHJpbWFyeXtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI0UwRTZFRDtcbiAgICB9XG5cbiAgICAudG9wLWNvbXBhbmllcy10ZXh0e1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgLnRvcC1jb21wYW5pZXN7XG4gICAgICAgIHBhZGRpbmctdG9wOjIwcHg7XG4gICAgfVxuXG4gICAgLmFiY2R7XG4gICAgICAgIHBhZGRpbmctdG9wOjIwcHg7XG4gICAgICAgIGZvbnQtc2l6ZToxOHB4O1xuICAgICAgICBsaW5lLWhlaWdodDogMzBweDtcbiAgICB9XG5cbiAgICAubWF0LXNpZGV7XG4gICAgICAgIHBhZGRpbmc6MHB4IDUwcHggMHB4IDQwcHg7XG4gICAgfVxuICAgIC5sb29rLWZvci1jb21wYW55LW1hdHtcbiAgICAgICAgZm9udC1zaXplOiAxNXB4O1xuICAgIH1cblxuICAgIC5kaXJlY3Rvcnl7XG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgcGFkZGluZy10b3A6MHB4O1xuICAgIH1cblxuICAgICNjb21hcGFueS1zZWxlY3R7XG4gICAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICB9XG5cbiAgICAuZm9ybS1ncm91cHtcbiAgICAgICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjRTBFNkVEO1xuICAgIH1cblxuICAgIC50b3AtY29tcGFuaWVzLXRleHR7XG4gICAgICAgIGZvbnQtc2l6ZTogMjdweDtcbiAgICB9XG5cbiAgICAubmV3c2xldHRlcntcbiAgICAgICAgcGFkZGluZzogMHB4O1xuICAgIH1cblxuICAgIC5mb290ZXItY29sMXtcbiAgICAgICAgcGFkZGluZzogMzBweCAwcHg7XG4gICAgfVxuXG4gICAgLm5ld3NsZXR0ZXItdGV4dHtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICBwYWRkaW5nOiAxMHB4O1xuICAgIH1cblxuICAgIC5leGFtcGxlLWZ1bGwtd2lkdGh7XG4gICAgICAgIHBhZGRpbmctdG9wOjE1cHg7XG4gICAgfVxuXG4gICAgLmFycm93e1xuICAgICAgICB0b3A6IDQ1cHg7XG4gICAgICAgIHJpZ2h0OiA2cHg7XG4gICAgfVxuXG4gICAgLmZvb3Rlci1pY29uc3tcbiAgICAgICAgcGFkZGluZzogMjBweCAwcHggMzBweCAwcHg7XG4gICAgfVxufVxuLmNvbC00LnAtMHtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG59XG5pLmZhLmZhLWFycm93LXJpZ2h0IHtcbiAgICBmb250LXNpemU6IDI1cHg7XG4gICAgZmxvYXQ6IHJpZ2h0O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICByaWdodDogMnB4O1xuICAgIGNvbG9yOiAjMzk3Yzg2O1xufVxuQG1lZGlhIChtYXgtd2lkdGg6MzIwcHgpe1xuICAgIGkuZmEuZmEtYXJyb3ctcmlnaHR7XG4gICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgZmxvYXQ6IHJpZ2h0O1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHJpZ2h0OiAwcHg7XG4gICAgICAgIGNvbG9yOiAjMzk3Yzg2O1xuICAgICAgICBsZWZ0OiAyMzNweDtcbiAgICB9XG59IiwiLmNvbnRhaW5lci1mbHVpZCB7XG4gIGJhY2tncm91bmQ6IHVybCguLi8uLi8uLi9hc3NldHMvL2Jhbm5lci1pbWFnZTEucG5nKTtcbiAgaGVpZ2h0OiAxMzdweDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIGNlbnRlcjtcbiAgLW1vei1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAtd2Via2l0LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIC1vLWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG59XG5cbmJvZHkge1xuICBmb250LWZhbWlseTogXCJSb2JvdG9cIiwgTW9udHNlcnJhdDtcbn1cblxuLnF1aXotZGl2IHtcbiAgbWFyZ2luLXRvcDogNzBweDtcbiAgcGFkZGluZzogMHB4O1xufVxuXG4uZ3JpZC1jb250YWluZXIge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDcwJSAzMCU7XG59XG5cbi5kb25lIHtcbiAgZm9udC1zaXplOiA0MHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xuICBjb2xvcjogIzM5N2M4NjtcbiAgcGFkZGluZy10b3A6IDQzcHg7XG59XG5cbi5hY2NvcmRpbmctdG8teW91IHtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogODAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5kb25lLWNvbCB7XG4gIHBhZGRpbmctdG9wOiA0MHB4O1xufVxuXG4ucmVtb3ZlLXBhZGRpbmcge1xuICBwYWRkaW5nOiAwcHg7XG59XG5cbi5hY2NvcmRpbmcge1xuICBwYWRkaW5nLXRvcDogNDVweDtcbn1cblxuLmFjY29yZGluZy10byB7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5kZXRhaWxlZCB7XG4gIGJhY2tncm91bmQ6IHJnYmEoNzQsIDEyMywgMTMzLCAwLjEpO1xufVxuXG4uZGV0YWlsZWQtcmVwb3J0IHtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogNTAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzM5N2M4NjtcbiAgcGFkZGluZzogMTBweDtcbn1cblxuLmV4YW1wbGUtZnVsbC13aWR0aCB7XG4gIHBhZGRpbmc6IDEwcHg7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjZDFkMmQyO1xufVxuXG4uYXJyb3cge1xuICBjb2xvcjogIzM5N2M4NjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDE2MHB4O1xuICByaWdodDogNTBweDtcbn1cblxuLmlucS1xdW90aWVudCB7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmctdG9wOiA3NHB4O1xufVxuXG4uZm9ydHkge1xuICBmb250LXNpemU6IDQwcHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzM5N2M4NjtcbiAgcGFkZGluZy1sZWZ0OiAxNXB4O1xufVxuXG4uc2hhcmVvbiB7XG4gIHBhZGRpbmc6IDcycHggMHB4IDExMnB4IDBweDtcbn1cblxuLnNoYXJlb24tdGV4dCB7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMDQ7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nLWJvdHRvbTogMjZweDtcbn1cblxuLmluY2x1c2lvbi1kb25lIHtcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkIGJsYWNrO1xufVxuXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pbmNsdXNpb24tdGV4dCB7XG4gICAgZm9udC1zaXplOiAyMHB4O1xuICB9XG5cbiAgLmRvbmUge1xuICAgIGZvbnQtc2l6ZTogMjBweDtcbiAgfVxuXG4gIC5yZW1vdmUtcGFkZGluZyB7XG4gICAgcGFkZGluZy1sZWZ0OiAxNXB4O1xuICB9XG5cbiAgLmV4YW1wbGUtZnVsbC13aWR0aCB7XG4gICAgZm9udC1zaXplOiAxNXB4O1xuICB9XG5cbiAgLmFycm93IHtcbiAgICByaWdodDogMzBweDtcbiAgfVxuXG4gIC5zaGFyZW9uIHtcbiAgICBwYWRkaW5nOiAxNXB4IDBweCAxNXB4IDBweDtcbiAgfVxuXG4gIC5pbWFnZSB7XG4gICAgd2lkdGg6IDY5cHg7XG4gIH1cblxuICAuY29tcGFueS1wcm9maWxlIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDE1cHg7XG4gIH1cblxuICAucm93IHtcbiAgICBtYXJnaW46IDBweDtcbiAgfVxuXG4gIC5hY2NvcmRpbmctdG8teW91IHtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gIH1cblxuICAuaW5xLXF1b3RpZW50IHtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gIH1cblxuICAuY29tcGFueS1wcm9maWxlIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDBweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAwcHg7XG4gIH1cbn1cbi8qIC5oZWFkZXJ7XG4gICAgYmFja2dyb3VuZDogdXJsKC4uLy4uL2Fzc2V0cy9ob21lcGFnZS5wbmcpIG5vLXJlcGVhdCBjZW50ZXIgY2VudGVyO1xuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XG4gICAgcGFkZGluZy1ib3R0b206IDE5cmVtO1xuICAgIC1tb3otYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgICAtd2Via2l0LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gICAgLW8tYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xufSAqL1xuLmFib3V0dXMtaGVhZGVyIHtcbiAgcGFkZGluZzogMjBweCAwcHggMHB4IDJweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC5hYm91dHVzLWhlYWRlciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuLmhvbWUtdGV4dCB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgY29sb3I6ICNmZmZmZmY7XG59XG5cbi5zdWItbWVudS1pdGVtcyB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgY29sb3I6ICNkN2Q3ZDc7XG59XG5cbi5zaWRlYmFyLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgdG9wOiAwO1xuICBib3R0b206IDA7XG4gIHJpZ2h0OiAwO1xufVxuXG4ubG9vay1mb3ItY29tcGFueSB7XG4gIHBhZGRpbmc6IDBweDtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHdpZHRoOiA1NyU7XG59XG5cbi50cmVhdGluZyB7XG4gIHBhZGRpbmctdG9wOiAxM3JlbTtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC50cmVhdGluZyB7XG4gICAgcGFkZGluZy10b3A6IDVyZW07XG4gIH1cbn1cbi5zZWFyY2gtaWNvbiB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcGFkZGluZy10b3A6IDBweDtcbn1cblxuLnNlYXJjaC10ZXh0IHtcbiAgZm9udC1zaXplOiAxMHB4O1xuICBmb250LXdlaWdodDogMzAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS43OTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgY29sb3I6ICNmZmZmZmY7XG4gIHBhZGRpbmc6IDEwcHggMHB4IDBweCAxNXB4O1xufVxuXG4uY29udHJpYnV0b3Ige1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAyMXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuODM7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmctdG9wOiAzMHB4O1xufVxuXG4uc2VhcmNoLWNvbnRhaW5lciB7XG4gIC8qIG1hcmdpbjogMjBweCAxMDBweCAwcHggMTM1cHg7ICovXG4gIHBhZGRpbmctdG9wOiA0MHB4O1xuICAvKiB0ZXh0LWFsaWduOiBjZW50ZXI7ICovXG59XG5cbi5tYXJnaW4wIHtcbiAgbWFyZ2luOiAwcHg7XG59XG5cbiNjb250cmlidXRlQXMge1xuICBwYWRkaW5nLWxlZnQ6IDM1cHg7XG59XG5cbiNzZWxlY3QtY29tcGFueS1pY29uIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDE2cHg7XG4gIGxlZnQ6IDMycHg7XG59XG5cbi5zZWFyY2gtY29udGFpbmVyIC5mb3JtLWdyb3VwIHNlbGVjdCwgLnNlYXJjaC1jb250YWluZXIgLmZvcm0tZ3JvdXAgaW5wdXQge1xuICAvKiAgOiA3N3B4ICFpbXBvcnRhbnQ7ICovXG4gIGJvcmRlci1yYWRpdXM6IDAgIWltcG9ydGFudDtcbiAgb3V0bGluZTogbm9uZTtcbiAgYm94LXNoYWRvdzogbm9uZTtcbiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgI0UwRTZFRDtcbiAgYm9yZGVyLWxlZnQ6IG5vbmU7XG4gIGhlaWdodDogNjBweDtcbn1cblxuLmZvcm0tZ3JvdXAgc2VsZWN0IHtcbiAgYmFja2dyb3VuZDogdXJsKC4uLy4uLy4uL2Fzc2V0cy9kb3duLnBuZykgbm8tcmVwZWF0IGNlbnRlcjtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4jY29tYXBhbnktc2VsZWN0IHtcbiAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjRTBFNkVEO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHBhZGRpbmctbGVmdDogODdweDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbi14OiA1MTVweDtcbn1cblxuI2NvbnRyaWJ1dGUtYXMge1xuICBwYWRkaW5nLWxlZnQ6IDM1cHg7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBmb250LXNpemU6IDEzcHg7XG4gIGJhY2tncm91bmQtcG9zaXRpb24teDogMjQwcHg7XG59XG5cbi5zZWFyY2gtY29udGFpbmVyOjpwbGFjZWhvbGRlciB7XG4gIC8qIENocm9tZSwgRmlyZWZveCwgT3BlcmEsIFNhZmFyaSAxMC4xKyAqL1xuICBjb2xvcjogI0FEQjdDNztcbiAgZm9udC1zaXplOiAxNnB4O1xuICBmb250LXdlaWdodDogNjAwO1xuICBsaW5lLWhlaWdodDogMTlweDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbn1cblxuLnNlYXJjaC1jb250YWluZXI6Oi1tcy1pbnB1dC1wbGFjZWhvbGRlciB7XG4gIGNvbG9yOiAjQURCN0M3O1xuICBmb250LXNpemU6IDE2cHg7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGxpbmUtaGVpZ2h0OiAxOXB4O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmJ0bi1zdGFydGVkIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxufVxuLmNhcmQge1xuICBwYWRkaW5nOiAyMHB4IDBweCAyMHB4IDBweDtcbiAgYm9yZGVyOiBub25lO1xufVxuXG4ucmlnaHQtYXJyb3cge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMThweDtcbiAgcmlnaHQ6IDQ1cHg7XG59XG5cbi50b3AtY29tcGFuaWVzIHtcbiAgcGFkZGluZzogODJweCAwcHggMjlweCAwcHg7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCBibGFjaztcbiAgbWFyZ2luOiAwcHg7XG59XG5cbi5jb21wYW5pZXMtdGV4dCB7XG4gIGZvbnQtc2l6ZTogNDhweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAwLjc7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG4uYWJjZCB7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuODM7XG4gIGxldHRlci1zcGFjaW5nOiAyLjhweDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuYWJjZCB7XG4gICAgcGFkZGluZzogMzBweCAwcHggMHB4IDBweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cbn1cbi50YWdsaW5lIHtcbiAgZm9udC1zaXplOiA0MXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgY29sb3I6ICNmZmY7XG4gIHBhZGRpbmctdG9wOiA3cmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLnRhZ2xpbmUge1xuICAgIGZvbnQtc2l6ZTogMjJweDtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC50YWdsaW5lIHtcbiAgICBmb250LXNpemU6IDE1cHg7XG4gICAgcGFkZGluZy10b3A6IDMwcHg7XG4gIH1cbn1cbi5sb29rLWZvci1jb21wYW55LW1hdCB7XG4gIHdpZHRoOiAxMDAlO1xuICBmb250LXNpemU6IDQxcHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICBjb2xvcjogd2hpdGU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIG1hcmdpbi10b3A6IDEwcHg7XG4gIGhlaWdodDogMTUwcHg7XG59XG5cbi8qIC5sb29rLWZvci1jb21wYW55LW1hdCA6Om5nLWRlZXAgLm1hdC1mb2N1c2VkIC5tYXQtZm9ybS1maWVsZC1sYWJlbCB7XG5cbiAgICBjb2xvcjogd2hpdGUgIWltcG9ydGFudDtcbn1cblxuLmxvb2stZm9yLWNvbXBhbnktbWF0IDo6bmctZGVlcCAubWF0LWlucHV0LXBsYWNlaG9sZGVyIHtcblxuICAgIGNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xufSAqL1xuLyogXG4ubG9vay1mb3ItY29tcGFueS1tYXQgOjpuZy1kZWVwLm1hdC1mb3JtLWZpZWxkLXVuZGVybGluZSB7ICovXG4vKmNoYW5nZSBjb2xvciBvZiB1bmRlcmxpbmUqL1xuLypjaGFuZ2UgY29sb3Igb2YgdW5kZXJsaW5lKi9cbi8qIGJhY2tncm91bmQtY29sb3I6IHJnYigyNTUsMjU1LDI1NSwgMC4xKSAhaW1wb3J0YW50OyAqL1xuLyogYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwyNTUsMjU1LCAwLjEpICFpbXBvcnRhbnQ7ICovXG4vKiBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xufSAqL1xuLyogXG4ubG9vay1mb3ItY29tcGFueS1tYXQgOjpuZy1kZWVwLm1hdC1mb3JtLWZpZWxkLXJpcHBsZSB7ICovXG4vKmNoYW5nZSBjb2xvciBvZiB1bmRlcmxpbmUgd2hlbiBmb2N1c2VkKi9cbi8qIGJhY2tncm91bmQtY29sb3I6IHdoaXRlICFpbXBvcnRhbnQ7O1xufSAqL1xuLyogXG4ubG9vay1mb3ItY29tcGFueS1tYXQgOjpuZy1kZWVwICAubWF0LWZvcm0tZmllbGQtbGFiZWwge1xuICAgIGNvbG9yOndoaXRlICFpbXBvcnRhbnQ7XG59XG5cbi5leGFtcGxlLWZ1bGwtd2lkdGggOjpuZy1kZWVwICAubWF0LWZvcm0tZmllbGQtbGFiZWx7XG4gICAgY29sb3I6IGJsYWNrICFpbXBvcnRhbnQ7XG59XG4ubWF0LWZvcm0tZmllbGQtZmxleHtcbmJvcmRlcjogMXB4IHNvbGlkIHdoaXRlICFpbXBvcnRhbnQ7XG59ICovXG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLmNvbC00IHtcbiAgICBmbGV4OiAxMDAlO1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgfVxufVxuLnRpdGxlIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMjVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAwLjgzO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMjBweCAwcHggMzBweCAwcHg7XG4gIGJvcmRlci1ib3R0b206IDNweCBzb2xpZDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC50aXRsZSB7XG4gICAgZm9udC1zaXplOiAxNXB4O1xuICB9XG59XG4uaW5xIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAzMHB4IDBweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pbnEge1xuICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgfVxufVxuLmNvbnRlbnQge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uaW5jbHVkZSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAwcHggMHB4IDBweCAxMHB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmluY2x1ZGUge1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgfVxufVxuLmNhcmQtdGV4dCB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDg1LjVweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMzk3Yzg2O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQ7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuY2FyZC10ZXh0IHtcbiAgICBmb250LXNpemU6IDM1cHg7XG4gIH1cbn1cbi5hZGpibGUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAyNHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAxMHB4IDBweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OCkge1xuICAuYWRqYmxlIHtcbiAgICBwYWRkaW5nOiAyMHB4IDBweCAxMHB4IDBweDtcbiAgfVxufVxuLm51bWJlcl9zZGoge1xuICBkaXNwbGF5OiBmbGV4O1xuICAvKiBib3JkZXItYm90dG9tOiAzcHggc29saWQ7ICovXG59XG5cbi5xdW90aWVudCB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG4ucGVyY2lldmVkIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMzBweCAwcHggMHB4IDIwcHg7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAucGVyY2lldmVkIHtcbiAgICBwYWRkaW5nOiAxMHB4IDBweCAwcHggMzBweDtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC5wZXJjaWV2ZWQge1xuICAgIHBhZGRpbmc6IDEwcHggMHB4IDBweCA1MHB4O1xuICB9XG59XG4ucGVyY2Uge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAzLjVyZW0gMHB4IDBweCAyMHB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLnBlcmNlIHtcbiAgICBwYWRkaW5nOiAxcmVtIDBweCAwcHggMzBweDtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC5wZXJjZSB7XG4gICAgcGFkZGluZzogMXJlbSAwcHggMHB4IDUwcHg7XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuY29udGFpbmVyIHtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gIH1cbn1cbi5zb2x1dGlvbnMge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLnNvbHV0aW9ucyB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gIH1cbn1cbi5zb21ld2hlcmUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAzMnB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmctbGVmdDogMTNweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC5zb21ld2hlcmUge1xuICAgIHBhZGRpbmc6IDBweCAwcHggMHB4IDVyZW07XG4gIH1cbn1cbi5uYWIge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLndoZXJlIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMzVweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMDQ7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nLWxlZnQ6IDEzcHg7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA1MDBweCkge1xuICAud2hlcmUge1xuICAgIHBhZGRpbmc6IDBweCAwcHggMHB4IDVyZW07XG4gIH1cbn1cbi5tYWxlIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMTBweCAwcHggMTBweCAwcHg7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAubWFsZSB7XG4gICAgZm9udC1zaXplOiAxNXB4O1xuICB9XG59XG4ubWF0LWlucHV0LWVsZW1lbnQge1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbn1cblxuZm9ybS5leGFtcGxlIGlucHV0W3R5cGU9dGV4dF0ge1xuICBwYWRkaW5nOiAxMHB4O1xuICBmb250LXNpemU6IDE3cHg7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHdoaXRlO1xuICBmbG9hdDogbGVmdDtcbiAgd2lkdGg6IDkwJTtcbiAgYm9yZGVyLXJhZGl1czogMHB4O1xuICBvcGFjaXR5OiAwLjI1O1xuICBib3JkZXItcmlnaHQ6IG5vbmU7XG4gIGNvbG9yOiBkYXJrbWFnZW50YTtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIGZvcm0uZXhhbXBsZSBpbnB1dFt0eXBlPXRleHRdIHtcbiAgICBwYWRkaW5nOiAwcHg7XG4gICAgZm9udC1zaXplOiAxN3B4O1xuICAgIC8qIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlOyAqL1xuICAgIGZsb2F0OiBsZWZ0O1xuICAgIHdpZHRoOiA2MCU7XG4gICAgYmFja2dyb3VuZDogI2YxZjFmMTtcbiAgICBib3JkZXItcmFkaXVzOiAwcHg7XG4gICAgb3BhY2l0eTogMC4yNTtcbiAgICBtYXJnaW4tbGVmdDogMS41cmVtO1xuICAgIGJvcmRlci1yaWdodDogbm9uZTtcbiAgfVxufVxuLmxpc3QtaW5saW5lIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3JkZXItYm90dG9tOiAycHggc29saWQ7XG4gIHBhZGRpbmc6IDBweCAwcHggMjBweCAwcHg7XG59XG5cbi51cF90b19kYXRlIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIGZvbnQ6IGJvbGQ7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4ucGVyY2VudCB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDMycHg7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG4ubWFoaW5kcmEge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAzMnB4O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLnJhbmdlIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbmZvcm0uZXhhbXBsZSBidXR0b24ge1xuICBmbG9hdDogbGVmdDtcbiAgd2lkdGg6IDEwJTtcbiAgcGFkZGluZzogMTBweDtcbiAgYmFja2dyb3VuZDogIzA3OTdhZTtcbiAgY29sb3I6IHdoaXRlO1xuICBmb250LXNpemU6IDE3cHg7XG4gIC8qIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlOyAqL1xuICBib3JkZXItbGVmdDogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIG9wYWNpdHk6IDAuODU7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA1MDBweCkge1xuICBmb3JtLmV4YW1wbGUgYnV0dG9uIHtcbiAgICBmbG9hdDogbGVmdDtcbiAgICB3aWR0aDogMTAlO1xuICAgIGJhY2tncm91bmQ6ICMwNzk3YWU7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIGZvbnQtc2l6ZTogMTQuMXB4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xuICAgIGJvcmRlci1sZWZ0OiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgcGFkZGluZzogMXB4O1xuICAgIG9wYWNpdHk6IDAuODU7XG4gIH1cbn1cbi5jb21wYW55MiB7XG4gIHBhZGRpbmctbGVmdDogNTVweDtcbn1cblxuLnRvcC1jb21wYW5pZXMtdGV4dCB7XG4gIGZvbnQtc2l6ZTogMzBweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAwLjc7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLnRvcC1jb21wYW5pZXMtdGV4dCB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB9XG59XG4ubmV3c2xldHRlciA6Om5nLWRlZXAgLm1hdC1mb3JtLWZpZWxkLWxhYmVsIHtcbiAgLypjaGFuZ2UgY29sb3Igb2YgbGFiZWwqL1xuICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcbn1cblxuLnN0eWxlZC1zZWxlY3Qgc2VsZWN0IHtcbiAgc2l6ZTogMTAwcHg7XG59XG5cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzYycHgpIHtcbiAgLmxvb2tpbmctZm9yLWNvbXBhbnktdGV4dCB7XG4gICAgZm9udC1zaXplOiAyMC41cHg7XG4gIH1cblxuICAubG9vay1mb3ItY29tcGFueSB7XG4gICAgbWFyZ2luOiA1MHB4IDMwcHggMHB4IDMwcHg7XG4gIH1cbn1cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzYycHgpIGFuZCAobWF4LXdpZHRoOiA1MDBweCkge1xuICAubG9vay1mb3ItY29tcGFueSB7XG4gICAgbWFyZ2luOiAxMHB4IDBweCAwcHggNDBweDtcbiAgfVxufVxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjJweCkge1xuICAuaGVhZGVyIHtcbiAgICBwYWRkaW5nLWJvdHRvbTogMTAxcHg7XG4gIH1cbn1cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzYycHgpIHtcbiAgLmNvbnRyaWJ1dG9yIHtcbiAgICBmb250LXNpemU6IDEzcHg7XG4gIH1cbn1cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzYycHgpIHtcbiAgLnJvdyB7XG4gICAgbWFyZ2luOiAwcHg7XG4gIH1cbn1cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzYycHgpIHtcbiAgLmJ0bi1wcmltYXJ5IHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjRTBFNkVEO1xuICB9XG59XG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2MnB4KSB7XG4gIC50b3AtY29tcGFuaWVzLXRleHQge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgfVxufVxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjJweCkge1xuICAudG9wLWNvbXBhbmllcyB7XG4gICAgcGFkZGluZy10b3A6IDIwcHg7XG4gIH1cbn1cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzYycHgpIHtcbiAgLmFiY2Qge1xuICAgIHBhZGRpbmctdG9wOiAyMHB4O1xuICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICBsaW5lLWhlaWdodDogMzBweDtcbiAgfVxufVxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjJweCkge1xuICAubWF0LXNpZGUge1xuICAgIHBhZGRpbmc6IDBweCA1MHB4IDBweCA0MHB4O1xuICB9XG59XG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2MnB4KSB7XG4gIC5sb29rLWZvci1jb21wYW55LW1hdCB7XG4gICAgZm9udC1zaXplOiAxNXB4O1xuICB9XG59XG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2MnB4KSB7XG4gIC5kaXJlY3Rvcnkge1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBwYWRkaW5nLXRvcDogMHB4O1xuICB9XG59XG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2MnB4KSB7XG4gICNjb21hcGFueS1zZWxlY3Qge1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgfVxufVxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjJweCkge1xuICAuZm9ybS1ncm91cCB7XG4gICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjRTBFNkVEO1xuICB9XG59XG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2MnB4KSB7XG4gIC50b3AtY29tcGFuaWVzLXRleHQge1xuICAgIGZvbnQtc2l6ZTogMjdweDtcbiAgfVxufVxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjJweCkge1xuICAubmV3c2xldHRlciB7XG4gICAgcGFkZGluZzogMHB4O1xuICB9XG59XG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2MnB4KSB7XG4gIC5mb290ZXItY29sMSB7XG4gICAgcGFkZGluZzogMzBweCAwcHg7XG4gIH1cbn1cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzYycHgpIHtcbiAgLm5ld3NsZXR0ZXItdGV4dCB7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICAgIHBhZGRpbmc6IDEwcHg7XG4gIH1cbn1cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzYycHgpIHtcbiAgLmV4YW1wbGUtZnVsbC13aWR0aCB7XG4gICAgcGFkZGluZy10b3A6IDE1cHg7XG4gIH1cbn1cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzYycHgpIHtcbiAgLmFycm93IHtcbiAgICB0b3A6IDQ1cHg7XG4gICAgcmlnaHQ6IDZweDtcbiAgfVxufVxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjJweCkge1xuICAuZm9vdGVyLWljb25zIHtcbiAgICBwYWRkaW5nOiAyMHB4IDBweCAzMHB4IDBweDtcbiAgfVxufVxuLmNvbC00LnAtMCB7XG4gIG1heC13aWR0aDogMTAwJTtcbn1cblxuaS5mYS5mYS1hcnJvdy1yaWdodCB7XG4gIGZvbnQtc2l6ZTogMjVweDtcbiAgZmxvYXQ6IHJpZ2h0O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHJpZ2h0OiAycHg7XG4gIGNvbG9yOiAjMzk3Yzg2O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMzIwcHgpIHtcbiAgaS5mYS5mYS1hcnJvdy1yaWdodCB7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICAgIGZsb2F0OiByaWdodDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgcmlnaHQ6IDBweDtcbiAgICBjb2xvcjogIzM5N2M4NjtcbiAgICBsZWZ0OiAyMzNweDtcbiAgfVxufSJdfQ== */"

/***/ }),

/***/ "./src/app/components/quiz-results/quiz-results.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/quiz-results/quiz-results.component.ts ***!
  \*******************************************************************/
/*! exports provided: QuizResultsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuizResultsComponent", function() { return QuizResultsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var QuizResultsComponent = /** @class */ (function () {
    function QuizResultsComponent() {
        this.SelectedRadio = "select";
        this.data = {
            events: [],
            labels: ["Female", "Male"],
            datasets: [
                {
                    data: [25, 75],
                    backgroundColor: [
                        "#148fd5",
                        "#da1b63",
                    ],
                }
            ]
        };
        this.pieChartOptions = {
            legend: {
                display: false
            },
            tooltips: {
                enabled: true
            }
        };
    }
    QuizResultsComponent.prototype.ngOnInit = function () {
    };
    QuizResultsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-quiz-results',
            template: __webpack_require__(/*! ./quiz-results.component.html */ "./src/app/components/quiz-results/quiz-results.component.html"),
            styles: [__webpack_require__(/*! ./quiz-results.component.scss */ "./src/app/components/quiz-results/quiz-results.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], QuizResultsComponent);
    return QuizResultsComponent;
}());



/***/ }),

/***/ "./src/app/components/quiz-test/quiz-test.component.html":
/*!***************************************************************!*\
  !*** ./src/app/components/quiz-test/quiz-test.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"container-fluid\">\n  <!-- <img src=\"../../../assets/banner-image1.png\" alt=\"\"> -->\n</section>\n<section class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-md-12 pad-0\">\n      <div class=\"grid-inclusion\">\n        <div>\n          <h5 class=\"inclusion-text\">INCLUSION <br />QUOTIENT QUIZ</h5>\n          <p class=\"contributing-as\">CONTRIBUTING AS: <b>EMPLOYEE</b></p>\n        </div>\n        <div>\n          <h5 class=\"count\" *ngIf=\"questions\"><b></b></h5>\n        </div>\n      </div>\n      <div class=\"que-ans\">\n        <div class=\"answ\">\n          <h5 class=\"q-a\">Q</h5>\n          <div [className]=\"'ques-div-comment'\">\n            <div>\n              <p class=\"question\">{{ question }}</p>\n            </div>\n          </div>\n        </div>\n        <div class=\"ques\">\n          <h5 class=\"q-a\">A</h5>\n          <div class=\"options\">\n            <div *ngIf=\"optionsText && optionsText.length > 0; else radioOpt\">\n              <div class=\"options-grid\">\n                <mat-radio-group class=\"radio-padd\">\n                  <div *ngFor=\"let opt of options; let i = index\">\n                    <mat-radio-button\n                      [value]=\"opt.aId\"\n                      (change)=\"setOptionValue($event, i)\"\n                      >{{ opt.answer }}\n                    </mat-radio-button>\n                    <!-- <span class=\"radio\">{{ opt.answer }}</span> -->\n                  </div>\n                </mat-radio-group>\n              </div>\n            </div>\n            <ng-template #radioOpt>\n              <mat-radio-group>\n                <div *ngFor=\"let opt of options\">\n                  <mat-radio-button\n                    [value]=\"opt.aId\"\n                    (change)=\"setOptionValue($event)\"\n                  ></mat-radio-button>\n                  <span class=\"radio\">{{ opt.answer }}</span\n                  >s\n                </div>\n              </mat-radio-group>\n            </ng-template>\n            <p>\n              <mat-form-field appearance=\"fill\">\n                <mat-label>Leave your comment</mat-label>\n                <input matInput placeholder=\"comment\" />\n              </mat-form-field>\n            </p>\n          </div>\n        </div>\n      </div>\n      <div class=\"progressbar\">\n        <mat-progress-bar\n          mode=\"determinate\"\n          value=\"{{ progress }}\"\n          class=\"progress\"\n        ></mat-progress-bar>\n      </div>\n      <div class=\"prev-next\">\n        <div class=\"cursor-pointer\" (click)=\"previousQuestion()\">\n          <span><img src=\"../../assets/left-arrow.png\"/></span>\n          <span class=\"previous-text\">PREVIOUS</span>\n        </div>\n        <div\n          class=\"next cursor-pointer\"\n          [ngClass]=\"{ disable: disable[nextID] === true }\"\n          (click)=\"nextQuestion()\"\n          *ngIf=\"nextID < questions?.length - 1\"\n        >\n          <span class=\"next-text\">NEXT</span>\n          <span><img src=\"../../assets/right-arrow.png\"/></span>\n        </div>\n        <div\n          class=\"next cursor-pointer\"\n          (click)=\"postQuestion()\"\n          [ngClass]=\"{ disable: disable[nextID] === true }\"\n          *ngIf=\"nextID >= questions?.length - 1\"\n        >\n          <span class=\"next-text\">Submit</span>\n          <span><img src=\"../../assets/right-arrow.png\"/></span>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n"

/***/ }),

/***/ "./src/app/components/quiz-test/quiz-test.component.scss":
/*!***************************************************************!*\
  !*** ./src/app/components/quiz-test/quiz-test.component.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container-fluid {\n  background: url('/assets/banner-image1.png');\n  height: 137px;\n  background-position: center center;\n  background-size: cover;\n}\n\n.aboutus-header {\n  padding: 20px 0px 0px 2px;\n}\n\n.disable {\n  cursor: not-allowed;\n  pointer-events: none !important;\n}\n\n@media (max-width: 500px) {\n  .aboutus-header {\n    display: none;\n  }\n}\n\n.home-text {\n  text-decoration: none;\n  color: #ffffff;\n}\n\n.sub-menu-items {\n  text-decoration: none;\n  color: #d7d7d7;\n}\n\n.sidebar-container {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  right: 0;\n}\n\n.look-for-company {\n  padding: 0px;\n  margin: 0 auto;\n  width: 57%;\n}\n\n.treating {\n  padding-top: 13rem;\n}\n\n@media (max-width: 500px) {\n  .treating {\n    padding-top: 5rem;\n  }\n}\n\n.search-icon {\n  text-align: center;\n  padding-top: 0px;\n}\n\n.search-text {\n  font-size: 10px;\n  font-weight: 300;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.79;\n  letter-spacing: normal;\n  color: #ffffff;\n  padding: 10px 0px 0px 15px;\n}\n\n.contributor {\n  font-family: Montserrat;\n  font-size: 21px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: normal;\n  text-align: center;\n  color: #000000;\n  padding-top: 30px;\n}\n\n.search-container {\n  /* margin: 20px 100px 0px 135px; */\n  padding-top: 40px;\n  /* text-align: center; */\n}\n\n.margin0 {\n  margin: 0px;\n}\n\n#contributeAs {\n  padding-left: 35px;\n}\n\n#select-company-icon {\n  position: absolute;\n  top: 16px;\n  left: 32px;\n}\n\n.search-container .form-group select,\n.search-container .form-group input {\n  /* : 77px !important; */\n  border-radius: 0 !important;\n  outline: none;\n  box-shadow: none;\n  border-right: 1px solid #e0e6ed;\n  border-left: none;\n  height: 60px;\n}\n\n.form-group select {\n  background: url('down.png') no-repeat center;\n  -webkit-appearance: none;\n}\n\n#comapany-select {\n  border-left: 1px solid #e0e6ed;\n  position: relative;\n  padding-left: 87px;\n  color: #000000;\n  font-size: 13px;\n  background-position-x: 515px;\n}\n\n#contribute-as {\n  padding-left: 35px;\n  color: #000000;\n  font-size: 13px;\n  background-position-x: 240px;\n}\n\n.search-container::-webkit-input-placeholder {\n  /* Chrome, Firefox, Opera, Safari 10.1+ */\n  color: #adb7c7;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 19px;\n  text-align: left;\n}\n\n.search-container::-moz-placeholder {\n  /* Chrome, Firefox, Opera, Safari 10.1+ */\n  color: #adb7c7;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 19px;\n  text-align: left;\n}\n\n.search-container::-ms-input-placeholder {\n  /* Chrome, Firefox, Opera, Safari 10.1+ */\n  color: #adb7c7;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 19px;\n  text-align: left;\n}\n\n.search-container::placeholder {\n  /* Chrome, Firefox, Opera, Safari 10.1+ */\n  color: #adb7c7;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 19px;\n  text-align: left;\n}\n\n.search-container::-ms-input-placeholder {\n  /* Microsoft Edge */\n  color: #adb7c7;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 19px;\n  text-align: left;\n}\n\n.directory {\n  font-family: Montserrat;\n  font-size: 13px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #ffffff;\n  text-decoration: none;\n}\n\n.directory1 {\n  padding-top: 2px;\n}\n\n.btn {\n  font-size: 15px;\n  font-weight: 700;\n  line-height: 18px;\n  padding: 14px 29px;\n  border-radius: 0;\n  outline: none;\n  height: 60px;\n}\n\n.btn-started {\n  border: 1px solid #e0e6ed;\n  border-radius: 0;\n  border-left: none;\n  font-size: 13px;\n  color: black;\n  background-color: white;\n  padding-left: 66px;\n  position: relative;\n}\n\n@media (max-width: 768px) {\n  .btn-started {\n    width: 100%;\n  }\n}\n\n.card {\n  padding: 20px 0px 20px 0px;\n  border: none;\n}\n\n.right-arrow {\n  position: absolute;\n  top: 18px;\n  right: 45px;\n}\n\n.top-companies {\n  padding: 82px 0px 29px 0px;\n  border-bottom: 1px solid black;\n  margin: 0px;\n}\n\n.companies-text {\n  font-size: 48px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.7;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.abcd {\n  font-size: 18px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: 2.8px;\n  text-align: left;\n  color: #000000;\n}\n\n@media (max-width: 768px) {\n  .abcd {\n    padding: 30px 0px 0px 0px;\n    text-align: center;\n  }\n}\n\n.tagline {\n  font-size: 41px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  color: #fff;\n  padding-top: 7rem;\n  text-align: center;\n  font-family: Montserrat;\n}\n\n@media (max-width: 768px) {\n  .tagline {\n    font-size: 22px;\n  }\n}\n\n@media (max-width: 500px) {\n  .tagline {\n    font-size: 15px;\n    padding-top: 30px;\n  }\n}\n\n.look-for-company-mat {\n  width: 100%;\n  font-size: 41px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  color: white;\n  text-align: center;\n  font-family: Montserrat;\n  margin-top: 10px;\n  height: 150px;\n}\n\n/* .look-for-company-mat ::ng-deep .mat-focused .mat-form-field-label {\n\n  color: white !important;\n  }\n\n  .look-for-company-mat ::ng-deep .mat-input-placeholder {\n\n  color: white !important;\n  } */\n\n/* \n  .look-for-company-mat ::ng-deep.mat-form-field-underline { */\n\n/*change color of underline*/\n\n/*change color of underline*/\n\n/* background-color: rgb(255,255,255, 0.1) !important; */\n\n/* background-color: rgb(255,255,255, 0.1) !important; */\n\n/* background-color: white !important;\n  } */\n\n/* \n  .look-for-company-mat ::ng-deep.mat-form-field-ripple { */\n\n/*change color of underline when focused*/\n\n/* background-color: white !important;;\n  } */\n\n/* \n  .look-for-company-mat ::ng-deep .mat-form-field-label {\n  color:white !important;\n  }\n\n  .example-full-width ::ng-deep .mat-form-field-label{\n  color: black !important;\n  }\n  .mat-form-field-flex{\n  border: 1px solid white !important;\n  } */\n\n@media (max-width: 500px) {\n  .col-4 {\n    flex: 100%;\n    max-width: 100%;\n  }\n}\n\n.title {\n  font-family: Montserrat;\n  font-size: 25px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 20px 0px 30px 0px;\n  border-bottom: 3px solid;\n}\n\n@media (max-width: 768px) {\n  .title {\n    font-size: 15px;\n  }\n}\n\n.inq {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px 0px 30px 0px;\n}\n\n@media (max-width: 768px) {\n  .inq {\n    font-size: 15px;\n  }\n}\n\n.content {\n  display: flex;\n}\n\n.include {\n  font-family: Montserrat;\n  font-size: 18px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px 0px 0px 10px;\n}\n\n@media (max-width: 768px) {\n  .include {\n    font-size: 13px;\n  }\n}\n\n.card-text {\n  font-family: Montserrat;\n  font-size: 85.5px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  text-align: left;\n  color: #397c86;\n  border-bottom: 1px solid;\n}\n\n@media (max-width: 768px) {\n  .card-text {\n    font-size: 35px;\n  }\n}\n\n.image {\n  padding-left: 54px;\n}\n\n.que-ans {\n  display: grid;\n  grid-template-columns: 50% 50%;\n  border-bottom: 1px solid black;\n}\n\n.q-a {\n  font-size: 65px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: normal;\n  text-align: left;\n  color: rgba(0, 0, 0, 0.13);\n  padding: 14px 0px 18px 0px;\n}\n\n.ques-div {\n  display: grid;\n  grid-template-columns: 50%;\n  /* grid-template-columns: 100% 0%; */\n  max-height: 180px;\n}\n\n.ques-div-comment {\n  display: grid;\n  grid-template-columns: 100%;\n  max-height: 240px;\n  padding: 20px 0 0 0;\n}\n\n.question {\n  font-size: 18px;\n  font-weight: 500;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.36;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 0px;\n  /* padding: 22px 169px 107px 0px; */\n}\n\n.text-area {\n  font-size: 13px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  width: 365px;\n}\n\n.very-text {\n  font-size: 13px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 4px 0px 0px 0px;\n}\n\n.difficult-text {\n  font-size: 13px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 118px 0px 0px 0px;\n}\n\n.radio-options {\n  margin-left: 27px;\n  font-size: 15px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.79;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  display: block;\n}\n\n.radio {\n  font-size: 13px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 2.6;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  vertical-align: bottom;\n}\n\n.comment-text {\n  font-size: 12px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  width: 100%;\n  font-family: Montserrat;\n}\n\n.radio-padd {\n  padding-left: 10px;\n}\n\n.options {\n  padding: 20px 0px 0px 0px;\n}\n\n.radio-btns {\n  padding-top: 46px;\n}\n\n.label {\n  padding-left: 13px;\n  font-size: 18px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.progressbar {\n  padding: 51px 0px 15px 0px;\n}\n\n::ng-deep .mat-progress-bar-fill::after {\n  background-color: #74b224;\n}\n\n::ng-deep .mat-progress-bar {\n  border-radius: 2px;\n}\n\n.previous {\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding-top: 29px;\n}\n\n.previous-text {\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 29px 0px 0px 12px;\n  text-align: right;\n}\n\n.next-text {\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.04;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  padding: 29px 12px 0px 0px;\n  text-align: right;\n}\n\n.next {\n  text-align: right;\n}\n\n.prev-next {\n  display: grid;\n  grid-template-columns: 50% 50%;\n  padding-bottom: 92px;\n}\n\n.count {\n  font-size: 45px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.56;\n  letter-spacing: normal;\n  color: #397c86;\n  text-align: right;\n  padding-top: 30px;\n}\n\n.company-name {\n  width: 300px;\n  font-size: 18px;\n  font-style: normal;\n  font-stretch: normal;\n  letter-spacing: normal;\n  padding-top: 5px;\n  color: white;\n  text-align: left;\n}\n\n.progress {\n  height: 15px;\n}\n\n.options-grid {\n  display: grid;\n  grid-template-columns: 100%;\n  /* grid-template-columns: 20% 80%; */\n}\n\n.company-profile {\n  padding: 53.5px 0px 0px 90px;\n}\n\n@media only screen and (max-width: 768px) {\n  .inclusion-text {\n    font-size: 23px;\n  }\n\n  .image {\n    width: 115px;\n    padding-left: 0px;\n  }\n\n  .container {\n    grid-template-columns: 100%;\n  }\n\n  .contributing-as {\n    font-size: 13px;\n  }\n\n  .grid-inclusion {\n    grid-template-columns: 60% 40%;\n  }\n\n  .infosys-text {\n    font-size: 24px;\n    text-align: left;\n  }\n\n  .ques-div {\n    grid-template-columns: 100%;\n  }\n\n  .question {\n    padding: 21px 37px 0px 0px;\n  }\n\n  .options {\n    padding: 0px;\n  }\n\n  .options:nth-child(1) {\n    padding: 0px;\n  }\n\n  .very-text {\n    font-size: 9px;\n  }\n\n  .difficult-text {\n    font-size: 9px;\n  }\n\n  .count {\n    font-size: 54px;\n    padding: 10px 0px 92px 192px;\n  }\n\n  .prev-next {\n    padding-bottom: 0px;\n  }\n\n  .options-grid {\n    grid-template-columns: 20% 60% 20%;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hcHBpbmVzcy9EZXNrdG9wL0VuZ2VuZGVyZWQtUHJvamVjdC9zcmMvYXBwL2NvbXBvbmVudHMvcXVpei10ZXN0L3F1aXotdGVzdC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvY29tcG9uZW50cy9xdWl6LXRlc3QvcXVpei10ZXN0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsNENBQUE7RUFDQSxhQUFBO0VBQ0Esa0NBQUE7RUFJQSxzQkFBQTtBQ0NGOztBREVBO0VBQ0UseUJBQUE7QUNDRjs7QURFQTtFQUNFLG1CQUFBO0VBQ0EsK0JBQUE7QUNDRjs7QURDQTtFQUNFO0lBQ0UsYUFBQTtFQ0VGO0FBQ0Y7O0FEQ0E7RUFDRSxxQkFBQTtFQUNBLGNBQUE7QUNDRjs7QURFQTtFQUNFLHFCQUFBO0VBQ0EsY0FBQTtBQ0NGOztBREVBO0VBQ0UsZUFBQTtFQUNBLE1BQUE7RUFDQSxTQUFBO0VBQ0EsUUFBQTtBQ0NGOztBREVBO0VBQ0UsWUFBQTtFQUNBLGNBQUE7RUFDQSxVQUFBO0FDQ0Y7O0FEQ0E7RUFDRSxrQkFBQTtBQ0VGOztBREFBO0VBQ0U7SUFDRSxpQkFBQTtFQ0dGO0FBQ0Y7O0FEQUE7RUFDRSxrQkFBQTtFQUNBLGdCQUFBO0FDRUY7O0FEQ0E7RUFDRSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGNBQUE7RUFDQSwwQkFBQTtBQ0VGOztBRENBO0VBQ0UsdUJBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtFQUNBLGlCQUFBO0FDRUY7O0FEQ0E7RUFDRSxrQ0FBQTtFQUNBLGlCQUFBO0VBQ0Esd0JBQUE7QUNFRjs7QURDQTtFQUNFLFdBQUE7QUNFRjs7QURDQTtFQUNFLGtCQUFBO0FDRUY7O0FEQ0E7RUFDRSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0FDRUY7O0FEQ0E7O0VBRUUsdUJBQUE7RUFDQSwyQkFBQTtFQUNBLGFBQUE7RUFDQSxnQkFBQTtFQUNBLCtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxZQUFBO0FDRUY7O0FEQ0E7RUFDRSw0Q0FBQTtFQUNBLHdCQUFBO0FDRUY7O0FEQ0E7RUFDRSw4QkFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxjQUFBO0VBQ0EsZUFBQTtFQUNBLDRCQUFBO0FDRUY7O0FEQ0E7RUFDRSxrQkFBQTtFQUNBLGNBQUE7RUFDQSxlQUFBO0VBQ0EsNEJBQUE7QUNFRjs7QURDQTtFQUNFLHlDQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7QUNFRjs7QURSQTtFQUNFLHlDQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7QUNFRjs7QURSQTtFQUNFLHlDQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7QUNFRjs7QURSQTtFQUNFLHlDQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7QUNFRjs7QURDQTtFQUNFLG1CQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7QUNFRjs7QURDQTtFQUNFLHVCQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxxQkFBQTtBQ0VGOztBRENBO0VBQ0UsZ0JBQUE7QUNFRjs7QURDQTtFQUNFLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7RUFDQSxZQUFBO0FDRUY7O0FEQ0E7RUFDRSx5QkFBQTtFQUNB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Rjs7RURIQTtJQUNFLDhCQUFBO0VDTUY7O0VESEE7SUFDRSxlQUFBO0lBQ0EsZ0JBQUE7RUNNRjs7RURIQTtJQUNFLDJCQUFBO0VDTUY7O0VESEE7SUFDRSwwQkFBQTtFQ01GOztFREhBO0lBQ0UsWUFBQTtFQ01GOztFREhBO0lBQ0UsWUFBQTtFQ01GOztFREhBO0lBQ0UsY0FBQTtFQ01GOztFREhBO0lBQ0UsY0FBQTtFQ01GOztFREhBO0lBQ0UsZUFBQTtJQUNBLDRCQUFBO0VDTUY7O0VESEE7SUFDRSxtQkFBQTtFQ01GOztFREhBO0lBQ0Usa0NBQUE7RUNNRjtBQUNGIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9xdWl6LXRlc3QvcXVpei10ZXN0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRhaW5lci1mbHVpZCB7XG4gIGJhY2tncm91bmQ6IHVybCgvYXNzZXRzLy9iYW5uZXItaW1hZ2UxLnBuZyk7XG4gIGhlaWdodDogMTM3cHg7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciBjZW50ZXI7XG4gIC1tb3otYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAtby1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xufVxuXG4uYWJvdXR1cy1oZWFkZXIge1xuICBwYWRkaW5nOiAyMHB4IDBweCAwcHggMnB4O1xufVxuXG4uZGlzYWJsZSB7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lICFpbXBvcnRhbnQ7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLmFib3V0dXMtaGVhZGVyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG5cbi5ob21lLXRleHQge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiAjZmZmZmZmO1xufVxuXG4uc3ViLW1lbnUtaXRlbXMge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiAjZDdkN2Q3O1xufVxuXG4uc2lkZWJhci1jb250YWluZXIge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgYm90dG9tOiAwO1xuICByaWdodDogMDtcbn1cblxuLmxvb2stZm9yLWNvbXBhbnkge1xuICBwYWRkaW5nOiAwcHg7XG4gIG1hcmdpbjogMCBhdXRvO1xuICB3aWR0aDogNTclO1xufVxuLnRyZWF0aW5nIHtcbiAgcGFkZGluZy10b3A6IDEzcmVtO1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC50cmVhdGluZyB7XG4gICAgcGFkZGluZy10b3A6IDVyZW07XG4gIH1cbn1cblxuLnNlYXJjaC1pY29uIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwYWRkaW5nLXRvcDogMHB4O1xufVxuXG4uc2VhcmNoLXRleHQge1xuICBmb250LXNpemU6IDEwcHg7XG4gIGZvbnQtd2VpZ2h0OiAzMDA7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjc5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICBjb2xvcjogI2ZmZmZmZjtcbiAgcGFkZGluZzogMTBweCAwcHggMHB4IDE1cHg7XG59XG5cbi5jb250cmlidXRvciB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDIxcHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMC44MztcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZy10b3A6IDMwcHg7XG59XG5cbi5zZWFyY2gtY29udGFpbmVyIHtcbiAgLyogbWFyZ2luOiAyMHB4IDEwMHB4IDBweCAxMzVweDsgKi9cbiAgcGFkZGluZy10b3A6IDQwcHg7XG4gIC8qIHRleHQtYWxpZ246IGNlbnRlcjsgKi9cbn1cblxuLm1hcmdpbjAge1xuICBtYXJnaW46IDBweDtcbn1cblxuI2NvbnRyaWJ1dGVBcyB7XG4gIHBhZGRpbmctbGVmdDogMzVweDtcbn1cblxuI3NlbGVjdC1jb21wYW55LWljb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTZweDtcbiAgbGVmdDogMzJweDtcbn1cblxuLnNlYXJjaC1jb250YWluZXIgLmZvcm0tZ3JvdXAgc2VsZWN0LFxuLnNlYXJjaC1jb250YWluZXIgLmZvcm0tZ3JvdXAgaW5wdXQge1xuICAvKiA6IDc3cHggIWltcG9ydGFudDsgKi9cbiAgYm9yZGVyLXJhZGl1czogMCAhaW1wb3J0YW50O1xuICBvdXRsaW5lOiBub25lO1xuICBib3gtc2hhZG93OiBub25lO1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjZTBlNmVkO1xuICBib3JkZXItbGVmdDogbm9uZTtcbiAgaGVpZ2h0OiA2MHB4O1xufVxuXG4uZm9ybS1ncm91cCBzZWxlY3Qge1xuICBiYWNrZ3JvdW5kOiB1cmwoLi4vLi4vLi4vYXNzZXRzL2Rvd24ucG5nKSBuby1yZXBlYXQgY2VudGVyO1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG59XG5cbiNjb21hcGFueS1zZWxlY3Qge1xuICBib3JkZXItbGVmdDogMXB4IHNvbGlkICNlMGU2ZWQ7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZy1sZWZ0OiA4N3B4O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uLXg6IDUxNXB4O1xufVxuXG4jY29udHJpYnV0ZS1hcyB7XG4gIHBhZGRpbmctbGVmdDogMzVweDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbi14OiAyNDBweDtcbn1cblxuLnNlYXJjaC1jb250YWluZXI6OnBsYWNlaG9sZGVyIHtcbiAgLyogQ2hyb21lLCBGaXJlZm94LCBPcGVyYSwgU2FmYXJpIDEwLjErICovXG4gIGNvbG9yOiAjYWRiN2M3O1xuICBmb250LXNpemU6IDE2cHg7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGxpbmUtaGVpZ2h0OiAxOXB4O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuXG4uc2VhcmNoLWNvbnRhaW5lcjo6LW1zLWlucHV0LXBsYWNlaG9sZGVyIHtcbiAgLyogTWljcm9zb2Z0IEVkZ2UgKi9cbiAgY29sb3I6ICNhZGI3Yzc7XG4gIGZvbnQtc2l6ZTogMTZweDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgbGluZS1oZWlnaHQ6IDE5cHg7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG59XG5cbi5kaXJlY3Rvcnkge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjZmZmZmZmO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG59XG5cbi5kaXJlY3RvcnkxIHtcbiAgcGFkZGluZy10b3A6IDJweDtcbn1cblxuLmJ0biB7XG4gIGZvbnQtc2l6ZTogMTVweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDE4cHg7XG4gIHBhZGRpbmc6IDE0cHggMjlweDtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgb3V0bGluZTogbm9uZTtcbiAgaGVpZ2h0OiA2MHB4O1xufVxuXG4uYnRuLXN0YXJ0ZWQge1xuICBib3JkZXI6IDFweCBzb2xpZCAjZTBlNmVkO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBib3JkZXItbGVmdDogbm9uZTtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBjb2xvcjogYmxhY2s7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBwYWRkaW5nLWxlZnQ6IDY2cHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5idG4tc3RhcnRlZCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbn1cbi5jYXJkIHtcbiAgcGFkZGluZzogMjBweCAwcHggMjBweCAwcHg7XG4gIGJvcmRlcjogbm9uZTtcbn1cblxuLnJpZ2h0LWFycm93IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDE4cHg7XG4gIHJpZ2h0OiA0NXB4O1xufVxuXG4udG9wLWNvbXBhbmllcyB7XG4gIHBhZGRpbmc6IDgycHggMHB4IDI5cHggMHB4O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiKDAwMCwgMDAwLCAwMDApO1xuICBtYXJnaW46IDBweDtcbn1cblxuLmNvbXBhbmllcy10ZXh0IHtcbiAgZm9udC1zaXplOiA0OHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuNztcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5hYmNkIHtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMC44MztcbiAgbGV0dGVyLXNwYWNpbmc6IDIuOHB4O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuYWJjZCB7XG4gICAgcGFkZGluZzogMzBweCAwcHggMHB4IDBweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cbn1cblxuLnRhZ2xpbmUge1xuICBmb250LXNpemU6IDQxcHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICBjb2xvcjogI2ZmZjtcbiAgcGFkZGluZy10b3A6IDdyZW07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLnRhZ2xpbmUge1xuICAgIGZvbnQtc2l6ZTogMjJweDtcbiAgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC50YWdsaW5lIHtcbiAgICBmb250LXNpemU6IDE1cHg7XG4gICAgcGFkZGluZy10b3A6IDMwcHg7XG4gIH1cbn1cblxuLmxvb2stZm9yLWNvbXBhbnktbWF0IHtcbiAgd2lkdGg6IDEwMCU7XG4gIGZvbnQtc2l6ZTogNDFweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgbWFyZ2luLXRvcDogMTBweDtcbiAgaGVpZ2h0OiAxNTBweDtcbn1cblxuLyogLmxvb2stZm9yLWNvbXBhbnktbWF0IDo6bmctZGVlcCAubWF0LWZvY3VzZWQgLm1hdC1mb3JtLWZpZWxkLWxhYmVsIHtcbiAgXG4gIGNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xuICB9XG4gIFxuICAubG9vay1mb3ItY29tcGFueS1tYXQgOjpuZy1kZWVwIC5tYXQtaW5wdXQtcGxhY2Vob2xkZXIge1xuICBcbiAgY29sb3I6IHdoaXRlICFpbXBvcnRhbnQ7XG4gIH0gKi9cbi8qIFxuICAubG9vay1mb3ItY29tcGFueS1tYXQgOjpuZy1kZWVwLm1hdC1mb3JtLWZpZWxkLXVuZGVybGluZSB7ICovXG4vKmNoYW5nZSBjb2xvciBvZiB1bmRlcmxpbmUqL1xuLypjaGFuZ2UgY29sb3Igb2YgdW5kZXJsaW5lKi9cbi8qIGJhY2tncm91bmQtY29sb3I6IHJnYigyNTUsMjU1LDI1NSwgMC4xKSAhaW1wb3J0YW50OyAqL1xuLyogYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwyNTUsMjU1LCAwLjEpICFpbXBvcnRhbnQ7ICovXG4vKiBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xuICB9ICovXG4vKiBcbiAgLmxvb2stZm9yLWNvbXBhbnktbWF0IDo6bmctZGVlcC5tYXQtZm9ybS1maWVsZC1yaXBwbGUgeyAqL1xuLypjaGFuZ2UgY29sb3Igb2YgdW5kZXJsaW5lIHdoZW4gZm9jdXNlZCovXG4vKiBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50OztcbiAgfSAqL1xuLyogXG4gIC5sb29rLWZvci1jb21wYW55LW1hdCA6Om5nLWRlZXAgLm1hdC1mb3JtLWZpZWxkLWxhYmVsIHtcbiAgY29sb3I6d2hpdGUgIWltcG9ydGFudDtcbiAgfVxuICBcbiAgLmV4YW1wbGUtZnVsbC13aWR0aCA6Om5nLWRlZXAgLm1hdC1mb3JtLWZpZWxkLWxhYmVse1xuICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcbiAgfVxuICAubWF0LWZvcm0tZmllbGQtZmxleHtcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGUgIWltcG9ydGFudDtcbiAgfSAqL1xuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC5jb2wtNCB7XG4gICAgZmxleDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gIH1cbn1cbi50aXRsZSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDI1cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMC44MztcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDIwcHggMHB4IDMwcHggMHB4O1xuICBib3JkZXItYm90dG9tOiAzcHggc29saWQ7XG59XG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLnRpdGxlIHtcbiAgICBmb250LXNpemU6IDE1cHg7XG4gIH1cbn1cbi5pbnEge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAwcHggMHB4IDMwcHggMHB4O1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pbnEge1xuICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgfVxufVxuLmNvbnRlbnQge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuLmluY2x1ZGUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAwcHggMTBweDtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuaW5jbHVkZSB7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICB9XG59XG4uY2FyZC10ZXh0IHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogODUuNXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMzOTdjODY7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZDtcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuY2FyZC10ZXh0IHtcbiAgICBmb250LXNpemU6IDM1cHg7XG4gIH1cbn1cbi5pbWFnZSB7XG4gIHBhZGRpbmctbGVmdDogNTRweDtcbn1cblxuLnF1ZS1hbnMge1xuICBkaXNwbGF5OiBncmlkO1xuXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogNTAlIDUwJTtcblxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiKDAsIDAsIDApO1xufVxuXG4ucS1hIHtcbiAgZm9udC1zaXplOiA2NXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDAuODM7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMTMpO1xuICBwYWRkaW5nOiAxNHB4IDBweCAxOHB4IDBweDtcbn1cblxuLnF1ZXMtZGl2IHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA1MCU7XG4gIC8qIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMTAwJSAwJTsgKi9cbiAgbWF4LWhlaWdodDogMTgwcHg7XG59XG5cbi5xdWVzLWRpdi1jb21tZW50IHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxMDAlO1xuICBtYXgtaGVpZ2h0OiAyNDBweDtcbiAgcGFkZGluZzogMjBweCAwIDAgMDtcbn1cblxuLnF1ZXN0aW9uIHtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogNTAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zNjtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDBweDtcbiAgLyogcGFkZGluZzogMjJweCAxNjlweCAxMDdweCAwcHg7ICovXG59XG5cbi50ZXh0LWFyZWEge1xuICBmb250LXNpemU6IDEzcHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIHdpZHRoOiAzNjVweDtcbn1cblxuLnZlcnktdGV4dCB7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiA0cHggMHB4IDBweCAwcHg7XG59XG5cbi5kaWZmaWN1bHQtdGV4dCB7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAxMThweCAwcHggMHB4IDBweDtcbn1cblxuLnJhZGlvLW9wdGlvbnMge1xuICBtYXJnaW4tbGVmdDogMjdweDtcbiAgZm9udC1zaXplOiAxNXB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS43OTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4ucmFkaW8ge1xuICBmb250LXNpemU6IDEzcHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAyLjY7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICB2ZXJ0aWNhbC1hbGlnbjogYm90dG9tO1xufVxuXG4uY29tbWVudC10ZXh0IHtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zOTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHdpZHRoOiAxMDAlO1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbn1cblxuLnJhZGlvLXBhZGQge1xuICBwYWRkaW5nLWxlZnQ6IDEwcHg7XG59XG4ub3B0aW9ucyB7XG4gIHBhZGRpbmc6IDIwcHggMHB4IDBweCAwcHg7XG59XG5cbi5yYWRpby1idG5zIHtcbiAgcGFkZGluZy10b3A6IDQ2cHg7XG59XG5cbi5sYWJlbCB7XG4gIHBhZGRpbmctbGVmdDogMTNweDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zOTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5wcm9ncmVzc2JhciB7XG4gIHBhZGRpbmc6IDUxcHggMHB4IDE1cHggMHB4O1xufVxuXG46Om5nLWRlZXAgLm1hdC1wcm9ncmVzcy1iYXItZmlsbDo6YWZ0ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNzRiMjI0O1xufVxuXG46Om5nLWRlZXAgLm1hdC1wcm9ncmVzcy1iYXIge1xuICBib3JkZXItcmFkaXVzOiAycHg7XG59XG5cbi5wcmV2aW91cyB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmctdG9wOiAyOXB4O1xufVxuXG4ucHJldmlvdXMtdGV4dCB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDI5cHggMHB4IDBweCAxMnB4O1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn1cblxuLm5leHQtdGV4dCB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4wNDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDI5cHggMTJweCAwcHggMHB4O1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn1cblxuLm5leHQge1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn1cblxuLnByZXYtbmV4dCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogNTAlIDUwJTtcbiAgcGFkZGluZy1ib3R0b206IDkycHg7XG59XG5cbi5jb3VudCB7XG4gIGZvbnQtc2l6ZTogNDVweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuNTY7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIGNvbG9yOiAjMzk3Yzg2O1xuICB0ZXh0LWFsaWduOiByaWdodDtcbiAgcGFkZGluZy10b3A6IDMwcHg7XG59XG5cbi5jb21wYW55LW5hbWUge1xuICB3aWR0aDogMzAwcHg7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgcGFkZGluZy10b3A6IDVweDtcbiAgY29sb3I6IHdoaXRlO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuXG4ucHJvZ3Jlc3Mge1xuICBoZWlnaHQ6IDE1cHg7XG59XG5cbi5vcHRpb25zLWdyaWQge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDEwMCU7XG4gIC8qIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMjAlIDgwJTsgKi9cbn1cblxuLmNvbXBhbnktcHJvZmlsZSB7XG4gIHBhZGRpbmc6IDUzLjVweCAwcHggMHB4IDkwcHg7XG59XG5cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmluY2x1c2lvbi10ZXh0IHtcbiAgICBmb250LXNpemU6IDIzcHg7XG4gIH1cblxuICAuaW1hZ2Uge1xuICAgIHdpZHRoOiAxMTVweDtcbiAgICBwYWRkaW5nLWxlZnQ6IDBweDtcbiAgfVxuXG4gIC5jb250YWluZXIge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMTAwJTtcbiAgfVxuXG4gIC5jb250cmlidXRpbmctYXMge1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgfVxuXG4gIC5ncmlkLWluY2x1c2lvbiB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA2MCUgNDAlO1xuICB9XG5cbiAgLmluZm9zeXMtdGV4dCB7XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gIH1cblxuICAucXVlcy1kaXYge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMTAwJTtcbiAgfVxuXG4gIC5xdWVzdGlvbiB7XG4gICAgcGFkZGluZzogMjFweCAzN3B4IDBweCAwcHg7XG4gIH1cblxuICAub3B0aW9ucyB7XG4gICAgcGFkZGluZzogMHB4O1xuICB9XG5cbiAgLm9wdGlvbnM6bnRoLWNoaWxkKDEpIHtcbiAgICBwYWRkaW5nOiAwcHg7XG4gIH1cblxuICAudmVyeS10ZXh0IHtcbiAgICBmb250LXNpemU6IDlweDtcbiAgfVxuXG4gIC5kaWZmaWN1bHQtdGV4dCB7XG4gICAgZm9udC1zaXplOiA5cHg7XG4gIH1cblxuICAuY291bnQge1xuICAgIGZvbnQtc2l6ZTogNTRweDtcbiAgICBwYWRkaW5nOiAxMHB4IDBweCA5MnB4IDE5MnB4O1xuICB9XG5cbiAgLnByZXYtbmV4dCB7XG4gICAgcGFkZGluZy1ib3R0b206IDBweDtcbiAgfVxuXG4gIC5vcHRpb25zLWdyaWQge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMjAlIDYwJSAyMCU7XG4gIH1cbn1cbiIsIi5jb250YWluZXItZmx1aWQge1xuICBiYWNrZ3JvdW5kOiB1cmwoL2Fzc2V0cy8vYmFubmVyLWltYWdlMS5wbmcpO1xuICBoZWlnaHQ6IDEzN3B4O1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXIgY2VudGVyO1xuICAtbW96LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIC13ZWJraXQtYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgLW8tYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgYmFja2dyb3VuZC1zaXplOiBjb3Zlcjtcbn1cblxuLmFib3V0dXMtaGVhZGVyIHtcbiAgcGFkZGluZzogMjBweCAwcHggMHB4IDJweDtcbn1cblxuLmRpc2FibGUge1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICBwb2ludGVyLWV2ZW50czogbm9uZSAhaW1wb3J0YW50O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLmFib3V0dXMtaGVhZGVyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG4uaG9tZS10ZXh0IHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjb2xvcjogI2ZmZmZmZjtcbn1cblxuLnN1Yi1tZW51LWl0ZW1zIHtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjb2xvcjogI2Q3ZDdkNztcbn1cblxuLnNpZGViYXItY29udGFpbmVyIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDA7XG4gIGJvdHRvbTogMDtcbiAgcmlnaHQ6IDA7XG59XG5cbi5sb29rLWZvci1jb21wYW55IHtcbiAgcGFkZGluZzogMHB4O1xuICBtYXJnaW46IDAgYXV0bztcbiAgd2lkdGg6IDU3JTtcbn1cblxuLnRyZWF0aW5nIHtcbiAgcGFkZGluZy10b3A6IDEzcmVtO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLnRyZWF0aW5nIHtcbiAgICBwYWRkaW5nLXRvcDogNXJlbTtcbiAgfVxufVxuLnNlYXJjaC1pY29uIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwYWRkaW5nLXRvcDogMHB4O1xufVxuXG4uc2VhcmNoLXRleHQge1xuICBmb250LXNpemU6IDEwcHg7XG4gIGZvbnQtd2VpZ2h0OiAzMDA7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjc5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICBjb2xvcjogI2ZmZmZmZjtcbiAgcGFkZGluZzogMTBweCAwcHggMHB4IDE1cHg7XG59XG5cbi5jb250cmlidXRvciB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDIxcHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMC44MztcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZy10b3A6IDMwcHg7XG59XG5cbi5zZWFyY2gtY29udGFpbmVyIHtcbiAgLyogbWFyZ2luOiAyMHB4IDEwMHB4IDBweCAxMzVweDsgKi9cbiAgcGFkZGluZy10b3A6IDQwcHg7XG4gIC8qIHRleHQtYWxpZ246IGNlbnRlcjsgKi9cbn1cblxuLm1hcmdpbjAge1xuICBtYXJnaW46IDBweDtcbn1cblxuI2NvbnRyaWJ1dGVBcyB7XG4gIHBhZGRpbmctbGVmdDogMzVweDtcbn1cblxuI3NlbGVjdC1jb21wYW55LWljb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTZweDtcbiAgbGVmdDogMzJweDtcbn1cblxuLnNlYXJjaC1jb250YWluZXIgLmZvcm0tZ3JvdXAgc2VsZWN0LFxuLnNlYXJjaC1jb250YWluZXIgLmZvcm0tZ3JvdXAgaW5wdXQge1xuICAvKiA6IDc3cHggIWltcG9ydGFudDsgKi9cbiAgYm9yZGVyLXJhZGl1czogMCAhaW1wb3J0YW50O1xuICBvdXRsaW5lOiBub25lO1xuICBib3gtc2hhZG93OiBub25lO1xuICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjZTBlNmVkO1xuICBib3JkZXItbGVmdDogbm9uZTtcbiAgaGVpZ2h0OiA2MHB4O1xufVxuXG4uZm9ybS1ncm91cCBzZWxlY3Qge1xuICBiYWNrZ3JvdW5kOiB1cmwoLi4vLi4vLi4vYXNzZXRzL2Rvd24ucG5nKSBuby1yZXBlYXQgY2VudGVyO1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG59XG5cbiNjb21hcGFueS1zZWxlY3Qge1xuICBib3JkZXItbGVmdDogMXB4IHNvbGlkICNlMGU2ZWQ7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZy1sZWZ0OiA4N3B4O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uLXg6IDUxNXB4O1xufVxuXG4jY29udHJpYnV0ZS1hcyB7XG4gIHBhZGRpbmctbGVmdDogMzVweDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbi14OiAyNDBweDtcbn1cblxuLnNlYXJjaC1jb250YWluZXI6OnBsYWNlaG9sZGVyIHtcbiAgLyogQ2hyb21lLCBGaXJlZm94LCBPcGVyYSwgU2FmYXJpIDEwLjErICovXG4gIGNvbG9yOiAjYWRiN2M3O1xuICBmb250LXNpemU6IDE2cHg7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGxpbmUtaGVpZ2h0OiAxOXB4O1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xufVxuXG4uc2VhcmNoLWNvbnRhaW5lcjo6LW1zLWlucHV0LXBsYWNlaG9sZGVyIHtcbiAgLyogTWljcm9zb2Z0IEVkZ2UgKi9cbiAgY29sb3I6ICNhZGI3Yzc7XG4gIGZvbnQtc2l6ZTogMTZweDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgbGluZS1oZWlnaHQ6IDE5cHg7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG59XG5cbi5kaXJlY3Rvcnkge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjZmZmZmZmO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG59XG5cbi5kaXJlY3RvcnkxIHtcbiAgcGFkZGluZy10b3A6IDJweDtcbn1cblxuLmJ0biB7XG4gIGZvbnQtc2l6ZTogMTVweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDE4cHg7XG4gIHBhZGRpbmc6IDE0cHggMjlweDtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgb3V0bGluZTogbm9uZTtcbiAgaGVpZ2h0OiA2MHB4O1xufVxuXG4uYnRuLXN0YXJ0ZWQge1xuICBib3JkZXI6IDFweCBzb2xpZCAjZTBlNmVkO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBib3JkZXItbGVmdDogbm9uZTtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBjb2xvcjogYmxhY2s7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBwYWRkaW5nLWxlZnQ6IDY2cHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5idG4tc3RhcnRlZCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbn1cbi5jYXJkIHtcbiAgcGFkZGluZzogMjBweCAwcHggMjBweCAwcHg7XG4gIGJvcmRlcjogbm9uZTtcbn1cblxuLnJpZ2h0LWFycm93IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDE4cHg7XG4gIHJpZ2h0OiA0NXB4O1xufVxuXG4udG9wLWNvbXBhbmllcyB7XG4gIHBhZGRpbmc6IDgycHggMHB4IDI5cHggMHB4O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgYmxhY2s7XG4gIG1hcmdpbjogMHB4O1xufVxuXG4uY29tcGFuaWVzLXRleHQge1xuICBmb250LXNpemU6IDQ4cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMC43O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLmFiY2Qge1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAwLjgzO1xuICBsZXR0ZXItc3BhY2luZzogMi44cHg7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmFiY2Qge1xuICAgIHBhZGRpbmc6IDMwcHggMHB4IDBweCAwcHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB9XG59XG4udGFnbGluZSB7XG4gIGZvbnQtc2l6ZTogNDFweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIGNvbG9yOiAjZmZmO1xuICBwYWRkaW5nLXRvcDogN3JlbTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC50YWdsaW5lIHtcbiAgICBmb250LXNpemU6IDIycHg7XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA1MDBweCkge1xuICAudGFnbGluZSB7XG4gICAgZm9udC1zaXplOiAxNXB4O1xuICAgIHBhZGRpbmctdG9wOiAzMHB4O1xuICB9XG59XG4ubG9vay1mb3ItY29tcGFueS1tYXQge1xuICB3aWR0aDogMTAwJTtcbiAgZm9udC1zaXplOiA0MXB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgY29sb3I6IHdoaXRlO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBtYXJnaW4tdG9wOiAxMHB4O1xuICBoZWlnaHQ6IDE1MHB4O1xufVxuXG4vKiAubG9vay1mb3ItY29tcGFueS1tYXQgOjpuZy1kZWVwIC5tYXQtZm9jdXNlZCAubWF0LWZvcm0tZmllbGQtbGFiZWwge1xuXG4gIGNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xuICB9XG5cbiAgLmxvb2stZm9yLWNvbXBhbnktbWF0IDo6bmctZGVlcCAubWF0LWlucHV0LXBsYWNlaG9sZGVyIHtcblxuICBjb2xvcjogd2hpdGUgIWltcG9ydGFudDtcbiAgfSAqL1xuLyogXG4gIC5sb29rLWZvci1jb21wYW55LW1hdCA6Om5nLWRlZXAubWF0LWZvcm0tZmllbGQtdW5kZXJsaW5lIHsgKi9cbi8qY2hhbmdlIGNvbG9yIG9mIHVuZGVybGluZSovXG4vKmNoYW5nZSBjb2xvciBvZiB1bmRlcmxpbmUqL1xuLyogYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwyNTUsMjU1LCAwLjEpICFpbXBvcnRhbnQ7ICovXG4vKiBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjU1LDI1NSwyNTUsIDAuMSkgIWltcG9ydGFudDsgKi9cbi8qIGJhY2tncm91bmQtY29sb3I6IHdoaXRlICFpbXBvcnRhbnQ7XG4gIH0gKi9cbi8qIFxuICAubG9vay1mb3ItY29tcGFueS1tYXQgOjpuZy1kZWVwLm1hdC1mb3JtLWZpZWxkLXJpcHBsZSB7ICovXG4vKmNoYW5nZSBjb2xvciBvZiB1bmRlcmxpbmUgd2hlbiBmb2N1c2VkKi9cbi8qIGJhY2tncm91bmQtY29sb3I6IHdoaXRlICFpbXBvcnRhbnQ7O1xuICB9ICovXG4vKiBcbiAgLmxvb2stZm9yLWNvbXBhbnktbWF0IDo6bmctZGVlcCAubWF0LWZvcm0tZmllbGQtbGFiZWwge1xuICBjb2xvcjp3aGl0ZSAhaW1wb3J0YW50O1xuICB9XG5cbiAgLmV4YW1wbGUtZnVsbC13aWR0aCA6Om5nLWRlZXAgLm1hdC1mb3JtLWZpZWxkLWxhYmVse1xuICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcbiAgfVxuICAubWF0LWZvcm0tZmllbGQtZmxleHtcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGUgIWltcG9ydGFudDtcbiAgfSAqL1xuQG1lZGlhIChtYXgtd2lkdGg6IDUwMHB4KSB7XG4gIC5jb2wtNCB7XG4gICAgZmxleDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gIH1cbn1cbi50aXRsZSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDI1cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMC44MztcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDIwcHggMHB4IDMwcHggMHB4O1xuICBib3JkZXItYm90dG9tOiAzcHggc29saWQ7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAudGl0bGUge1xuICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgfVxufVxuLmlucSB7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zOTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDBweCAwcHggMzBweCAwcHg7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuaW5xIHtcbiAgICBmb250LXNpemU6IDE1cHg7XG4gIH1cbn1cbi5jb250ZW50IHtcbiAgZGlzcGxheTogZmxleDtcbn1cblxuLmluY2x1ZGUge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4IDBweCAwcHggMTBweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pbmNsdWRlIHtcbiAgICBmb250LXNpemU6IDEzcHg7XG4gIH1cbn1cbi5jYXJkLXRleHQge1xuICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgZm9udC1zaXplOiA4NS41cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzM5N2M4NjtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmNhcmQtdGV4dCB7XG4gICAgZm9udC1zaXplOiAzNXB4O1xuICB9XG59XG4uaW1hZ2Uge1xuICBwYWRkaW5nLWxlZnQ6IDU0cHg7XG59XG5cbi5xdWUtYW5zIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA1MCUgNTAlO1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgYmxhY2s7XG59XG5cbi5xLWEge1xuICBmb250LXNpemU6IDY1cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMC44MztcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xMyk7XG4gIHBhZGRpbmc6IDE0cHggMHB4IDE4cHggMHB4O1xufVxuXG4ucXVlcy1kaXYge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDUwJTtcbiAgLyogZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxMDAlIDAlOyAqL1xuICBtYXgtaGVpZ2h0OiAxODBweDtcbn1cblxuLnF1ZXMtZGl2LWNvbW1lbnQge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDEwMCU7XG4gIG1heC1oZWlnaHQ6IDI0MHB4O1xuICBwYWRkaW5nOiAyMHB4IDAgMCAwO1xufVxuXG4ucXVlc3Rpb24ge1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM2O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgcGFkZGluZzogMHB4O1xuICAvKiBwYWRkaW5nOiAyMnB4IDE2OXB4IDEwN3B4IDBweDsgKi9cbn1cblxuLnRleHQtYXJlYSB7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgd2lkdGg6IDM2NXB4O1xufVxuXG4udmVyeS10ZXh0IHtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zOTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDRweCAwcHggMHB4IDBweDtcbn1cblxuLmRpZmZpY3VsdC10ZXh0IHtcbiAgZm9udC1zaXplOiAxM3B4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zOTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHBhZGRpbmc6IDExOHB4IDBweCAwcHggMHB4O1xufVxuXG4ucmFkaW8tb3B0aW9ucyB7XG4gIG1hcmdpbi1sZWZ0OiAyN3B4O1xuICBmb250LXNpemU6IDE1cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjc5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi5yYWRpbyB7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDIuNjtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG4gIHZlcnRpY2FsLWFsaWduOiBib3R0b207XG59XG5cbi5jb21tZW50LXRleHQge1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xufVxuXG4ucmFkaW8tcGFkZCB7XG4gIHBhZGRpbmctbGVmdDogMTBweDtcbn1cblxuLm9wdGlvbnMge1xuICBwYWRkaW5nOiAyMHB4IDBweCAwcHggMHB4O1xufVxuXG4ucmFkaW8tYnRucyB7XG4gIHBhZGRpbmctdG9wOiA0NnB4O1xufVxuXG4ubGFiZWwge1xuICBwYWRkaW5nLWxlZnQ6IDEzcHg7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG4ucHJvZ3Jlc3NiYXIge1xuICBwYWRkaW5nOiA1MXB4IDBweCAxNXB4IDBweDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtcHJvZ3Jlc3MtYmFyLWZpbGw6OmFmdGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzc0YjIyNDtcbn1cblxuOjpuZy1kZWVwIC5tYXQtcHJvZ3Jlc3MtYmFyIHtcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xufVxuXG4ucHJldmlvdXMge1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMDQ7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nLXRvcDogMjlweDtcbn1cblxuLnByZXZpb3VzLXRleHQge1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMDQ7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAyOXB4IDBweCAwcHggMTJweDtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG5cbi5uZXh0LXRleHQge1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMDQ7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBwYWRkaW5nOiAyOXB4IDEycHggMHB4IDBweDtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG5cbi5uZXh0IHtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG59XG5cbi5wcmV2LW5leHQge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDUwJSA1MCU7XG4gIHBhZGRpbmctYm90dG9tOiA5MnB4O1xufVxuXG4uY291bnQge1xuICBmb250LXNpemU6IDQ1cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjU2O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICBjb2xvcjogIzM5N2M4NjtcbiAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gIHBhZGRpbmctdG9wOiAzMHB4O1xufVxuXG4uY29tcGFueS1uYW1lIHtcbiAgd2lkdGg6IDMwMHB4O1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHBhZGRpbmctdG9wOiA1cHg7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbn1cblxuLnByb2dyZXNzIHtcbiAgaGVpZ2h0OiAxNXB4O1xufVxuXG4ub3B0aW9ucy1ncmlkIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxMDAlO1xuICAvKiBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDIwJSA4MCU7ICovXG59XG5cbi5jb21wYW55LXByb2ZpbGUge1xuICBwYWRkaW5nOiA1My41cHggMHB4IDBweCA5MHB4O1xufVxuXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pbmNsdXNpb24tdGV4dCB7XG4gICAgZm9udC1zaXplOiAyM3B4O1xuICB9XG5cbiAgLmltYWdlIHtcbiAgICB3aWR0aDogMTE1cHg7XG4gICAgcGFkZGluZy1sZWZ0OiAwcHg7XG4gIH1cblxuICAuY29udGFpbmVyIHtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDEwMCU7XG4gIH1cblxuICAuY29udHJpYnV0aW5nLWFzIHtcbiAgICBmb250LXNpemU6IDEzcHg7XG4gIH1cblxuICAuZ3JpZC1pbmNsdXNpb24ge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogNjAlIDQwJTtcbiAgfVxuXG4gIC5pbmZvc3lzLXRleHQge1xuICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICB9XG5cbiAgLnF1ZXMtZGl2IHtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDEwMCU7XG4gIH1cblxuICAucXVlc3Rpb24ge1xuICAgIHBhZGRpbmc6IDIxcHggMzdweCAwcHggMHB4O1xuICB9XG5cbiAgLm9wdGlvbnMge1xuICAgIHBhZGRpbmc6IDBweDtcbiAgfVxuXG4gIC5vcHRpb25zOm50aC1jaGlsZCgxKSB7XG4gICAgcGFkZGluZzogMHB4O1xuICB9XG5cbiAgLnZlcnktdGV4dCB7XG4gICAgZm9udC1zaXplOiA5cHg7XG4gIH1cblxuICAuZGlmZmljdWx0LXRleHQge1xuICAgIGZvbnQtc2l6ZTogOXB4O1xuICB9XG5cbiAgLmNvdW50IHtcbiAgICBmb250LXNpemU6IDU0cHg7XG4gICAgcGFkZGluZzogMTBweCAwcHggOTJweCAxOTJweDtcbiAgfVxuXG4gIC5wcmV2LW5leHQge1xuICAgIHBhZGRpbmctYm90dG9tOiAwcHg7XG4gIH1cblxuICAub3B0aW9ucy1ncmlkIHtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDIwJSA2MCUgMjAlO1xuICB9XG59Il19 */"

/***/ }),

/***/ "./src/app/components/quiz-test/quiz-test.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/components/quiz-test/quiz-test.component.ts ***!
  \*************************************************************/
/*! exports provided: QuizTestComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuizTestComponent", function() { return QuizTestComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _service_questions_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../service/questions.service */ "./src/app/service/questions.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");





var QuizTestComponent = /** @class */ (function () {
    function QuizTestComponent(service, router, httpClient) {
        this.service = service;
        this.router = router;
        this.httpClient = httpClient;
        this.nextID = 0;
        this.select = "";
        this.gender = null;
        this.comment = false;
        this.selectedOption = [];
        this.disable = [];
        this.data = {
            events: [],
            labels: ["Female", "Male"],
            datasets: [
                {
                    data: [25, 75],
                    backgroundColor: ["#148fd5", "#da1b63"]
                }
            ]
        };
        this.pieChartOptions = {
            legend: {
                display: false
            },
            tooltips: {
                enabled: true
            }
        };
    }
    QuizTestComponent.prototype.showComments = function () {
        this.comment = !this.comment;
    };
    QuizTestComponent.prototype.setOptionValue = function (event, index) {
        var data = {
            questionId: this.questions[this.nextID].questionId,
            answerId: event.value,
            point: this.questions[this.nextID].answers[index].points
        };
        this.selectedOption[this.nextID] = data;
        if (typeof this.selectedOption[this.nextID] === "object") {
            this.disable[this.nextID] = false;
        }
        console.log("selected option", this.selectedOption);
        // return this.httpClient.post(`http://localhost:8080/response/submit`, data);
    };
    QuizTestComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getAllQuestions().subscribe(function (data) {
            console.log(data);
            _this.questions = data.data;
            //initialize disable indexes for the next and prev button
            _this.questions.forEach(function (element, index) {
                _this.disable[index] = true;
            });
            console.log(_this.questions);
            _this.question = _this.questions[0].question;
            _this.optionsText = _this.questions[0].answers;
            _this.optionsLength = _this.questions[0].answers.length;
            _this.options = _this.questions[0].answers;
            _this.count = _this.questions[0].questionId;
            _this.progressValue = 100 / _this.questions.length;
            _this.progress = _this.progressValue;
            console.log(_this.options);
        });
    };
    QuizTestComponent.prototype.nextQuestion = function () {
        if (this.nextID < this.questions.length - 1) {
            this.question = this.questions[this.nextID + 1].question;
            console.log("Questions", this.question);
            this.optionsText = this.questions[this.nextID + 1].answers;
            this.options = this.questions[this.nextID + 1].answers;
            console.log("QuestionText", this.optionsText);
            this.progress += this.progressValue;
            this.gender = null;
            this.nextID++;
        }
        else {
        }
    };
    //nextQuestion
    QuizTestComponent.prototype.previousQuestion = function () {
        if (this.nextID == 0) {
            // hide previious button
        }
        else if (this.nextID >= 0) {
            this.nextID--;
            this.question = this.questions[this.nextID].question;
            this.optionsText = this.questions[this.nextID].answers;
            this.options = this.questions[this.nextID].answers;
            this.progress -= this.progressValue;
            this.gender = null;
        }
    };
    QuizTestComponent.prototype.postQuestion = function () {
        var postData = {
            companyId: sessionStorage.getItem("companyId"),
            userId: JSON.parse(sessionStorage.getItem("userData")).uid,
            answers: this.selectedOption
        };
        console.log(postData);
        this.router.navigate(["/quiz-results"]);
        this.httpClient
            .post("http://13.126.96.234/response/submit", postData)
            .subscribe(function (postData) {
            console.log(postData);
        });
    };
    QuizTestComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: "app-quiz-test",
            template: __webpack_require__(/*! ./quiz-test.component.html */ "./src/app/components/quiz-test/quiz-test.component.html"),
            styles: [__webpack_require__(/*! ./quiz-test.component.scss */ "./src/app/components/quiz-test/quiz-test.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_service_questions_service__WEBPACK_IMPORTED_MODULE_2__["QuestionsService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"]])
    ], QuizTestComponent);
    return QuizTestComponent;
}());



/***/ }),

/***/ "./src/app/components/request-company/request-company.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/components/request-company/request-company.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"container-fluid\">\n  <!-- <img src=\"../../../assets/banner-image1.png\" alt=\"\"> -->\n</section>\n<section class=\"container\">\n  <div class=\"new-company\">\n    <p class=\"looking-for\">LOOKING FOR</p>\n    <form [formGroup]=\"addCompanyForm\" (ngSubmit)=\"onSubmit()\">\n      <div class=\"\">\n        <div class=\"form-group\">\n          <input formControlName=\"companyName\" class=\"form-control line_remove\"\n            [ngClass]=\"{ 'is-invalid': submitted && f.companyName.errors }\" />\n          <div *ngIf=\"submitted && f.companyName.errors\" class=\"invalid-feedback\">\n            <div *ngIf=\"f.companyName.errors.required\">company Name is required</div>\n          </div>\n        </div>\n      </div>\n      <div class=\"under_value\">\n        <p class=\"source-it\">Unfortunately we don’t have data about this company. But we can source it for you.\n        </p>\n      </div>\n      <div class=\"data_value\">\n        <div class=\"form-group\">\n          <input type=\"text\" placeholder=\"NAME\" formControlName=\"name\" class=\"form-control your_name\"\n            [ngClass]=\"{ 'is-invalid': submitted && f.name.errors }\" />\n          <div *ngIf=\"submitted && f.name.errors\" class=\"invalid-feedback\">\n            <div *ngIf=\"f.name.errors.required\">company email is required</div>\n          </div>\n        </div>\n        <span class=\"and\">&</span>\n        <div class=\"form-group\">\n          <input type=\"text\" placeholder=\"COMPANY EMAIL\" formControlName=\"email\" class=\"form-control company_email\"\n            [ngClass]=\"{ 'is-invalid': submitted && f.email.errors }\" />\n          <div *ngIf=\"submitted && f.email.errors\" class=\"invalid-feedback\">\n            <div *ngIf=\"f.email.errors.required\">factscore is required</div>\n          </div>\n        </div>\n      </div>\n      <div class=\"\">\n        <div class=\"form-group\">\n          <input type=\"text\" placeholder=\"COMMENT (Optional)\" formControlName=\"comment\" class=\"form-control comment\"\n            [ngClass]=\"{ 'is-invalid': submitted && f.comment.errors }\" />\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <button [disabled]=\"loading\" class=\"submit-btn\">SUBMIT</button>\n      </div>\n    </form>\n  </div>\n</section>"

/***/ }),

/***/ "./src/app/components/request-company/request-company.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/components/request-company/request-company.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container-fluid {\n  background: url('banner-image1.png');\n  height: 137px;\n  background-position: center center;\n  background-size: cover;\n}\n\n.new-company {\n  padding: 30px;\n}\n\n.line_remove {\n  border-bottom: none !important;\n  font-size: 40px;\n}\n\n.under_value {\n  border-bottom: 3px solid black;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n}\n\n.looking-for {\n  font-size: 14px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.company-name {\n  padding-top: 5px;\n  font-size: 35px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n@media (max-width: 500px) {\n  .form-group {\n    padding: 0px 20px 0px 0px;\n  }\n}\n\n.source-it {\n  padding: 5px 0px 10px 0px;\n  font-size: 15px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.25;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.employee {\n  margin: 60px 0px 0px 0px;\n}\n\n.submit {\n  padding: 5px 0px 200px 0px;\n}\n\n.input-data {\n  padding-top: 0px;\n}\n\n.leave-us {\n  font-size: 22px;\n  font-weight: bold;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 0.83;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n}\n\n.and {\n  margin: 0px 80px 0px 80px;\n  font-size: 18px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  align-items: center;\n  display: flex;\n}\n\n@media (max-width: 768px) {\n  .and {\n    margin: 0px 10px 0px 10px;\n    font-size: 18px;\n    font-weight: normal;\n    font-style: normal;\n    font-stretch: normal;\n    line-height: 1.39;\n    letter-spacing: normal;\n    text-align: left;\n    color: #000000;\n    align-items: center;\n    display: flex;\n  }\n}\n\n@media (max-width: 500px) {\n  .and {\n    display: none;\n  }\n}\n\n.example-full-width {\n  font-family: Montserrat;\n  font-size: 13px;\n  font-weight: normal;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.39;\n  letter-spacing: normal;\n  text-align: left;\n  color: #000000;\n  width: 230px;\n}\n\n.example-full-width ::ng-deep .mat-form-field-label {\n  color: black;\n}\n\n.data_value {\n  display: flex;\n  padding: 20px 0px 0px 0px;\n}\n\n.comment {\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n}\n\n.form-control {\n  border: none;\n  border-bottom: 1px solid;\n  border-radius: 0;\n  box-shadow: none !important;\n  padding: 20px 0px 0px 0px;\n}\n\n.submit-btn {\n  background-image: linear-gradient(59deg, #5fbb04, #1d8502);\n  padding: 9px 30px 9px 30px;\n  border-radius: 40px;\n  background-color: #ffffff;\n  font-family: Montserrat;\n  font-size: 12px;\n  font-weight: 800;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 1.13;\n  letter-spacing: 0.4px;\n  text-align: left;\n  color: #ffffff;\n}\n\n@media only screen and (max-width: 768px) {\n  .new-company {\n    margin: 20px 0px 0px 0px;\n  }\n\n  .looking-for {\n    font-size: 12px;\n  }\n\n  .example-full-width {\n    width: 283px;\n  }\n\n  .submit {\n    padding: 5px 0px 57px 0px;\n  }\n\n  .company-name {\n    padding-top: 17px;\n    font-size: 17px;\n  }\n\n  .source-it {\n    padding: 19px 0px 22px 0px;\n    font-size: 14px;\n  }\n\n  .employee {\n    margin: 50px 0px 0px 0px;\n  }\n\n  .leave-us {\n    font-size: 15px;\n  }\n\n  .input-data {\n    padding-top: 20px;\n  }\n}\n\n/* //////////////// */\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hcHBpbmVzcy9EZXNrdG9wL0VuZ2VuZGVyZWQtUHJvamVjdC9zcmMvYXBwL2NvbXBvbmVudHMvcmVxdWVzdC1jb21wYW55L3JlcXVlc3QtY29tcGFueS5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvY29tcG9uZW50cy9yZXF1ZXN0LWNvbXBhbnkvcmVxdWVzdC1jb21wYW55LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksb0NBQUE7RUFDQSxhQUFBO0VBQ0Esa0NBQUE7RUFJQSxzQkFBQTtBQ0NKOztBRENBO0VBQ0ksYUFBQTtBQ0VKOztBREFBO0VBQ0ksOEJBQUE7RUFDQSxlQUFBO0FDR0o7O0FEREE7RUFDSSw4QkFBQTtFQUNBLDBCQUFBO0VBQUEsdUJBQUE7RUFBQSxrQkFBQTtBQ0lKOztBREZBO0VBQ0ksZUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUNLSjs7QURGQTtFQUNJLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGNBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ0tKOztBREhBO0VBQ0E7SUFDSSx5QkFBQTtFQ01GO0FBQ0Y7O0FESkE7RUFDSSx5QkFBQTtFQUNBLGVBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0JBQUE7RUFDQSxpQkFBQTtFQUNBLHNCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0FDTUo7O0FEbUJBO0VBQ0ksd0JBQUE7QUNoQko7O0FEbUJBO0VBQ0ksMEJBQUE7QUNoQko7O0FEbUJBO0VBQ0ksZ0JBQUE7QUNoQko7O0FEbUJBO0VBQ0ksZUFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUNoQko7O0FEbUJBO0VBQ0kseUJBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtBQ2hCSjs7QURrQkE7RUFDSTtJQUNJLHlCQUFBO0lBQ0EsZUFBQTtJQUNBLG1CQUFBO0lBQ0Esa0JBQUE7SUFDQSxvQkFBQTtJQUNBLGlCQUFBO0lBQ0Esc0JBQUE7SUFDQSxnQkFBQTtJQUNBLGNBQUE7SUFDQSxtQkFBQTtJQUNBLGFBQUE7RUNmTjtBQUNGOztBRGlCQTtFQUNJO0lBQ0csYUFBQTtFQ2ZMO0FBQ0Y7O0FEa0JBO0VBQ0ksdUJBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUNoQko7O0FEbUJFO0VBQ0ksWUFBQTtBQ2hCTjs7QURrQkU7RUFDRSxhQUFBO0VBQ0EseUJBQUE7QUNmSjs7QURpQkU7RUFDRSwwQkFBQTtFQUFBLHVCQUFBO0VBQUEsa0JBQUE7QUNkSjs7QURnQkU7RUFDRSxZQUFBO0VBQ0Esd0JBQUE7RUFDQSxnQkFBQTtFQUNBLDJCQUFBO0VBQ0EseUJBQUE7QUNiSjs7QURlRTtFQUNFLDBEQUFBO0VBQ0EsMEJBQUE7RUFDQSxtQkFBQTtFQUNBLHlCQUFBO0VBQ0EsdUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsaUJBQUE7RUFDQSxxQkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQ1pKOztBRGVFO0VBQ0U7SUFDSSx3QkFBQTtFQ1pOOztFRGNFO0lBQ0ksZUFBQTtFQ1hOOztFRGNFO0lBQ0ksWUFBQTtFQ1hOOztFRGNFO0lBQ0kseUJBQUE7RUNYTjs7RURjRTtJQUNJLGlCQUFBO0lBQ0EsZUFBQTtFQ1hOOztFRGNFO0lBQ0ksMEJBQUE7SUFDQSxlQUFBO0VDWE47O0VEY0U7SUFDSSx3QkFBQTtFQ1hOOztFRGNFO0lBQ0ksZUFBQTtFQ1hOOztFRGNFO0lBQ0ksaUJBQUE7RUNYTjtBQUNGOztBRGFBLHFCQUFBIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9yZXF1ZXN0LWNvbXBhbnkvcmVxdWVzdC1jb21wYW55LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRhaW5lci1mbHVpZHtcbiAgICBiYWNrZ3JvdW5kOiB1cmwoLi4vLi4vLi4vYXNzZXRzLy9iYW5uZXItaW1hZ2UxLnBuZyk7XG4gICAgaGVpZ2h0OiAxMzdweDtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXIgY2VudGVyO1xuICAgIC1tb3otYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgICAtd2Via2l0LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gICAgLW8tYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xufVxuLm5ldy1jb21wYW55e1xuICAgIHBhZGRpbmc6IDMwcHg7ICAgIFxufVxuLmxpbmVfcmVtb3Zle1xuICAgIGJvcmRlci1ib3R0b206bm9uZSAhaW1wb3J0YW50OyBcbiAgICBmb250LXNpemU6IDQwcHg7XG59XG4udW5kZXJfdmFsdWUge1xuICAgIGJvcmRlci1ib3R0b206IDNweCBzb2xpZCBibGFjaztcbiAgICB3aWR0aDogZml0LWNvbnRlbnQ7XG59XG4ubG9va2luZy1mb3J7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLmNvbXBhbnktbmFtZXtcbiAgICBwYWRkaW5nLXRvcDogNXB4O1xuICAgIGZvbnQtc2l6ZTogMzVweDtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIGNvbG9yOiAjMDAwMDAwO1xufVxuQG1lZGlhIChtYXgtd2lkdGg6NTAwcHgpe1xuLmZvcm0tZ3JvdXB7XG4gICAgcGFkZGluZzogMHB4IDIwcHggMHB4IDBweDtcbn1cbn1cbi5zb3VyY2UtaXR7XG4gICAgcGFkZGluZzogNXB4IDBweCAxMHB4IDBweDtcbiAgICBmb250LXNpemU6IDE1cHg7XG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGluZS1oZWlnaHQ6IDEuMjU7XG4gICAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIGNvbG9yOiAjMDAwMDAwO1xufVxuLy8gLmFkamVzdHtcbi8vICAgICB3aWR0aDogNTQzcHg7XG4vLyB9XG4vLyBAbWVkaWEgKG1heC13aWR0aDo3NjhweCl7XG4vLyAgICAgLmFkamVzdHtcbi8vICAgICAgICAgd2lkdGg6IDY5MHB4O1xuLy8gICAgIH1cbi8vIH1cbi8vIEBtZWRpYSAobWF4LXdpZHRoOjQyNXB4KXtcbi8vICAgICAuYWRqZXN0e1xuLy8gICAgICAgICB3aWR0aDogNDAwcHg7XG4vLyAgICAgfVxuLy8gfVxuLy8gQG1lZGlhIChtYXgtd2lkdGg6Mzc1cHgpe1xuLy8gICAgIC5hZGplc3R7XG4vLyAgICAgICAgIHdpZHRoOiAzNDNweDtcbi8vICAgICB9XG4vLyB9XG4vLyBAbWVkaWEgKG1heC13aWR0aDozMjBweCl7XG4vLyAgICAgLmFkamVzdHtcbi8vICAgICAgICAgd2lkdGg6IDMwMHB4O1xuLy8gICAgIH1cbi8vIH1cbi5lbXBsb3llZXtcbiAgICBtYXJnaW46NjBweCAwcHggMHB4IDBweDtcbn1cblxuLnN1Ym1pdHtcbiAgICBwYWRkaW5nOjVweCAwcHggMjAwcHggMHB4O1xufVxuXG4uaW5wdXQtZGF0YXtcbiAgICBwYWRkaW5nLXRvcDowcHg7XG59XG5cbi5sZWF2ZS11c3tcbiAgICBmb250LXNpemU6IDIycHg7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICAgIGxpbmUtaGVpZ2h0OiAwLjgzO1xuICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjb2xvcjogIzAwMDAwMDtcbn1cblxuLmFuZHtcbiAgICBtYXJnaW46MHB4IDgwcHggMHB4IDgwcHg7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjb2xvcjogIzAwMDAwMDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG59XG5AbWVkaWEgKG1heC13aWR0aDo3NjhweCl7XG4gICAgLmFuZHtcbiAgICAgICAgbWFyZ2luOjBweCAxMHB4IDBweCAxMHB4O1xuICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gICAgICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICAgICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgICBjb2xvcjogIzAwMDAwMDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDo1MDBweCl7XG4gICAgLmFuZHtcbiAgICAgICBkaXNwbGF5OiBub25lO1xuICAgIH1cbn1cblxuLmV4YW1wbGUtZnVsbC13aWR0aCB7XG4gICAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjb2xvcjogIzAwMDAwMDtcbiAgICB3aWR0aDogMjMwcHg7XG4gIH1cblxuICAuZXhhbXBsZS1mdWxsLXdpZHRoIDo6bmctZGVlcCAubWF0LWZvcm0tZmllbGQtbGFiZWx7XG4gICAgICBjb2xvcjogYmxhY2tcbiAgfVxuICAuZGF0YV92YWx1ZXtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIHBhZGRpbmc6IDIwcHggMHB4IDBweCAwcHg7XG4gIH1cbiAgLmNvbW1lbnR7XG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xuICB9XG4gIC5mb3JtLWNvbnRyb2wge1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQ7XG4gICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICBib3gtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7XG4gICAgcGFkZGluZzogMjBweCAwcHggMHB4IDBweDtcbn1cbiAgLnN1Ym1pdC1idG57XG4gICAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDU5ZGVnLCAjNWZiYjA0LCAjMWQ4NTAyKTtcbiAgICBwYWRkaW5nOjlweCAzMHB4IDlweCAzMHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDQwcHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbiAgICBmb250LWZhbWlseTogTW9udHNlcnJhdDtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XG4gICAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gICAgbGluZS1oZWlnaHQ6IDEuMTM7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuNHB4O1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgY29sb3I6ICNmZmZmZmY7XG4gIH1cblxuICBAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6NzY4cHgpe1xuICAgIC5uZXctY29tcGFueXtcbiAgICAgICAgbWFyZ2luOjIwcHggMHB4IDBweCAwcHg7XG4gICAgfSBcbiAgICAubG9va2luZy1mb3J7XG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICB9XG5cbiAgICAuZXhhbXBsZS1mdWxsLXdpZHRoe1xuICAgICAgICB3aWR0aDogMjgzcHg7XG4gICAgfVxuXG4gICAgLnN1Ym1pdHtcbiAgICAgICAgcGFkZGluZzogNXB4IDBweCA1N3B4IDBweDtcbiAgICB9XG4gICAgXG4gICAgLmNvbXBhbnktbmFtZXtcbiAgICAgICAgcGFkZGluZy10b3A6IDE3cHg7XG4gICAgICAgIGZvbnQtc2l6ZTogMTdweDtcbiAgICB9XG4gICAgXG4gICAgLnNvdXJjZS1pdHtcbiAgICAgICAgcGFkZGluZzogMTlweCAwcHggMjJweCAwcHg7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICB9XG5cbiAgICAuZW1wbG95ZWV7XG4gICAgICAgIG1hcmdpbjo1MHB4IDBweCAwcHggMHB4O1xuICAgIH1cblxuICAgIC5sZWF2ZS11c3tcbiAgICAgICAgZm9udC1zaXplOiAxNXB4O1xuICAgIH1cblxuICAgIC5pbnB1dC1kYXRhe1xuICAgICAgICBwYWRkaW5nLXRvcDoyMHB4O1xuICAgIH1cbiAgfVxuLyogLy8vLy8vLy8vLy8vLy8vLyAqL1xuIiwiLmNvbnRhaW5lci1mbHVpZCB7XG4gIGJhY2tncm91bmQ6IHVybCguLi8uLi8uLi9hc3NldHMvL2Jhbm5lci1pbWFnZTEucG5nKTtcbiAgaGVpZ2h0OiAxMzdweDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyIGNlbnRlcjtcbiAgLW1vei1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAtd2Via2l0LWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIC1vLWJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG59XG5cbi5uZXctY29tcGFueSB7XG4gIHBhZGRpbmc6IDMwcHg7XG59XG5cbi5saW5lX3JlbW92ZSB7XG4gIGJvcmRlci1ib3R0b206IG5vbmUgIWltcG9ydGFudDtcbiAgZm9udC1zaXplOiA0MHB4O1xufVxuXG4udW5kZXJfdmFsdWUge1xuICBib3JkZXItYm90dG9tOiAzcHggc29saWQgYmxhY2s7XG4gIHdpZHRoOiBmaXQtY29udGVudDtcbn1cblxuLmxvb2tpbmctZm9yIHtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMS4zOTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5jb21wYW55LW5hbWUge1xuICBwYWRkaW5nLXRvcDogNXB4O1xuICBmb250LXNpemU6IDM1cHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMTtcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA1MDBweCkge1xuICAuZm9ybS1ncm91cCB7XG4gICAgcGFkZGluZzogMHB4IDIwcHggMHB4IDBweDtcbiAgfVxufVxuLnNvdXJjZS1pdCB7XG4gIHBhZGRpbmc6IDVweCAwcHggMTBweCAwcHg7XG4gIGZvbnQtc2l6ZTogMTVweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMjU7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuXG4uZW1wbG95ZWUge1xuICBtYXJnaW46IDYwcHggMHB4IDBweCAwcHg7XG59XG5cbi5zdWJtaXQge1xuICBwYWRkaW5nOiA1cHggMHB4IDIwMHB4IDBweDtcbn1cblxuLmlucHV0LWRhdGEge1xuICBwYWRkaW5nLXRvcDogMHB4O1xufVxuXG4ubGVhdmUtdXMge1xuICBmb250LXNpemU6IDIycHg7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBsaW5lLWhlaWdodDogMC44MztcbiAgbGV0dGVyLXNwYWNpbmc6IG5vcm1hbDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG5cbi5hbmQge1xuICBtYXJnaW46IDBweCA4MHB4IDBweCA4MHB4O1xuICBmb250LXNpemU6IDE4cHg7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5hbmQge1xuICAgIG1hcmdpbjogMHB4IDEwcHggMHB4IDEwcHg7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xuICAgIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjM5O1xuICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjb2xvcjogIzAwMDAwMDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA1MDBweCkge1xuICAuYW5kIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG4uZXhhbXBsZS1mdWxsLXdpZHRoIHtcbiAgZm9udC1mYW1pbHk6IE1vbnRzZXJyYXQ7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgbGluZS1oZWlnaHQ6IDEuMzk7XG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICB3aWR0aDogMjMwcHg7XG59XG5cbi5leGFtcGxlLWZ1bGwtd2lkdGggOjpuZy1kZWVwIC5tYXQtZm9ybS1maWVsZC1sYWJlbCB7XG4gIGNvbG9yOiBibGFjaztcbn1cblxuLmRhdGFfdmFsdWUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAyMHB4IDBweCAwcHggMHB4O1xufVxuXG4uY29tbWVudCB7XG4gIHdpZHRoOiBmaXQtY29udGVudDtcbn1cblxuLmZvcm0tY29udHJvbCB7XG4gIGJvcmRlcjogbm9uZTtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBib3gtc2hhZG93OiBub25lICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmc6IDIwcHggMHB4IDBweCAwcHg7XG59XG5cbi5zdWJtaXQtYnRuIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KDU5ZGVnLCAjNWZiYjA0LCAjMWQ4NTAyKTtcbiAgcGFkZGluZzogOXB4IDMwcHggOXB4IDMwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDQwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XG4gIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA4MDA7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC1zdHJldGNoOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjEzO1xuICBsZXR0ZXItc3BhY2luZzogMC40cHg7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGNvbG9yOiAjZmZmZmZmO1xufVxuXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5uZXctY29tcGFueSB7XG4gICAgbWFyZ2luOiAyMHB4IDBweCAwcHggMHB4O1xuICB9XG5cbiAgLmxvb2tpbmctZm9yIHtcbiAgICBmb250LXNpemU6IDEycHg7XG4gIH1cblxuICAuZXhhbXBsZS1mdWxsLXdpZHRoIHtcbiAgICB3aWR0aDogMjgzcHg7XG4gIH1cblxuICAuc3VibWl0IHtcbiAgICBwYWRkaW5nOiA1cHggMHB4IDU3cHggMHB4O1xuICB9XG5cbiAgLmNvbXBhbnktbmFtZSB7XG4gICAgcGFkZGluZy10b3A6IDE3cHg7XG4gICAgZm9udC1zaXplOiAxN3B4O1xuICB9XG5cbiAgLnNvdXJjZS1pdCB7XG4gICAgcGFkZGluZzogMTlweCAwcHggMjJweCAwcHg7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICB9XG5cbiAgLmVtcGxveWVlIHtcbiAgICBtYXJnaW46IDUwcHggMHB4IDBweCAwcHg7XG4gIH1cblxuICAubGVhdmUtdXMge1xuICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgfVxuXG4gIC5pbnB1dC1kYXRhIHtcbiAgICBwYWRkaW5nLXRvcDogMjBweDtcbiAgfVxufVxuLyogLy8vLy8vLy8vLy8vLy8vLyAqLyJdfQ== */"

/***/ }),

/***/ "./src/app/components/request-company/request-company.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/request-company/request-company.component.ts ***!
  \*************************************************************************/
/*! exports provided: RequestCompanyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RequestCompanyComponent", function() { return RequestCompanyComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../service/user.service */ "./src/app/service/user.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_internal_operators_first__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/internal/operators/first */ "./node_modules/rxjs/internal/operators/first.js");
/* harmony import */ var rxjs_internal_operators_first__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(rxjs_internal_operators_first__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _service_company_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../service/company.service */ "./src/app/service/company.service.ts");







var RequestCompanyComponent = /** @class */ (function () {
    function RequestCompanyComponent(formBuilder, router, userService, companySvc) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.userService = userService;
        this.companySvc = companySvc;
        this.loading = false;
        this.submitted = false;
    }
    RequestCompanyComponent.prototype.ngOnInit = function () {
        this.addCompanyForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroup"]({
            firstName: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]()
        });
        this.addCompanyForm = this.formBuilder.group({
            name: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            email: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            companyName: [this.companySvc.companyName, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            comment: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"]],
        });
    };
    Object.defineProperty(RequestCompanyComponent.prototype, "f", {
        get: function () { return this.addCompanyForm.controls; },
        enumerable: true,
        configurable: true
    });
    RequestCompanyComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // stop here if form is invalid
        if (this.addCompanyForm.invalid) {
            return;
        }
        this.loading = true;
        this.userService.createCompany(this.addCompanyForm.value)
            .pipe(Object(rxjs_internal_operators_first__WEBPACK_IMPORTED_MODULE_5__["first"])())
            .subscribe(function (_data) {
            console.log(_data);
            alert("company added successfully");
            _this.router.navigate(['']);
        }, function (_error) {
            _this.loading = false;
        });
    };
    RequestCompanyComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-request-company',
            template: __webpack_require__(/*! ./request-company.component.html */ "./src/app/components/request-company/request-company.component.html"),
            styles: [__webpack_require__(/*! ./request-company.component.scss */ "./src/app/components/request-company/request-company.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"], _service_user_service__WEBPACK_IMPORTED_MODULE_3__["UserService"], _service_company_service__WEBPACK_IMPORTED_MODULE_6__["CompanyService"]])
    ], RequestCompanyComponent);
    return RequestCompanyComponent;
}());



/***/ }),

/***/ "./src/app/service/detailed-report.service.ts":
/*!****************************************************!*\
  !*** ./src/app/service/detailed-report.service.ts ***!
  \****************************************************/
/*! exports provided: DetailedReportService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DetailedReportService", function() { return DetailedReportService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _http_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./http.service */ "./src/app/service/http.service.ts");



var DetailedReportService = /** @class */ (function () {
    function DetailedReportService(httpService) {
        this.httpService = httpService;
        this.getCompanyByIdApi = 'company-getCompany';
    }
    DetailedReportService.prototype.getCompanyById = function (id) {
        // tslint:disable-next-line: whitespace
        return this.httpService.get(this.getCompanyByIdApi + "?id=" + id + '/');
    };
    DetailedReportService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_http_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"]])
    ], DetailedReportService);
    return DetailedReportService;
}());



/***/ })

}]);
//# sourceMappingURL=components-component-module.js.map