const { execSync } = require("child_process");
const fs = require("fs");

// Read the configuration
const config = JSON.parse(fs.readFileSync("./appwrite.json", "utf8"));

async function setupDatabase() {
  try {
    console.log("🚀 Setting up Appwrite database...");

    // Check if database exists, if not create it
    console.log("📊 Checking database...");
    let databaseExists = false;
    try {
      const databaseList = JSON.parse(
        execSync("appwrite databases list --json", { encoding: "utf8" })
      );
      databaseExists = databaseList.databases.some(
        (db) => db.$id === config.databaseId
      );
    } catch (error) {
      console.log(
        "Could not check existing databases, proceeding with creation..."
      );
    }

    if (!databaseExists) {
      console.log("📊 Creating database...");
      execSync(
        `appwrite databases create --database-id ${config.databaseId} --name "Regret Archive"`,
        { stdio: "inherit" }
      );
      console.log("✅ Database created successfully!");
    } else {
      console.log("✅ Database already exists, using existing database...");
    }

    // Create collections
    for (const [collectionId, collection] of Object.entries(
      config.collections
    )) {
      console.log(`📝 Setting up collection: ${collection.name}...`);

      // Check if collection exists, if not create it
      let collectionExists = false;
      try {
        const collectionsList = JSON.parse(
          execSync(
            `appwrite databases list-collections --database-id ${config.databaseId} --json`,
            { encoding: "utf8" }
          )
        );
        collectionExists = collectionsList.collections.some(
          (col) => col.$id === collectionId
        );
      } catch (error) {
        console.log(
          `Could not check existing collections for ${collection.name}, proceeding with creation...`
        );
      }

      if (!collectionExists) {
        console.log(`📝 Creating collection: ${collection.name}...`);
        execSync(
          `appwrite databases create-collection --database-id ${config.databaseId} --collection-id ${collectionId} --name "${collection.name}"`,
          { stdio: "inherit" }
        );
        console.log(`✅ Collection ${collection.name} created successfully!`);
      } else {
        console.log(
          `✅ Collection ${collection.name} already exists, skipping creation...`
        );
      }

      // Create attributes (only if collection was just created or attributes don't exist)
      console.log(`🔧 Setting up attributes for ${collection.name}...`);
      for (const attribute of collection.attributes) {
        try {
          const command = buildAttributeCommand(
            attribute,
            config.databaseId,
            collectionId
          );
          if (command === null) {
            continue; // Skip unsupported attributes
          }
          execSync(command, { stdio: "inherit" });
          console.log(`✅ Attribute ${attribute.key} created successfully!`);
        } catch (error) {
          if (error.message.includes("already exists")) {
            console.log(
              `✅ Attribute ${attribute.key} already exists, skipping...`
            );
          } else {
            console.log(
              `⚠️  Warning: Could not create attribute ${attribute.key}:`,
              error.message
            );
          }
        }
      }

      // Create indexes (only if collection was just created or indexes don't exist)
      console.log(`🔍 Setting up indexes for ${collection.name}...`);
      for (const index of collection.indexes) {
        try {
          const command = buildIndexCommand(
            index,
            config.databaseId,
            collectionId
          );
          execSync(command, { stdio: "inherit" });
          console.log(`✅ Index ${index.key} created successfully!`);
        } catch (error) {
          if (error.message.includes("already exists")) {
            console.log(`✅ Index ${index.key} already exists, skipping...`);
          } else {
            console.log(
              `⚠️  Warning: Could not create index ${index.key}:`,
              error.message
            );
          }
        }
      }

      // Set permissions (always update to ensure correct permissions)
      console.log(`🔐 Setting permissions for ${collection.name}...`);
      try {
        // Format permissions correctly for Appwrite CLI with double quotes
        const permissionsArgs = collection.permissions
          .map((perm) => {
            // Convert single quotes to double quotes for Appwrite CLI format
            const formattedPerm = perm.replace(/'/g, '"');
            return `--permissions="${formattedPerm}"`;
          })
          .join(" ");
        execSync(
          `appwrite databases update-collection --database-id ${config.databaseId} --collection-id ${collectionId} --name "${collection.name}" ${permissionsArgs}`,
          { stdio: "inherit" }
        );
        console.log(`✅ Permissions updated for ${collection.name}!`);
      } catch (error) {
        console.log(
          `⚠️  Warning: Could not update permissions for ${collection.name}:`,
          error.message
        );
      }
    }

    console.log("✅ Database setup completed successfully!");
    console.log("🎉 Your Appwrite database is ready to use!");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    process.exit(1);
  }
}

function buildAttributeCommand(attribute, databaseId, collectionId) {
  // For enum attributes, use the specific enum command
  if (attribute.enum) {
    let command = `appwrite databases create-enum-attribute --database-id ${databaseId} --collection-id ${collectionId} --key ${attribute.key}`;

    if (attribute.required !== undefined) {
      command += ` --required ${attribute.required}`;
    }

    if (attribute.default !== undefined) {
      command += ` --xdefault ${attribute.default}`;
    }

    // Add enum elements
    command += ` --elements ${attribute.enum.join(" ")}`;

    return command;
  }

  // Handle object attributes as string attributes (JSON serialized)
  if (attribute.type === "object") {
    console.log(
      `📝 Creating object attribute ${attribute.key} as string (JSON serialized)`
    );
    let command = `appwrite databases create-string-attribute --database-id ${databaseId} --collection-id ${collectionId} --key ${attribute.key}`;

    if (attribute.required !== undefined) {
      command += ` --required ${attribute.required}`;
    }

    // Use a smaller size for JSON objects to avoid collection limits
    command += ` --size 2000`;

    return command;
  }

  // For regular attributes
  let command = `appwrite databases create-${attribute.type}-attribute --database-id ${databaseId} --collection-id ${collectionId} --key ${attribute.key}`;

  if (attribute.required !== undefined) {
    command += ` --required ${attribute.required}`;
  }

  // Always include size for string attributes
  if (attribute.type === "string") {
    command += ` --size ${attribute.size || 255}`;
  }

  // Only set default value if attribute is not required
  if (attribute.default !== undefined && !attribute.required) {
    command += ` --xdefault ${attribute.default}`;
  }

  return command;
}

function buildIndexCommand(index, databaseId, collectionId) {
  return `appwrite databases create-index --database-id ${databaseId} --collection-id ${collectionId} --key ${index.key} --type ${index.type} --attributes ${index.attributes.join(",")}`;
}

setupDatabase();
