export type GroupRole = "SUPER" | "SUB" | "MEMBER";

export type GroupVisibility = "PUBLIC_OPEN" | "PUBLIC_APPROVAL" | "PRIVATE";

export interface GroupMember {
  memberNo: number;
  nickname: string;
  email: string;
  message: string | null;
  groupRole: GroupRole;
  position: string;
  profileImageUrl?: string;
}

export interface MyGroupResponse {
  groupNo: number;
  groupName: string;
  groupCode: string;
  groupRole: GroupRole;
  position: string;
  visibility: GroupVisibility;
  description: string | null;
  profileImageUrl?: string;
  members: GroupMember[];
}

export interface PublicGroup {
  groupNo: number;
  groupName: string;
  description: string | null;
  visibility: GroupVisibility;
  memberCount: number;
  joined: boolean;
  pending: boolean;
  profileImageUrl?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface JoinRequest {
  requestNo: number;
  memberNo: number;
  nickname: string;
  email: string;
  message: string | null;
  profileImageUrl?: string;
  createdAt: string;
}

export type JoinRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface MemberPresence {
  memberNo: number;
  online: boolean;
  lastSeenAt: string | null;
}

export const roleOf = (role?: GroupRole) => ({
  owner: role === "SUPER",
  manager: role === "SUPER" || role === "SUB",
});
