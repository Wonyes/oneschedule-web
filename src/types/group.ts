export interface GroupMember {
  memberNo: number;
  nickname: string;
  email: string;
  groupRole: "SUPER" | "SUB" | "GENERAL";
  position: string;
}

export interface MyGroupResponse {
  groupNo: number;
  groupName: string;
  groupCode: string;
  groupRole: "SUPER" | "SUB" | "GENERAL";
  position: string;
  members: GroupMember[];
}
