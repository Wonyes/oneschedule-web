import MockAdapter from "axios-mock-adapter";
import api from "@/src/lib/api";
import { Get, Post, Patch, Put, Delete } from "./useMutations";

describe("useMutations 헬퍼", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  test("Get은 params를 쿼리스트링으로 보낸다", async () => {
    mock.onGet("/members/nickname-check").reply(200, { result: true });

    await Get({ url: "/members/nickname-check", params: { nickname: "wony" } });

    expect(mock.history.get[0].params).toEqual({ nickname: "wony" });
  });

  test("Post는 body와 params를 둘 다 보낸다", async () => {
    mock.onPost("/group/create").reply(200, { result: {} });

    await Post({
      url: "/group/create",
      params: { groupName: "우리집", position: "막내" },
    });

    expect(mock.history.post[0].params).toEqual({
      groupName: "우리집",
      position: "막내",
    });
  });

  test("Patch는 body와 params를 둘 다 보낸다", async () => {
    mock.onPatch(/\/group\/.+\/member\/.+/).reply(200, { result: {} });

    await Patch({
      url: "/group/1/member/2",
      body: null,
      params: { groupRole: "SUB", position: "팀장" },
    });

    expect(mock.history.patch[0].params).toEqual({
      groupRole: "SUB",
      position: "팀장",
    });
  });

  test("Put은 params를 무시하지 않고 그대로 보낸다 (회귀 방지)", async () => {
    mock.onPut(/\/group\/group-name\/.+/).reply(200, { result: {} });

    await Put({
      url: "/group/group-name/1",
      body: null,
      params: { groupName: "새이름" },
    });

    expect(mock.history.put[0].params).toEqual({ groupName: "새이름" });
  });

  test("Put은 params 없이도 body만으로 정상 동작한다", async () => {
    mock.onPut("/members/password").reply(200, { result: {} });

    await Put({
      url: "/members/password",
      body: { currentPassword: "a", newPassword: "b" },
    });

    expect(JSON.parse(mock.history.put[0].data)).toEqual({
      currentPassword: "a",
      newPassword: "b",
    });
  });

  test("Delete는 params를 쿼리스트링으로 보낸다", async () => {
    mock.onDelete("/group/leave").reply(200, { result: {} });

    await Delete({ url: "/group/leave", params: { groupNo: 26 } });

    expect(mock.history.delete[0].params).toEqual({ groupNo: 26 });
  });
});
