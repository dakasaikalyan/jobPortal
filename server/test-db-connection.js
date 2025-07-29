const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    
    // Test creating a simple document
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Database write test successful');
    
    // Clean up test document
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Database cleanup successful');
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n📋 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your .env file has the correct MONGODB_URI');
    console.log('3. If using MongoDB Atlas, verify your connection string');
    console.log('4. If using local MongoDB, make sure the service is running');
    process.exit(1);
  }
}

testConnection(); 