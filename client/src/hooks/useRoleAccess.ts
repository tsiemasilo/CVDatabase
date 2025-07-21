import { useAuth } from "./useAuth";

export type UserRole = 'admin' | 'manager' | 'user';

export interface RolePermissions {
  canAccessUserProfiles: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewAllCVs: boolean;
  canEditCVs: boolean;
  canDeleteCVs: boolean;
  canManagePositions: boolean;
  canManageQualifications: boolean;
  canManageTenders: boolean;
  canCaptureRecords: boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canAccessUserProfiles: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canViewAllCVs: true,
    canEditCVs: true,
    canDeleteCVs: true,
    canManagePositions: true,
    canManageQualifications: true,
    canManageTenders: true,
    canCaptureRecords: true,
  },
  manager: {
    canAccessUserProfiles: true,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewAllCVs: true,
    canEditCVs: true,
    canDeleteCVs: false,
    canManagePositions: true,
    canManageQualifications: true,
    canManageTenders: true,
    canCaptureRecords: true,
  },
  user: {
    canAccessUserProfiles: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewAllCVs: false,
    canEditCVs: false,
    canDeleteCVs: false,
    canManagePositions: false,
    canManageQualifications: false,
    canManageTenders: false,
    canCaptureRecords: true,
  },
};

export function useRoleAccess() {
  const { user } = useAuth();
  

  
  const userRole = user?.role as UserRole;
  const permissions = user && userRole && ROLE_PERMISSIONS[userRole] ? ROLE_PERMISSIONS[userRole] : {
    canAccessUserProfiles: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewAllCVs: false,
    canEditCVs: false,
    canDeleteCVs: false,
    canManagePositions: false,
    canManageQualifications: false,
    canManageTenders: false,
    canCaptureRecords: false,
  };

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  const canAccessTab = (tab: string): boolean => {
    switch (tab) {
      case "Landing page":
        return permissions.canViewAllCVs;
      case "Qualifications":
        return permissions.canManageQualifications;
      case "Positions | Roles":
        return permissions.canManagePositions;
      case "Tenders":
        return permissions.canManageTenders;
      case "Capture record":
        return permissions.canCaptureRecords;
      case "Access User Profiles":
        return permissions.canAccessUserProfiles;
      default:
        return false;
    }
  };

  return {
    permissions,
    hasPermission,
    canAccessTab,
    userRole: userRole || null,
  };
}