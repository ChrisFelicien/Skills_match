import mongoose from 'mongoose';

const connect = async (url) => {
  try {
    const connect = await mongoose.connect(url);
    if (process.env.NODE_ENV !== 'production')
      console.log(`connect to db on ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connect;
