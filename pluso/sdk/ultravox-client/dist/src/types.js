"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionQuality = exports.Medium = exports.Role = exports.UltravoxSessionStatus = void 0;
var UltravoxSessionStatus;
(function (UltravoxSessionStatus) {
    UltravoxSessionStatus["DISCONNECTED"] = "disconnected";
    UltravoxSessionStatus["CONNECTING"] = "connecting";
    UltravoxSessionStatus["IDLE"] = "idle";
    UltravoxSessionStatus["LISTENING"] = "listening";
    UltravoxSessionStatus["SPEAKING"] = "speaking";
    UltravoxSessionStatus["ERROR"] = "error";
})(UltravoxSessionStatus || (exports.UltravoxSessionStatus = UltravoxSessionStatus = {}));
var Role;
(function (Role) {
    Role["AGENT"] = "agent";
    Role["USER"] = "user";
    Role["SYSTEM"] = "system";
})(Role || (exports.Role = Role = {}));
var Medium;
(function (Medium) {
    Medium["VOICE"] = "voice";
    Medium["TEXT"] = "text";
})(Medium || (exports.Medium = Medium = {}));
var ConnectionQuality;
(function (ConnectionQuality) {
    ConnectionQuality["EXCELLENT"] = "excellent";
    ConnectionQuality["GOOD"] = "good";
    ConnectionQuality["FAIR"] = "fair";
    ConnectionQuality["POOR"] = "poor";
})(ConnectionQuality || (exports.ConnectionQuality = ConnectionQuality = {}));
