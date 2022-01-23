"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MongoCodeRepository = (function () {
  function MongoCodeRepository(collection, expiredAt, passcode) {
    this.collection = collection;
    this.code = (passcode ? passcode : 'passcode');
    this.expiredAt = (expiredAt ? expiredAt : 'expiredAt');
    this.load = this.load.bind(this);
    this.delete = this.delete.bind(this);
    this.save = this.save.bind(this);
  }
  MongoCodeRepository.prototype.save = function (id, passcode, expiredAt) {
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
  MongoCodeRepository.prototype.load = function (id) {
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
  MongoCodeRepository.prototype.delete = function (id) {
    var _this = this;
    var query = { _id: id };
    return new Promise((function (resolve, reject) {
      _this.collection.deleteOne(query, function (err, result) { return err ? reject(err) : resolve(result.deletedCount ? result.deletedCount : 0); });
    }));
  };
  return MongoCodeRepository;
}());
exports.MongoCodeRepository = MongoCodeRepository;
exports.MongoPasscodeRepository = MongoCodeRepository;
function getAffectedRow(res) {
  return res.lastErrorObject ? res.lastErrorObject.n : (res.ok ? res.ok : 0);
}
exports.getAffectedRow = getAffectedRow;
