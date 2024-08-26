import { Types } from 'mongoose';

export const toObjectId = (id: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid ID');
  return new Types.ObjectId(id);
};
