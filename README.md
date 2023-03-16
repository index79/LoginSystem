# snsLoginForExpress

이 프로젝트의 목적은 로그인 시스템(로컬 및 SNS)을 구축하는 것입니다.

원래는 Firebase 기반으로 하려다가 로컬에서 password 나 passwordHash가

리턴되어지지 않아서 bcrypt compare의 사용이 불가능함을 깨달고 MongoDB에

저장하게끔 하였습니다. Cookie 대신 Session을 사용한 이유는 이상하게

제 브라우저에서 제대로 인식 못해서, 한번 리로드를 해야만 /api로 진입이 되어

Session 으로 대신하였습니다. 세션은 서버에 무리가 가지만 잘 관리하면

안전하다 생각됩니다. 매일 만료된 세션은 정리되어지게 하였습니다. JWT 를

통하여 accessToken 과 refreshToken를 세션에 저장하며 5분, 7일 로

만료됩니다. accessToken 은 만료되면 refreshToken 을 확인하여 재발급됩니다.

한번 발급 받은 토큰은 서버가 로드 밸런싱이 되어 있는 서버에서 로그인이

가능하기에 사용하였습니다.

여기에 사용된 소스는 chatgpt 기반으로 검색하여 modify 작업을 통해 구현되었습니다.

---

사용된 모듈 리스트입니다.

express: Node.js용 인기 있는 웹 프레임워크로, 웹 애플리케이션을 구축하는 데 필요한 도구와 규약을 제공합니다.

initializePassport: Passport.js 인증 라이브러리를 사용자가 지정한 인증 전략과 설정으로 초기화하는 사용자 정의 모듈입니다.

morgan: HTTP 요청과 응답을 로깅하는 미들웨어입니다.

cookie-parser: HTTP 요청 쿠키를 구문 분석하여 req.cookies에 사용할 수 있도록 하는 미들웨어입니다.

express-session: 세션 관리 기능을 제공하는 미들웨어로, 세션 데이터를 서버에 저장하고 세션 ID 및 쿠키를 관리합니다.

connect-mongo: express-session용 MongoDB 세션 저장소로, 세션 데이터를 MongoDB 데이터베이스에 저장할 수 있도록 합니다.

mongoose: Node.js용 인기 있는 MongoDB 객체 모델링 라이브러리로, MongoDB 데이터베이스에 연결하고 데이터의 스키마와 모델을 정의합니다.

authRouter: 사용자 인증을 위한 라우트를 정의하는 사용자 정의 모듈입니다. 로그인 및 등록과 같은 작업이 이루어집니다.

apiRouter: 인증된 사용자만 액세스할 수 있는 보호된 API를 정의하는 사용자 정의 모듈입니다.

dotenv: .env 파일에서 환경 변수를 로드하는 모듈로, 데이터베이스 자격 증명 및 API 키와 같은 민감한 정보를 저장하는 데 사용됩니다.

SessionCleanup: MongoDB 데이터베이스에서 만료된 세션을 정리하는 함수를 정의하는 사용자 정의 모듈입니다. node-cron 모듈을 사용하여 매일 예약된 시간에 실행됩니다.
