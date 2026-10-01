import { test, expect } from "@playwright/test";

const EMAIL = process.env.E2E_EMAIL ?? "";
const PASSWORD = process.env.E2E_PASSWORD ?? "";

test("로그인", async ({ page }) => {
  test.skip(
    !EMAIL || !PASSWORD,
    "E2E_EMAIL / E2E_PASSWORD 환경변수가 필요합니다.",
  );

  await page.goto("/login");

  await page.getByPlaceholder("이메일").fill(EMAIL);
  await page.getByPlaceholder("비밀번호").fill(PASSWORD);

  await page
    .getByRole("button", {
      name: "로그인",
    })
    .click();

  await expect(page).toHaveURL("/");
});
