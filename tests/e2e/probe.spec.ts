import { test } from "@playwright/test";

for (const width of [320, 390]) {
  test(`${width}px에서 그룹 스위처 위치`, async ({ page }) => {
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
