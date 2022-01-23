import { Collection } from 'mongodb';
export interface Passcode {
  code: string;
  expiredAt: Date;
}
export class CodeRepository<ID> {
  constructor(public collection: Collection, expiredAt?: string, passcode?: string) {
    this.code = (passcode ? passcode : 'passcode');
    this.expiredAt = (expiredAt ? expiredAt : 'expiredAt');
    this.load = this.load.bind(this);
    this.delete = this.delete.bind(this);
    this.save = this.save.bind(this);
  }
  code: string;
  expiredAt: string;
  save(id: ID, passcode: string, expiredAt: Date): Promise<number> {
    const query = {_id: id};
    const obj = {
      _id: id,
      [this.code]: passcode,
      [this.expiredAt]: expiredAt
    };
    return new Promise<number>(((resolve, reject) => {
      this.collection.findOneAndUpdate(query, { $set: obj }, {
        upsert: true
      }, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(getAffectedRow(result));
        }
      });
    }));
  }
  load(id: ID): Promise<Passcode> {
    const query = {_id: id};
    return new Promise<Passcode>((resolve, reject) => {
      this.collection.findOne(query, (err: any, item: any) => {
        if (err) {
          reject(err);
        } else {
          const obj: any = {};
          obj.code = item[this.code];
          obj.expiredAt = item[this.expiredAt];
          return resolve(obj);
        }
      });
    });
  }
  delete(id: ID): Promise<number> {
    const query = {_id: id};
    return new Promise<number>(((resolve, reject) => {
      this.collection.deleteOne(query, (err: any, result: any) => err ? reject(err) : resolve(result.deletedCount ? result.deletedCount : 0));
    }));
  }
}
export const PasscodeRepository = CodeRepository;
export const MongoPasscodeRepository = CodeRepository;
export const MongoCodeRepository = CodeRepository;
export const CodeService = CodeRepository;
export const PasscodeService = CodeRepository;
export const MongoPasscodeService = CodeRepository;
export const MongoCodeService = CodeRepository;
export function getAffectedRow(res: any): number {
  return res.lastErrorObject ? res.lastErrorObject.n : (res.ok ? res.ok : 0);
}
