import { test } from "@playwright/test";

// 레이아웃 좌표를 눈으로 확인하려고 만든 디버그용 스크립트다.
// 단언이 없고 로그인된 계정이 필요하므로, 자격증명이 없으면 건너뛴다.
const EMAIL = process.env.E2E_EMAIL ?? "";
const PASSWORD = process.env.E2E_PASSWORD ?? "";

for (const width of [320, 390]) {
  test(`${width}px에서 그룹 스위처 위치`, async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, "E2E_EMAIL / E2E_PASSWORD 환경변수가 필요합니다.");

    await page.setViewportSize({ width, height: 800 });
    await page.goto("/login");
    await page.getByPlaceholder("이메일").fill(process.env.E2E_EMAIL ?? "");
    await page.getByPlaceholder("비밀번호").fill(process.env.E2E_PASSWORD ?? "");
    await page.getByRole("button", { name: "로그인" }).click();
    await page.waitForTimeout(4000);

    await page.goto("/schedule");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "GROUP Schedule" }).click();
    await page.waitForTimeout(1500);

    const tab = await page
      .getByRole("button", { name: "MY Schedule" })
      .boundingBox();

    const sw = await page
      .locator('[aria-label="그룹 전환"]')
      .first()
      .boundingBox()
      .catch(() => null);

    console.log(`--- ${width}px ---`);
    console.log("MY 탭:", JSON.stringify(tab));
    console.log("스위처:", JSON.stringify(sw));

    if (sw) {
      console.log(
        "스위처 오른쪽 끝:",
        Math.round(sw.x + sw.width),
        "| 화면 밖?",
        sw.x + sw.width > width,
      );
    }
  });
}
