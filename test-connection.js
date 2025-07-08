import sequelize from "./config/database.js";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
    console.log("=".repeat(50));
    console.log("🔍 DATABASE CONNECTION ANALYSIS");
    console.log("=".repeat(50));
    
    // Check environment variables
    console.log("\n📋 Environment Check:");
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Not set");
    if (process.env.DATABASE_URL) {
        const url = new URL(process.env.DATABASE_URL);
        console.log("  - Host:", url.hostname);
        console.log("  - Port:", url.port);
        console.log("  - Database:", url.pathname.slice(1));
        console.log("  - Username:", url.username);
        console.log("  - Password:", url.password ? "***" : "❌ Not set");
    }
    
    console.log("\n🔗 Testing Raw PostgreSQL Connection:");
    try {
        const client = new Client({
            connectionString: process.env.DATABASE_URL
        });
        
        await client.connect();
        console.log("✅ Raw PostgreSQL connection successful");
        
        const result = await client.query('SELECT version()');
        console.log("✅ PostgreSQL version:", result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
        
        // Check if database exists
        const dbCheck = await client.query(`
            SELECT datname FROM pg_database 
            WHERE datname = $1
        `, [new URL(process.env.DATABASE_URL).pathname.slice(1)]);
        
        if (dbCheck.rows.length > 0) {
            console.log("✅ Database exists");
        } else {
            console.log("❌ Database does not exist");
        }
        
        await client.end();
        
    } catch (error) {
        console.log("❌ Raw PostgreSQL connection failed:");
        console.log("  Error:", error.message);
        
        if (error.code === '28P01') {
            console.log("  🔐 Authentication failed - check username/password");
        } else if (error.code === 'ECONNREFUSED') {
            console.log("  🚫 Connection refused - check if PostgreSQL is running");
        } else if (error.code === '3D000') {
            console.log("  🗄️ Database does not exist");
        }
    }
    
    console.log("\n🔗 Testing Sequelize Connection:");
    try {
        await sequelize.authenticate();
        console.log("✅ Sequelize connection successful");
        
        // Test query
        const [results] = await sequelize.query('SELECT NOW() as current_time');
        console.log("✅ Query test successful:", results[0].current_time);
        
        // Check dialect and config
        console.log("✅ Sequelize configuration:");
        console.log("  - Dialect:", sequelize.getDialect());
        console.log("  - Database:", sequelize.getDatabaseName());
        
    } catch (error) {
        console.log("❌ Sequelize connection failed:");
        console.log("  Error:", error.message);
        console.log("  Type:", error.name);
    } finally {
        await sequelize.close();
    }
    
    console.log("\n�️ Recommendations:");
    console.log("1. If password authentication fails:");
    console.log("   - Check PostgreSQL pg_hba.conf file");
    console.log("   - Try: ALTER USER postgres PASSWORD 'postgres';");
    console.log("   - Or create a new user with proper permissions");
    console.log("2. If database doesn't exist:");
    console.log("   - Create it: CREATE DATABASE \"learn-pg\";");
    console.log("3. For production:");
    console.log("   - Use environment-specific credentials");
    console.log("   - Enable SSL connection");
    console.log("   - Use connection pooling");
    
    console.log("\n" + "=".repeat(50));
}

testConnection();
