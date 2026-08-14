import { latLngToGrid } from "./weather";

describe("latLngToGrid", () => {
  test("서울 좌표는 기상청 격자 (60, 127)로 변환된다", () => {
    // ViewModeToggle.tsx LOCATIONS의 서울 좌표와 동일해야 함
    expect(latLngToGrid(37.5665, 126.978)).toEqual({ nx: 60, ny: 127 });
  });

  test("부산 좌표는 기상청 격자 (98, 76)로 변환된다", () => {
    expect(latLngToGrid(35.1796, 129.0756)).toEqual({ nx: 98, ny: 76 });
  });
});
