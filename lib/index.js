"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CodeRepository = (function () {
  function CodeRepository(collection, expiredAt, passcode) {
    this.collection = collection;
    this.code = (passcode ? passcode : 'passcode');
    this.expiredAt = (expiredAt ? expiredAt : 'expiredAt');
    this.load = this.load.bind(this);
    this.delete = this.delete.bind(this);
    this.save = this.save.bind(this);
  }
  CodeRepository.prototype.save = function (id, passcode, expiredAt) {
    var _a;
    var _this = this;
    var query = { _id: id };
    var obj = (_a = {
      _id: id
    },
      _a[this.code] = passcode,
      _a[this.expiredAt] = expiredAt,
      _a);
    return new Promise((function (resolve, reject) {
      _this.collection.findOneAndUpdate(query, { $set: obj }, {
        upsert: true
      }, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(getAffectedRow(result));
        }
      });
    }));
  };
  CodeRepository.prototype.load = function (id) {
    var _this = this;
    var query = { _id: id };
    return new Promise(function (resolve, reject) {
      _this.collection.findOne(query, function (err, item) {
        if (err) {
          reject(err);
        } else {
          var obj = {};
          obj.code = item[_this.code];
          obj.expiredAt = item[_this.expiredAt];
          return resolve(obj);
        }
      });
    });
  };
  CodeRepository.prototype.delete = function (id) {
    var _this = this;
    var query = { _id: id };
    return new Promise((function (resolve, reject) {
      _this.collection.deleteOne(query, function (err, result) { return err ? reject(err) : resolve(result.deletedCount ? result.deletedCount : 0); });
    }));
  };
  return CodeRepository;
}());
exports.CodeRepository = CodeRepository;
exports.PasscodeRepository = CodeRepository;
exports.MongoPasscodeRepository = CodeRepository;
exports.MongoCodeRepository = CodeRepository;
exports.CodeService = CodeRepository;
exports.PasscodeService = CodeRepository;
exports.MongoPasscodeService = CodeRepository;
exports.MongoCodeService = CodeRepository;
function getAffectedRow(res) {
  return res.lastErrorObject ? res.lastErrorObject.n : (res.ok ? res.ok : 0);
}
exports.getAffectedRow = getAffectedRow;
