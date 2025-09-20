"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardStatus = exports.CardType = void 0;
var CardType;
(function (CardType) {
    CardType["VISA"] = "visa";
    CardType["MASTER"] = "master";
    CardType["VERVE"] = "verve";
    CardType["DISCOVER"] = "discover";
})(CardType || (exports.CardType = CardType = {}));
var CardStatus;
(function (CardStatus) {
    CardStatus["ACTIVE"] = "active";
    CardStatus["DE_ACTIVATED"] = "de-activated";
})(CardStatus || (exports.CardStatus = CardStatus = {}));
