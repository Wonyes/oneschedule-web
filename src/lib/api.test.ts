/**
 * axios 인터셉터의 토큰 재발급 흐름 테스트.
 * 401 → /token-refresh 1회 호출 → 원요청 재시도가 핵심이고,
 * 동시에 여러 요청이 실패해도 재발급은 한 번만 나가야 한다.
 * 403은 진짜 권한 거부라 재발급을 타면 안 된다.
 */
import MockAdapter from "axios-mock-adapter";
import api from "./api";

describe("api 인터셉터 (토큰 재발급)", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    mock.restore();
    jest.restoreAllMocks();
  });

  test("401이면 토큰을 재발급하고 원래 요청을 재시도한다", async () => {
    let scheduleCallCount = 0;

    mock.onGet("/schedules").reply(() => {
      scheduleCallCount += 1;
      return scheduleCallCount === 1 ? [401] : [200, { result: ["ok"] }];
    });

    mock.onPost("/token-refresh").reply(200);

    const response = await api.get("/schedules");

    expect(response.status).toBe(200);
    expect(scheduleCallCount).toBe(2);
    expect(
      mock.history.post.filter((r) => r.url === "/token-refresh"),
    ).toHaveLength(1);
  });

  test("재발급 후에도 실패하면 재시도를 반복하지 않는다", async () => {
    let scheduleCallCount = 0;

    mock.onGet("/schedules").reply(() => {
      scheduleCallCount += 1;
      return [401];
    });

    mock.onPost("/token-refresh").reply(200);

    await expect(api.get("/schedules")).rejects.toBeDefined();

    // 최초 1회 + 재발급 후 재시도 1회. 무한 반복되면 안 된다.
    expect(scheduleCallCount).toBe(2);
  });

  test("로그인 실패(401)는 재발급 흐름을 타지 않는다", async () => {
    mock.onPost("/members/login").reply(401);
    mock.onPost("/token-refresh").reply(200);

    await expect(api.post("/members/login")).rejects.toBeDefined();

    expect(
      mock.history.post.filter((r) => r.url === "/token-refresh"),
    ).toHaveLength(0);
  });

  test("재발급 자체가 실패하면 그대로 에러를 던진다", async () => {
    mock.onGet("/schedules").reply(401);
    mock.onPost("/token-refresh").reply(401);

    await expect(api.get("/schedules")).rejects.toBeDefined();
  });

  test("401이 아닌 에러는 재발급 없이 그대로 전달된다", async () => {
    mock.onGet("/schedules").reply(500);
    mock.onPost("/token-refresh").reply(200);

    await expect(api.get("/schedules")).rejects.toBeDefined();
    expect(
      mock.history.post.filter((r) => r.url === "/token-refresh"),
    ).toHaveLength(0);
  });

  // 서버는 인증 실패를 전부 401로 내려준다. 403은 "그룹 관리 권한 없음" 같은
  // 진짜 권한 거부라, 재발급/재시도로 삼켜버리면 오류 메시지가 사라진다.
  test("403은 재발급을 타지 않고 권한 오류를 그대로 올려보낸다", async () => {
    let scheduleCallCount = 0;

    mock.onGet("/schedules").reply(() => {
      scheduleCallCount += 1;
      return [
        403,
        {
          success: false,
          code: -501,
          message: "일정에 접근할 권한이 없습니다.",
          result: null,
        },
      ];
    });
    mock.onPost("/token-refresh").reply(200);

    await expect(api.get("/schedules")).rejects.toMatchObject({
      response: { status: 403 },
    });

    expect(scheduleCallCount).toBe(1);
    expect(
      mock.history.post.filter((r) => r.url === "/token-refresh"),
    ).toHaveLength(0);
  });
});
