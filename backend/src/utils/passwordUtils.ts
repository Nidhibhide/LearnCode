import { User } from "../models";
import bcrypt from "bcryptjs";

/**
 * Check if a password hash already exists in the database for any user with the same role
 * This prevents multiple users with the same role from using the same password
 * Also checks password history to catch previously used passwords
 */
export const isPasswordUsedByOtherUser = async (
  password: string,
  role: string,
): Promise<boolean> => {
  try {
    // Find any user with the same role that has a password
    const usersWithPassword = await User.find({
      role: role,
      password: { $exists: true, $ne: null },
    });

    for (const user of usersWithPassword) {
      if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return true;
        }
      }

      // Also check password history
      if (user.passwordHistory && user.passwordHistory.length > 0) {
        for (const oldPasswordHash of user.passwordHistory) {
          const isOldMatch = await bcrypt.compare(password, oldPasswordHash);
          if (isOldMatch) {
            return true;
          }
        }
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking password existence:", error);
    return false;
  }
};

/**
 * Check if a password has been used by the same user before (for change password)
 * Compares against current password and password history
 */
export const isOldPassword = async (
  userId: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    const user = await User.findById(userId);

    if (!user || !user.password) {
      return false;
    }

    // Check against current password
    const isCurrentPassword = await bcrypt.compare(newPassword, user.password);
    if (isCurrentPassword) {
      return true;
    }

    // Check against password history
    if (user.passwordHistory && user.passwordHistory.length > 0) {
      for (const oldPasswordHash of user.passwordHistory) {
        const isOldMatch = await bcrypt.compare(newPassword, oldPasswordHash);
        if (isOldMatch) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking old password:", error);
    return false;
  }
};

/**
 * Add current password to password history before changing
 * Keeps track of last 5 passwords to prevent reuse
 */
export const addToPasswordHistory = async (
  userId: string,
  currentPasswordHash: string,
): Promise<void> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return;
    }

    // Initialize passwordHistory if it doesn't exist
    if (!user.passwordHistory) {
      user.passwordHistory = [];
    }

    // Add current password to history
    user.passwordHistory.push(currentPasswordHash);

    // Keep only last 5 passwords in history
    if (user.passwordHistory.length > 5) {
      user.passwordHistory = user.passwordHistory.slice(-5);
    }

    await user.save();
  } catch (error) {
    console.error("Error adding to password history:", error);
  }
};
