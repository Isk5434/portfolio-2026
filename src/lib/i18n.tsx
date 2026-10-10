"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "ja" | "en";

export type WorkId =
  | "show-harness"
  | "jewelry"
  | "roleplay"
  | "physical-ai"
  | "llm-finetune"
  | "maro"
  | "portfolio";

export type WorkStatus = "done" | "ongoing" | "planned";

// Display order of the Works section; a project's number ("01"…) is derived from it.
export const workOrder: WorkId[] = [
  "show-harness",
  "jewelry",
  "roleplay",
  "physical-ai",
  "llm-finetune",
  "maro",
  "portfolio",
];
export const workNumber = (id: WorkId) =>
  String(workOrder.indexOf(id) + 1).padStart(2, "0");

export interface WorkCopy {
  title: string;
  cat: string;
  summary: string;
  problem: string;
  role: string[];
  result: string;
}

export interface Dictionary {
  nav: {
    links: {
      index: string;
      about: string;
      works: string;
      experience: string;
      achievements: string;
      contact: string;
    };
  };
  hero: {
    eyebrow: string;
    subtitle: string;
    scroll: string;
    basedIn: string;
    loading: string;
  };
  about: {
    eyebrow: string;
    bio: string[];
    index: [string, string][];
    approachHeading: string;
    approach: string[];
  };
  skills: {
    heading: string;
    note: string;
    related: string;
    groups: { k: string; items: string[]; works: WorkId[] }[];
    learning: { k: string; items: string[] };
  };
  works: {
    selected: string;
    featured: string;
    details: string;
    privateNote: string;
    labels: {
      problem: string;
      role: string;
      tech: string;
      result: string;
      links: string;
    };
    status: Record<WorkStatus, string>;
    items: Record<WorkId, WorkCopy>;
  };
  experience: {
    heading: string;
    subtitle: string;
    related: string;
    items: {
      period: string;
      org: string;
      role: string;
      summary: string;
      work?: WorkId;
    }[];
  };
  achievements: {
    heading: string;
    subtitle: string;
    groups: {
      label: string;
      items: { when: string; title: string; note?: string; image?: { src: string; alt: string } }[];
    }[];
  };
  contact: {
    eyebrow: string;
    note: string;
  };
}

// Hero scroll captions — short editorial statements, kept English in both
// locales (same treatment as the "Works" / "LET'S TALK" display headings).
export const heroCaptions = [
  { kicker: "01 — LLM", text: "Language at work." },
  { kicker: "02 — Web", text: "Built for real use." },
  { kicker: "03 — Physical AI", text: "From vision to motion." },
] as const;

// Marquee words shared by the loader bands and the Skills band.
export const marqueeDomains = ["LLM", "WEB APPS", "PHYSICAL AI", "ROBOTICS", "FINE-TUNING", "EVALUATION"];
export const marqueeTools = ["PYTHON", "TYPESCRIPT", "NEXT.JS", "PYTORCH", "ISAAC SIM", "SO-101"];

// Skill items are technology names, so they are shared by both locales.
const skillItems = {
  lang: ["Python", "TypeScript", "JavaScript", "SQL"],
  web: ["React", "Next.js", "FastAPI", "Express", "PostgreSQL", "Drizzle"],
  llm: ["OpenAI API", "Gemini API", "Dify", "RAG", "Qdrant", "Prompt Design", "LLM Evaluation"],
  ml: ["PyTorch", "Hugging Face Transformers", "PEFT", "LoRA", "SFT", "Logistic Regression", "SVM", "MediaPipe"],
  robotics: ["Isaac Sim / Isaac Lab", "SO-101", "UR3e", "LeRobot", "OpenPI", "ACT", "VLM / VLA", "Teleoperation", "Imitation Learning", "Reinforcement Learning", "Sim-to-Real"],
  infra: ["Git", "GitHub", "Docker", "AWS EC2", "Amazon S3", "Google Colab", "Hugging Face Hub", "vLLM", "Weights & Biases", "VS Code Remote SSH", "Streamlit"],
  learning: ["ROS 2", "rosbag2"],
};

