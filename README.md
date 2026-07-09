# 정처기 실기 모바일 웹 (PWA)

정보처리기사 실기 **코드 출력값 문제풀이 + 오답노트**를 폰 브라우저에서 쓰는 반응형 웹앱.
MyApp(데스크톱)의 정처기 실기 기능을 모바일용으로 새로 만든 것.

- 백엔드·DB **불필요** — 문제는 `questions.js`(362문항, C 124·Java 110·Python 128)에 임베드
- 오답노트는 브라우저 **localStorage** 에 저장 (폰마다 로컬 보관)
- **PWA** — 홈 화면에 추가하면 앱처럼 실행, 서비스워커로 **오프라인** 동작

## 실행 (PC에서 서버 켜기)

```
run.bat 더블클릭
```
- 콘솔에 표시되는 `http://<PC-IP>:8000` 주소를 **같은 와이파이의 폰 브라우저**에 입력
- PC 자신에서 확인하려면 `http://localhost:8000`
- 종료: 콘솔에서 Ctrl+C

> 폰이 접속 안 되면 PC 방화벽에서 8000 포트(또는 python) 인바운드를 허용하세요.

## 폰에서 앱처럼 쓰기 (PWA 설치)
- 안드로이드 Chrome: 메뉴 → **홈 화면에 추가**
- iOS Safari: 공유 → **홈 화면에 추가**
- 한 번 열어두면 오프라인에서도 실행됨(문제·오답노트 로컬 보관)

## 문제 데이터 갱신
데스크톱 MyApp의 `data/study_questions.json` 이 바뀌면 아래로 `questions.js` 재생성:
```
python -c "import json,io; d=json.load(open(r'..\myapp\data\study_questions.json',encoding='utf-8'))['questions']; io.open('questions.js','w',encoding='utf-8').write('window.QUESTIONS = '+json.dumps(d,ensure_ascii=False)+';')"
```

## 파일
- `index.html` / `style.css` / `app.js` — 앱 본체(화면 전환·퀴즈 엔진)
- `questions.js` — 문제 은행(임베드)
- `manifest.webmanifest` / `icon.svg` / `sw.js` — PWA(설치·오프라인)
- `run.bat` — 정적 서버 실행
