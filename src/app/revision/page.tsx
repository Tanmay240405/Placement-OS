import Navbar from "@/components/layout/Navbar";
import SubjectCard from "@/components/revision/SubjectCard";

export default function RevisionPage() {
  const subjects = [
    {
      title: "DBMS",
      icon: "🗄️",
      description: "Database Management Systems concepts, normal forms, transactions, and concurrency.",
      href: "/revision/dbms",
    },
    {
      title: "SQL",
      icon: "💾",
      description: "Structured Query Language, complex queries, joins, indices, and optimization.",
      href: "/revision/sql",
    },
    {
      title: "Computer Networks",
      icon: "🌐",
      description: "OSI model, TCP/IP, routing, application protocols, and network security.",
      href: "/revision/cn",
    },
    {
      title: "System Design",
      icon: "🏗️",
      description: "System Architecture, scalability, load balancing, microservices, and design patterns.",
      href: "/revision/system-design",
    },
    {
      title: "OOPS",
      icon: "🧩",
      description: "Object-Oriented Programming concepts, inheritance, polymorphism, and solid principles.",
      href: "/revision/oops",
    },
    {
      title: "Operating Systems",
      icon: "🖥️",
      description: "Processes, threads, scheduling, memory management, and file systems.",
      href: "/revision/os",
    }
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="page-container animate-fade-in" style={{ flex: 1, width: "100%" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "-0.05em",
              marginBottom: "0.5rem",
              textShadow: "2px 2px 0px var(--accent-glow)",
            }}
          >
            Core Subjects
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.125rem",
              fontFamily: "var(--font-mono)",
            }}
          >
            Select a subject to begin your revision session.
          </p>
        </div>

        <div className="grid-stats" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.title}
              title={subject.title}
              icon={subject.icon}
              description={subject.description}
              href={subject.href}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
