export interface GroupMember {
  memberNo: number;
  nickname: string;
  email: string;
  groupRole: "SUPER" | "SUB" | "MEMBER";
  position: string;
  profileImageUrl?: string;
}

export interface MyGroupResponse {
  groupNo: number;
  groupName: string;
  groupCode: string;
  groupRole: "SUPER" | "SUB" | "MEMBER";
  position: string;
  members: GroupMember[];
}

export type GroupVisibility = "PUBLIC_OPEN" | "PUBLIC_APPROVAL" | "PRIVATE";

/** 공개 그룹 탐색 목록의 항목 */
export interface PublicGroup {
  groupNo: number;
  groupName: string;
  description: string | null;
  visibility: GroupVisibility;
  memberCount: number;
  /** 내가 이미 가입한 그룹인지 */
  joined: boolean;
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
