# PROJECT: ZERO-DAY — 서버 통합 실시간 랭킹

게임에는 Firebase Realtime Database 실시간 랭킹 클라이언트가 구현되어 있습니다. **Firebase 프로젝트를 만들고 웹 앱 설정을 입력하기 전까지 서버 연결은 활성화되지 않습니다.**

## 최초 연결 (프로젝트 관리자)

1. https://console.firebase.google.com/ 에서 Firebase 프로젝트를 만듭니다.
2. **빌드 > Realtime Database**에서 데이터베이스를 생성합니다. 지역을 선택하고 **잠금 모드**로 시작합니다. 표시된 **Database URL**을 복사합니다.
3. **빌드 > Authentication > Sign-in method**에서 **Anonymous(익명)** 로그인을 활성화합니다.
4. **프로젝트 설정 > 내 앱 > 웹 앱 등록**에서 Firebase Web App 설정 객체를 복사합니다.
5. GitHub 저장소 `js/firebase-config.js`의 `null`을 아래 공개 웹 앱 설정으로 바꿉니다. databaseURL은 2번의 실제 URL을 사용합니다.

```js
window.PZD_FIREBASE_CONFIG = {
  apiKey: "YOUR_PUBLIC_WEB_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_DATABASE_HOST.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_PUBLIC_WEB_APP_ID"
};
```

6. **Realtime Database > Rules**에 저장소 `database.rules.json`의 **전체 JSON**을 붙여 넣고 **게시**합니다. 모든 사용자 쓰기 허용 규칙은 사용하지 마세요.
7. GitHub Pages 게임을 열어 랭킹 화면에 **SERVER LIVE / 전체 기기 실시간 랭킹**이 나타나는지 확인합니다.
8. 서로 다른 두 기기에서 게임을 클리어하고 닉네임을 등록하여 Easy/Hard 기록이 모두 공유되는지 확인합니다.

## 동작 및 개인정보

- 온라인: Easy/Hard 서버 기록을 실시간 구독합니다. 종합/점수/시간/추적도 정렬은 같은 서버 기록에서 계산합니다.
- 오프라인: 해당 브라우저의 로컬 기록만 표시합니다. 신규 등록 기록은 로컬에 보존되고, 서버 연결이 복구되면 전송 대기열에서 재시도합니다.
- 기존 로컬 기록은 자동 업로드하지 않습니다. 개발자 QA 샘플과 수동 등록도 서버에 업로드하지 않습니다.
- 서버 공개 필드: 닉네임, 난이도, 점수, 소요 시간, 추적도, 등급, 날짜, 기록 ID, 서버 등록 시각.
- **하드모드 전화번호는 서버로 보내지 않습니다.** 전화번호는 등록한 기기의 로컬 저장소에만 남습니다. 다중 기기에서 연락처를 관리하려면 별도 비공개 관리자 전용 서버가 필요합니다.
- Firebase 웹 앱 API 키는 공개 식별자이지만, **Admin SDK 서비스 계정 키/비밀키는 저장소에 올리면 안 됩니다.**
- 익명 인증과 DB 규칙은 필드 제한 및 기존 기록 변경 방지용입니다. **브라우저가 보낸 점수가 실제 플레이 결과인지 서버에서 검증하지 못하므로 부정행위 방지 수단은 아닙니다.** 대규모 공개 대회에는 서버측 점수 검증, 요청 제한, App Check 등을 추가하세요.
- 현재는 전체 기록을 실시간으로 구독합니다. 기록이 많아지면 서버측 집계와 상위 N개 조회/페이지네이션으로 전환해야 비용을 통제할 수 있습니다.

## 오류 확인

- **서버 설정 필요:** `js/firebase-config.js`가 여전히 `null`입니다.
- **익명 인증 오류:** Firebase Authentication에서 Anonymous를 활성화하세요.
- **permission_denied:** Realtime Database의 Rules 게시 여부와 databaseURL 프로젝트 일치를 확인하세요.
- **오프라인:** 전시 기기가 인터넷에 연결되어야 다른 기기의 기록이 실시간으로 보입니다.
- GitHub Pages는 정적 사이트입니다. GitHub 저장소만으로 실시간 데이터베이스가 생성되지는 않습니다.
