import { test, expect } from "@playwright/test";

/**
 * 로그인 전에는 백엔드를 호출하지 않아야 한다.
 * 훅은 early return보다 먼저 실행되므로, 화면에 안 보이는 컴포넌트가
 * 조용히 /members/info 같은 요청을 흘리기 쉽다. 그걸 막는 테스트.
 */
const GUEST_ROUTES = ["/", "/login", "/sign"];

test.describe("비로그인 상태의 네트워크", () => {
  for (const route of GUEST_ROUTES) {
    test(`${route} 에서 백엔드를 호출하지 않는다`, async ({ page }) => {
      const calls: string[] = [];

      page.on("request", (req) => {
        const url = req.url();
        if (url.includes("/v1/api")) {
          calls.push(`${req.method()} ${url.replace(/^https?:\/\/[^/]+/, "")}`);
        }
      });

      await page.goto(route);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(800);

      expect(calls, `${route} 에서 예기치 않은 API 호출: ${calls.join(", ")}`)
        .toHaveLength(0);
    });
  }
});
