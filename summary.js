/* 정처기 실기 핵심요약 (시험 직전 참고용) — 고빈출 순 정리 */
window.SUMMARY_HTML = `
<p class="sum-intro">시험 직전 훑기용. 배점 큰 <b>①프로그래밍 ②SQL</b>부터 보세요. 항목을 눌러 펼치세요.</p>

<details open><summary>① 프로그래밍 언어 (C·Java·Python) — 최다 배점 🔥</summary>
<div class="sum-body">
<b>■ 공통 연산</b>
<ul>
<li><b>정수 나눗셈/몫/나머지</b>: C·Java <code>7/2=3</code>, <code>7%2=1</code> / Python <code>7//2=3</code>, <code>7/2=3.5</code>, <code>7%2=1</code>, 거듭제곱 <code>2**10=1024</code></li>
<li><b>증감</b>: <code>i++</code>(후위: 쓰고 증가), <code>++i</code>(전위: 증가 후 씀)</li>
<li><b>비트</b>: <code>&</code>AND <code>|</code>OR <code>^</code>XOR <code>~</code>NOT <code>&lt;&lt;</code>왼쪽(×2) <code>&gt;&gt;</code>오른쪽(÷2)</li>
<li><b>진법 출력(C)</b>: <code>%d</code>10진 <code>%o</code>8진 <code>%x</code>16진 <code>%c</code>문자 <code>%f</code>실수</li>
<li>삼항: <code>조건 ? 참 : 거짓</code></li>
</ul>
<b>■ C언어</b>
<ul>
<li><b>포인터</b>: <code>*p</code>=값, <code>&a</code>=주소, <code>arr[i] == *(arr+i)</code></li>
<li>구조체 포인터 멤버: <code>p-&gt;x</code> (== <code>(*p).x</code>)</li>
<li>문자열: char 배열, <code>'A'==65</code>, <code>'a'==97</code>, <code>'0'==48</code></li>
<li>배열 전달=주소전달(함수 안 수정이 원본 반영), 값 전달은 복사</li>
<li>재귀: 종료조건 먼저 확인 → 호출 순서대로 손으로 스택 그리기</li>
</ul>
<b>■ Java</b>
<ul>
<li><b>오버라이딩</b>(재정의, 상속 관계, 이름·매개변수 같음, 동적바인딩) ↔ <b>오버로딩</b>(중복정의, 매개변수 다름)</li>
<li>접근제어자 넓→좁: <b>public &gt; protected &gt; default &gt; private</b></li>
<li><code>static</code>=클래스 공용, <code>final</code>=상수/재정의금지, <code>super</code>=부모</li>
<li>부모타입 참조 → 오버라이딩된 <b>자식 메서드 실행</b>(다형성)</li>
<li>배열 <code>arr.length</code>, 문자열 <code>str.length()</code>, <code>charAt()</code>, <code>substring()</code></li>
</ul>
<b>■ Python</b>
<ul>
<li><b>슬라이싱</b> <code>a[start:end:step]</code> (end 미포함), 음수 인덱스 <code>a[-1]</code>=마지막</li>
<li><code>a[::-1]</code>=역순, <code>a[1:4]</code>=인덱스1~3</li>
<li>리스트<code>[]</code> 튜플<code>()</code>불변 딕셔너리<code>{k:v}</code> 집합<code>set{}</code>(중복X)</li>
<li>문자열: <code>split()</code>, <code>join()</code>, <code>upper/lower()</code>, <code>replace()</code>, <code>find()</code></li>
<li><code>range(a,b,c)</code>=a~b-1, <code>for i in range</code>, <code>enumerate</code>, <code>zip</code></li>
<li>참/거짓 없는 값: <code>0, '', [], {}, None</code></li>
</ul>
</div></details>

<details><summary>② 데이터베이스 · SQL — 거의 매회 출제 🔥</summary>
<div class="sum-body">
<b>■ SQL 분류</b>
<ul>
<li><b>DDL</b>(정의): CREATE, ALTER, DROP, TRUNCATE</li>
<li><b>DML</b>(조작): SELECT, INSERT, UPDATE, DELETE</li>
<li><b>DCL</b>(제어): GRANT, REVOKE</li>
<li><b>TCL</b>(트랜잭션): COMMIT, ROLLBACK, SAVEPOINT</li>
</ul>
<b>■ SELECT 기본형/작성순서</b>
<pre>SELECT 컬럼 FROM 테이블
WHERE 조건
GROUP BY 컬럼 HAVING 그룹조건
ORDER BY 컬럼 [ASC|DESC];</pre>
<ul>
<li>집계: <code>COUNT, SUM, AVG, MAX, MIN</code> / <b>GROUP BY</b>와 함께</li>
<li><b>WHERE</b>=행 조건, <b>HAVING</b>=그룹(집계) 조건</li>
<li>JOIN: INNER(교집합), LEFT/RIGHT OUTER, <code>ON</code> 조인조건</li>
<li>패턴: <code>LIKE '김%'</code>(김으로 시작), <code>'_'</code>=한 글자</li>
<li>DELETE(행 삭제)와 <b>DROP</b>(테이블 삭제) 구분, <b>TRUNCATE</b>=전체행 삭제(구조 유지)</li>
</ul>
<b>■ 정규화 (이상현상 제거)</b>
<ul>
<li><b>1NF</b>: 모든 속성이 <b>원자값</b>(반복 제거)</li>
<li><b>2NF</b>: 1NF + <b>부분함수 종속 제거</b>(완전함수종속)</li>
<li><b>3NF</b>: 2NF + <b>이행함수 종속 제거</b></li>
<li><b>BCNF</b>: 3NF + <b>모든 결정자가 후보키</b></li>
<li>암기: 도부이결다조인(도메인→1NF, 부분→2NF, 이행→3NF, 결정자→BCNF...)</li>
<li>이상현상: <b>삽입/삭제/갱신</b> 이상</li>
</ul>
<b>■ 키 & 무결성</b>
<ul>
<li>슈퍼키(유일성O 최소성X), <b>후보키</b>(유일+최소), <b>기본키</b>(PK,NULL·중복X), 대체키, <b>외래키</b>(FK,참조)</li>
<li>무결성: <b>개체</b>(PK NULL·중복X) / <b>참조</b>(FK는 참조PK존재 or NULL) / <b>도메인</b>(속성값 범위)</li>
</ul>
<b>■ 트랜잭션 ACID</b>
<ul>
<li><b>원자성</b>(Atomicity, 전부 or 전무), <b>일관성</b>(Consistency), <b>격리성</b>(Isolation), <b>지속성</b>(Durability)</li>
</ul>
</div></details>

<details><summary>③ 소프트웨어 설계 (UML·디자인패턴·응집/결합)</summary>
<div class="sum-body">
<b>■ UML 관계</b>
<ul>
<li><b>연관</b>(실선), <b>집합 Aggregation</b>(빈 마름모◇, 부분이 독립), <b>합성 Composition</b>(채운 마름모◆, 생명주기 공유)</li>
<li><b>일반화</b>(상속, 빈 삼각형△), <b>의존</b>(점선 화살표), <b>실체화</b>(점선+빈삼각형, 인터페이스)</li>
</ul>
<b>■ UML 다이어그램</b>
<ul>
<li><b>구조</b>(정적): 클래스, 객체, 컴포넌트, 배치, 패키지</li>
<li><b>행위</b>(동적): 유스케이스, 시퀀스, 활동, 상태, 커뮤니케이션</li>
</ul>
<b>■ 디자인 패턴 (GoF 23)</b>
<ul>
<li><b>생성(5)</b>: 싱글턴, 팩토리메소드, 추상팩토리, 빌더, 프로토타입</li>
<li><b>구조(7)</b>: 어댑터, 브리지, 컴포지트, 데코레이터, 퍼사드, 플라이웨이트, 프록시</li>
<li><b>행위(11)</b>: 옵서버, 스트래티지, 커맨드, 상태, 템플릿메소드, 반복자, 책임연쇄, 중재자, 메멘토, 방문자, 인터프리터</li>
</ul>
<b>■ 응집도·결합도 (모듈 독립성)</b>
<ul>
<li><b>응집도 = 높을수록 좋음</b> (약→강): 우연 &lt; 논리 &lt; 시간 &lt; 절차 &lt; 통신 &lt; 순차 &lt; <b>기능</b></li>
<li><b>결합도 = 낮을수록 좋음</b> (약→강): <b>자료</b> &lt; 스탬프 &lt; 제어 &lt; 외부 &lt; 공통 &lt; 내용</li>
</ul>
<b>■ 아키텍처 패턴</b>: 계층형, MVC, 클라이언트-서버, 파이프-필터, 브로커, 마스터-슬레이브
</div></details>

<details><summary>④ 소프트웨어 개발 (자료구조·테스트)</summary>
<div class="sum-body">
<b>■ 자료구조</b>
<ul>
<li><b>스택</b> LIFO(후입선출), <b>큐</b> FIFO(선입선출)</li>
<li>트리 순회: <b>전위</b>(뿌리→좌→우), <b>중위</b>(좌→뿌리→우), <b>후위</b>(좌→우→뿌리)</li>
</ul>
<b>■ 테스트 기법</b>
<ul>
<li><b>화이트박스</b>(구조/내부 로직): 구문·조건·결정·조건결정·다중조건 커버리지, 기초경로검사</li>
<li><b>블랙박스</b>(명세/기능): <b>동등분할</b>, <b>경계값 분석</b>, 원인-효과, 오류예측, 비교검사</li>
</ul>
<b>■ 테스트 레벨</b>: 단위 → 통합 → 시스템 → 인수
<ul>
<li>통합: <b>하향식</b>(스텁 Stub 사용), <b>상향식</b>(드라이버 Driver 사용), 빅뱅, 샌드위치</li>
</ul>
<b>■ 형상관리</b>: 형상식별 → 형상통제(변경관리) → 형상감사 → 형상기록/보고 (버전관리 Git/SVN)
</div></details>

<details><summary>⑤ 정보시스템 구축관리 (보안·네트워크·신기술)</summary>
<div class="sum-body">
<b>■ OSI 7계층</b>(하→상): <b>물-데-네-전-세-표-응</b> (물리·데이터링크·네트워크·전송·세션·표현·응용)
<ul>
<li><b>TCP</b>: 연결형, 신뢰성, 순서보장 / <b>UDP</b>: 비연결, 빠름, 신뢰성X</li>
<li>라우팅: RIP(거리벡터·홉), OSPF(링크상태), BGP(AS간)</li>
</ul>
<b>■ 암호화</b>
<ul>
<li><b>대칭키</b>(비밀키, 빠름): DES, <b>AES</b>, SEED, ARIA, IDEA</li>
<li><b>비대칭키</b>(공개키): <b>RSA</b>, ECC, 디피-헬만 (키교환·전자서명)</li>
<li><b>해시</b>(단방향): MD5, SHA-256 (무결성)</li>
</ul>
<b>■ 접근통제</b>: <b>DAC</b>(임의,신원기반) / <b>MAC</b>(강제,등급기반) / <b>RBAC</b>(역할기반)
<br><b>■ 보안 3요소</b>: 기밀성·무결성·가용성
<b>■ 주요 공격</b>
<ul>
<li>웹: <b>SQL 인젝션</b>, <b>XSS</b>(스크립트 삽입), <b>CSRF</b></li>
<li>네트워크: DDoS, <b>스니핑</b>(도청), <b>스푸핑</b>(위장), SYN 플러딩, 스머프</li>
<li>기타: 랜섬웨어, <b>APT</b>(지능형지속위협), 제로데이, 피싱/파밍/스미싱</li>
</ul>
<b>■ 신기술 용어</b>
<ul>
<li>클라우드: <b>IaaS·PaaS·SaaS</b>, 도커/쿠버네티스</li>
<li>빅데이터: 하둡, 맵리듀스, 데이터마이닝, 3V(Volume·Velocity·Variety)</li>
<li>MSA(마이크로서비스), RESTful API, SDN/NFV, 블록체인, 디지털트윈</li>
</ul>
<b>■ 개발방법론·관리</b>
<ul>
<li>모델: 폭포수, 프로토타입, 나선형(위험분석), <b>애자일</b></li>
<li><b>스크럼</b>: 스프린트, 백로그, 번다운차트, 데일리스크럼</li>
<li><b>XP</b>: 페어프로그래밍, TDD, 리팩토링, 지속적통합</li>
<li>비용산정: <b>COCOMO</b>, 기능점수(FP) / 일정: PERT·CPM</li>
</ul>
</div></details>

<p class="sum-tip">💡 손코딩(C/Java/Python 출력)과 SQL은 <b>반드시 손으로 값 추적</b>. 용어 문제는 영문 약어까지 같이 외우면 부분점수 유리. 화이팅! 🔥</p>
`;
