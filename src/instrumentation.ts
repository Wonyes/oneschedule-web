/**
 * 서버 기준 시간대를 서울로 맞춘다.
 *
 * 서버가 UTC면 달력이 `isSameDay(date, new Date())`로 오늘을 칠할 때 서버는 UTC의
 * 오늘을, 브라우저는 KST의 오늘을 잡는다. 한국 시간 자정~오전 9시에는 두 날이 달라져
 * "오늘" 배지가 엉뚱한 칸에 찍히고, 서버와 클라이언트 HTML이 어긋나 React가 페이지를
 * 통째로 다시 그린다(#418). 한국에서만 쓰는 서비스라 서버 시계를 KST로 둔다.
 *
 * 이미 들어있는 TZ를 존중하면 안 된다. Vercel은 TZ를 예약 환경변수로 잡고 UTC를
 * 넣어두기 때문에, "비어 있을 때만 설정" 같은 조건을 걸면 정작 배포 환경에서 건너뛴다.
 * 대시보드에서 TZ를 덮어쓸 수도 없으므로 여기서 무조건 덮어쓴다.
 */
export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    process.env.TZ = "Asia/Seoul";
  }
}
