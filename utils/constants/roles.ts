import { AffiliateRole } from "../../models/Affiliate";

// Role name constants for display
export const ROLE_NAMES = {
  [AffiliateRole.ADMIN]: 'Admin',
  [AffiliateRole.MANAGER]: 'Manager',
  [AffiliateRole.AFFILIATE]: 'Affiliate',
  [AffiliateRole.COMMUNITY_HEAD]: 'Community Head',
};

// Default tags for roles
export const ROLE_TAGS = {
  [AffiliateRole.ADMIN]: 'admin',
  [AffiliateRole.MANAGER]: 'manager',
  [AffiliateRole.AFFILIATE]: 'affiliate',
  [AffiliateRole.COMMUNITY_HEAD]: 'community',
};

// Gets the display name for a role
export const getRoleName = (role: AffiliateRole): string => {
  return ROLE_NAMES[role] || 'Affiliate';
};

// Gets the default tag for a role
export const getDefaultTag = (role: AffiliateRole): string | null => {
  return ROLE_TAGS[role] || null;
}; 