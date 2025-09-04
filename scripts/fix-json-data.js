const { execSync } = require("child_process");
const fs = require("fs");

// Read the configuration
const config = JSON.parse(fs.readFileSync("./appwrite.json", "utf8"));

function fixJsonString(jsonString) {
  if (!jsonString || typeof jsonString !== "string") {
    return jsonString;
  }

  try {
    // First try to parse as-is
    const parsed = JSON.parse(jsonString);
    // Ensure numeric values and re-stringify
    return JSON.stringify(ensureNumericValues(parsed));
  } catch (error) {
    // If that fails, try to fix common issues like single quotes
    let fixedString = jsonString
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Add quotes around unquoted keys
      .replace(/:\s*([^",\{\}\[\]]+)([,}\]])/g, ':"$1"$2'); // Add quotes around unquoted string values

    try {
      const parsed = JSON.parse(fixedString);
      // Ensure numeric values and re-stringify
      return JSON.stringify(ensureNumericValues(parsed));
    } catch (secondError) {
      console.warn("Failed to fix JSON string:", jsonString);
      return jsonString; // Return original if we can't fix it
    }
  }
}

// Helper function to ensure reaction values are numbers
function ensureNumericValues(obj) {
  if (typeof obj === "object" && obj !== null) {
    const result = { ...obj };
    // Check for common reaction fields and ensure they're numbers
    const reactionFields = ["hugs", "me_too", "wisdom", "helpful", "heart"];
    reactionFields.forEach((field) => {
      if (field in result) {
        result[field] = Number(result[field]) || 0;
      }
    });
    return result;
  }
  return obj;
}

async function fixJsonData() {
  try {
    console.log("🔧 Fixing JSON data in database...");

    // Get all regrets
    console.log("📝 Processing regrets collection...");
    const regretsResponse = JSON.parse(
      execSync(
        `appwrite databases list-documents --database-id ${config.databaseId} --collection-id regrets --json`,
        { encoding: "utf8" }
      )
    );
    const regrets = regretsResponse.documents;

    let updatedCount = 0;

    for (const regret of regrets) {
      let needsUpdate = false;
      const updateData = {};

      // Fix reactions field
      if (regret.reactions) {
        const fixedReactions = fixJsonString(regret.reactions);
        if (fixedReactions !== regret.reactions) {
          updateData.reactions = fixedReactions;
          needsUpdate = true;
          console.log(`✅ Fixed reactions for regret ${regret.$id}`);
        }
      }

      // Fix sliding_doors field
      if (regret.sliding_doors) {
        const fixedSlidingDoors = fixJsonString(regret.sliding_doors);
        if (fixedSlidingDoors !== regret.sliding_doors) {
          updateData.sliding_doors = fixedSlidingDoors;
          needsUpdate = true;
          console.log(`✅ Fixed sliding_doors for regret ${regret.$id}`);
        }
      }

      // Update the document if needed
      if (needsUpdate) {
        try {
          const updateDataString = JSON.stringify(updateData).replace(
            /"/g,
            '\\"'
          );
          execSync(
            `appwrite databases update-document --database-id ${config.databaseId} --collection-id regrets --document-id ${regret.$id} --data '${updateDataString}'`,
            { stdio: "inherit" }
          );
          updatedCount++;
        } catch (error) {
          console.error(
            `❌ Failed to update regret ${regret.$id}:`,
            error.message
          );
        }
      }
    }

    // Get all comments
    console.log("💬 Processing comments collection...");
    const commentsResponse = JSON.parse(
      execSync(
        `appwrite databases list-documents --database-id ${config.databaseId} --collection-id comments --json`,
        { encoding: "utf8" }
      )
    );
    const comments = commentsResponse.documents;

    for (const comment of comments) {
      let needsUpdate = false;
      const updateData = {};

      // Fix reactions field
      if (comment.reactions) {
        const fixedReactions = fixJsonString(comment.reactions);
        if (fixedReactions !== comment.reactions) {
          updateData.reactions = fixedReactions;
          needsUpdate = true;
          console.log(`✅ Fixed reactions for comment ${comment.$id}`);
        }
      }

      // Update the document if needed
      if (needsUpdate) {
        try {
          const updateDataString = JSON.stringify(updateData).replace(
            /"/g,
            '\\"'
          );
          execSync(
            `appwrite databases update-document --database-id ${config.databaseId} --collection-id comments --document-id ${comment.$id} --data '${updateDataString}'`,
            { stdio: "inherit" }
          );
          updatedCount++;
        } catch (error) {
          console.error(
            `❌ Failed to update comment ${comment.$id}:`,
            error.message
          );
        }
      }
    }

    console.log(
      `✅ JSON data fix completed! Updated ${updatedCount} documents.`
    );
  } catch (error) {
    console.error("❌ Error fixing JSON data:", error.message);
    process.exit(1);
  }
}

fixJsonData();
