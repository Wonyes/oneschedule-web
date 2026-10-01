import { test, expect } from "@playwright/test";

/**
 * 회원가입 직후 로그인 화면으로 넘어올 때(?welcome=1) 다음 단계 안내가 보이는지 확인한다.
 * 실제 가입은 백엔드에 계정을 만들게 되므로, 넘어온 이후 화면만 검증한다.
 */
test.describe("회원가입 후 안내", () => {
  test("welcome 파라미터가 있으면 가입 완료 안내가 보인다", async ({ page }) => {
    await page.goto("/login?welcome=1");

    await expect(page.getByText("가입 완료")).toBeVisible();
    await expect(
      page.getByText("로그인하면 그룹 참여와 첫 일정 등록을 안내해드려요."),
    ).toBeVisible();
    await expect(page.getByText("계정이 만들어졌어요.")).toBeVisible();
  });

  test("일반 진입에서는 안내가 보이지 않는다", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("Welcome")).toBeVisible();
    await expect(page.getByText("가입 완료")).toHaveCount(0);
  });

  test("회원가입 화면에서 로그인 화면으로 이동할 수 있다", async ({ page }) => {
    await page.goto("/login");

    await page.getByText("회원가입").click();

    await expect(page).toHaveURL(/\/sign/);
    // getByText는 Next의 라우트 안내용 요소(#__next-route-announcer__)까지 잡는다
    await expect(
      page.getByRole("heading", { name: "회원정보 입력" }),
    ).toBeVisible();
  });
});