// TODO(content): 未確認の項目（正式名称・年度・担当範囲・公開可否）は、
// 確認が取れるまでこの辞書に追加しない。確認リストはリポジトリ外で管理。
const dictionaries: Record<Locale, Dictionary> = {
  ja: {
    nav: {
      links: {
        index: "トップ",
        about: "プロフィール",
        works: "プロジェクト",
        experience: "経歴",
        achievements: "実績",
        contact: "連絡先",
      },
    },
    hero: {
      eyebrow: "AI / Full-Stack Engineer — 2026",
      subtitle:
        "石川 潮早（Usa Ishikawa）。LLM・Webアプリケーション・Physical AIの開発に取り組む大学生エンジニアです。",
      scroll: "スクロール",
      basedIn: "拠点 / 日本・東海",
      loading: "フレームを読み込み中",
    },
    about: {
      eyebrow: "プロフィール",
      bio: [
        "名古屋市立大学人文社会学部に在籍する大学2年生です。東京大学松尾・岩澤研究室の講座をきっかけにプログラミングや機械学習を学び、現在は複数の企業でAI・Webアプリケーション・ロボティクスの開発に取り組んでいます。",
        "LLMを活用した業務支援アプリケーションの開発から、モデルの追加学習・評価、ロボットアームを用いたPhysical AIの研究開発まで経験しています。現場の課題を理解し、必要な技術を学びながら、実装と検証を通じて解決につなげることを大切にしています。",
        "将来は、顧客や現場に近い立場で課題発見から開発・導入まで関わるForward Deployed Engineer（FDE）を目指しています。",
      ],
      index: [
        ["氏名", "石川 潮早（Usa Ishikawa）"],
        ["所属", "名古屋市立大学 人文社会学部"],
        ["学年", "2年（2029年3月 卒業予定）"],
        ["拠点", "日本・東海地方"],
        ["立場", "大学生／エンジニアインターン／個人事業主"],
        ["目標", "Forward Deployed Engineer"],
      ],
      approachHeading: "大切にしていること",
      approach: [
        "現場の要望を、画面・会話機能・判定機能などの具体的な機能に落とし込む。",
        "顧客との定例で、担当機能の説明・検証結果の報告・改善提案まで行う。",
        "モデルを動かすだけで終わらせず、比較評価と失敗分析に取り組む。",
        "Webアプリケーションとモデル学習の両方に、実務で関わる。",
        "外部OSSへの貢献を通じて、既存コードを読み解き、開発者と協働する。",
      ],
    },
    skills: {
      heading: "技術スタック",
      note: "利用・学習・検証の経験がある技術です。熟練度の一覧ではなく、関わったプロジェクトとあわせて記載しています。",
      related: "関連",
      groups: [
        { k: "言語", items: skillItems.lang, works: ["show-harness", "jewelry", "llm-finetune", "portfolio"] },
        { k: "Web・バックエンド", items: skillItems.web, works: ["jewelry", "maro", "portfolio"] },
        { k: "LLM・AIアプリケーション", items: skillItems.llm, works: ["jewelry", "roleplay", "llm-finetune"] },
        { k: "機械学習・深層学習", items: skillItems.ml, works: ["jewelry", "physical-ai", "llm-finetune"] },
        { k: "ロボティクス・Physical AI", items: skillItems.robotics, works: ["show-harness", "physical-ai"] },
        { k: "開発・学習基盤", items: skillItems.infra, works: ["show-harness", "physical-ai", "llm-finetune"] },
      ],
      learning: { k: "基礎学習中", items: skillItems.learning },
    },
    works: {
      selected: "プロジェクト",
      featured: "注目",
      details: "詳細を見る",
      privateNote: "非公開案件のため、説明可能な範囲で掲載しています。",
      labels: {
        problem: "課題",
        role: "担当",
        tech: "技術",
        result: "結果・現状",
        links: "リンク",
      },
      status: { done: "実施済み", ongoing: "進行中", planned: "計画段階" },
      items: {
        "show-harness": {
          title: "Show-Harness Contribution（OSS）",
          cat: "OSS / Robotics",
          summary:
            "NUS Show Labが公開するVLMベースのロボット制御OSS「Show-Harness」に、SO-101ロボットアームをシミュレーション上の新しい実行対象（embodiment）として追加するPRを提出し、本体にマージされました。",
          problem:
            "Show-Harnessは、VLMエージェントが共通の動作語彙（移動・回転トークン）でロボットを操作するフレームワークです。5自由度のSO-101（LeRobot）を、既存のコア部分を変えずにシミュレーション上で扱えるようにする必要がありました。",
          role: [
            "既存コードとIssueで合意された構成を調査し、コア部分と共通語彙を変更しない形でSO-101対応を実装。",
            "SO-101の順運動学・逆運動学（FK/IK）と、移動・回転トークンを実行するコントローラを実装。",
            "5自由度で実現できる回転（RT_PITCH / RT_YAW）と、実現できない回転（RT_ROLL）を整理し、後者は動かさずに拒否する仕様に。",
            "Isaac LabのSim-to-Real SO-101 Workshop環境向けのバックエンド、動作検証スクリプト、実機・シミュレータ不要のテストを追加。",
            "カメラ座標の扱いや成功判定など、レビューしてほしい論点をPRに整理し、メンテナーとやり取り。",
          ],
          result:
            "2026年10月、PR #6がマージされました（シミュレーションのみ）。実機向けバックエンドなどは、PR内でフォローアップ候補として挙げています。外部コントリビューターとしての貢献で、研究室への所属や論文の著者を意味するものではありません。",
        },
        jewelry: {
          title: "ジュエリー領域のAI接客・業務支援",
          cat: "AI / Full-Stack",
          summary:
            "株式会社FriStiのインターンとして、ジュエリー領域の接客支援・業務支援システムの開発に参画。手の画像を用いた判定、LLMを用いたQ&A、製作工程・見積の支援に取り組んでいます。",
          problem:
            "接客時の提案や、デザイン画・デザイナーメモから加工工程や見積を組み立てる作業を、AIで支援することを目指しています。",
          role: [
            "MediaPipeで手の画像から特徴を抽出し、ロジスティック回帰による水かきの判定、特徴量とSVMによる骨格タイプの判定を開発・評価・改善。",
            "判定が境界的なケースでは候補を2つ提示するUIを検討・実装。",
            "OpenAI / Gemini APIを用いたQ&A機能で、用途に応じたプロンプトと、複数回のモデル呼び出しを含む処理フローを設計。推論コスト・回答品質・利用体験のバランスを検討。",
            "デザイン画やメモから加工工程の候補を提示する機能で、過去案件を参照する方法とLLMによる工程抽出を比較し、画像特徴量を用いた類似案件検索も検証。",
            "加工・部材・地金重量などの候補提示や、RAG・相場APIの活用を検討（検討段階）。",
            "顧客との定例で、担当機能の説明、検証結果の報告、改善提案を実施。",
          ],
          result: "進行中。業務データや評価結果は公開していません。",
        },
        roleplay: {
          title: "LLMロールプレイ練習アプリ",
          cat: "LLM / Full-Stack",
          summary:
            "Brain-PlusのAI Full-Stack Engineerインターンとして、LLMを活用したロールプレイ型の練習・成長支援アプリの開発に参画しています。",
          problem:
            "営業ロールプレイや部下指導などをAI相手に練習できるアプリで、営業担当者が現場でヒアリングした課題や要望を、既存プロダクトの機能として形にすることが求められています。",
          role: [
            "営業担当者がヒアリングした課題・要望をもとに、既存プロダクトの機能追加・改修を担当。",
            "画面、AIとの会話機能、フィードバック機能を実装・改修。",
            "営業ロールプレイや部下指導など、用途に応じたプロンプトを設計。",
            "Gemini APIを用いた会話処理を開発。",
          ],
          result: "進行中。利用場面や要望を理解し、実際の機能に落とし込む経験を積んでいます。",
        },
        "physical-ai": {
          title: "SO-101を用いたPhysical AI研究開発",
          cat: "Physical AI / R&D",
          summary:
            "株式会社フィジカルAI総合研究所のR&D Engineerインターンとして、SO-101ロボットアームを用いたPhysical AIの研究開発に参画。環境構築・データ収集から、モデルの設計・学習・評価まで関わっています。",
          problem:
            "画像と言語の情報からロボットアームの動作を生成するモデルを、シミュレーションでのデータ収集から学習・評価まで一貫して検証しています。",
          role: [
            "SO-101とIsaac Simの連携環境をセットアップし、環境構築手順を整備・共有。",
            "テレオペレーションによるデモデータを収集。",
            "Qwen系VLMで画像・言語情報を処理し、ACTで行動を出力する制御モデルを設計・実装。VLM部分を凍結し、行動生成部分を学習する構成を検証。",
            "ファインチューニングとシミュレーション上での強化学習を行い、ロールアウトでタスクの達成状況や失敗動作を確認。",
            "Weights & Biasesで学習・評価ログを確認。",
            "工場見学や現場ヒアリングを通じて、実際の業務やロボット活用の課題を理解。",
          ],
          result: "進行中。モデルは改善途中で、ロールアウトでの失敗分析をもとに検証を続けています。",
        },
        "llm-finetune": {
          title: "LLMの追加学習と評価",
          cat: "LLM / ML",
          summary:
            "Qwen系のLLMを対象に、SFTやPEFT / LoRAによる追加学習と、ベンチマークによる評価に取り組んでいます。",
          problem:
            "オープンなLLMを目的のタスクに合わせて追加学習し、条件を変えたときの効果を比較できる形で評価する。",
          role: [
            "Qwen系LLM（Qwen2.5-7B、Qwen3-4B系）を用いたSFT、PEFT / LoRAによる追加学習。",
            "データセット、学習率、エポック数、LoRA設定などの条件を比較。",
            "DBBench、ALFWorldを用いた評価。",
            "学習から推論・評価までのNotebookを作成・改善。",
            "数学分野：Qwen3-4B-Baseで汎用データと数学データを段階的に学習する構成を検証。Hugging Face Hubでモデルを管理し、固定した推論条件で評価（進行中）。",
          ],
          result:
            "SFT・LoRAの比較評価は実施済み。数学分野の追加学習は、GENIAC関連のスクリーニングに取り組んでいる段階です。",
        },
        portfolio: {
          title: "Portfolio 2026",
          cat: "Web",
          summary:
            "このポートフォリオサイトです。1本の映像を153枚のフレームに分割し、スクロールに合わせて1コマずつ描画しています。",
          problem: "経歴や実績を、映像演出を活かした1ページで、日本語と英語の両方で伝える。",
          role: [
            "Next.js / Reactで実装し、Canvasによるフレームシーケンス描画とスクロール連動の演出を構築。",
            "日本語・英語の切り替えに対応。",
            "GitHub Actionsを用いて、GitHub Pagesへ静的サイトとしてデプロイ。",
          ],
          result: "公開中。",
        },
        maro: {
          title: "MARO 活動紹介サイト",
          cat: "Web",
          summary:
            "名古屋市博物館サポーター団体「MARO」の活動紹介サイト。設計・実装から公開までを一人で担当しました。",
          problem:
            "名古屋市立大学から始まった学生主体の団体が、若い世代と博物館をつなぐ企画・運営の様子を発信するためのサイトです。",
          role: [
            "Next.js / TypeScriptで静的サイトとして構築し、Cloudflare Pagesで公開。",
            "microCMSと連携した活動記事一覧。記事を更新すると自動で再ビルド・再デプロイ。",
            "Three.js / React Three FiberとGSAPによる3Dモデル・アニメーション演出。",
            "Cloudflare TurnstileとKVによるレート制限を備えた問い合わせフォームを、Pages Functionsで実装。",
            "PWA対応、SEO対応（OGP・構造化データ・サイトマップ）、ダークモード、自前のアクセス解析。",
            "GitHub Actions（lint・型チェック・テスト・ビルド）、Playwright / VitestによるテストとSentryによるエラー監視。",
          ],
          result: "公開中。",
        },
      },
    },
    experience: {
      heading: "経歴",
      subtitle: "インターン",
      related: "関連プロジェクト",
      items: [
        {
          period: "2026 —",
          org: "株式会社EQUES",
          role: "Engineer（インターン）",
          summary:
            "東京大学松尾研発のスタートアップ。Physical AI関連の案件で、基盤モデルの追加学習、評価基盤、データ収集に関わっています。",
        },
        {
          period: "2026.05 —",
          org: "株式会社フィジカルAI総合研究所",
          role: "R&D Engineer（インターン）",
          summary: "SO-101ロボットアームを用いたPhysical AIの研究開発に参画しています。",
          work: "physical-ai",
        },
        {
          period: "2026.04 —",
          org: "株式会社FriSti",
          role: "Full-Stack Engineer（インターン）",
          summary:
            "ジュエリー領域のAI接客支援・業務支援システムの開発に参画。顧客との定例で担当機能の説明、検証結果の報告、改善提案も行っています。",
          work: "jewelry",
        },
        {
          period: "2026.03 —",
          org: "Brain-Plus",
          role: "AI Full-Stack Engineer（インターン）",
          summary: "LLMを活用したロールプレイ型の練習・成長支援アプリの開発に参画しています。",
          work: "roleplay",
        },
      ],
    },
    achievements: {
      heading: "実績",
      subtitle: "受賞・知的財産・講座",
      groups: [
        {
          label: "受賞・知的財産",
          items: [
            {
              when: "2026.07",
              title: "意匠登録 第1832319号「ダンベル用シャフト」",
              note: "左右非対称の山状形状を持つダンベルシャフトのデザイン。意匠の創作者・意匠権者として登録（2026年7月16日）。",
              image: {
                src: "/achievements/design-registration-1832319.jpg",
                alt: "意匠登録証 第1832319号（ダンベル用シャフト）",
              },
            },
            {
              when: "受賞",
              title: "デザインパテントコンテスト 優秀賞",
              note: "主催：文部科学省・特許庁・日本弁理士会・独立行政法人工業所有権情報・研修館。上記ダンベル用シャフトのデザインで受賞し、形状のアイデアを具体化して、知的財産として保護する経験を得ました。",
            },
            { when: "入賞", title: "NTT系企業のLLMハッカソン 入賞" },
            { when: "決勝進出", title: "東京大学 松尾・岩澤研究室 LLM講座 決勝進出" },
          ],
        },
        {
          label: "OSS",
          items: [
            {
              when: "2026.10",
              title: "Show-Harness（NUS Show Lab）PR #6 マージ",
              note: "SO-101のシミュレーション対応を追加。",
            },
          ],
        },
        {
          label: "講座・プログラム",
          items: [
            { when: "修了", title: "東京大学 松尾・岩澤研究室 GCI" },
            { when: "修了", title: "東京大学 松尾・岩澤研究室 深層学習／DL基礎講座 2026 Spring" },
            { when: "修了", title: "三菱UFJ主催 顧客価値共創プログラム" },
            { when: "受講", title: "松尾研 Physical AI 基礎編" },
            { when: "2026.09", title: "松尾研 Physical AI 応用編1 課題提出" },
          ],
        },
      ],
    },
    contact: {
      eyebrow: "連絡先",
      note: "開発の記録やコードはGitHubで公開しています。",
    },
  },
  en: {
    nav: {
      links: {
        index: "Index",
        about: "About",
        works: "Projects",
        experience: "Experience",
        achievements: "Awards",
        contact: "Contact",
      },
    },
    hero: {
      eyebrow: "AI / Full-Stack Engineer — 2026",
      subtitle:
        "Usa Ishikawa — a university student engineer building with LLMs, web applications, and Physical AI.",
      scroll: "Scroll",
      basedIn: "Based in / Tokai, Japan",
      loading: "Loading frames",
    },
    about: {
      eyebrow: "About",
      bio: [
        "I'm a second-year student at Nagoya City University, School of Humanities and Social Sciences. Courses from the Matsuo-Iwasawa Lab at the University of Tokyo got me into programming and machine learning, and I now work on AI, web applications, and robotics with several companies.",
        "My experience runs from LLM-powered business tools, through fine-tuning and evaluating models, to Physical AI R&D with robot arms. I care about understanding the problem on the ground, learning whatever the job needs, and getting to a solution through implementation and verification.",
        "My goal is to become a Forward Deployed Engineer (FDE) — working close to customers and the field, from finding the problem to building and deploying the solution.",
      ],
      index: [
        ["Name", "Usa Ishikawa (石川 潮早)"],
        ["University", "Nagoya City University"],
        ["Year", "2nd year (graduating Mar 2029)"],
        ["Based", "Tokai region, Japan"],
        ["Status", "Student / Engineering intern / Sole proprietor"],
        ["Goal", "Forward Deployed Engineer"],
      ],
      approachHeading: "How I work",
      approach: [
        "Turn requests from the field into concrete features — screens, conversations, classifiers.",
        "Present my features, report test results, and propose improvements in regular client meetings.",
        "Go beyond getting a model to run: compare, evaluate, and analyse failures.",
        "Work hands-on with both web applications and model training.",
        "Read existing code and collaborate with maintainers through open-source contributions.",
      ],
    },
    skills: {
      heading: "Stack",
      note: "Technologies I have used, studied, or tested — not a list of mastered skills. Each group links to the projects where I used it.",
      related: "Projects",
      groups: [
        { k: "Languages", items: skillItems.lang, works: ["show-harness", "jewelry", "llm-finetune", "portfolio"] },
        { k: "Web & Backend", items: skillItems.web, works: ["jewelry", "maro", "portfolio"] },
        { k: "LLM & AI Apps", items: skillItems.llm, works: ["jewelry", "roleplay", "llm-finetune"] },
        { k: "Machine & Deep Learning", items: skillItems.ml, works: ["jewelry", "physical-ai", "llm-finetune"] },
        { k: "Robotics & Physical AI", items: skillItems.robotics, works: ["show-harness", "physical-ai"] },
        { k: "Tooling & Infrastructure", items: skillItems.infra, works: ["show-harness", "physical-ai", "llm-finetune"] },
      ],
      learning: { k: "Currently learning", items: skillItems.learning },
    },
    works: {
      selected: "Projects",
      featured: "Featured",
      details: "Details",
      privateNote: "Client work — described only as far as I can share.",
      labels: {
        problem: "Problem",
        role: "My role",
        tech: "Tech",
        result: "Outcome / status",
        links: "Links",
      },
      status: { done: "Completed", ongoing: "Ongoing", planned: "Planned" },
      items: {
        "show-harness": {
          title: "Show-Harness Contribution (OSS)",
          cat: "OSS / Robotics",
          summary:
            "Contributed to Show-Harness, NUS Show Lab's open-source VLM-based robot control framework. My PR adding the SO-101 robot arm as a new simulated embodiment was merged.",
          problem:
            "Show-Harness lets a VLM agent drive robots through a shared action vocabulary of move and rotate tokens. The 5-DoF SO-101 (LeRobot) needed to run in simulation without changes to the framework's core.",
          role: [
            "Studied the codebase and the layout agreed in the issue, then implemented SO-101 support without touching the core or the shared vocabulary.",
            "Implemented forward/inverse kinematics for the SO-101 and a controller that executes move and rotate tokens.",
            "Defined which rotations a 5-DoF arm can realise (RT_PITCH / RT_YAW) and made the unrealisable one (RT_ROLL) a deterministic refusal.",
            "Added a backend for the Isaac Lab Sim-to-Real SO-101 Workshop, motion-verification scripts, and hardware- and simulator-free tests.",
            "Laid out open review questions (camera conventions, success criteria) in the PR and worked through them with the maintainers.",
          ],
          result:
            "PR #6 was merged in October 2026 (simulation only). A real-arm backend is listed in the PR as a follow-up. This is an external contribution; it does not imply lab membership or paper authorship.",
        },
        jewelry: {
          title: "AI for Jewelry Retail & Production",
          cat: "AI / Full-Stack",
          summary:
            "As an intern at FriSti, I work on AI tools that support jewelry sales and operations: hand-image classification, an LLM Q&A feature, and support for estimating production steps.",
          problem:
            "The aim is to support staff with AI when making recommendations to customers and when turning design sketches and designer notes into production steps and estimates.",
          role: [
            "Extracted hand features with MediaPipe; developed, evaluated, and improved a logistic-regression classifier for finger webbing and a feature-based SVM classifier for skeletal type.",
            "Designed and built a UI that shows two candidates when a prediction is borderline.",
            "Designed prompts and a multi-call pipeline for an LLM Q&A feature on the OpenAI / Gemini APIs, balancing inference cost, answer quality, and user experience.",
            "For suggesting production steps from sketches and notes, compared retrieval of past cases with LLM-based extraction, and tested similar-case search using image features.",
            "Exploring suggestions for processes, parts, and metal weight, and the use of RAG and market-price APIs (exploration stage).",
            "Present my features, report results, and propose improvements in regular client meetings.",
          ],
          result: "Ongoing. Business data and evaluation results are not public.",
        },
        roleplay: {
          title: "LLM Role-Play Training App",
          cat: "LLM / Full-Stack",
          summary:
            "As an AI Full-Stack Engineer intern at Brain-Plus, I develop an LLM-powered role-play app for practice and skill development.",
          problem:
            "The app lets people practise scenarios such as sales role-plays and coaching team members with an AI partner. The job is to turn needs heard by the sales team in the field into features of the existing product.",
          role: [
            "Add and revise features of the existing product based on issues and requests the sales team gathered from customers.",
            "Implement and revise screens, the AI conversation feature, and the feedback feature.",
            "Design prompts for each use case, such as sales role-plays and team coaching.",
            "Develop conversation handling on the Gemini API.",
          ],
          result: "Ongoing — experience turning real use cases and requests into working features.",
        },
        "physical-ai": {
          title: "Physical AI R&D with SO-101",
          cat: "Physical AI / R&D",
          summary:
            "As an R&D Engineer intern at フィジカルAI総合研究所, I work on Physical AI with the SO-101 robot arm — from environment setup and data collection to model design, training, and evaluation.",
          problem:
            "We are testing, end to end, models that generate robot-arm actions from images and language — from collecting data in simulation through training and evaluation.",
          role: [
            "Set up the SO-101 + Isaac Sim environment and documented the setup for the team.",
            "Collected demonstration data by teleoperation.",
            "Designed and implemented a control model in which a Qwen-family VLM processes images and language and ACT outputs actions; tested freezing the VLM and training the action head.",
            "Ran fine-tuning and reinforcement learning in simulation, and reviewed task completion and failure modes in rollouts.",
            "Tracked training and evaluation logs with Weights & Biases.",
            "Learned about real operations and robotics challenges through factory visits and on-site interviews.",
          ],
          result: "Ongoing. The model is still being improved, guided by failure analysis of rollouts.",
        },
        "llm-finetune": {
          title: "LLM Fine-Tuning & Evaluation",
          cat: "LLM / ML",
          summary:
            "Fine-tuning Qwen-family LLMs with SFT and PEFT / LoRA, and evaluating them on benchmarks.",
          problem:
            "Adapt open LLMs to target tasks and evaluate them so that the effect of each training condition can be compared.",
          role: [
            "SFT and PEFT / LoRA fine-tuning of Qwen-family models (Qwen2.5-7B, Qwen3-4B).",
            "Compared datasets, learning rates, epochs, and LoRA settings.",
            "Evaluated on DBBench and ALFWorld.",
            "Built and refined notebooks covering training, inference, and evaluation.",
            "Math: testing staged training on general then math data with Qwen3-4B-Base, managing models on the Hugging Face Hub and evaluating under fixed inference settings (ongoing).",
          ],
          result:
            "Comparative SFT / LoRA evaluation completed. The math fine-tuning is at the stage of working on a GENIAC-related screening.",
        },
        portfolio: {
          title: "Portfolio 2026",
          cat: "Web",
          summary:
            "This site. A single video, cut into 153 frames and drawn one frame at a time as you scroll.",
          problem: "Present my background and work on one cinematic page, in both Japanese and English.",
          role: [
            "Built with Next.js / React, with canvas frame-sequence rendering and scroll-driven motion.",
            "Japanese / English language switching.",
            "Deployed as a static site to GitHub Pages with GitHub Actions.",
          ],
          result: "Live.",
        },
        maro: {
          title: "MARO Website",
          cat: "Web",
          summary:
            "The website of MARO, a supporter group of the Nagoya City Museum. I handled everything from design and implementation to launch on my own.",
          problem:
            "MARO is a student-led group that began at Nagoya City University, connecting younger generations with the museum. The site shares its planning and activities.",
          role: [
            "Built as a static Next.js / TypeScript site and deployed on Cloudflare Pages.",
            "Activity articles from microCMS; publishing an article triggers an automatic rebuild and redeploy.",
            "3D models and animation with Three.js / React Three Fiber and GSAP.",
            "Contact form on Pages Functions, protected by Cloudflare Turnstile and KV-based rate limiting.",
            "PWA, SEO (OGP, structured data, sitemap), dark mode, and self-hosted analytics.",
            "GitHub Actions (lint, type-check, test, build), Playwright / Vitest tests, and Sentry error monitoring.",
          ],
          result: "Live.",
        },
      },
    },
    experience: {
      heading: "Experience",
      subtitle: "Internships",
      related: "Project",
      items: [
        {
          period: "2026 —",
          org: "EQUES",
          role: "Engineer (Intern)",
          summary:
            "A startup from the Matsuo Lab at the University of Tokyo. I work on Physical AI projects, contributing to foundation-model fine-tuning, evaluation infrastructure, and data collection.",
        },
        {
          period: "2026.05 —",
          org: "フィジカルAI総合研究所",
          role: "R&D Engineer (Intern)",
          summary: "Physical AI research and development using the SO-101 robot arm.",
          work: "physical-ai",
        },
        {
          period: "2026.04 —",
          org: "FriSti",
          role: "Full-Stack Engineer (Intern)",
          summary:
            "AI tools for jewelry sales and operations. I also present my features, report results, and propose improvements in regular client meetings.",
          work: "jewelry",
        },
        {
          period: "2026.03 —",
          org: "Brain-Plus",
          role: "AI Full-Stack Engineer (Intern)",
          summary: "Development of an LLM-powered role-play app for practice and skill development.",
          work: "roleplay",
        },
      ],
    },
    achievements: {
      heading: "Awards",
      subtitle: "Awards, IP & courses",
      groups: [
        {
          label: "Awards & IP",
          items: [
            {
              when: "2026.07",
              title: "Design Registration No. 1832319 — Dumbbell shaft",
              note: "A dumbbell shaft design with an asymmetric, ridged profile. Registered on 16 July 2026, with me as creator and right holder.",
              image: {
                src: "/achievements/design-registration-1832319.jpg",
                alt: "Certificate of Design Registration No. 1832319 (dumbbell shaft)",
              },
            },
            {
              when: "Award",
              title: "Design Patent Contest — Award of Excellence",
              note: "Organised by MEXT, the Japan Patent Office, the Japan Patent Attorneys Association, and INPIT. Awarded for the dumbbell shaft design above — turning a shape idea into something concrete and protecting it as intellectual property.",
            },
            { when: "Award", title: "Prize winner, LLM hackathon hosted by an NTT group company" },
            { when: "Finalist", title: "LLM course competition, Matsuo-Iwasawa Lab, University of Tokyo" },
          ],
        },
        {
          label: "Open source",
          items: [
            {
              when: "2026.10",
              title: "Show-Harness (NUS Show Lab) — PR #6 merged",
              note: "Added simulated SO-101 support.",
            },
          ],
        },
        {
          label: "Courses & programs",
          items: [
            { when: "Completed", title: "GCI — Matsuo-Iwasawa Lab, University of Tokyo" },
            { when: "Completed", title: "Deep Learning Fundamentals 2026 Spring — Matsuo-Iwasawa Lab" },
            { when: "Completed", title: "Customer Value Co-Creation Program — hosted by MUFG" },
            { when: "Attended", title: "Physical AI Fundamentals — Matsuo Lab" },
            { when: "2026.09", title: "Physical AI Advanced 1 — assignment submitted" },
          ],
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      note: "Code and development notes are on GitHub.",
    },
  },
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
} | null>(null);

const STORAGE_KEY = "locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Pick up a previously chosen locale after mount (default stays "en" for SSR/first paint).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ja" || stored === "en") setLocaleState(stored);
  }, []);

  // Keep <html lang> in sync with the visible language.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  };

  const value = useMemo(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
