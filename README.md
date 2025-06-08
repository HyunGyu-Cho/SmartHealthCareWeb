# Smart Healthcare System

스마트 헬스케어 시스템은 인바디(InBody) 데이터를 활용하여 사용자의 건강 상태를 분석하고 예측하는 종합적인 헬스케어 솔루션입니다.

> ⚠️ **현재 개발 진행 중인 프로젝트입니다**  
> 이 프로젝트는 아직 완성되지 않은 상태이며, 일부 기능은 개발 중이거나 계획 단계에 있습니다.

## 프로젝트 소개 자료
- 본 README.md 파일에서는 프로젝트의 구조 및 간단 소개를 진행하고, 자세한 설명은 아래 ppt 파일에서 확인해보실 수 있습니다.
- 또한, 시연 영상을 통해 대략적인 프로그램의 동작과정을 이해할 수 있습니다.
- [프로젝트 발표 PPT](docs/Smart_Healthcare_System_Presentation.pptx)
- [시연 영상](https://youtu.be/s7_HekvGIO0)
    - 웹 홈페이지 영상 출처: Video by [freefitnessmedia] from Pixabay
### 완성된 기능
- ✅ 인바디 데이터 입력 및 저장
- ✅ 기본적인 신체 분석 결과 표시
- ✅ 개인화된 운동 추천 시스템
- ✅ 개인화된 식단 추천 시스템
- ✅ AI 모델 기반 신체 유형 분류

### 개발 중인 기능
- 🔄 기본적인 사용자 인증 시스템 (로그인/회원가입)
- 🔄 커뮤니티 게시판 CRUD 기능
- 🔄 평점 게시판 CRUD 기능
- 🔄 캘린더 기능
- 🔄 상세한 건강 리포트 생성

### 계획된 기능
- 📋 인바디 데이터 입력
- 📋 입력받은 인바디 데이터 기반 체형분석
- 📋 AI 기반 맞춤형 운동 / 식단 추천 데이터 생성
- 📋 추천된 상세 운동/식단 정보 제공
- 📋 건강 데이터 시각화 대시보드
- 📋 캘린더 기능 통해 실행현황 분석


## 프로젝트 구조

```
.
├── frontend/                           
│   └── Smart-Healthcare-main/
│       ├── src/                       
│       │   ├── pages/               
│       │   │   ├── DietDetailPage.jsx
│       │   │   ├── WorkoutDetailPage.jsx
│       │   │   ├── RecommendedDietListPage.jsx
│       │   │   ├── RecommendedWorkoutListPage.jsx
│       │   │   ├── BodyAnalysisPage.jsx
│       │   │   ├── CalendarPage.jsx
│       │   │   ├── SurveyPage.jsx
│       │   │   ├── InbodyInputPage.jsx
│       │   │   ├── EvaluationPage.jsx
│       │   │   ├── CommunityPage.jsx
│       │   │   ├── AboutPage.jsx
│       │   │   ├── MainPage.jsx
│       │   │   ├── LoginPage.jsx
│       │   │   └── SignupPage.jsx
│       │   ├── components/           
│       │   │   ├── Layout.jsx
│       │   │   ├── Header.jsx
│       │   │   ├── HeroWithBg.jsx
│       │   │   ├── SectionWithWave.jsx
│       │   │   ├── Button.jsx
│       │   │   ├── StarRating.jsx
│       │   │   ├── EvaluationList.jsx
│       │   │   ├── EvaluationForm.jsx
│       │   │   ├── InputField.jsx
│       │   │   ├── Card.jsx
│       │   │   ├── Navigation.jsx
│       │   │   ├── PasswordScreen.jsx
│       │   │   ├── BackButton.jsx
│       │   │   ├── Footer.jsx
│       │   │   └── Hero.jsx
│       │   ├── api/                  
│       │   ├── App.jsx              
│       │   ├── index.js             
│       │   ├── App.test.js        
│       │   ├── index.css           
│       │   ├── logo.svg             
│       │   ├── reportWebVitals.js   
│       │   ├── setupTests.js        
│       │   └── App.css              
│       ├── public/                   
│       ├── node_modules/              
│       ├── package.json              
│       ├── package-lock.json        
│       ├── tailwind.config.js      
│       ├── postcss.config.js         
│       └── .gitignore               
├── backend/                          
│   └── smart-healthcare/
│       ├── src/                      
│       │   ├── main/               
│       │   │   ├── java/          
│       │   │   │   └── com/example/smart_healthcare/
│       │   │   │       ├── service/       
│       │   │   │       │   ├── ChatGptService.java
│       │   │   │       │   ├── UserHistoryService.java
│       │   │   │       │   ├── BodyClassificationService.java
│       │   │   │       │   ├── OrchestratorService.java
│       │   │   │       │   ├── ImageService.java
│       │   │   │       │   ├── FeatureService.java
│       │   │   │       │   ├── ValidationService.java
│       │   │   │       │   └── FoodNutritionService.java
│       │   │   │       ├── repository/     
│       │   │   │       │   ├── UserHistoryRepository.java
│       │   │   │       │   ├── UserRepository.java
│       │   │   │       │   ├── CommentRepository.java
│       │   │   │       │   ├── CommunityPostRepository.java
│       │   │   │       │   ├── RecommendationRepository.java
│       │   │   │       │   ├── SurveyRepository.java
│       │   │   │       │   ├── FoodImageCacheRepository.java
│       │   │   │       │   ├── FoodNutritionRepository.java
│       │   │   │       │   └── InbodyRecordRepository.java
│       │   │   │       ├── loader/         
│       │   │   │       │   └── FoodNutritionLoader.java
│       │   │   │       ├── entity/         
│       │   │   │       │   ├── UserHistory.java
│       │   │   │       │   ├── Comment.java
│       │   │   │       │   ├── CommunityPost.java
│       │   │   │       │   ├── Recommendation.java
│       │   │   │       │   ├── Survey.java
│       │   │   │       │   ├── User.java
│       │   │   │       │   ├── FoodImageCache.java
│       │   │   │       │   ├── FoodNutrition.java
│       │   │   │       │   ├── InbodyRecord.java
│       │   │   │       │   └── JsonAttributeConverter.java
│       │   │   │       ├── dto/            
│       │   │   │       │   ├── FoodDto.java
│       │   │   │       │   ├── WorkoutDto.java
│       │   │   │       │   ├── BodyTypeDto.java
│       │   │   │       │   ├── RecommendationDto.java
│       │   │   │       │   └── RecommendRequest.java
│       │   │   │       ├── controller/    
│       │   │   │       │   ├── UserHistoryController.java
│       │   │   │       │   ├── RecommendController.java
│       │   │   │       │   ├── CommunityController.java
│       │   │   │       │   ├── SurveyController.java
│       │   │   │       │   └── FeatureController.java
│       │   │   │       ├── config/         
│       │   │   │       ├── client/        
│       │   │   │       └── SmartHealthcareApplication.java
│       │   │   └── resources/      
│       │   └── test/               
│       ├── build/                   
│       ├── gradle/                  
│       ├── bin/                      
│       ├── build.gradle             
│       ├── settings.gradle          
│       ├── gradlew                
│       ├── gradlew.bat              
│       └── .gitignore               
│
└── AI_model/                       
    ├── app.py                       
    ├── train.py                     
    ├── test_api.py                 
    ├── process_cluster.py           
    ├── test.ipynb                   
    ├── requirements.txt            
    ├── mlp_classifier_sklearn.pkl  
    ├── preprocess_and_cluster.pkl  
    ├── label_encoder.pkl            
    └── data/                      
        ├── inbody_final_2_labeled.csv
        ├── inbody_final_labeled.csv
        └── inbody_full.csv
```

## 주요 기능

- 인바디 데이터 기반 현재 체형 분석
- 머신러닝/딥러닝을 통한 건강 상태 예측
- 사용자 친화적인 웹 인터페이스
- RESTful API를 통한 데이터 처리

## 기술 스택

### 프론트엔드
- React.js
- Tailwind CSS
- Node.js

### 백엔드
- Spring Boot
- RESTful API

### AI 모델
- MLP (Multi-Layer Perceptron) 분류기
- 데이터 전처리 및 클러스터링
- scikit-learn 기반 머신러닝

## 설치 및 실행

### 프론트엔드
```bash
cd frontend/Smart-Healthcare-main
npm install
npm start
```

### 백엔드
```bash
cd backend/smart-healthcare
./gradlew build
./gradlew bootRun
```

### AI 모델
```bash
cd AI_model
pip install -r requirements.txt
python app.py
```

## 데이터셋

프로젝트는 다음과 같은 인바디 데이터셋을 사용합니다:
- inbody_final_2_labeled.csv
- inbody_final_labeled.csv
- inbody_full.csv
