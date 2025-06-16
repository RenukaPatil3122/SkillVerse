const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/skillverse";

    // ✅ Updated options - removed deprecated ones
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      // ❌ Removed: useNewUrlParser, useUnifiedTopology, bufferCommands, bufferMaxEntries
      // These are now defaults in mongoose 6+ or deprecated
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(
      chalk.green.bold(`✅ MongoDB Connected: ${conn.connection.host}`)
    );
    console.log(chalk.blue(`📊 Database: ${conn.connection.name}`));

    // Connection event listeners
    mongoose.connection.on("connected", () => {
      console.log(chalk.green("📱 Mongoose connected to MongoDB"));
    });

    mongoose.connection.on("error", (err) => {
      console.error(chalk.red("❌ Mongoose connection error:"), err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log(chalk.yellow("📴 Mongoose disconnected from MongoDB"));
    });

    // If the Node process ends, close the Mongoose connection
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log(
        chalk.yellow("🔌 Mongoose connection closed through app termination")
      );
      process.exit(0);
    });

    // Create indexes after connection
    await createIndexes();

    return conn;
  } catch (error) {
    console.error(
      chalk.red.bold("❌ Database connection failed:"),
      error.message
    );

    // Log specific connection issues
    if (error.name === "MongooseServerSelectionError") {
      console.error(
        chalk.red("💡 Make sure MongoDB is running and accessible")
      );
      console.error(
        chalk.red("💡 Check your connection string and network connectivity")
      );
    }

    if (error.name === "MongoParseError") {
      console.error(
        chalk.red("💡 Check your MongoDB connection string format")
      );
    }

    // Exit process with failure
    process.exit(1);
  }
};

// Database health check function
const checkDBHealth = async () => {
  try {
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.ping();
    return { status: "healthy", response: result };
  } catch (error) {
    return { status: "unhealthy", error: error.message };
  }
};

// Get database statistics
const getDBStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
      objects: stats.objects,
    };
  } catch (error) {
    console.error("Error getting database stats:", error);
    return null;
  }
};

// Create database indexes for better performance
const createIndexes = async () => {
  try {
    console.log(chalk.blue("🔍 Creating database indexes..."));

    // Check if collections exist before creating indexes
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((c) => c.name);

    // User indexes
    if (collectionNames.includes("users")) {
      await mongoose.connection
        .collection("users")
        .createIndex({ email: 1 }, { unique: true });
      await mongoose.connection
        .collection("users")
        .createIndex({ username: 1 }, { unique: true, sparse: true });
    }

    // Roadmap indexes - only if collection exists
    if (collectionNames.includes("roadmaps")) {
      await mongoose.connection
        .collection("roadmaps")
        .createIndex({ userId: 1 });
      await mongoose.connection
        .collection("roadmaps")
        .createIndex({ category: 1 });
      await mongoose.connection
        .collection("roadmaps")
        .createIndex({ isPublic: 1 });
      await mongoose.connection
        .collection("roadmaps")
        .createIndex({ createdAt: -1 });
      await mongoose.connection.collection("roadmaps").createIndex({
        title: "text",
        description: "text",
        "steps.title": "text",
      });
    }

    // Progress indexes - only if collection exists
    if (collectionNames.includes("progresses")) {
      await mongoose.connection
        .collection("progresses")
        .createIndex({ userId: 1, roadmapId: 1 }, { unique: true });
      await mongoose.connection
        .collection("progresses")
        .createIndex({ userId: 1 });
    }

    console.log(chalk.green("✅ Database indexes created successfully"));
  } catch (error) {
    // Don't fail if indexes already exist
    if (error.code !== 11000) {
      console.error(chalk.red("❌ Error creating indexes:"), error.message);
    }
  }
};

// Clean up old data (utility function)
const cleanupOldData = async (days = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Clean up old unverified users
    const result = await mongoose.connection.collection("users").deleteMany({
      isVerified: false,
      createdAt: { $lt: cutoffDate },
    });

    if (result.deletedCount > 0) {
      console.log(
        chalk.yellow(
          `🧹 Cleaned up ${result.deletedCount} unverified users older than ${days} days`
        )
      );
    }

    return result.deletedCount;
  } catch (error) {
    console.error(chalk.red("❌ Error during cleanup:"), error.message);
    return 0;
  }
};

// Database backup utility (for development)
const createBackup = async (backupName) => {
  try {
    if (process.env.NODE_ENV === "production") {
      console.log(chalk.yellow("⚠️  Backup not available in production mode"));
      return false;
    }

    console.log(chalk.blue(`💾 Creating backup: ${backupName}`));
    // This would typically use mongodump or similar
    // For now, it's just a placeholder
    return true;
  } catch (error) {
    console.error(chalk.red("❌ Backup failed:"), error.message);
    return false;
  }
};

// Export functions
module.exports = {
  connectDB,
  checkDBHealth,
  getDBStats,
  createIndexes,
  cleanupOldData,
  createBackup,
};
