# Taektris

![taektris_screenshot](https://user-images.githubusercontent.com/22310601/105666806-6b128c00-5f1d-11eb-8d22-147a2df43201.png)

React, Typescript를 이용한 테트리스

```
/Taektris  
├── /public                 # static 파일 저장 폴더  
│    ├── /asset             # 배경화면과 bgm이 담긴 폴더  
│    │    ├── /bg           # 배경화면 폴더  
│    │    └── /sounds       # bgm 폴더  
│    │  
│    └──  index.html  
│  
├── /src                    # 개발 폴더  
│    ├── /asset             # public/asset과 동일  
│    │    ├── /bg  
│    │    └── /sounds  
│    │  
│    ├── /component         # 컴포넌트 폴더  
│    │    ├── board.tsx     # 테트리스 맵의 기능에 관련한 컴포넌트  
│    │    ├── constant.tsx  # 키보드, 블록 색, 모양, 점수, 속도를 정의한 컴포넌트  
│    │    ├── piece.tsx     # 테트리스 블록을 그리는 컴포넌트  
│    │    └── map.tsx       # 테트리스 맵 컴포넌트
│    │  
│    ├── App.css            # 메인 css  
│    ├── App.tsx            # 메인 tsx  
│    ├── index.css  
│    └── index.tsx  
│  
├── package.json            # 패키지 파일  
├── tsconfig.json           # 타입스크립트 설정 파일  
└── README.md  
```

