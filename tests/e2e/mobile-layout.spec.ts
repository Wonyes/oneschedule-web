import { test, expect, Page } from "@playwright/test";

const EMAIL = process.env.E2E_EMAIL ?? "";
const PASSWORD = process.env.E2E_PASSWORD ?? "";

// 실기기에서 가장 좁은 축에 해당하는 폭들
const WIDTHS = [320, 390];

const PROTECTED_ROUTES = ["/", "/schedule", "/group", "/profile"];

async function login(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("이메일").fill(EMAIL);
  await page.getByPlaceholder("비밀번호").fill(PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page).toHaveURL("/", { timeout: 15000 });
}

async function expectNoHorizontalOverflow(page: Page, route: string) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
    };
  });

  // 1px 정도의 반올림 오차는 허용한다
  expect(
    overflow.scrollWidth,
    `${route} 에서 가로 스크롤이 발생했습니다 (scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth})`,
  ).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

// 같은 테스트 계정으로 동시에 로그인하면 세션이 서로 밀려나므로 직렬로 실행한다
test.describe.configure({ mode: "serial" });

test.describe("모바일 폭 레이아웃", () => {
  for (const width of WIDTHS) {
    test(`${width}px에서 공개 페이지에 가로 오버플로가 없다`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });

      for (const route of ["/login", "/sign"]) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await expectNoHorizontalOverflow(page, route);
      }
    });

    test(`${width}px에서 로그인 후 주요 페이지에 가로 오버플로가 없다`, async ({
      page,
    }) => {
      test.skip(
        !EMAIL || !PASSWORD,
        "E2E_EMAIL / E2E_PASSWORD 환경변수가 필요합니다.",
      );

      await page.setViewportSize({ width, height: 844 });
      await login(page);

      for (const route of PROTECTED_ROUTES) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await expectNoHorizontalOverflow(page, route);
      }
    });
  }
});
