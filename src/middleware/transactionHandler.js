import mongoose from "mongoose";
import config from "../config/env.js";


// isAbort or isCommit passed also session compulsory
const handleTransaction = async (data) => {
  let { session, isStart, isCommit, isAbort } = data;
  if (config.isReplicaDB) {
    console.log("handleTransaction",{isStart, isCommit, isAbort });
    
    if (isStart) {
      session = await mongoose.startSession();
      // Start a new transaction session
      await session.startTransaction();
      return session;
    }else if (isCommit) {
      await session.commitTransaction();
      session.endSession();
    }else if (isAbort) {
      await session.abortTransaction();
      session.endSession();
    }
  }
  return session;
};

export { handleTransaction };
