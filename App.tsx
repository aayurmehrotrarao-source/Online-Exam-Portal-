import { useEffect, useState } from "react";
import "./App.css";

type Question = {
  question: string;
  options: string[];
  answer: number;
};

type Exam = {
  id: number;
  title: string;
  subject: string;
  duration: number;
  questions: number;
  status: "Available" | "Upcoming";
};

const examQuestions: Question[] = [
  {
    question: "Which data structure uses FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: 1,
  },
  {
    question: "Which keyword declares a constant in JavaScript?",
    options: ["var", "let", "const", "static"],
    answer: 2,
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    answer: 1,
  },
  {
    question: "Which language runs in a web browser?",
    options: ["JavaScript", "C", "SQL", "Assembly"],
    answer: 0,
  },
  {
    question: "Which data structure follows LIFO?",
    options: ["Queue", "Array", "Stack", "Graph"],
    answer: 2,
  },
];

const examList: Exam[] = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    subject: "Computer Science",
    duration: 15,
    questions: 5,
    status: "Available",
  },
  {
    id: 2,
    title: "Database Management Systems",
    subject: "Database",
    duration: 30,
    questions: 20,
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Web Development",
    subject: "Programming",
    duration: 25,
    questions: 15,
    status: "Upcoming",
  },
];

function App() {
  const [page, setPage] = useState("Dashboard");
  const [activeExam, setActiveExam] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [result, setResult] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [showSubmit, setShowSubmit] = useState(false);

  const filteredExams = examList.filter((exam) =>
    exam.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!activeExam) return;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setActiveExam(false);
          setResult(
            examQuestions.reduce(
              (score, question, index) =>
                score + (answers[index] === question.answer ? 1 : 0),
              0
            )
          );
          setPage("Results");
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeExam, answers]);

  const startExam = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setTimeLeft(15 * 60);
    setResult(null);
    setShowSubmit(false);
    setActiveExam(true);
    setPage("Exam");
  };

  const finishExam = () => {
    const score = examQuestions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.answer ? 1 : 0),
      0
    );

    setActiveExam(false);
    setShowSubmit(false);
    setResult(score);
    setPage("Results");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const selectAnswer = (optionIndex: number) => {
    setAnswers((previous) => {
      const updated = [...previous];
      updated[currentQuestion] = optionIndex;
      return updated;
    });
  };

  if (activeExam) {
    const question = examQuestions[currentQuestion];

    return (
      <div className="exam-page">
        <header className="exam-header">
          <h2>Examly</h2>
          <div className="timer">Time Left: {formatTime(timeLeft)}</div>
        </header>

        <main className="exam-content">
          <div className="exam-top">
            <div>
              <h2>Data Structures & Algorithms</h2>
              <p>
                Question {currentQuestion + 1} of {examQuestions.length}
              </p>
            </div>
            <span className="question-count">
              {answers.filter((answer) => answer !== undefined).length} Answered
            </span>
          </div>

          <div className="question-card">
            <h3>{question.question}</h3>

            <div className="options-list">
              {question.options.map((option, index) => (
                <button
                  type="button"
                  key={option}
                  className={`option ${
                    answers[currentQuestion] === index ? "selected" : ""
                  }`}
                  onClick={() => selectAnswer(index)}
                >
                  <span>{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              ))}
            </div>

            <div className="question-navigation">
              <button
                type="button"
                className="secondary-btn"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((previous) => previous - 1)}
              >
                Previous
              </button>

              {currentQuestion < examQuestions.length - 1 ? (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => setCurrentQuestion((previous) => previous + 1)}
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => setShowSubmit(true)}
                >
                  Submit Exam
                </button>
              )}
            </div>
          </div>

          <div className="question-palette">
            <h3>Question Palette</h3>
            <div className="palette-grid">
              {examQuestions.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  className={`palette-button ${
                    currentQuestion === index ? "current" : ""
                  } ${answers[index] !== undefined ? "answered" : ""}`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </main>

        {showSubmit && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Submit Exam?</h2>
              <p>
                You have answered{" "}
                {answers.filter((answer) => answer !== undefined).length} out
                of {examQuestions.length} questions.
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowSubmit(false)}
                >
                  Continue Exam
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={finishExam}
                >
                  Confirm Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="logo">Examly<span>.</span></h2>

        <p className="sidebar-label">MENU</p>

        {["Dashboard", "My Exams", "Results", "Settings"].map((item) => (
          <button
            type="button"
            key={item}
            className={`nav-item ${page === item ? "active" : ""}`}
            onClick={() => setPage(item)}
          >
            {item === "Dashboard" && "▦"}
            {item === "My Exams" && "▤"}
            {item === "Results" && "◷"}
            {item === "Settings" && "⚙"}
            <span>{item}</span>
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="profile-avatar">S</div>
          <div>
            <strong>Student User</strong>
            <p>Student Account</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{page}</h1>
            <p>Welcome back! Ready to test your knowledge?</p>
          </div>

          <div className="topbar-profile">
            <div className="profile-avatar">S</div>
            <span>Student</span>
          </div>
        </header>

        {page === "Dashboard" && (
          <>
            <section className="welcome-banner">
              <div>
                <p className="banner-tag">YOUR LEARNING JOURNEY</p>
                <h2>Ready to ace your exams?</h2>
                <p>
                  Challenge yourself, track your progress, and achieve your
                  goals.
                </p>
                <button
                  type="button"
                  className="banner-btn"
                  onClick={() => setPage("My Exams")}
                >
                  Explore Exams →
                </button>
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <p>Total Exams</p>
                <h2>{examList.length}</h2>
                <span>Exams in the portal</span>
              </div>
              <div className="stat-card">
                <p>Available Exams</p>
                <h2>
                  {examList.filter((exam) => exam.status === "Available").length}
                </h2>
                <span>Ready to attempt</span>
              </div>
              <div className="stat-card">
                <p>Latest Score</p>
                <h2>
                  {result === null
                    ? "--"
                    : `${Math.round(
                        (result / examQuestions.length) * 100
                      )}%`}
                </h2>
                <span>Your latest exam result</span>
              </div>
            </section>

            <section className="section-heading">
              <div>
                <h2>Available Exams</h2>
                <p>Choose an exam and get started.</p>
              </div>
              <button
                type="button"
                className="text-btn"
                onClick={() => setPage("My Exams")}
              >
                View All →
              </button>
            </section>

            <section className="exam-grid">
              {filteredExams
                .filter((exam) => exam.status === "Available")
                .map((exam) => (
                  <div className="exam-card" key={exam.id}>
                    <div className="exam-icon">📘</div>
                    <span className="status-badge">{exam.status}</span>
                    <h3>{exam.title}</h3>
                    <p>{exam.subject}</p>
                    <div className="exam-meta">
                      <span>◷ {exam.duration} min</span>
                      <span>☰ {exam.questions} questions</span>
                    </div>
                    <button
                      type="button"
                      className="primary-btn full-btn"
                      onClick={startExam}
                    >
                      Start Exam →
                    </button>
                  </div>
                ))}
            </section>
          </>
        )}

        {page === "My Exams" && (
          <>
            <div className="section-heading">
              <div>
                <h2>All Exams</h2>
                <p>Search and select an exam.</p>
              </div>
              <input
                className="search-input"
                type="search"
                placeholder="Search exams..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <section className="exam-grid">
              {filteredExams.map((exam) => (
                <div className="exam-card" key={exam.id}>
                  <div className="exam-icon">📘</div>
                  <span
                    className={`status-badge ${
                      exam.status === "Upcoming" ? "upcoming" : ""
                    }`}
                  >
                    {exam.status}
                  </span>
                  <h3>{exam.title}</h3>
                  <p>{exam.subject}</p>
                  <div className="exam-meta">
                    <span>◷ {exam.duration} min</span>
                    <span>☰ {exam.questions} questions</span>
                  </div>
                  <button
                    type="button"
                    className="primary-btn full-btn"
                    disabled={exam.status !== "Available"}
                    onClick={startExam}
                  >
                    {exam.status === "Available" ? "Start Exam →" : "Coming Soon"}
                  </button>
                </div>
              ))}
            </section>
          </>
        )}

        {page === "Results" && (
          <section className="result-card">
            <div className="result-icon">🏆</div>
            <h2>{result === null ? "No Results Yet" : "Exam Completed!"}</h2>
            {result === null ? (
              <p>Complete an exam to see your score here.</p>
            ) : (
              <>
                <p>Your Data Structures & Algorithms result</p>
                <h1>
                  {result} / {examQuestions.length}
                </h1>
                <h3>
                  {Math.round((result / examQuestions.length) * 100)}%
                </h3>
                <p>
                  {result >= 3
                    ? "Great work! Keep learning and improving."
                    : "Keep practising. You can improve your score!"}
                </p>
              </>
            )}
            <button
              type="button"
              className="primary-btn"
              onClick={() => setPage("My Exams")}
            >
              Browse Exams
            </button>
          </section>
        )}

        {page === "Settings" && (
          <section className="settings-card">
            <h2>Profile Settings</h2>
            <p>Student User</p>
            <p>Role: Student</p>
            <p>Portal: Examly Online Examination System</p>
            <p className="settings-note">
              This is a frontend demo. Account settings are not connected to a
              backend yet.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
