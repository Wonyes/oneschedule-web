import { test, expect } from "@playwright/test";

test("로그인", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.getByPlaceholder("이메일").fill("test@test.com");
  await page.getByPlaceholder("비밀번호").fill("1234");

  await page
    .getByRole("button", {
      name: "로그인",
    })
    .click();

  await expect(page).toHaveURL(/dashboard/);
});
