export interface GroupMember {
  memberNo: number;
  nickname: string;
  email: string;
  groupRole: "SUPER" | "SUB" | "MEMBER";
  position: string;
}

export interface MyGroupResponse {
  groupNo: number;
  groupName: string;
  groupCode: string;
  groupRole: "SUPER" | "SUB" | "MEMBER";
  position: string;
  members: GroupMember[];
}

export interface GroupMemberResponse {
  memberNo: number;
  nickname: string;
  email: string;
  groupRole: "SUPER" | "SUB" | "MEMBER";
  position: string;
}
