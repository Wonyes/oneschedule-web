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
  members: GroupMember[];
}

/** 공개 그룹 탐색 목록의 항목 */
export interface PublicGroup {
  groupNo: number;
  groupName: string;
  description: string | null;
  visibility: GroupVisibility;
  memberCount: number;
  /** 내가 이미 가입한 그룹인지 */
  joined: boolean;
  pending: boolean;
}

/** 서버의 PageResponse<T> */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/** 승인제 그룹의 가입 신청 (관리자용) */
export interface JoinRequest {
  requestNo: number;
  memberNo: number;
  nickname: string;
  email: string;
  /** 가입 희망 메시지. 선택 입력이라 없을 수 있다. */
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
